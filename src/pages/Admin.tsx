
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UsersIcon, Coffee, Award, PieChart, BarChart, Clock } from 'lucide-react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const { data: usersCount } = useQuery({
    queryKey: ['admin', 'usersCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'customer');
      
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: rewardsCount } = useQuery({
    queryKey: ['admin', 'rewardsCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('rewards')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: recentTransactions } = useQuery({
    queryKey: ['admin', 'recentTransactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*, profiles(first_name, last_name)')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    }
  });
  
  return (
    <Layout adminOnly>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-amber-900">Admin Dashboard</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 md:grid-cols-5 lg:w-3/4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="settings" className="hidden md:block">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <UsersIcon className="h-4 w-4 text-amber-700" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{usersCount || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active loyalty program members</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Active Rewards</CardTitle>
                  <Award className="h-4 w-4 text-amber-700" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{rewardsCount || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Available redemption options</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Points Issued</CardTitle>
                  <PieChart className="h-4 w-4 text-amber-700" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">--</div>
                  <p className="text-xs text-muted-foreground mt-1">Total points in circulation</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Redemption Rate</CardTitle>
                  <BarChart className="h-4 w-4 text-amber-700" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">--</div>
                  <p className="text-xs text-muted-foreground mt-1">Points redeemed vs. issued</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-700" />
                  Recent Transactions
                </CardTitle>
                <CardDescription>Latest activity across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Customer</th>
                        <th className="text-left py-2">Type</th>
                        <th className="text-left py-2">Points</th>
                        <th className="text-left py-2">Date</th>
                        <th className="text-left py-2">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions?.length ? (
                        recentTransactions.map((transaction: any) => (
                          <tr key={transaction.id} className="border-b">
                            <td className="py-2">{transaction.profiles?.first_name || ''} {transaction.profiles?.last_name || ''}</td>
                            <td className="py-2 capitalize">{transaction.transaction_type}</td>
                            <td className="py-2">
                              <span className={transaction.transaction_type === 'earn' ? 'text-green-600' : 'text-amber-700'}>
                                {transaction.transaction_type === 'earn' ? '+' : '-'}{transaction.points}
                              </span>
                            </td>
                            <td className="py-2">{new Date(transaction.created_at).toLocaleDateString()}</td>
                            <td className="py-2">{transaction.notes}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-4">No recent transactions</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>
                  View and manage customer accounts, profiles, and point balances.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Customer management functionality will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="rewards">
            <Card>
              <CardHeader>
                <CardTitle>Rewards Management</CardTitle>
                <CardDescription>
                  Create, edit, and manage rewards available to customers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Rewards management functionality will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  View and manage all transactions in the system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Transaction management functionality will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system settings and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Settings functionality will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
