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

const Dashboard = () => {
  const { profile, communityPoints } = useAuth();
  
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
  const currentVisits = profile?.visits || 0;
  
  let nextTier = '';
  let visitsNeeded = 0;
  let progress = 0;
  let pointsToNextTier = 0;

  if (currentMembership === 'bronze') {
    nextTier = 'silver';
    pointsToNextTier = Math.max(0, 200 - (profile?.current_points || 0));
    progress = Math.min(((profile?.current_points || 0) / 200) * 100, 100);
  } else if (currentMembership === 'silver') {
    nextTier = 'gold';
    pointsToNextTier = Math.max(0, 550 - (profile?.current_points || 0));
    progress = Math.min(((profile?.current_points || 0) - 200) / (550 - 200) * 100, 100);
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
  
  const getDiscountRate = (tier: string) => {
    switch(tier) {
      case 'bronze': return '10%';
      case 'silver': return '15%';
      case 'gold': return '25%';
      default: return '0%';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-amber-900">Welcome, {profile?.first_name}!</h1>
            <p className="text-amber-700">Here's an overview of your loyalty status.</p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-amber-100 text-amber-900 border-amber-300 px-3 py-1">
              {currentMembership.charAt(0).toUpperCase() + currentMembership.slice(1)} Member
            </Badge>
            <Badge variant="secondary" className="bg-amber-700 text-white px-3 py-1">
              {profile?.current_points || 0} Points
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CoffeeIcon className="h-5 w-5 text-amber-700" />
                Membership Status
              </CardTitle>
              <CardDescription>Your current benefits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-amber-900">Current Tier:</span>
                  <span className="font-medium capitalize">{currentMembership}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-amber-900">Discount Rate:</span>
                  <span>{getDiscountRate(currentMembership)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-amber-900">Total Visits:</span>
                  <span>{profile?.visits || 0} visits</span>
                </div>
                
                {pointsToNextTier > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Progress to {nextTier.charAt(0).toUpperCase() + nextTier.slice(1)}</span>
                      <span className="text-sm">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm mt-2 text-amber-700">
                      {pointsToNextTier} more points needed!
                    </p>
                  </div>
                )}
                
                {pointsToNextTier === 0 && currentMembership === 'gold' && (
                  <p className="text-sm mt-2 text-amber-700">
                    You've reached our highest tier! Enjoy all Gold benefits.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-700" />
                Rewards
              </CardTitle>
              <CardDescription>Your current balance and rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-amber-900">Available Points:</span>
                  <span className="font-bold text-amber-700">{profile?.current_points || 0} pts</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium text-amber-900">Community Points:</span>
                  <span className="font-bold text-amber-700">{communityPoints || 0} pts</span>
                </div>

                <div className="mt-4 space-y-2">
                  <h4 className="font-medium text-sm">Active Redemptions:</h4>
                  {activeRedemptions && activeRedemptions.length > 0 ? (
                    <ul className="space-y-2">
                      {activeRedemptions.map((redemption: any) => (
                        <li key={redemption.id} className="bg-amber-100 p-2 rounded-md text-sm flex justify-between">
                          <span>{redemption.reward?.name}</span>
                          <span className="text-amber-700">{formatDate(redemption.created_at)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-amber-700">No active redemptions.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-700" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {recentTransactions && recentTransactions.length > 0 ? (
                <ul className="space-y-2">
                  {recentTransactions.map((transaction: any) => (
                    <li key={transaction.id} className="border-b pb-2 last:border-0">
                      <div className="flex justify-between">
                        <span className={transaction.transaction_type === 'earn' ? 'text-green-600' : 'text-amber-700'}>
                          {transaction.transaction_type === 'earn' ? '+' : '-'}{transaction.points} pts
                        </span>
                        <span className="text-sm text-amber-700">{formatDate(transaction.created_at)}</span>
                      </div>
                      {transaction.notes && (
                        <p className="text-sm text-amber-900">{transaction.notes}</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
                  <p className="text-sm font-medium">No recent transactions</p>
                  <p className="text-xs text-amber-700">Visit our store to start earning points!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-700" />
                Community Goals
              </CardTitle>
              <CardDescription>Contribute your points to community challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <CommunityGoalsList />
            </CardContent>
          </Card>
          <ReferFriend />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
