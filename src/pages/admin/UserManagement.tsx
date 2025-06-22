
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import CustomersList from '@/components/admin/CustomersList';
import ManagePointsDialog from '@/components/admin/ManagePointsDialog';
import UserActions from '@/components/admin/UserActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

// Define tier point thresholds
const tierPoints: Record<string, number> = {
  bronze: 0,
  silver: 200,
  gold: 550,
};

const UserManagement = () => {
  const { user } = useAuth();
  const [selectedCustomer, setSelectedCustomer] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isPointsDialogOpen, setIsPointsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("customers");

  const handleManagePoints = (customerId: string, customerName: string) => {
    setSelectedCustomer({ id: customerId, name: customerName });
    setIsPointsDialogOpen(true);
  };

  const handleRankChange = async (customerId: string, newRank: Database['public']['Enums']['membership_tier']) => {
    try {
      if (!user) return;
      
      const { error } = await supabase.rpc('set_user_tier', {
        uid: customerId,
        new_tier: newRank
      });
      
      if (error) throw error;
      
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          <span>Membership rank updated successfully</span>
        </div>
      );
      
    } catch (err: any) {
      console.error("Error updating rank:", err);
      toast.error(`Failed to update rank: ${err.message}`);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customer Management</h2>
          <p className="text-muted-foreground">
            View and manage all customers, their profiles, points, and membership tiers.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="customers">All Customers</TabsTrigger>
            <TabsTrigger value="user-actions">User Actions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="customers" className="space-y-4">
            <CustomersList 
              onManagePoints={handleManagePoints} 
              onRankChange={handleRankChange}
            />
          </TabsContent>

          <TabsContent value="user-actions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <UserActions />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Customer Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Customer analytics will be implemented in a future update.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {selectedCustomer && (
        <ManagePointsDialog
          open={isPointsDialogOpen}
          onOpenChange={setIsPointsDialogOpen}
          userId={selectedCustomer.id}
          customerName={selectedCustomer.name}
        />
      )}
    </AdminLayout>
  );
};

export default UserManagement;
