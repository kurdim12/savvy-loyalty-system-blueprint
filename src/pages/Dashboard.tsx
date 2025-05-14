
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CoffeeIcon, Award, Clock, AlertTriangle, Users } from 'lucide-react';
import CommunityGoalsList from '@/components/community/CommunityGoalsList';
import ReferFriend from '@/components/loyalty/ReferFriend';
import RankBenefits from '@/components/loyalty/RankBenefits';
import { getDiscountRate } from '@/integrations/supabase/functions';

const Dashboard = () => {
  const { profile } = useAuth();
  
  const { data: recentTransactions } = useQuery({
    queryKey: ['recentTransactions'],
    queryFn: async () => {
      if (!profile?.id) return [];
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id,
  });

  const { data: activeRedemptions } = useQuery({
    queryKey: ['activeRedemptions'],
    queryFn: async () => {
      if (!profile?.id) return [];
      const { data, error } = await supabase
        .from('redemptions')
        .select('*, reward:rewards(*)')
        .eq('user_id', profile.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id,
  });

  // Calculate next tier progress
  const currentMembership = profile?.membership_tier || 'bronze';
  const currentPoints = profile?.current_points || 0;
  
  let nextTier = '';
  let pointsToNextTier = 0;
  let progress = 0;

  if (currentMembership === 'bronze') {
    nextTier = 'silver';
    pointsToNextTier = Math.max(0, 200 - currentPoints);
    // Fix the progress calculation to properly show percentage
    progress = currentPoints > 0 ? Math.min((currentPoints / 200) * 100, 100) : 0;
  } else if (currentMembership === 'silver') {
    nextTier = 'gold';
    pointsToNextTier = Math.max(0, 550 - currentPoints);
    progress = Math.min(((currentPoints - 200) / (550 - 200)) * 100, 100);
  } else {
    // For gold members
    nextTier = 'gold';
    pointsToNextTier = 0;
    progress = 100;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#8B4513]">Welcome, {profile?.first_name}!</h1>
            <p className="text-[#6F4E37]">Here's an overview of your loyalty status.</p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-[#FFF8DC] text-[#8B4513] border-[#8B4513]/30 px-3 py-1">
              {currentMembership.charAt(0).toUpperCase() + currentMembership.slice(1)} Member
            </Badge>
            <Badge className="bg-[#8B4513] text-white px-3 py-1">
              {currentPoints} Points
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Membership Status Card */}
          <Card className="border-[#8B4513]/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-[#8B4513]">
                <CoffeeIcon className="h-5 w-5 text-[#8B4513]" />
                Membership Status
              </CardTitle>
              <CardDescription className="text-[#6F4E37]">Your current benefits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-[#8B4513]">Current Tier:</span>
                  <span className="font-medium capitalize text-[#6F4E37]">{currentMembership}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-[#8B4513]">Discount Rate:</span>
                  <span className="text-[#6F4E37]">{getDiscountRate(currentMembership)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-[#8B4513]">Total Visits:</span>
                  <span className="text-[#6F4E37]">{profile?.visits || 0} visits</span>
                </div>
                
                {pointsToNextTier > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-[#6F4E37]">Progress to {nextTier.charAt(0).toUpperCase() + nextTier.slice(1)}</span>
                      <span className="text-sm text-[#6F4E37]">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-[#FFF8DC]" />
                    <p className="text-sm mt-2 text-[#8B4513]">
                      {pointsToNextTier} more points needed!
                    </p>
                  </div>
                )}
                
                {pointsToNextTier === 0 && currentMembership === 'gold' && (
                  <p className="text-sm mt-2 text-[#8B4513]">
                    You've reached our highest tier! Enjoy all Gold benefits.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Rewards Card */}
          <Card className="border-[#8B4513]/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-[#8B4513]">
                <Award className="h-5 w-5 text-[#8B4513]" />
                Rewards
              </CardTitle>
              <CardDescription className="text-[#6F4E37]">Your points balance and rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-[#8B4513]">Available Points:</span>
                  <span className="font-bold text-[#8B4513]">{currentPoints} pts</span>
                </div>

                <div className="mt-4 space-y-2">
                  <h4 className="font-medium text-sm text-[#6F4E37]">Active Redemptions:</h4>
                  {activeRedemptions && activeRedemptions.length > 0 ? (
                    <ul className="space-y-2">
                      {activeRedemptions.map((redemption: any) => (
                        <li key={redemption.id} className="bg-[#FFF8DC] p-2 rounded-md text-sm flex justify-between">
                          <span className="text-[#8B4513]">{redemption.reward?.name}</span>
                          <span className="text-[#6F4E37]">{formatDate(redemption.created_at)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-[#8B4513]">No active redemptions.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Card */}
          <Card className="border-[#8B4513]/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-[#8B4513]">
                <Clock className="h-5 w-5 text-[#8B4513]" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-[#6F4E37]">Latest transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {recentTransactions && recentTransactions.length > 0 ? (
                <ul className="space-y-2">
                  {recentTransactions.map((transaction: any) => (
                    <li key={transaction.id} className="border-b pb-2 last:border-0 border-[#8B4513]/10">
                      <div className="flex justify-between">
                        <span className={transaction.transaction_type === 'earn' ? 'text-green-600' : 'text-[#8B4513]'}>
                          {transaction.transaction_type === 'earn' ? '+' : '-'}{transaction.points} pts
                        </span>
                        <span className="text-sm text-[#6F4E37]">{formatDate(transaction.created_at)}</span>
                      </div>
                      {transaction.notes && (
                        <p className="text-sm text-[#6F4E37]">{transaction.notes}</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <AlertTriangle className="h-8 w-8 text-[#FFD700] mb-2" />
                  <p className="text-sm font-medium text-[#8B4513]">No recent transactions</p>
                  <p className="text-xs text-[#6F4E37]">Visit our store to start earning points!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Rank Benefits and Refer Friend Components */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RankBenefits 
            currentPoints={currentPoints}
            membershipTier={profile?.membership_tier || 'bronze'}
          />
          <ReferFriend />
        </div>
        
        {/* Community Goals Section */}
        <div className="grid gap-6">
          <Card className="border-[#8B4513]/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-[#8B4513]">
                <Users className="h-5 w-5 text-[#8B4513]" />
                Community Goals
              </CardTitle>
              <CardDescription className="text-[#6F4E37]">Contribute your points to community challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <CommunityGoalsList />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
