
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Filter, Check, X, Clock } from 'lucide-react';

type Redemption = {
  id: string;
  user_id: string;
  reward_id: string;
  status: 'pending' | 'redeemed' | 'rejected';
  created_at: string;
  fulfilled_at: string | null;
  points_spent: number;
  reward: {
    name: string;
    points_required: number;
  } | null;
  profile: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
};

const RedemptionsManagement = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch redemptions
  const { data: redemptions, isLoading } = useQuery({
    queryKey: ['admin', 'redemptions', statusFilter],
    queryFn: async () => {
      const query = supabase
        .from('redemptions')
        .select(`
          *,
          reward:rewards(*),
          profile:profiles(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });
        
      if (statusFilter !== 'all') {
        query.eq('status', statusFilter);
      }
        
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Redemption[];
    },
  });

  // Update redemption status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'redeemed' | 'rejected' }) => {
      const updateData: { status: string; fulfilled_at?: string } = {
        status
      };
      
      // If approving, set fulfilled_at to now
      if (status === 'redeemed') {
        updateData.fulfilled_at = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from('redemptions')
        .update(updateData)
        .eq('id', id);
        
      if (error) throw error;
      
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'redemptions'] });
      toast.success('Redemption status updated successfully');
    },
    onError: (error) => {
      console.error('Error updating redemption:', error);
      toast.error('Failed to update redemption status');
    },
  });

  // Filter redemptions based on search query
  const filteredRedemptions = redemptions?.filter(redemption => {
    if (!searchQuery) return true;
    
    const customerName = `${redemption.profile?.first_name || ''} ${redemption.profile?.last_name || ''}`.toLowerCase();
    const rewardName = redemption.reward?.name?.toLowerCase() || '';
    const email = redemption.profile?.email?.toLowerCase() || '';
    
    const query = searchQuery.toLowerCase();
    return customerName.includes(query) || rewardName.includes(query) || email.includes(query);
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle status update
  const handleStatusUpdate = (id: string, status: 'redeemed' | 'rejected') => {
    updateStatusMutation.mutate({ id, status });
  };

  // Get status badge class based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
          <Clock className="mr-1 h-3 w-3" /> Pending
        </Badge>;
      case 'redeemed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
          <Check className="mr-1 h-3 w-3" /> Redeemed
        </Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
          <X className="mr-1 h-3 w-3" /> Rejected
        </Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Redemption Requests</CardTitle>
        <CardDescription>
          Review and manage customer reward redemptions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer or reward..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-[200px]">
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="redeemed">Redeemed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableCaption>
            {isLoading ? 'Loading redemptions...' : (
              filteredRedemptions?.length 
                ? `Showing ${filteredRedemptions.length} ${statusFilter === 'all' ? '' : statusFilter} redemptions` 
                : 'No redemptions found'
            )}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Reward</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading redemptions...
                </TableCell>
              </TableRow>
            ) : filteredRedemptions?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No redemptions found matching your filters
                </TableCell>
              </TableRow>
            ) : (
              filteredRedemptions?.map((redemption) => (
                <TableRow key={redemption.id}>
                  <TableCell>
                    <div className="font-medium">
                      {redemption.profile?.first_name} {redemption.profile?.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {redemption.profile?.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    {redemption.reward?.name || "Reward no longer available"}
                  </TableCell>
                  <TableCell>{redemption.points_spent}</TableCell>
                  <TableCell>
                    <div>{formatDate(redemption.created_at)}</div>
                    {redemption.fulfilled_at && (
                      <div className="text-xs text-muted-foreground">
                        Fulfilled: {formatDate(redemption.fulfilled_at)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(redemption.status)}
                  </TableCell>
                  <TableCell>
                    {redemption.status === 'pending' ? (
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 border-green-500 text-green-600 hover:bg-green-50"
                          onClick={() => handleStatusUpdate(redemption.id, 'redeemed')}
                        >
                          <Check className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 border-red-500 text-red-600 hover:bg-red-50"
                          onClick={() => handleStatusUpdate(redemption.id, 'rejected')}
                        >
                          <X className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        {redemption.status === 'redeemed' ? 'Approved' : 'Rejected'}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RedemptionsManagement;
