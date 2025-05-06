
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
  BadgeDollarSign, ArrowRight, Target
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
      // Get count of users
      const { count: usersCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

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

      return {
        usersCount: usersCount || 0,
        recentTransactionsCount: recentTransactionsCount || 0,
        activeRewardsCount: activeRewardsCount || 0,
        goalsCount: goalsCount || 0
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
        <div>
          <h1 className="text-2xl font-bold text-amber-900">Admin Dashboard</h1>
          <p className="text-amber-700">Manage your loyalty program</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-700" />
                Total Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? '...' : stats?.usersCount}
              </div>
              <p className="text-xs text-muted-foreground">
                Active loyalty program members
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-amber-700" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? '...' : stats?.recentTransactionsCount}
              </div>
              <p className="text-xs text-muted-foreground">
                In the last 30 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-700" />
                Active Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? '...' : stats?.activeRewardsCount}
              </div>
              <p className="text-xs text-muted-foreground">
                Available for redemption
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-amber-700" />
                Community Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? '...' : stats?.goalsCount}
              </div>
              <p className="text-xs text-muted-foreground">
                Active community challenges
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used tools and reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4 px-4"
                  onClick={() => setActiveTab('customers')}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 p-2 rounded">
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
                  className="justify-start h-auto py-4 px-4"
                  onClick={() => setActiveTab('rewards')}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 p-2 rounded">
                      <Award className="h-5 w-5 text-amber-700" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Manage Rewards</div>
                      <div className="text-xs text-muted-foreground">
                        Create or update available rewards
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
                </Button>

                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4 px-4"
                  onClick={() => navigate('/admin/community-goals')}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 p-2 rounded">
                      <Target className="h-5 w-5 text-amber-700" />
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
                  className="justify-start h-auto py-4 px-4"
                  onClick={() => setActiveTab('transactions')}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 p-2 rounded">
                      <BarChart3 className="h-5 w-5 text-amber-700" />
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

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Loyalty program overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-medium text-sm text-amber-900">Most Active Members</h3>
                  {/* Placeholder for actual stats */}
                  <p className="text-sm text-amber-700 mt-2">
                    Add analytics charts and member stats here
                  </p>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-medium text-sm text-amber-900">Popular Rewards</h3>
                  {/* Placeholder for actual stats */}
                  <p className="text-sm text-amber-700 mt-2">
                    Show top redeemed rewards here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
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
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
