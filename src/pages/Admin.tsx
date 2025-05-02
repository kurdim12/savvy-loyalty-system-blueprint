
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UsersIcon, Coffee, Award, PieChart, BarChart, Clock, Plus } from 'lucide-react';

// Admin Components
import CustomersList from '@/components/admin/CustomersList';
import CustomerTransactionsList from '@/components/admin/CustomerTransactionsList';
import RewardsList from '@/components/admin/RewardsList';
import TransactionsList from '@/components/admin/TransactionsList';
import ManagePointsDialog from '@/components/admin/ManagePointsDialog';
import AddTransactionDialog from '@/components/admin/AddTransactionDialog';

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState<string | null>(null);
  const [isManagePointsOpen, setIsManagePointsOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

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

  const { data: pointsStats } = useQuery({
    queryKey: ['admin', 'pointsStats'],
    queryFn: async () => {
      // Get total points issued (sum of all earn transactions)
      const { data: earnData, error: earnError } = await supabase
        .from('transactions')
        .select('points')
        .eq('transaction_type', 'earn');
      
      if (earnError) throw earnError;
      
      // Get total points redeemed (sum of all redeem transactions)
      const { data: redeemData, error: redeemError } = await supabase
        .from('transactions')
        .select('points')
        .eq('transaction_type', 'redeem');
      
      if (redeemError) throw redeemError;
      
      const pointsIssued = earnData.reduce((sum, tx) => sum + tx.points, 0);
      const pointsRedeemed = redeemData.reduce((sum, tx) => sum + tx.points, 0);
      const redemptionRate = pointsIssued > 0 ? ((pointsRedeemed / pointsIssued) * 100).toFixed(1) : '0';
      
      return {
        pointsIssued,
        pointsRedeemed,
        redemptionRate
      };
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
  
  // Handle customer selection for point management
  const handleManagePoints = (customerId: string, customerName: string) => {
    setSelectedCustomerId(customerId);
    setSelectedCustomerName(customerName);
    setIsManagePointsOpen(true);
  };
  
  return (
    <Layout adminOnly>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-amber-900">Admin Dashboard</h1>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => setIsAddTransactionOpen(true)} 
              className="bg-amber-700 hover:bg-amber-800"
            >
              <Plus className="h-4 w-4 mr-2" /> 
              Add Transaction
            </Button>
          </div>
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
                  <div className="text-2xl font-bold">{pointsStats?.pointsIssued || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Total points in circulation</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Redemption Rate</CardTitle>
                  <BarChart className="h-4 w-4 text-amber-700" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pointsStats?.redemptionRate || 0}%</div>
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
            <div className="grid gap-6">
              <CustomersList 
                onManagePoints={handleManagePoints}
                onSelectCustomer={(customerId) => setSelectedCustomerId(customerId)}
              />
              
              {selectedCustomerId && (
                <CustomerTransactionsList customerId={selectedCustomerId} />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="rewards">
            <RewardsList />
          </TabsContent>
          
          <TabsContent value="transactions">
            <TransactionsList />
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

      {/* Manage Points Dialog */}
      <ManagePointsDialog 
        open={isManagePointsOpen}
        onOpenChange={setIsManagePointsOpen}
        customerId={selectedCustomerId}
        customerName={selectedCustomerName}
      />

      {/* Add Transaction Dialog */}
      <AddTransactionDialog
        open={isAddTransactionOpen}
        onOpenChange={setIsAddTransactionOpen}
      />
    </Layout>
  );
};

export default Admin;
