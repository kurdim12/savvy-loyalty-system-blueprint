
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { ArrowUpCircle, ArrowDownCircle, Users, Gift, Coffee, ChevronRight, Bell } from 'lucide-react';

// Types for the dashboard stats
interface DashboardStats {
  totalUsers: number;
  newUsersToday: number;
  newUsersWeek: number;
  newUsersMonth: number;
  totalPoints: number;
  pointsEarnedToday: number;
  pointsRedeemedToday: number;
  activeTransactions: number;
}

// Mock data for the charts
const userGrowthData = [
  { name: 'Jan', users: 12 },
  { name: 'Feb', users: 19 },
  { name: 'Mar', users: 28 },
  { name: 'Apr', users: 35 },
  { name: 'May', users: 41 },
  { name: 'Jun', users: 52 },
  { name: 'Jul', users: 60 }
];

const rankDistributionData = [
  { name: 'Bronze', value: 70 },
  { name: 'Silver', value: 20 },
  { name: 'Gold', value: 10 },
];

const COLORS = ['#C19A6B', '#C0C0C0', '#FFD700'];

const recentActivityData = [
  { id: 1, type: 'signup', user: 'john.doe@example.com', time: '2 mins ago' },
  { id: 2, type: 'redemption', user: 'alice.smith@example.com', reward: 'Free Coffee', time: '15 mins ago' },
  { id: 3, type: 'points', user: 'robert.johnson@example.com', points: '+25', time: '32 mins ago' },
  { id: 4, type: 'signup', user: 'emma.wilson@example.com', time: '1 hour ago' },
  { id: 5, type: 'redemption', user: 'michael.brown@example.com', reward: 'Pastry Discount', time: '2 hours ago' },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    newUsersToday: 0,
    newUsersWeek: 0,
    newUsersMonth: 0,
    totalPoints: 0,
    pointsEarnedToday: 0,
    pointsRedeemedToday: 0,
    activeTransactions: 0,
  });

  // Fetch dashboard statistics
  const { data: dashboardStats, isLoading } = useQuery({
    queryKey: ['admin', 'dashboardStats'],
    queryFn: async () => {
      try {
        // Get total users
        const { count: totalUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        // Get new users today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { count: newUsersToday } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString());

        // Get total points in circulation
        const { data: pointsData } = await supabase
          .from('profiles')
          .select('current_points');
        
        const totalPoints = pointsData?.reduce((sum, profile) => sum + (profile.current_points || 0), 0) || 0;

        // Get transactions today
        const { data: earnedToday } = await supabase
          .from('transactions')
          .select('points')
          .eq('transaction_type', 'earn')
          .gte('created_at', today.toISOString());
        
        const { data: redeemedToday } = await supabase
          .from('transactions')
          .select('points')
          .eq('transaction_type', 'redeem')
          .gte('created_at', today.toISOString());
        
        const pointsEarnedToday = earnedToday?.reduce((sum, tx) => sum + (tx.points || 0), 0) || 0;
        const pointsRedeemedToday = redeemedToday?.reduce((sum, tx) => sum + (tx.points || 0), 0) || 0;
        
        // Active transactions (last 24 hours)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        const { count: activeTransactions } = await supabase
          .from('transactions')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', yesterday.toISOString());
        
        // Get new users this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const { count: newUsersWeek } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', oneWeekAgo.toISOString());
        
        // Get new users this month
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        const { count: newUsersMonth } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', oneMonthAgo.toISOString());
        
        return {
          totalUsers: totalUsers || 0,
          newUsersToday: newUsersToday || 0,
          newUsersWeek: newUsersWeek || 0,
          newUsersMonth: newUsersMonth || 0,
          totalPoints,
          pointsEarnedToday,
          pointsRedeemedToday,
          activeTransactions: activeTransactions || 0,
        };
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return null;
      }
    }
  });

  useEffect(() => {
    if (dashboardStats) {
      setStats(dashboardStats);
    }
  }, [dashboardStats]);

  const StatCard = ({ title, value, icon, footer, color = "text-blue-600" }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`rounded-full p-2 ${color.replace('text', 'bg')}/15`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{isLoading ? '-' : value}</div>
        {footer && <p className="text-xs text-muted-foreground mt-1">{footer}</p>}
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex space-x-2">
            <Button variant="outline">Export Report</Button>
            <Button>Create Promotion</Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Users" 
            value={stats.totalUsers} 
            icon={<Users className="h-4 w-4 text-blue-600" />}
            footer={`+${stats.newUsersToday} today`}
            color="text-blue-600"
          />
          <StatCard 
            title="Total Points" 
            value={stats.totalPoints} 
            icon={<Coffee className="h-4 w-4 text-amber-600" />}
            footer="In circulation"
            color="text-amber-600"
          />
          <StatCard 
            title="Points Today" 
            value={`+${stats.pointsEarnedToday} / -${stats.pointsRedeemedToday}`} 
            icon={<ArrowUpCircle className="h-4 w-4 text-green-600" />}
            footer="Earned / Redeemed"
            color="text-green-600"
          />
          <StatCard 
            title="Active Transactions" 
            value={stats.activeTransactions} 
            icon={<ArrowDownCircle className="h-4 w-4 text-purple-600" />}
            footer="Last 24 hours"
            color="text-purple-600"
          />
        </div>

        {/* Charts and Activity */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* User Growth Chart */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>New user signups over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#8B4513" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Rank Distribution */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Rank Distribution</CardTitle>
              <CardDescription>Users by membership tier</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={rankDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {rankDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest events in the loyalty system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivityData.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-amber-100 p-2">
                      {activity.type === 'signup' ? (
                        <Users className="h-4 w-4 text-amber-600" />
                      ) : activity.type === 'redemption' ? (
                        <Gift className="h-4 w-4 text-amber-600" />
                      ) : (
                        <Coffee className="h-4 w-4 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{activity.user}</p>
                      <p className="text-sm text-gray-500">
                        {activity.type === 'signup' ? 'New user signup' : 
                         activity.type === 'redemption' ? `Redeemed ${activity.reward}` : 
                         `Point adjustment ${activity.points}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Activity
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button variant="outline" className="h-24 flex-col">
            <Users className="h-6 w-6 mb-2" />
            <span>Add New User</span>
          </Button>
          <Button variant="outline" className="h-24 flex-col">
            <Bell className="h-6 w-6 mb-2" />
            <span>Send Notifications</span>
          </Button>
          <Button variant="outline" className="h-24 flex-col">
            <Gift className="h-6 w-6 mb-2" />
            <span>Create Promotion</span>
          </Button>
          <Button variant="outline" className="h-24 flex-col">
            <Coffee className="h-6 w-6 mb-2" />
            <span>Manage Drinks</span>
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
