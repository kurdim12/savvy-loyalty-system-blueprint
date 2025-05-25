
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Reward = {
  id: string;
  name: string;
  points_required: number;
  category: string | null;
  inventory: number | null;
  active: boolean;
  membership_required: 'bronze' | 'silver' | 'gold' | null;
  image_url: string | null;
  description: string | null;
};

const EnhancedRewardsManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch rewards
  const { data: rewards, isLoading } = useQuery({
    queryKey: ['enhanced-rewards', searchQuery, categoryFilter, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('rewards')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      if (statusFilter !== 'all') {
        query = query.eq('active', statusFilter === 'active');
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Reward[];
    },
  });

  // Toggle reward status
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from('rewards')
        .update({ active: !active })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-rewards'] });
      toast({
        title: "Success",
        description: "Reward status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update reward status",
        variant: "destructive",
      });
    },
  });

  const handleToggleStatus = (reward: Reward) => {
    toggleStatusMutation.mutate({ id: reward.id, active: reward.active });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">Loading rewards...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-amber-900">Enhanced Rewards Management</h2>
          <p className="text-amber-700">Advanced tools for managing loyalty rewards</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Reward
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
          <CardDescription>Find specific rewards quickly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search rewards..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="drink">Drinks</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="merchandise">Merchandise</SelectItem>
                <SelectItem value="discount">Discounts</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Bulk Import
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Rewards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rewards && rewards.length > 0 ? (
          rewards.map((reward) => (
            <Card key={reward.id} className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
                {reward.image_url ? (
                  <img 
                    src={reward.image_url} 
                    alt={reward.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-amber-600 text-sm">No Image</div>
                )}
              </div>
              
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{reward.name}</CardTitle>
                  <Badge variant={reward.active ? "default" : "secondary"}>
                    {reward.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <CardDescription>{reward.description || 'No description'}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Points Required:</span>
                    <span className="font-medium">{reward.points_required}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium capitalize">{reward.category || 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Inventory:</span>
                    <span className="font-medium">
                      {reward.inventory === null ? 'Unlimited' : reward.inventory}
                    </span>
                  </div>
                  {reward.membership_required && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tier Required:</span>
                      <Badge variant="outline" className="capitalize">
                        {reward.membership_required}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="mr-2 h-3 w-3" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleToggleStatus(reward)}
                  >
                    {reward.active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="p-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">No rewards found matching your criteria.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EnhancedRewardsManagement;
