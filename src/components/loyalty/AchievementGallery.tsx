
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import loyaltyService, { Achievement, ACHIEVEMENTS } from '@/services/loyaltyService';
import { ArtisticBadge } from '@/components/profile/ArtisticBadge';
import { Trophy, Clock, CheckCircle } from 'lucide-react';

export const AchievementGallery = () => {
  const { user, profile } = useAuth();
  const [earnedAchievements, setEarnedAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAchievements();
    }
  }, [user]);

  const loadAchievements = async () => {
    if (!user) return;
    
    try {
      const achievements = await loyaltyService.getUserAchievements(user.id);
      setEarnedAchievements(achievements);
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressTowards = (achievement: Achievement): number => {
    if (!profile) return 0;

    switch (achievement.type) {
      case 'visits':
        return Math.min((profile.visits / achievement.requirement) * 100, 100);
      case 'points':
        return Math.min((profile.current_points / achievement.requirement) * 100, 100);
      case 'special':
        if (achievement.tier_required === profile.membership_tier) return 100;
        return 0;
      default:
        return 0;
    }
  };

  const isEarned = (achievementId: string): boolean => {
    return earnedAchievements.some(a => a.id === achievementId);
  };

  if (loading) {
    return (
      <Card className="border-[#8B4513]/20">
        <CardContent className="p-6 text-center">
          <div className="animate-pulse">Loading achievements...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#8B4513]/20">
      <CardHeader>
        <CardTitle className="text-[#8B4513] flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Achievement Gallery
        </CardTitle>
        <CardDescription className="text-[#6F4E37]">
          Track your progress and unlock exclusive badges
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ACHIEVEMENTS.map((achievement) => {
            const earned = isEarned(achievement.id);
            const progress = getProgressTowards(achievement);
            
            return (
              <div key={achievement.id} className="text-center space-y-3">
                <div className="relative">
                  <ArtisticBadge
                    type="achievement"
                    achievement={achievement.name}
                    size="lg"
                    glowing={earned}
                    className={earned ? '' : 'opacity-50 grayscale'}
                  />
                  {earned && (
                    <div className="absolute -top-1 -right-1">
                      <CheckCircle className="h-6 w-6 text-green-500 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h4 className={`font-medium text-sm ${earned ? 'text-[#8B4513]' : 'text-gray-400'}`}>
                    {achievement.name}
                  </h4>
                  <p className="text-xs text-[#6F4E37] line-clamp-2">
                    {achievement.description}
                  </p>
                  
                  {!earned && (
                    <div className="space-y-1">
                      <Progress value={progress} className="h-2" />
                      <div className="flex items-center justify-center gap-1 text-xs text-[#6F4E37]">
                        <Clock className="h-3 w-3" />
                        <span>{progress.toFixed(0)}% complete</span>
                      </div>
                    </div>
                  )}
                  
                  {earned && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      Earned +{achievement.points_reward} pts
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
