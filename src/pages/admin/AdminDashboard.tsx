
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Line, Pie } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { UserIcon, CoffeeIcon, GiftIcon, ArrowRightLeft } from 'lucide-react';

interface DashboardStat {
  label: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    totalUsers: number;
    totalPoints: number;
    todayTransactions: number;
    newUsersMonth: number;
  }>({
    totalUsers: 0,
    totalPoints: 0,
    todayTransactions: 0,
    newUsersMonth: 0,
  });
  
  const [recentRedemptions, setRecentRedemptions] = useState<any[]>([]);

  useEffect(() => {
    // Verify admin status
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch total users
        const { count: totalUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        // Fetch total points in circulation
        const { data: pointsData } = await supabase
          .from('profiles')
          .select('current_points');
        
        const totalPoints = pointsData?.reduce((sum, profile) => sum + (profile.current_points || 0), 0) || 0;
        
        // Get today's date for filtering
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Fetch today's transactions
        const { count: todayTransactions } = await supabase
          .from('transactions')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString());
        
        // Fetch new users this month
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const { count: newUsersMonth } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', firstDayOfMonth.toISOString());
        
        // Fetch recent redemptions
        const { data: redemptions } = await supabase
          .from('redemptions')
          .select(`
            id,
            points_spent,
            created_at,
            status,
            profiles:user_id (email, first_name, last_name),
            rewards:reward_id (name)
          `)
          .order('created_at', { ascending: false })
          .limit(10);
        
        setStats({
          totalUsers: totalUsers || 0,
          totalPoints,
          todayTransactions: todayTransactions || 0,
          newUsersMonth: newUsersMonth || 0,
        });
        
        setRecentRedemptions(redemptions || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAdmin, navigate]);

  const dashboardStats: DashboardStat[] = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      change: '+12% from last month',
      icon: <UserIcon className="h-5 w-5 text-amber-700" />,
      trend: 'up',
    },
    {
      label: 'Points in Circulation',
      value: stats.totalPoints.toLocaleString(),
      icon: <ArrowRightLeft className="h-5 w-5 text-amber-700" />,
    },
    {
      label: "Today's Transactions",
      value: stats.todayTransactions,
      icon: <CoffeeIcon className="h-5 w-5 text-amber-700" />,
    },
    {
      label: 'New Users This Month',
      value: stats.newUsersMonth,
      change: '+5% from last month',
      icon: <UserIcon className="h-5 w-5 text-amber-700" />,
      trend: 'up',
    },
  ];

  // Sample chart data
  const pointsChartData = [
    { name: 'Jan', earned: 1200, redeemed: 800 },
    { name: 'Feb', earned: 1800, redeemed: 1200 },
    { name: 'Mar', earned: 2500, redeemed: 2000 },
    { name: 'Apr', earned: 3100, redeemed: 2400 },
    { name: 'May', earned: 3500, redeemed: 2800 },
    { name: 'Jun', earned: 4200, redeemed: 3100 },
  ];

  const rankDistribution = [
    { name: 'Bronze', value: 65 },
    { name: 'Silver', value: 25 },
    { name: 'Gold', value: 10 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/admin/users')}>
            View All Users
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/transactions')}>
            View Transactions
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="p-4">
                <div className="h-4 w-1/2 rounded bg-amber-200"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-1/3 rounded bg-amber-100"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {dashboardStats.map((stat, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <div className="rounded-md bg-amber-50 p-2">
                    {stat.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  {stat.change && (
                    <p 
                      className={`text-xs ${
                        stat.trend === 'up' ? 'text-green-500' : 
                        stat.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                      }`}
                    >
                      {stat.change}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Points earned vs redeemed chart */}
            <Card>
              <CardHeader>
                <CardTitle>Points Earned vs Redeemed</CardTitle>
                <CardDescription>
                  Monthly breakdown of loyalty point activity
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <ChartContainer 
                  className="aspect-[4/3]"
                  config={{
                    earned: { 
                      label: 'Points Earned',
                      theme: { light: '#f59e0b', dark: '#f59e0b' }
                    },
                    redeemed: { 
                      label: 'Points Redeemed',
                      theme: { light: '#78350f', dark: '#92400e' }
                    }
                  }}
                >
                  <Line 
                    data={pointsChartData}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <ChartTooltip content={<ChartTooltipContent />} />
                    {/* Add additional chart components here if needed */}
                  </Line>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Rank distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Membership Tier Distribution</CardTitle>
                <CardDescription>
                  Breakdown of customers by tier level
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center pt-2">
                <ChartContainer 
                  className="aspect-[4/3] max-w-[300px]"
                  config={{
                    Bronze: { 
                      label: 'Bronze',
                      theme: { light: '#d1d5db', dark: '#9ca3af' }
                    },
                    Silver: { 
                      label: 'Silver',
                      theme: { light: '#94a3b8', dark: '#64748b' }
                    },
                    Gold: { 
                      label: 'Gold',
                      theme: { light: '#f59e0b', dark: '#d97706' }
                    }
                  }}
                >
                  <Pie 
                    data={rankDistribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    label
                  >
                    <ChartTooltip content={<ChartTooltipContent labelKey="name" />} />
                    {/* Add additional chart components here if needed */}
                  </Pie>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GiftIcon className="h-5 w-5" />
                Recent Redemptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b text-xs font-medium text-muted-foreground">
                      <th className="p-2 text-left">Customer</th>
                      <th className="p-2 text-left">Reward</th>
                      <th className="p-2 text-left">Points</th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRedemptions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-muted-foreground">
                          No recent redemptions found.
                        </td>
                      </tr>
                    ) : (
                      recentRedemptions.map((redemption) => (
                        <tr key={redemption.id} className="border-b">
                          <td className="p-2">
                            {redemption.profiles?.first_name || redemption.profiles?.email || 'Unknown'}
                          </td>
                          <td className="p-2">{redemption.rewards?.name || 'Unknown Reward'}</td>
                          <td className="p-2">{redemption.points_spent}</td>
                          <td className="p-2">
                            <span 
                              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                redemption.status === 'fulfilled' ? 'bg-green-100 text-green-800' : 
                                redemption.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                                'bg-red-100 text-red-800'
                              }`}
                            >
                              {redemption.status}
                            </span>
                          </td>
                          <td className="p-2">
                            {new Date(redemption.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
