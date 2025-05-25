
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash, Upload, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RewardImage } from '@/components/rewards/RewardImage';

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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <Card className="m-6">
          <CardContent className="p-6">
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700"></div>
              <span className="ml-3 text-amber-800">Loading rewards...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <div className="space-y-6 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent">
              Enhanced Rewards Management
            </h2>
            <p className="text-amber-700 mt-1">Advanced tools for managing loyalty rewards</p>
          </div>
          <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            Add New Reward
          </Button>
        </div>

        {/* Enhanced Filters */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-t-lg">
            <CardTitle className="text-amber-900">Filter & Search</CardTitle>
            <CardDescription className="text-amber-700">Find specific rewards quickly</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-amber-600" />
                <Input
                  placeholder="Search rewards..."
                  className="pl-10 border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="border-amber-200 focus:border-amber-400">
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
                <SelectTrigger className="border-amber-200 focus:border-amber-400">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
                <Upload className="mr-2 h-4 w-4" />
                Bulk Import
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Rewards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rewards && rewards.length > 0 ? (
            rewards.map((reward) => (
              <Card key={reward.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/95 backdrop-blur-sm">
                <div className="aspect-video bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center relative">
                  {reward.image_url ? (
                    <RewardImage 
                      src={reward.image_url} 
                      alt={reward.name}
                      className="w-full h-full rounded-t-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-amber-600">
                      <Image className="h-12 w-12 mb-2 opacity-50" />
                      <span className="text-sm font-medium">No Image</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge 
                      variant={reward.active ? "default" : "secondary"}
                      className={reward.active ? "bg-green-500 hover:bg-green-600" : "bg-gray-400"}
                    >
                      {reward.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-amber-900">{reward.name}</CardTitle>
                  <CardDescription className="text-amber-700">
                    {reward.description || 'No description available'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center p-2 bg-amber-50 rounded">
                      <span className="text-amber-700 font-medium">Points Required:</span>
                      <span className="font-bold text-amber-900">{reward.points_required}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-700">Category:</span>
                      <span className="font-medium capitalize text-amber-900">
                        {reward.category || 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-700">Inventory:</span>
                      <span className="font-medium text-amber-900">
                        {reward.inventory === null ? 'Unlimited' : reward.inventory}
                      </span>
                    </div>
                    {reward.membership_required && (
                      <div className="flex justify-between">
                        <span className="text-amber-700">Tier Required:</span>
                        <Badge variant="outline" className="capitalize border-amber-300 text-amber-700">
                          {reward.membership_required}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50"
                    >
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleToggleStatus(reward)}
                      className={reward.active ? "border-red-300 text-red-700 hover:bg-red-50" : "border-green-300 text-green-700 hover:bg-green-50"}
                    >
                      {reward.active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="md:col-span-2 lg:col-span-3 shadow-lg border-0 bg-white/90">
              <CardContent className="p-8">
                <div className="text-center py-8">
                  <Image className="h-16 w-16 mx-auto mb-4 text-amber-400" />
                  <h3 className="text-lg font-semibold text-amber-900 mb-2">No rewards found</h3>
                  <p className="text-amber-700">No rewards match your current search criteria.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedRewardsManagement;
