
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Clock, 
  AlertTriangle, 
  Users, 
  Gift, 
  ArrowRight,
  Calendar,
  Coffee,
  Star,
  TrendingUp,
  Award,
  Sparkles
} from 'lucide-react';
import CommunityGoalsList from '@/components/community/CommunityGoalsList';
import ReferFriend from '@/components/loyalty/ReferFriend';
import RankBenefits from '@/components/loyalty/RankBenefits';
import { WelcomeHeader } from '@/components/dashboard/WelcomeHeader';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { ProgressCard } from '@/components/dashboard/ProgressCard';
import { InstallPrompt } from '@/components/dashboard/InstallPrompt';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  
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
    staleTime: 30000,
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
    staleTime: 30000,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const currentPoints = profile?.current_points || 0;
  const membershipTier = profile?.membership_tier || 'bronze';
  const visits = profile?.visits || 0;
  const pendingCount = activeRedemptions?.length || 0;

  const quickActions = [
    {
      title: 'Browse Rewards',
      description: 'Discover amazing coffee rewards',
      icon: Gift,
      color: 'bg-gradient-to-r from-amber-500 to-orange-500',
      hoverColor: 'hover:from-amber-600 hover:to-orange-600',
      action: () => navigate('/rewards')
    },
    {
      title: 'Join Community',
      description: 'Connect with fellow coffee lovers',
      icon: Users,
      color: 'bg-gradient-to-r from-blue-500 to-indigo-500',
      hoverColor: 'hover:from-blue-600 hover:to-indigo-600',
      action: () => navigate('/community')
    },
    {
      title: 'Update Profile',
      description: 'Personalize your coffee experience',
      icon: Star,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      hoverColor: 'hover:from-purple-600 hover:to-pink-600',
      action: () => navigate('/profile')
    }
  ];

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6 lg:space-y-8 px-2 sm:px-0">
        {/* Install Prompt */}
        <InstallPrompt />

        {/* Welcome Header */}
        <WelcomeHeader
          firstName={profile?.first_name}
          currentPoints={currentPoints}
          membershipTier={membershipTier}
        />

        {/* Stats Grid */}
        <StatsGrid
          currentPoints={currentPoints}
          membershipTier={membershipTier}
          visits={visits}
          pendingRedemptions={pendingCount}
        />

        {/* Progress Card */}
        <ProgressCard
          currentPoints={currentPoints}
          membershipTier={membershipTier}
        />

        {/* Quick Actions */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card 
                key={index}
                className="group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                onClick={action.action}
              >
                <div className={`h-2 ${action.color}`} />
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${action.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2 text-gray-900">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your latest transactions</CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">
                  Last 5
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="text-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto mb-3"></div>
                  <p className="text-sm text-gray-600">Loading transactions...</p>
                </div>
              ) : recentTransactions && recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentTransactions.map((transaction: any) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          transaction.transaction_type === 'earn' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.transaction_type === 'earn' ? 
                            <TrendingUp className="h-4 w-4" /> : 
                            <Gift className="h-4 w-4" />
                          }
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${
                              transaction.transaction_type === 'earn' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.transaction_type === 'earn' ? '+' : '-'}{transaction.points} pts
                            </span>
                          </div>
                          {transaction.notes && (
                            <p className="text-sm text-gray-600">{transaction.notes}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{formatDate(transaction.created_at)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="p-4 bg-blue-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Coffee className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="font-medium text-gray-900 mb-2">No recent activity</p>
                  <p className="text-sm text-gray-600 mb-4">Visit our store to start earning points!</p>
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate('/rewards')}
                  >
                    Explore Rewards
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Redemptions */}
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2 text-gray-900">
                    <Gift className="h-5 w-5 text-purple-600" />
                    Active Rewards
                  </CardTitle>
                  <CardDescription>Your pending redemptions</CardDescription>
                </div>
                {pendingCount > 0 && (
                  <Badge className="bg-purple-100 text-purple-700">
                    {pendingCount} pending
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {redemptionsLoading ? (
                <div className="text-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto mb-3"></div>
                  <p className="text-sm text-gray-600">Loading redemptions...</p>
                </div>
              ) : activeRedemptions && activeRedemptions.length > 0 ? (
                <div className="space-y-3">
                  {activeRedemptions.map((redemption: any) => (
                    <div key={redemption.id} className="p-4 bg-purple-50 rounded-xl border border-purple-200 hover:bg-purple-100 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-200 rounded-lg">
                            <Gift className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-purple-900">{redemption.reward?.name}</p>
                            <p className="text-sm text-purple-700">Redeemed {formatDate(redemption.created_at)}</p>
                          </div>
                        </div>
                        <Badge className="bg-amber-200 text-amber-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="p-4 bg-purple-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="font-medium text-gray-900 mb-2">No active redemptions</p>
                  <p className="text-sm text-gray-600 mb-4">Redeem your points for amazing rewards!</p>
                  <Button 
                    size="sm" 
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => navigate('/rewards')}
                  >
                    Browse Rewards
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Loyalty Features */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          <RankBenefits 
            currentPoints={currentPoints}
            membershipTier={membershipTier}
          />
          <ReferFriend />
        </div>
        
        {/* Community Goals */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900">
              <Users className="h-5 w-5 text-green-600" />
              Community Goals
            </CardTitle>
            <CardDescription>Join forces with fellow coffee enthusiasts</CardDescription>
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
