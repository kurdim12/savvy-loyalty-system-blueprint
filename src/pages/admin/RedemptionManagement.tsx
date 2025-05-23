
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, formatDistanceToNow } from 'date-fns';
import { Search, CheckCircle, XCircle, Clock } from 'lucide-react';

import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function RedemptionManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  // Fetch pending redemptions
  const { data: pendingRedemptions, isLoading } = useQuery({
    queryKey: ['pendingRedemptions'],
    queryFn: async () => {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('redemptions')
        .select(`
          id,
          created_at,
          status,
          points_spent,
          reward_id,
          user_id,
          rewards (
            id,
            name,
            points_required
          ),
          profiles (
            id,
            first_name, 
            last_name,
            phone,
            email,
            membership_tier
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  // Approve redemption mutation
  const approveRedemption = useMutation({
    mutationFn: async ({ redemptionId, userId, points }: { redemptionId: string, userId: string, points: number }) => {
      // First update the redemption status
      const { error: updateError } = await supabase
        .from('redemptions')
        .update({ 
          status: 'redeemed',
          fulfilled_at: new Date().toISOString()
        })
        .eq('id', redemptionId);
      
      if (updateError) throw updateError;
      
      // Deduct points using existing function
      const { error: pointsError } = await supabase.rpc(
        'decrement_points',
        { user_id: userId, point_amount: points }
      );
      
      if (pointsError) throw pointsError;
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingRedemptions'] });
      toast.success('Redemption approved successfully');
    },
    onError: (error) => {
      toast.error(`Error approving redemption: ${error.message}`);
    }
  });

  // Reject redemption mutation
  const rejectRedemption = useMutation({
    mutationFn: async (redemptionId: string) => {
      const { error } = await supabase
        .from('redemptions')
        .update({ 
          status: 'expired',
          fulfilled_at: new Date().toISOString()
        })
        .eq('id', redemptionId);
      
      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingRedemptions'] });
      toast.success('Redemption rejected');
    },
    onError: (error) => {
      toast.error(`Error rejecting redemption: ${error.message}`);
    }
  });

  // Filter redemptions based on search query
  const filteredRedemptions = pendingRedemptions?.filter(redemption => {
    const searchLower = searchQuery.toLowerCase();
    const userName = `${redemption.profiles?.first_name || ''} ${redemption.profiles?.last_name || ''}`.toLowerCase();
    const email = redemption.profiles?.email?.toLowerCase() || '';
    const phone = redemption.profiles?.phone?.toLowerCase() || '';
    const rewardName = redemption.rewards?.name?.toLowerCase() || '';
    
    return !searchQuery || 
      userName.includes(searchLower) || 
      email.includes(searchLower) || 
      phone.includes(searchLower) ||
      rewardName.includes(searchLower) ||
      redemption.id.toLowerCase().includes(searchLower);
  });

  // Handle approve button click
  const handleApprove = (redemption: any) => {
    approveRedemption.mutate({
      redemptionId: redemption.id,
      userId: redemption.user_id,
      points: redemption.points_spent
    });
  };

  // Handle reject button click
  const handleReject = (redemptionId: string) => {
    rejectRedemption.mutate(redemptionId);
  };

  // Render tier badge with appropriate color
  const renderTierBadge = (tier: string) => {
    const tierColors: Record<string, string> = {
      bronze: 'bg-amber-600',
      silver: 'bg-slate-400',
      gold: 'bg-yellow-400 text-black'
    };
    
    return (
      <Badge className={`${tierColors[tier] || ''}`}>
        {tier?.charAt(0).toUpperCase() + tier?.slice(1)}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-amber-900">Manage Redemptions</h1>
          <p className="text-amber-700">Review and process pending reward redemptions</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by customer name, email, phone or reward..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Redemptions</CardTitle>
            <CardDescription>
              Approve or reject reward redemptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <p>Loading redemptions...</p>
              </div>
            ) : filteredRedemptions && filteredRedemptions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Reward</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRedemptions.map((redemption) => (
                    <TableRow key={redemption.id}>
                      <TableCell className="font-mono text-xs">
                        {redemption.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        {redemption.profiles?.first_name} {redemption.profiles?.last_name}
                        <div className="text-xs text-muted-foreground">
                          {redemption.profiles?.phone || redemption.profiles?.email}
                        </div>
                      </TableCell>
                      <TableCell>{redemption.rewards?.name}</TableCell>
                      <TableCell>{redemption.points_spent}</TableCell>
                      <TableCell>
                        {renderTierBadge(redemption.profiles?.membership_tier)}
                      </TableCell>
                      <TableCell>
                        <div title={format(new Date(redemption.created_at), 'PPpp')}>
                          {formatDistanceToNow(new Date(redemption.created_at), { addSuffix: true })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {redemption.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                          onClick={() => handleApprove(redemption)}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
                          onClick={() => handleReject(redemption.id)}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "No redemptions match your search criteria"
                    : "No pending redemptions at this time"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
