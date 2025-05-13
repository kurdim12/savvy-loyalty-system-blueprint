
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, Coffee, Gift, ArrowUpRight, ArrowDownRight, CheckCircle, 
  AlertCircle, ChevronsRight, ArrowRightLeft, LayoutDashboard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type DashboardMetrics = {
  totalCustomers: number;
  customerGrowth: number;
  pointsIssuedThisMonth: number;
  pointsGrowth: number;
  activeRewards: number;
  redemptionsThisMonth: number;
};

type ActivityItem = {
  id: string;
  type: 'signup' | 'redemption' | 'transaction' | 'reward';
  customerId: string;
  customerName?: string;
  points?: number;
  reward?: string;
  timestamp: string;
  timeAgo: string;
};

type SystemStatus = {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Fetch dashboard metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['admin', 'metrics', 'dashboard'],
    queryFn: async () => {
      try {
        // Get total customers
        const { count: totalCustomers } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .neq('role', 'admin');

        // Get customers from last month for growth calculation
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getDate() - 30);
        
        const { count: lastMonthCustomers } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .neq('role', 'admin')
          .lt('created_at', lastMonth.toISOString());
        
        const customerGrowth = lastMonthCustomers ? 
          Math.round(((totalCustomers || 0) - lastMonthCustomers) / lastMonthCustomers * 100) : 
          0;
        
        // Get points issued this month
        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);
        
        const { data: pointsThisMonth } = await supabase
          .from('transactions')
          .select('points')
          .eq('transaction_type', 'earn')
          .gte('created_at', thisMonth.toISOString());
        
        const pointsIssuedThisMonth = pointsThisMonth?.reduce((sum, tx) => sum + (tx.points || 0), 0) || 0;
        
        // Get points from previous month for growth calculation
        const prevMonth = new Date();
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        prevMonth.setDate(1);
        prevMonth.setHours(0, 0, 0, 0);
        
        const lastMonthEnd = new Date(thisMonth);
        lastMonthEnd.setMilliseconds(-1);
        
        const { data: pointsLastMonth } = await supabase
          .from('transactions')
          .select('points')
          .eq('transaction_type', 'earn')
          .gte('created_at', prevMonth.toISOString())
          .lt('created_at', thisMonth.toISOString());
          
        const pointsIssuedLastMonth = pointsLastMonth?.reduce((sum, tx) => sum + (tx.points || 0), 0) || 0;
        const pointsGrowth = pointsIssuedLastMonth ? 
          Math.round((pointsIssuedThisMonth - pointsIssuedLastMonth) / pointsIssuedLastMonth * 100) : 
          0;
        
        // Get active rewards count
        const { count: activeRewards } = await supabase
          .from('drinks')
          .select('id', { count: 'exact', head: true })
          .eq('active', true);
        
        // Get redemptions this month
        const { count: redemptionsThisMonth } = await supabase
          .from('transactions')
          .select('id', { count: 'exact', head: true })
          .eq('transaction_type', 'redeem')
          .gte('created_at', thisMonth.toISOString());
        
        return {
          totalCustomers: totalCustomers || 0,
          customerGrowth,
          pointsIssuedThisMonth,
          pointsGrowth,
          activeRewards: activeRewards || 0,
          redemptionsThisMonth: redemptionsThisMonth || 0
        } as DashboardMetrics;
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        return {
          totalCustomers: 0,
          customerGrowth: 0,
          pointsIssuedThisMonth: 0,
          pointsGrowth: 0,
          activeRewards: 0,
          redemptionsThisMonth: 0
        } as DashboardMetrics;
      }
    },
    refetchInterval: 60000 // Refetch every minute
  });

  // Fetch recent activity
  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ['admin', 'recent-activity'],
    queryFn: async () => {
      try {
        // Get recent transactions
        const { data: transactions } = await supabase
          .from('transactions')
          .select(`
            id, 
            transaction_type, 
            points, 
            user_id, 
            created_at, 
            profiles:user_id (first_name, last_name),
            reward_id
          `)
          .order('created_at', { ascending: false })
          .limit(5);
        
        // Format the activity items
        return (transactions || []).map(tx => {
          const now = new Date();
          const txDate = new Date(tx.created_at);
          const diffInSeconds = Math.round((now.getTime() - txDate.getTime()) / 1000);
          
          let timeAgo;
          if (diffInSeconds < 60) {
            timeAgo = `${diffInSeconds} sec ago`;
          } else if (diffInSeconds < 3600) {
            timeAgo = `${Math.floor(diffInSeconds / 60)} min ago`;
          } else if (diffInSeconds < 86400) {
            timeAgo = `${Math.floor(diffInSeconds / 3600)} h ago`;
          } else {
            timeAgo = `${Math.floor(diffInSeconds / 86400)} d ago`;
          }
          
          const customerName = tx.profiles ? 
            `${tx.profiles.first_name || ''} ${tx.profiles.last_name || ''}`.trim() : 
            'Unknown';
            
          const customerId = tx.user_id?.substring(0, 6) || '';
          
          return {
            id: tx.id,
            type: tx.transaction_type === 'earn' ? 'transaction' : 
                  tx.transaction_type === 'redeem' ? 'redemption' : 'transaction',
            customerId: `#${customerId}`,
            customerName,
            points: tx.points,
            reward: tx.reward_id ? 'Reward Redeemed' : undefined,
            timestamp: tx.created_at,
            timeAgo
          } as ActivityItem;
        });
      } catch (error) {
        console.error('Error fetching recent activity:', error);
        return [];
      }
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  // System status
  const [systemStatus] = useState<SystemStatus[]>([
    { name: 'Points System', status: 'operational' },
    { name: 'Reward Redemptions', status: 'operational' },
    { name: 'Customer Registration', status: 'operational' },
    { name: 'System Health', status: 'operational' }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-500';
      case 'degraded': return 'text-yellow-500';
      case 'outage': return 'text-red-500';
      default: return 'text-green-500';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Welcome to your loyalty program admin dashboard.</p>
          </div>
          <Button
            onClick={() => navigate('/admin/settings')}
            variant="outline"
            className="flex items-center"
          >
            View System Settings
            <ChevronsRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Customers */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Customers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metricsLoading ? '...' : metrics?.totalCustomers}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                {metrics?.customerGrowth !== undefined && metrics.customerGrowth >= 0 ? (
                  <>
                    <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                    <span className="text-green-500">{metrics.customerGrowth}%</span> from last month
                  </>
                ) : metrics?.customerGrowth !== undefined ? (
                  <>
                    <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                    <span className="text-red-500">{Math.abs(metrics.customerGrowth)}%</span> from last month
                  </>
                ) : ''}
              </p>
            </CardContent>
          </Card>

          {/* Points Issued (Month) */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Points Issued (Month)
              </CardTitle>
              <Coffee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metricsLoading ? '...' : metrics?.pointsIssuedThisMonth.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                {metrics?.pointsGrowth !== undefined && metrics.pointsGrowth >= 0 ? (
                  <>
                    <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                    <span className="text-green-500">{metrics.pointsGrowth}%</span> from last month
                  </>
                ) : metrics?.pointsGrowth !== undefined ? (
                  <>
                    <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                    <span className="text-red-500">{Math.abs(metrics.pointsGrowth)}%</span> from last month
                  </>
                ) : ''}
              </p>
            </CardContent>
          </Card>

          {/* Active Rewards */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Rewards
              </CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metricsLoading ? '...' : metrics?.activeRewards}
              </div>
              <p className="text-xs text-muted-foreground">
                Available for customers
              </p>
            </CardContent>
          </Card>

          {/* Redemptions (Month) */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Redemptions (Month)
              </CardTitle>
              <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metricsLoading ? '...' : metrics?.redemptionsThisMonth}
              </div>
              <p className="text-xs text-muted-foreground">
                In the current month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Activity Feed */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest transactions and customer actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activityLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
                </div>
              ) : activity && activity.length > 0 ? (
                <div className="space-y-4">
                  {activity.map((item) => (
                    <div key={item.id} className="flex items-start space-x-4">
                      <div className={`mt-0.5 rounded-full p-1.5 ${
                        item.type === 'signup' ? 'bg-green-100 text-green-600' : 
                        item.type === 'redemption' ? 'bg-purple-100 text-purple-600' : 
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {item.type === 'signup' ? (
                          <Users className="h-3 w-3" />
                        ) : item.type === 'redemption' ? (
                          <Gift className="h-3 w-3" />
                        ) : (
                          <Coffee className="h-3 w-3" />
                        )}
                      </div>
                      <div className="space-y-1 flex-1">
                        <p className="text-sm font-medium">
                          {item.customerId} {item.customerName ? `(${item.customerName})` : ''} {' '}
                          {item.type === 'signup' ? 'signed up' :
                           item.type === 'redemption' ? `redeemed ${item.reward || 'a reward'}` :
                           `earned ${item.points} points`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.timeAgo}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-gray-500">No recent activity</p>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/admin/transactions')}
              >
                View All Activity
                <ChevronsRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* System Status and Quick Actions */}
          <div className="md:col-span-1 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used admin tools</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                <Button 
                  className="h-24 flex-col justify-center space-y-2"
                  onClick={() => navigate('/admin/customers')}
                >
                  <Users className="h-6 w-6" />
                  <span>Manage Customers</span>
                </Button>
                <Button 
                  className="h-24 flex-col justify-center space-y-2"
                  onClick={() => navigate('/admin/transactions')}
                >
                  <ArrowRightLeft className="h-6 w-6" />
                  <span>Record Transaction</span>
                </Button>
                <Button 
                  className="h-24 flex-col justify-center space-y-2" 
                  onClick={() => navigate('/admin/drinks')}
                >
                  <Gift className="h-6 w-6" />
                  <span>Manage Rewards</span>
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current system health and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemStatus.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.name}</span>
                      <div className="flex items-center">
                        <span className={`mr-2 text-xs ${getStatusColor(item.status)}`}>
                          {item.status === 'operational' ? 'Operational' :
                           item.status === 'degraded' ? 'Degraded' : 'Outage'}
                        </span>
                        {item.status === 'operational' ? (
                          <CheckCircle className={`h-4 w-4 ${getStatusColor(item.status)}`} />
                        ) : (
                          <AlertCircle className={`h-4 w-4 ${getStatusColor(item.status)}`} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
