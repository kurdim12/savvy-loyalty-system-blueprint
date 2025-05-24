import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import CustomersList from '@/components/admin/CustomersList';
import TransactionsList from '@/components/admin/TransactionsList';
import RewardsList from '@/components/admin/RewardsList';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, Award, CoffeeIcon, BarChart3, ClipboardList, 
  BadgeDollarSign, ArrowRight, Target, Gift, Star
} from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Redirect non-admins away
    if (!loading && !isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, loading, navigate]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      // Get count of customers (role = 'customer')
      const { count: usersCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'customer');

      if (usersError) throw usersError;

      // Get count of transactions in last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: recentTransactionsCount, error: transactionsError } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .gt('created_at', thirtyDaysAgo.toISOString());

      if (transactionsError) throw transactionsError;

      // Get count of active rewards
      const { count: activeRewardsCount, error: rewardsError } = await supabase
        .from('rewards')
        .select('*', { count: 'exact', head: true })
        .eq('active', true);

      if (rewardsError) throw rewardsError;

      // Get count of community goals
      const { count: goalsCount, error: goalsError } = await supabase
        .from('community_goals')
        .select('*', { count: 'exact', head: true });
        
      if (goalsError) throw goalsError;

      // Get count of pending redemptions
      const { count: pendingRedemptionsCount, error: redemptionsError } = await supabase
        .from('redemptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (redemptionsError) throw redemptionsError;

      return {
        usersCount: usersCount || 0,
        recentTransactionsCount: recentTransactionsCount || 0,
        activeRewardsCount: activeRewardsCount || 0,
        goalsCount: goalsCount || 0,
        pendingRedemptionsCount: pendingRedemptionsCount || 0
      };
    },
    enabled: !loading && isAdmin,
  });

  if (loading) {
    return <Layout adminOnly><div>Loading...</div></Layout>;
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <Layout adminOnly>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-amber-900">Admin Dashboard</h1>
            <p className="text-amber-700">Manage your loyalty program</p>
          </div>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Raw Smith Coffee" className="h-8 w-auto" />
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-700" />
                Total Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-900">
                {statsLoading ? '...' : stats?.usersCount}
              </div>
              <p className="text-xs text-amber-700">
                Active loyalty program members
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-blue-700" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {statsLoading ? '...' : stats?.recentTransactionsCount}
              </div>
              <p className="text-xs text-blue-700">
                In the last 30 days
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Award className="h-4 w-4 text-green-700" />
                Active Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {statsLoading ? '...' : stats?.activeRewardsCount}
              </div>
              <p className="text-xs text-green-700">
                Available for redemption
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-700" />
                Community Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {statsLoading ? '...' : stats?.goalsCount}
              </div>
              <p className="text-xs text-purple-700">
                Active community challenges
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Gift className="h-4 w-4 text-orange-700" />
                Pending Redemptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">
                {statsLoading ? '...' : stats?.pendingRedemptionsCount}
              </div>
              <p className="text-xs text-orange-700">
                Awaiting approval
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <Card className="lg:col-span-2 bg-gradient-to-br from-amber-50 to-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CoffeeIcon className="h-5 w-5 text-amber-700" />
                Quick Actions
              </CardTitle>
              <CardDescription>Frequently used tools and reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4 px-4 border-2 hover:border-amber-300 hover:bg-amber-50"
                  onClick={() => setActiveTab('customers')}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 p-2 rounded-lg">
                      <BadgeDollarSign className="h-5 w-5 text-amber-700" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Add Points</div>
                      <div className="text-xs text-muted-foreground">
                        Issue points to customers manually
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
                </Button>

                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4 px-4 border-2 hover:border-green-300 hover:bg-green-50"
                  onClick={() => navigate('/admin/redeem')}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Gift className="h-5 w-5 text-green-700" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Process Redemptions</div>
                      <div className="text-xs text-muted-foreground">
                        Approve or reject pending rewards
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
                </Button>

                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4 px-4 border-2 hover:border-blue-300 hover:bg-blue-50"
                  onClick={() => setActiveTab('enhanced-rewards')}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Award className="h-5 w-5 text-blue-700" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Enhanced Rewards</div>
                      <div className="text-xs text-muted-foreground">
                        Advanced rewards management
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
                </Button>

                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4 px-4 border-2 hover:border-purple-300 hover:bg-purple-50"
                  onClick={() => navigate('/admin/community')}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Target className="h-5 w-5 text-purple-700" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Community Goals</div>
                      <div className="text-xs text-muted-foreground">
                        Manage community challenges
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
                </Button>

                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4 px-4 border-2 hover:border-indigo-300 hover:bg-indigo-50"
                  onClick={() => setActiveTab('transactions')}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-indigo-700" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Transaction History</div>
                      <div className="text-xs text-muted-foreground">
                        View all point transactions
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-600" />
                Quick Stats
              </CardTitle>
              <CardDescription>Loyalty program overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-amber-200">
                  <h3 className="font-medium text-sm text-amber-900 mb-2">Program Performance</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-700">Active Members</span>
                      <span className="font-medium text-amber-900">{stats?.usersCount || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-700">Total Rewards</span>
                      <span className="font-medium text-amber-900">{stats?.activeRewardsCount || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-amber-200">
                  <h3 className="font-medium text-sm text-amber-900 mb-2">Recent Activity</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-700">New Transactions</span>
                      <span className="font-medium text-amber-900">{stats?.recentTransactionsCount || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-700">Pending Redemptions</span>
                      <span className="font-medium text-amber-900">{stats?.pendingRedemptionsCount || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-amber-50 border border-amber-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-amber-100">Overview</TabsTrigger>
            <TabsTrigger value="customers" className="data-[state=active]:bg-amber-100">Customers</TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-amber-100">Transactions</TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-amber-100">Rewards</TabsTrigger>
            <TabsTrigger value="enhanced-rewards" className="data-[state=active]:bg-amber-100">Enhanced Rewards</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>
                  Welcome to the Raw Smith Coffee loyalty program admin panel.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Select a tab above to manage different aspects of your loyalty program.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="customers">
            <CustomersList />
          </TabsContent>
          
          <TabsContent value="transactions">
            <TransactionsList />
          </TabsContent>
          
          <TabsContent value="rewards">
            <RewardsList />
          </TabsContent>
          
          <TabsContent value="enhanced-rewards">
            <EnhancedRewardsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
