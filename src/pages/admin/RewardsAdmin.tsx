
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Edit, Plus, Trash } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Define the form schema
const rewardFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  pointsRequired: z.coerce.number().min(1, 'Points must be at least 1'),
  category: z.string().min(1, 'Category is required'),
  inventory: z.coerce.number().min(0, 'Inventory must be at least 0'),
});

type RewardFormValues = z.infer<typeof rewardFormSchema>;

type Reward = {
  id: string;
  name: string;
  points_required: number;
  category: string;
  inventory: number | null;
  active: boolean;
};

export default function RewardsAdmin() {
  const queryClient = useQueryClient();
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentReward, setCurrentReward] = useState<Reward | null>(null);

  // Form definition
  const form = useForm<RewardFormValues>({
    resolver: zodResolver(rewardFormSchema),
    defaultValues: {
      name: '',
      pointsRequired: 100,
      category: 'drink',
      inventory: 10,
    },
  });

  // Fetch all rewards
  const { data: rewards, isLoading } = useQuery({
    queryKey: ['admin-rewards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Reward[];
    },
  });

  // Create a new reward
  const createMutation = useMutation({
    mutationFn: async (values: RewardFormValues) => {
      const { error } = await supabase.rpc('admin_create_reward', {
        name: values.name,
        cost: values.pointsRequired,
        category: values.category,
        stock: values.inventory
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rewards'] });
      toast.success('Reward created successfully');
      setIsNewDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      console.error('Error creating reward:', error);
      toast.error('Failed to create reward');
    },
  });

  // Update an existing reward
  const updateMutation = useMutation({
    mutationFn: async (values: RewardFormValues & { id: string }) => {
      const { error } = await supabase.rpc('admin_update_reward', {
        rid: values.id,
        name: values.name,
        cost: values.pointsRequired,
        category: values.category,
        stock: values.inventory
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rewards'] });
      toast.success('Reward updated successfully');
      setIsEditDialogOpen(false);
      setCurrentReward(null);
      form.reset();
    },
    onError: (error) => {
      console.error('Error updating reward:', error);
      toast.error('Failed to update reward');
    },
  });

  // Delete a reward
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc('admin_delete_reward', {
        rid: id
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rewards'] });
      toast.success('Reward deleted successfully');
      setIsDeleteDialogOpen(false);
      setCurrentReward(null);
    },
    onError: (error) => {
      console.error('Error deleting reward:', error);
      toast.error('Failed to delete reward');
    },
  });

  const onSubmitNew = (values: RewardFormValues) => {
    createMutation.mutate(values);
  };

  const onSubmitEdit = (values: RewardFormValues) => {
    if (currentReward) {
      updateMutation.mutate({ ...values, id: currentReward.id });
    }
  };

  const handleEdit = (reward: Reward) => {
    setCurrentReward(reward);
    form.reset({
      name: reward.name,
      pointsRequired: reward.points_required,
      category: reward.category,
      inventory: reward.inventory || 0,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (reward: Reward) => {
    setCurrentReward(reward);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (currentReward) {
      deleteMutation.mutate(currentReward.id);
    }
  };

  return (
    <Layout adminOnly>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Rewards Management</h1>
            <p className="text-muted-foreground">
              Create, edit, and delete rewards for your loyalty program
            </p>
          </div>
          <Button onClick={() => {
            form.reset();
            setIsNewDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            New Reward
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">Loading rewards...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Points Cost</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Inventory</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rewards && rewards.length > 0 ? (
                rewards.map((reward) => (
                  <TableRow key={reward.id}>
                    <TableCell>{reward.name}</TableCell>
                    <TableCell>{reward.points_required}</TableCell>
                    <TableCell className="capitalize">{reward.category}</TableCell>
                    <TableCell>{reward.inventory === null ? 'Unlimited' : reward.inventory}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(reward)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(reward)}>
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No rewards found. Create your first reward to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        {/* New Reward Dialog */}
        <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Reward</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitNew)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Free Coffee" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pointsRequired"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Points Required</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="drink">Drink</SelectItem>
                          <SelectItem value="food">Food</SelectItem>
                          <SelectItem value="merchandise">Merchandise</SelectItem>
                          <SelectItem value="discount">Discount</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="inventory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inventory (0 for unlimited)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsNewDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? 'Creating...' : 'Create Reward'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit Reward Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Reward</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Free Coffee" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pointsRequired"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Points Required</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="drink">Drink</SelectItem>
                          <SelectItem value="food">Food</SelectItem>
                          <SelectItem value="merchandise">Merchandise</SelectItem>
                          <SelectItem value="discount">Discount</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="inventory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inventory (0 for unlimited)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the reward "{currentReward?.name}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
