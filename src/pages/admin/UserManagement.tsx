
import React, { useState } from 'react';
import CustomersList from '@/components/admin/CustomersList';
import ManagePointsDialog from '@/components/admin/ManagePointsDialog';
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Customer Management</h1>
          <p className="text-gray-600 mt-2">View and manage all customers, their profiles, points, and membership tiers.</p>
        </div>
      </div>
      
      <CustomersList 
        onManagePoints={handleManagePoints} 
        onRankChange={handleRankChange}
      />
      
      {selectedCustomer && (
        <ManagePointsDialog
          open={isPointsDialogOpen}
          onOpenChange={setIsPointsDialogOpen}
          userId={selectedCustomer.id}
          customerName={selectedCustomer.name}
        />
      )}
    </div>
  );
};

export default UserManagement;
