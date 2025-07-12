
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CoffeeIcon, Award, Clock, AlertTriangle, Users, Wallet, Star, Gift, TrendingUp } from 'lucide-react';
import CommunityGoalsList from '@/components/community/CommunityGoalsList';
import ReferFriend from '@/components/loyalty/ReferFriend';
import RankBenefits from '@/components/loyalty/RankBenefits';
import { getDiscountRate } from '@/integrations/supabase/functions';
import { toast } from 'sonner';

const Dashboard = () => {
  const { profile } = useAuth();
  
  const { data: recentTransactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['recentTransactions', profile?.id],
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
    staleTime: 30000, // 30 seconds
  });

  const { data: activeRedemptions, isLoading: redemptionsLoading } = useQuery({
    queryKey: ['activeRedemptions', profile?.id],
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
    staleTime: 30000, // 30 seconds
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
    progress = currentPoints > 0 ? Math.min((currentPoints / 200) * 100, 100) : 0;
  } else if (currentMembership === 'silver') {
    nextTier = 'gold';
    pointsToNextTier = Math.max(0, 550 - currentPoints);
    progress = Math.min(((currentPoints - 200) / (550 - 200)) * 100, 100);
  } else {
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

  const copyPointsToClipboard = () => {
    navigator.clipboard.writeText(currentPoints.toString());
    toast.success('Points copied to clipboard!');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Header with Enhanced Design */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 border border-amber-200">
          <div className="absolute inset-0 opacity-30"></div>
          <div className="relative p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">
                  Welcome back, {profile?.first_name}! ☕
                </h1>
                <p className="text-amber-700 text-lg">Your coffee journey continues...</p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Badge 
                  variant="outline" 
                  className="bg-white/80 text-amber-800 border-amber-300 px-4 py-2 text-sm font-semibold"
                >
                  <Star className="h-4 w-4 mr-1 fill-current" />
                  {currentMembership.charAt(0).toUpperCase() + currentMembership.slice(1)} Member
                </Badge>
                <Badge 
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 text-sm font-bold cursor-pointer transition-colors" 
                  onClick={copyPointsToClipboard}
                >
                  <Wallet className="h-4 w-4 mr-1" />
                  {currentPoints} Points
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Points Card */}
          <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700">Available Points</p>
                  <p className="text-3xl font-bold text-amber-900">{currentPoints}</p>
                </div>
                <div className="p-3 bg-amber-200 rounded-full">
                  <Wallet className="h-6 w-6 text-amber-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Membership Card */}
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Membership</p>
                  <p className="text-2xl font-bold text-blue-900 capitalize">{currentMembership}</p>
                </div>
                <div className="p-3 bg-blue-200 rounded-full">
                  <Award className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Discount Card */}
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Discount Rate</p>
                  <p className="text-3xl font-bold text-green-900">{getDiscountRate(currentMembership)}%</p>
                </div>
                <div className="p-3 bg-green-200 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visits Card */}
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Total Visits</p>
                  <p className="text-3xl font-bold text-purple-900">{profile?.visits || 0}</p>
                </div>
                <div className="p-3 bg-purple-200 rounded-full">
                  <CoffeeIcon className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress to Next Tier */}
        {pointsToNextTier > 0 && (
          <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-amber-900">
                <Star className="h-5 w-5 text-amber-600" />
                Progress to {nextTier.charAt(0).toUpperCase() + nextTier.slice(1)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-700">Progress</span>
                  <span className="text-sm font-medium text-amber-900">{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} className="h-3 bg-amber-100" />
                <p className="text-sm text-amber-700">
                  <span className="font-semibold">{pointsToNextTier} more points</span> needed to reach {nextTier} tier!
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-900">
                <Clock className="h-5 w-5 text-gray-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="text-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mx-auto mb-3"></div>
                  <p className="text-sm text-gray-600">Loading transactions...</p>
                </div>
              ) : recentTransactions && recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentTransactions.map((transaction: any) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`font-semibold ${transaction.transaction_type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.transaction_type === 'earn' ? '+' : '-'}{transaction.points} pts
                          </span>
                          <span className="text-sm text-gray-500">{formatDate(transaction.created_at)}</span>
                        </div>
                        {transaction.notes && (
                          <p className="text-sm text-gray-600 mt-1">{transaction.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto mb-3" />
                  <p className="font-medium text-gray-900">No recent activity</p>
                  <p className="text-sm text-gray-600">Visit our store to start earning points!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Redemptions */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-900">
                <Gift className="h-5 w-5 text-gray-600" />
                Active Rewards
              </CardTitle>
              <CardDescription>Your pending redemptions</CardDescription>
            </CardHeader>
            <CardContent>
              {redemptionsLoading ? (
                <div className="text-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mx-auto mb-3"></div>
                  <p className="text-sm text-gray-600">Loading redemptions...</p>
                </div>
              ) : activeRedemptions && activeRedemptions.length > 0 ? (
                <div className="space-y-3">
                  {activeRedemptions.map((redemption: any) => (
                    <div key={redemption.id} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-amber-900">{redemption.reward?.name}</p>
                          <p className="text-sm text-amber-700">Redeemed {formatDate(redemption.created_at)}</p>
                        </div>
                        <Badge className="bg-amber-200 text-amber-800">Pending</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Gift className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="font-medium text-gray-900">No active redemptions</p>
                  <p className="text-sm text-gray-600">Redeem your points for rewards!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Additional Components */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RankBenefits 
            currentPoints={currentPoints}
            membershipTier={profile?.membership_tier || 'bronze'}
          />
          <ReferFriend />
        </div>
        
        {/* Community Goals */}
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-amber-900">
              <Users className="h-5 w-5 text-amber-600" />
              Community Goals
            </CardTitle>
            <CardDescription>Contribute your points to community challenges</CardDescription>
          </CardHeader>
          <CardContent>
            <CommunityGoalsList />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
