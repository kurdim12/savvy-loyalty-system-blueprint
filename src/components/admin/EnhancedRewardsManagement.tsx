
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Image, 
  Coffee, 
  Star, 
  Award,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import { RewardImage } from '@/components/rewards/RewardImage';

interface Reward {
  id: string;
  name: string;
  description?: string;
  points_required: number;
  membership_required?: string;
  inventory?: number;
  active: boolean;
  image_url?: string;
  category?: string;
}

const EnhancedRewardsManagement = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newReward, setNewReward] = useState({
    name: '',
    description: '',
    points_required: 100,
    membership_required: '',
    inventory: null as number | null,
    active: true,
    image_url: '',
    category: 'drink'
  });

  const queryClient = useQueryClient();

  // Predefined coffee reward images
  const coffeeImages = [
    '/lovable-uploads/680bf950-de42-45c2-bcfd-0e9b786df840.png',
    '/lovable-uploads/8d4d71ac-a5a9-4e5d-92d5-3083e04eeda7.png'
  ];

  // Fetch rewards
  const { data: rewards, isLoading } = useQuery({
    queryKey: ['admin-rewards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .order('points_required');
      
      if (error) throw error;
      return data as Reward[];
    }
  });

  // Create reward mutation
  const createRewardMutation = useMutation({
    mutationFn: async (rewardData: typeof newReward) => {
      const { error } = await supabase
        .from('rewards')
        .insert({
          name: rewardData.name,
          description: rewardData.description || null,
          points_required: rewardData.points_required,
          membership_required: rewardData.membership_required || null,
          inventory: rewardData.inventory,
          active: rewardData.active,
          image_url: rewardData.image_url || null,
          category: rewardData.category
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rewards'] });
      toast.success('Reward created successfully');
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to create reward: ${error.message}`);
    }
  });

  // Update reward mutation
  const updateRewardMutation = useMutation({
    mutationFn: async (rewardData: Reward) => {
      const { error } = await supabase
        .from('rewards')
        .update({
          name: rewardData.name,
          description: rewardData.description || null,
          points_required: rewardData.points_required,
          membership_required: rewardData.membership_required || null,
          inventory: rewardData.inventory,
          active: rewardData.active,
          image_url: rewardData.image_url || null,
          category: rewardData.category,
          updated_at: new Date().toISOString()
        })
        .eq('id', rewardData.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rewards'] });
      toast.success('Reward updated successfully');
      setIsEditDialogOpen(false);
      setSelectedReward(null);
    },
    onError: (error) => {
      toast.error(`Failed to update reward: ${error.message}`);
    }
  });

  // Delete reward mutation
  const deleteRewardMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('rewards')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rewards'] });
      toast.success('Reward deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete reward: ${error.message}`);
    }
  });

  // Quick add coffee rewards
  const addQuickCoffeeRewards = async () => {
    const coffeeRewards = [
      {
        name: "Premium Coffee - Single Origin",
        description: "Experience our finest single-origin coffee with complex flavor notes",
        points_required: 150,
        category: "drink",
        image_url: coffeeImages[0],
        active: true
      },
      {
        name: "Specialty Latte Art",
        description: "Handcrafted latte with beautiful art design by our skilled baristas",
        points_required: 200,
        category: "drink", 
        image_url: coffeeImages[1],
        active: true
      },
      {
        name: "Coffee Bean Tasting",
        description: "Free tasting session of our premium coffee beans",
        points_required: 100,
        category: "experience",
        active: true
      }
    ];

    try {
      for (const reward of coffeeRewards) {
        await supabase.from('rewards').insert(reward);
      }
      queryClient.invalidateQueries({ queryKey: ['admin-rewards'] });
      toast.success('Coffee rewards added successfully!');
    } catch (error) {
      toast.error('Failed to add coffee rewards');
    }
  };

  const resetForm = () => {
    setNewReward({
      name: '',
      description: '',
      points_required: 100,
      membership_required: '',
      inventory: null,
      active: true,
      image_url: '',
      category: 'drink'
    });
  };

  const filteredRewards = rewards?.filter(reward => {
    const matchesSearch = reward.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || reward.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && reward.active) ||
      (filterStatus === 'inactive' && !reward.active);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-amber-900">Enhanced Rewards Management</h2>
          <p className="text-amber-700">Create and manage customer rewards with advanced controls</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={addQuickCoffeeRewards} variant="outline" className="border-amber-200">
            <Coffee className="h-4 w-4 mr-2" />
            Add Coffee Rewards
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-amber-700 hover:bg-amber-800">
            <Plus className="h-4 w-4 mr-2" />
            Create Reward
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-600" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search Rewards</Label>
              <Input
                id="search"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="drink">Drinks</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                  <SelectItem value="merchandise">Merchandise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setFilterCategory('all');
                  setFilterStatus('all');
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rewards Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rewards ({filteredRewards?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Inventory</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">Loading rewards...</TableCell>
                </TableRow>
              ) : filteredRewards?.map((reward) => (
                <TableRow key={reward.id}>
                  <TableCell>
                    <RewardImage
                      src={reward.image_url}
                      alt={reward.name}
                      className="w-12 h-12 rounded-lg"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{reward.name}</p>
                      {reward.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {reward.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{reward.points_required} pts</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {reward.category || 'general'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {reward.membership_required ? (
                      <Badge className="capitalize">{reward.membership_required}+</Badge>
                    ) : (
                      <span className="text-muted-foreground">Any</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {reward.inventory ? reward.inventory : 'Unlimited'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {reward.active ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                      <Badge variant={reward.active ? 'default' : 'secondary'}>
                        {reward.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedReward(reward);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteRewardMutation.mutate(reward.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) || (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">No rewards found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Reward Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Reward</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={newReward.name}
                  onChange={(e) => setNewReward({...newReward, name: e.target.value})}
                  placeholder="Free Coffee"
                />
              </div>
              <div>
                <Label>Points Required</Label>
                <Input
                  type="number"
                  value={newReward.points_required}
                  onChange={(e) => setNewReward({...newReward, points_required: parseInt(e.target.value)})}
                />
              </div>
            </div>
            
            <div>
              <Label>Description</Label>
              <Textarea
                value={newReward.description}
                onChange={(e) => setNewReward({...newReward, description: e.target.value})}
                placeholder="Describe this reward..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Category</Label>
                <Select value={newReward.category} onValueChange={(value) => setNewReward({...newReward, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="drink">Drink</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                    <SelectItem value="merchandise">Merchandise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Membership Tier</Label>
                <Select value={newReward.membership_required} onValueChange={(value) => setNewReward({...newReward, membership_required: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="bronze">Bronze+</SelectItem>
                    <SelectItem value="silver">Silver+</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Inventory</Label>
                <Input
                  type="number"
                  value={newReward.inventory || ''}
                  onChange={(e) => setNewReward({...newReward, inventory: e.target.value ? parseInt(e.target.value) : null})}
                  placeholder="Unlimited"
                />
              </div>
            </div>

            <div>
              <Label>Image URL</Label>
              <Select value={newReward.image_url} onValueChange={(value) => setNewReward({...newReward, image_url: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an image" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Image</SelectItem>
                  {coffeeImages.map((img, index) => (
                    <SelectItem key={index} value={img}>Coffee Image {index + 1}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {newReward.image_url && (
                <div className="mt-2">
                  <RewardImage
                    src={newReward.image_url}
                    alt="Preview"
                    className="w-20 h-20 rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={newReward.active}
                onCheckedChange={(checked) => setNewReward({...newReward, active: checked})}
              />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => createRewardMutation.mutate(newReward)}
              disabled={!newReward.name || createRewardMutation.isPending}
              className="bg-amber-700 hover:bg-amber-800"
            >
              {createRewardMutation.isPending ? 'Creating...' : 'Create Reward'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Reward Dialog */}
      {selectedReward && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Reward</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={selectedReward.name}
                    onChange={(e) => setSelectedReward({...selectedReward, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Points Required</Label>
                  <Input
                    type="number"
                    value={selectedReward.points_required}
                    onChange={(e) => setSelectedReward({...selectedReward, points_required: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div>
                <Label>Description</Label>
                <Textarea
                  value={selectedReward.description || ''}
                  onChange={(e) => setSelectedReward({...selectedReward, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={selectedReward.category || 'drink'} onValueChange={(value) => setSelectedReward({...selectedReward, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="drink">Drink</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="experience">Experience</SelectItem>
                      <SelectItem value="merchandise">Merchandise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Membership Tier</Label>
                  <Select value={selectedReward.membership_required || ''} onValueChange={(value) => setSelectedReward({...selectedReward, membership_required: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any</SelectItem>
                      <SelectItem value="bronze">Bronze+</SelectItem>
                      <SelectItem value="silver">Silver+</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Inventory</Label>
                  <Input
                    type="number"
                    value={selectedReward.inventory || ''}
                    onChange={(e) => setSelectedReward({...selectedReward, inventory: e.target.value ? parseInt(e.target.value) : null})}
                    placeholder="Unlimited"
                  />
                </div>
              </div>

              <div>
                <Label>Image URL</Label>
                <Select value={selectedReward.image_url || ''} onValueChange={(value) => setSelectedReward({...selectedReward, image_url: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an image" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Image</SelectItem>
                    {coffeeImages.map((img, index) => (
                      <SelectItem key={index} value={img}>Coffee Image {index + 1}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedReward.image_url && (
                  <div className="mt-2">
                    <RewardImage
                      src={selectedReward.image_url}
                      alt="Preview"
                      className="w-20 h-20 rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={selectedReward.active}
                  onCheckedChange={(checked) => setSelectedReward({...selectedReward, active: checked})}
                />
                <Label>Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => updateRewardMutation.mutate(selectedReward)}
                disabled={updateRewardMutation.isPending}
                className="bg-amber-700 hover:bg-amber-800"
              >
                {updateRewardMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EnhancedRewardsManagement;
