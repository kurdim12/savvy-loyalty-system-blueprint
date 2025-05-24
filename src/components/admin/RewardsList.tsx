import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit, ArchiveX, Archive, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Database } from '@/integrations/supabase/types';
import { ImageUpload } from './ImageUpload';
import { RewardImage } from '@/components/rewards/RewardImage';

// Define the reward schema for validation
const rewardSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  points_required: z.number().min(1, "Points must be at least 1"),
  membership_required: z.enum(["bronze", "silver", "gold"]).optional(),
  inventory: z.number().int().optional(),
  active: z.boolean().default(true),
  image_url: z.string().optional(),
});

type RewardFormData = z.infer<typeof rewardSchema>;

interface Reward {
  id: string;
  name: string;
  description?: string;
  points_required: number;
  membership_required?: Database['public']['Enums']['membership_tier'];
  inventory?: number;
  active: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

const RewardsList = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  
  // Form for creating new rewards
  const createForm = useForm<RewardFormData>({
    resolver: zodResolver(rewardSchema),
    defaultValues: {
      name: '',
      description: '',
      points_required: 10,
      active: true,
      image_url: '',
    }
  });
  
  // Form for editing rewards
  const editForm = useForm<RewardFormData>({
    resolver: zodResolver(rewardSchema),
    defaultValues: {
      name: '',
      description: '',
      points_required: 10,
      active: true,
      image_url: '',
    }
  });
  
  // Fetch all rewards
  const { data: rewards, isLoading } = useQuery({
    queryKey: ['admin', 'rewards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .order('points_required', { ascending: true });
      
      if (error) throw error;
      return data as unknown as Reward[];
    }
  });
  
  // Create a new reward
  const createReward = useMutation({
    mutationFn: async (data: RewardFormData) => {
      const rewardData = {
        name: data.name,
        description: data.description || null,
        points_required: data.points_required,
        membership_required: data.membership_required || null,
        inventory: data.inventory || null,
        active: data.active,
        image_url: uploadedImageUrl || null,
      } as unknown as Database['public']['Tables']['rewards']['Insert'];
      
      const { error } = await supabase
        .from('rewards')
        .insert(rewardData);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'rewards'] });
      toast.success('Reward created successfully');
      setIsCreateModalOpen(false);
      setUploadedImageUrl(null);
      createForm.reset();
    },
    onError: (error) => {
      toast.error(`Failed to create reward: ${error.message}`);
    }
  });
  
  // Update an existing reward
  const updateReward = useMutation({
    mutationFn: async (data: RewardFormData & { id: string }) => {
      const { id, ...rewardData } = data;
      
      const updatedData = {
        name: rewardData.name,
        description: rewardData.description || null,
        points_required: rewardData.points_required,
        membership_required: rewardData.membership_required || null,
        inventory: rewardData.inventory || null,
        active: rewardData.active,
        image_url: uploadedImageUrl || selectedReward?.image_url || null,
        updated_at: new Date().toISOString()
      } as unknown as Database['public']['Tables']['rewards']['Update'];
      
      const { error } = await supabase
        .from('rewards')
        .update(updatedData)
        .eq('id', id as string);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'rewards'] });
      toast.success('Reward updated successfully');
      setIsEditModalOpen(false);
      setSelectedReward(null);
      setUploadedImageUrl(null);
      editForm.reset();
    },
    onError: (error) => {
      toast.error(`Failed to update reward: ${error.message}`);
    }
  });
  
  // Delete a reward
  const deleteReward = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('rewards')
        .delete()
        .eq('id', id as string);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'rewards'] });
      toast.success('Reward deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedReward(null);
    },
    onError: (error) => {
      toast.error(`Failed to delete reward: ${error.message}`);
    }
  });
  
  // Toggle reward active status
  const toggleRewardStatus = useMutation({
    mutationFn: async ({ id, active }: { id: string, active: boolean }) => {
      const { error } = await supabase
        .from('rewards')
        .update({ 
          active, 
          updated_at: new Date().toISOString() 
        } as unknown as Database['public']['Tables']['rewards']['Update'])
        .eq('id', id as string);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'rewards'] });
      toast.success(`Reward ${variables.active ? 'activated' : 'deactivated'} successfully`);
    },
    onError: (error) => {
      toast.error(`Failed to update reward status: ${error.message}`);
    }
  });
  
  // Handle form submissions
  const handleCreateSubmit = (data: RewardFormData) => {
    createReward.mutate({ ...data, image_url: uploadedImageUrl || '' });
  };
  
  const handleEditSubmit = (data: RewardFormData) => {
    if (!selectedReward) return;
    updateReward.mutate({ ...data, id: selectedReward.id });
  };
  
  const handleDeleteConfirm = () => {
    if (!selectedReward) return;
    deleteReward.mutate(selectedReward.id);
  };
  
  // Modal handlers
  const openEditModal = (reward: Reward) => {
    setSelectedReward(reward);
    setUploadedImageUrl(reward.image_url || null);
    editForm.reset({
      name: reward.name,
      description: reward.description || '',
      points_required: reward.points_required,
      membership_required: reward.membership_required,
      inventory: reward.inventory,
      active: reward.active,
      image_url: reward.image_url || '',
    });
    setIsEditModalOpen(true);
  };
  
  const openDeleteModal = (reward: Reward) => {
    setSelectedReward(reward);
    setIsDeleteModalOpen(true);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Rewards</CardTitle>
            <CardDescription>Manage rewards that customers can redeem with their points.</CardDescription>
          </div>
          <Button 
            onClick={() => {
              setUploadedImageUrl(null);
              setIsCreateModalOpen(true);
            }} 
            className="bg-amber-700 hover:bg-amber-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Reward
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Membership</TableHead>
                  <TableHead>Inventory</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">Loading rewards...</TableCell>
                  </TableRow>
                ) : rewards?.length ? (
                  rewards.map((reward) => (
                    <TableRow key={reward.id} className={!reward.active ? 'opacity-60' : ''}>
                      <TableCell>
                        <RewardImage
                          src={reward.image_url}
                          alt={reward.name}
                          className="w-12 h-12 rounded-lg"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {reward.name}
                        {reward.description && <p className="text-xs text-muted-foreground truncate max-w-[200px]">{reward.description}</p>}
                      </TableCell>
                      <TableCell>{reward.points_required}</TableCell>
                      <TableCell>
                        {reward.membership_required ? (
                          <Badge variant="secondary" className="capitalize">
                            {reward.membership_required}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">Any</span>
                        )}
                      </TableCell>
                      <TableCell>{reward.inventory ?? 'Unlimited'}</TableCell>
                      <TableCell>
                        <Badge variant={reward.active ? 'default' : 'outline'} className="capitalize">
                          {reward.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(reward.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => openEditModal(reward)}
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => toggleRewardStatus.mutate({ id: reward.id, active: !reward.active })}
                            title={reward.active ? 'Deactivate' : 'Activate'}
                          >
                            {reward.active ? <Archive className="h-4 w-4" /> : <ArchiveX className="h-4 w-4" />}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="text-red-500 hover:text-red-600"
                            onClick={() => openDeleteModal(reward)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">No rewards found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Create Reward Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Reward</DialogTitle>
            <DialogDescription>
              Add a new reward for customers to redeem with their points.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-4">
              <ImageUpload
                currentImageUrl={uploadedImageUrl}
                onImageUploaded={(url) => setUploadedImageUrl(url)}
                onImageRemoved={() => setUploadedImageUrl(null)}
              />
              
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Free Coffee" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of the reward as it will appear to customers.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={createForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enjoy a free coffee of your choice..." 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional detailed description of the reward.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={createForm.control}
                  name="points_required"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Points Required</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="membership_required"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Membership Required</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Any membership tier" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bronze">Bronze</SelectItem>
                          <SelectItem value="silver">Silver</SelectItem>
                          <SelectItem value="gold">Gold</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Optional membership tier requirement.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={createForm.control}
                  name="inventory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inventory</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0} 
                          placeholder="Leave empty for unlimited"
                          {...field}
                          onChange={(e) => {
                            const val = e.target.value ? parseInt(e.target.value) : undefined;
                            field.onChange(val);
                          }}
                          value={field.value === undefined ? '' : field.value}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional inventory limit. Leave empty for unlimited.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>
                          Make this reward available immediately?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-amber-700 hover:bg-amber-800"
                  disabled={createReward.isPending}
                >
                  {createReward.isPending ? 'Creating...' : 'Create Reward'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Reward Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Reward</DialogTitle>
            <DialogDescription>
              Update the details for this reward.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
              <ImageUpload
                currentImageUrl={uploadedImageUrl || selectedReward?.image_url}
                onImageUploaded={(url) => setUploadedImageUrl(url)}
                onImageRemoved={() => setUploadedImageUrl(null)}
              />
              
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Free Coffee" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of the reward as it will appear to customers.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enjoy a free coffee of your choice..." 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional detailed description of the reward.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="points_required"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Points Required</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="membership_required"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Membership Required</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Any membership tier" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Any</SelectItem>
                          <SelectItem value="bronze">Bronze</SelectItem>
                          <SelectItem value="silver">Silver</SelectItem>
                          <SelectItem value="gold">Gold</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Optional membership tier requirement.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="inventory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inventory</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0} 
                          placeholder="Leave empty for unlimited"
                          {...field}
                          onChange={(e) => {
                            const val = e.target.value ? parseInt(e.target.value) : undefined;
                            field.onChange(val);
                          }}
                          value={field.value === undefined ? '' : field.value}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional inventory limit. Leave empty for unlimited.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>
                          Make this reward available for redemption?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-amber-700 hover:bg-amber-800"
                  disabled={updateReward.isPending}
                >
                  {updateReward.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the reward "{selectedReward?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={deleteReward.isPending}
            >
              {deleteReward.isPending ? 'Deleting...' : 'Delete Reward'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RewardsList;
