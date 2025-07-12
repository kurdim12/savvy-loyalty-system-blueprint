
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: 'points' | 'visits' | 'social' | 'special';
  requirement: number;
  points_reward: number;
  badge_icon: string;
  tier_required?: 'bronze' | 'silver' | 'gold';
}

export interface LoyaltyAction {
  type: 'visit' | 'purchase' | 'referral' | 'social' | 'challenge' | 'review';
  points: number;
  description: string;
}

export const LOYALTY_ACTIONS: Record<string, LoyaltyAction> = {
  cafe_visit: { type: 'visit', points: 10, description: 'Café visit check-in' },
  drink_purchase: { type: 'purchase', points: 5, description: 'Drink purchase' },
  food_purchase: { type: 'purchase', points: 8, description: 'Food purchase' },
  friend_referral: { type: 'referral', points: 50, description: 'Successful friend referral' },
  social_post: { type: 'social', points: 15, description: 'Social media post about café' },
  photo_upload: { type: 'social', points: 20, description: 'Photo contest participation' },
  review_written: { type: 'review', points: 25, description: 'Written review' },
  challenge_completed: { type: 'challenge', points: 30, description: 'Challenge completion' },
  community_chat: { type: 'social', points: 2, description: 'Community chat participation' },
  song_request: { type: 'social', points: 5, description: 'Song request' },
  daily_checkin: { type: 'visit', points: 5, description: 'Daily check-in bonus' }
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_visit',
    name: 'First Steps',
    description: 'Welcome to Raw Smith Coffee!',
    type: 'visits',
    requirement: 1,
    points_reward: 10,
    badge_icon: 'star'
  },
  {
    id: 'regular_customer',
    name: 'Regular Customer',
    description: 'Visit us 5 times',
    type: 'visits',
    requirement: 5,
    points_reward: 25,
    badge_icon: 'coffee'
  },
  {
    id: 'coffee_enthusiast',
    name: 'Coffee Enthusiast',
    description: 'Visit us 15 times',
    type: 'visits',
    requirement: 15,
    points_reward: 50,
    badge_icon: 'heart'
  },
  {
    id: 'coffee_connoisseur',
    name: 'Coffee Connoisseur',
    description: 'Visit us 30 times',
    type: 'visits',
    requirement: 30,
    points_reward: 100,
    badge_icon: 'award'
  },
  {
    id: 'points_collector',
    name: 'Points Collector',
    description: 'Earn 100 points',
    type: 'points',
    requirement: 100,
    points_reward: 20,
    badge_icon: 'coins'
  },
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Participate in 10 social activities',
    type: 'social',
    requirement: 10,
    points_reward: 30,
    badge_icon: 'users'
  },
  {
    id: 'silver_member',
    name: 'Silver Status',
    description: 'Reach Silver membership tier',
    type: 'special',
    requirement: 200,
    points_reward: 50,
    badge_icon: 'medal',
    tier_required: 'silver'
  },
  {
    id: 'gold_member',
    name: 'Gold Status',
    description: 'Reach Gold membership tier',
    type: 'special',
    requirement: 550,
    points_reward: 100,
    badge_icon: 'crown',
    tier_required: 'gold'
  }
];

export const TIER_THRESHOLDS = {
  bronze: { min: 0, max: 199, benefits: ['10% discount', '87+ cupping score access'] },
  silver: { min: 200, max: 549, benefits: ['15% discount', '87+ cupping score beans', 'Early access to new coffees'] },
  gold: { min: 550, max: Infinity, benefits: ['25% discount', '90+ cupping score exclusives', 'Personal barista service'] }
};

class LoyaltyService {
  private static instance: LoyaltyService;

  static getInstance(): LoyaltyService {
    if (!LoyaltyService.instance) {
      LoyaltyService.instance = new LoyaltyService();
    }
    return LoyaltyService.instance;
  }

  async awardPoints(userId: string, action: string, customPoints?: number): Promise<boolean> {
    try {
      const loyaltyAction = LOYALTY_ACTIONS[action];
      if (!loyaltyAction && !customPoints) {
        console.error('Unknown loyalty action:', action);
        return false;
      }

      const points = customPoints || loyaltyAction.points;
      const description = loyaltyAction?.description || 'Custom point award';

      // Call the edge function to award points
      const { data, error } = await supabase.functions.invoke('earn-points', {
        body: { 
          type: action, 
          points: points,
          description 
        }
      });

      if (error) {
        console.error('Error awarding points:', error);
        return false;
      }

      // Check for achievements and tier changes
      await this.checkAchievements(userId);
      await this.checkTierProgression(userId);

      toast.success(`🎉 +${points} points earned! ${description}`);
      return true;
    } catch (error) {
      console.error('Error in awardPoints:', error);
      return false;
    }
  }

  async checkAchievements(userId: string): Promise<void> {
    try {
      // Get user's current stats
      const { data: profile } = await supabase
        .from('profiles')
        .select('current_points, visits, membership_tier')
        .eq('id', userId)
        .single();

      if (!profile) return;

      // Get user's existing achievements
      const { data: existingAchievements } = await supabase
        .from('coffee_education_progress')
        .select('badge_name')
        .eq('user_id', userId);

      const earnedBadges = existingAchievements?.map(a => a.badge_name) || [];

      // Check each achievement
      for (const achievement of ACHIEVEMENTS) {
        if (earnedBadges.includes(achievement.id)) continue;

        let shouldAward = false;

        switch (achievement.type) {
          case 'visits':
            shouldAward = profile.visits >= achievement.requirement;
            break;
          case 'points':
            shouldAward = profile.current_points >= achievement.requirement;
            break;
          case 'special':
            if (achievement.tier_required) {
              shouldAward = profile.membership_tier === achievement.tier_required;
            }
            break;
        }

        if (shouldAward) {
          await this.awardAchievement(userId, achievement);
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  }

  async awardAchievement(userId: string, achievement: Achievement): Promise<void> {
    try {
      // Record the achievement
      const { error: achievementError } = await supabase
        .from('coffee_education_progress')
        .insert({
          user_id: userId,
          badge_name: achievement.id,
          badge_type: achievement.type,
          description: achievement.description
        });

      if (achievementError) {
        console.error('Error recording achievement:', achievementError);
        return;
      }

      // Award bonus points
      if (achievement.points_reward > 0) {
        const { error: pointsError } = await supabase
          .from('transactions')
          .insert({
            user_id: userId,
            transaction_type: 'earn',
            points: achievement.points_reward,
            notes: `Achievement bonus: ${achievement.name}`
          });

        if (pointsError) {
          console.error('Error awarding achievement points:', pointsError);
        }
      }

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: '🏆 Achievement Unlocked!',
          message: `Congratulations! You've earned the "${achievement.name}" badge and received ${achievement.points_reward} bonus points!`,
          type: 'achievement'
        });

      toast.success(`🏆 Achievement Unlocked: ${achievement.name}!`);
    } catch (error) {
      console.error('Error awarding achievement:', error);
    }
  }

  async checkTierProgression(userId: string): Promise<void> {
    try {
      // Note: Tier progression is now handled automatically by the database trigger
      // when transactions are inserted. This method is kept for manual checks.
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('current_points, membership_tier')
        .eq('id', userId)
        .single();

      if (!profile) return;

      // Get rank thresholds from settings
      const { data: settings } = await supabase
        .from('settings')
        .select('setting_value')
        .eq('setting_name', 'rank_thresholds')
        .single();

      const defaultThresholds = { silver: 200, gold: 550 };
      const thresholds = (settings?.setting_value as any) || defaultThresholds;
      const currentPoints = profile.current_points;
      let newTier = profile.membership_tier;

      if (currentPoints >= (thresholds.gold || 550) && profile.membership_tier !== 'gold') {
        newTier = 'gold';
      } else if (currentPoints >= (thresholds.silver || 200) && profile.membership_tier === 'bronze') {
        newTier = 'silver';
      }

      if (newTier !== profile.membership_tier) {
        // Award tier achievement if available
        const tierAchievement = ACHIEVEMENTS.find(a => a.tier_required === newTier);
        if (tierAchievement) {
          await this.awardAchievement(userId, tierAchievement);
        }
      }
    } catch (error) {
      console.error('Error checking tier progression:', error);
    }
  }

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    try {
      const { data: earnedAchievements } = await supabase
        .from('coffee_education_progress')
        .select('badge_name, earned_at')
        .eq('user_id', userId);

      if (!earnedAchievements) return [];

      return ACHIEVEMENTS.filter(achievement => 
        earnedAchievements.some(earned => earned.badge_name === achievement.id)
      );
    } catch (error) {
      console.error('Error getting user achievements:', error);
      return [];
    }
  }

  async getUserStats(userId: string) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('current_points, visits, membership_tier')
        .eq('id', userId)
        .single();

      const { data: transactions } = await supabase
        .from('transactions')
        .select('points, transaction_type, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      const { data: achievements } = await supabase
        .from('coffee_education_progress')
        .select('*')
        .eq('user_id', userId);

      return {
        profile,
        transactions: transactions || [],
        achievements: achievements || [],
        totalEarned: transactions?.filter(t => t.transaction_type === 'earn').reduce((sum, t) => sum + t.points, 0) || 0,
        totalRedeemed: transactions?.filter(t => t.transaction_type === 'redeem').reduce((sum, t) => sum + t.points, 0) || 0
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return null;
    }
  }
}

export default LoyaltyService.getInstance();
