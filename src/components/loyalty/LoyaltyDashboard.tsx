
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import loyaltyService from '@/services/loyaltyService';
import { LoyaltyActions } from './LoyaltyActions';
import { AchievementGallery } from './AchievementGallery';
import RankBenefits from './RankBenefits';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Award, Target, Activity } from 'lucide-react';

export const LoyaltyDashboard = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    if (!user) return;
    
    try {
      const userStats = await loyaltyService.getUserStats(user.id);
      setStats(userStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <Card className="border-[#8B4513]/20">
          <CardContent className="p-6 text-center">
            <div className="animate-pulse">Loading loyalty dashboard...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressToNext = () => {
    if (!profile) return 0;
    const current = profile.current_points;
    
    if (profile.membership_tier === 'bronze') {
      return Math.min((current / 200) * 100, 100);
    } else if (profile.membership_tier === 'silver') {
      return Math.min(((current - 200) / (550 - 200)) * 100, 100);
    }
    return 100;
  };

  const pointsToNext = () => {
    if (!profile) return 0;
    const current = profile.current_points;
    
    if (profile.membership_tier === 'bronze') {
      return Math.max(200 - current, 0);
    } else if (profile.membership_tier === 'silver') {
      return Math.max(550 - current, 0);
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#8B4513]/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-[#8B4513]">{profile?.current_points || 0}</div>
            <div className="text-sm text-[#6F4E37]">Current Points</div>
          </CardContent>
        </Card>
        
        <Card className="border-[#8B4513]/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-[#8B4513]">{stats.totalEarned}</div>
            <div className="text-sm text-[#6F4E37]">Total Earned</div>
          </CardContent>
        </Card>
        
        <Card className="border-[#8B4513]/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-[#8B4513]">{profile?.visits || 0}</div>
            <div className="text-sm text-[#6F4E37]">Café Visits</div>
          </CardContent>
        </Card>
        
        <Card className="border-[#8B4513]/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-[#8B4513]">{stats.achievements.length}</div>
            <div className="text-sm text-[#6F4E37]">Achievements</div>
          </CardContent>
        </Card>
      </div>

      {/* Next Tier Progress */}
      {profile?.membership_tier !== 'gold' && (
        <Card className="border-[#8B4513]/20">
          <CardHeader>
            <CardTitle className="text-[#8B4513] flex items-center gap-2">
              <Target className="h-5 w-5" />
              Next Tier Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[#6F4E37]">
                  Progress to {profile?.membership_tier === 'bronze' ? 'Silver' : 'Gold'}
                </span>
                <Badge className="capitalize bg-[#8B4513] text-white">
                  {progressToNext().toFixed(0)}%
                </Badge>
              </div>
              <Progress value={progressToNext()} className="h-3" />
              <div className="text-sm text-[#6F4E37]">
                {pointsToNext() > 0 ? `${pointsToNext()} more points needed` : 'Tier unlocked!'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="actions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="actions" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Actions
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="benefits" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Benefits
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="actions">
          <LoyaltyActions />
        </TabsContent>

        <TabsContent value="achievements">
          <AchievementGallery />
        </TabsContent>

        <TabsContent value="benefits">
          <RankBenefits 
            currentPoints={profile?.current_points || 0}
            membershipTier={profile?.membership_tier || 'bronze'}
          />
        </TabsContent>

        <TabsContent value="activity">
          <Card className="border-[#8B4513]/20">
            <CardHeader>
              <CardTitle className="text-[#8B4513]">Recent Activity</CardTitle>
              <CardDescription className="text-[#6F4E37]">
                Your latest point transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.transactions.slice(0, 10).map((transaction: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-[#FFF8DC]/30">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        transaction.transaction_type === 'earn' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.transaction_type === 'earn' ? '+' : '-'}
                      </div>
                      <div>
                        <div className="font-medium text-[#8B4513]">
                          {transaction.transaction_type === 'earn' ? 'Points Earned' : 'Points Redeemed'}
                        </div>
                        <div className="text-sm text-[#6F4E37]">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant={transaction.transaction_type === 'earn' ? 'default' : 'destructive'}>
                      {transaction.transaction_type === 'earn' ? '+' : '-'}{transaction.points}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
