
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogDescription, DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Plus, Edit, Trash2, Award, Coffee, Heart, Recycle, Users } from 'lucide-react';

interface CommunityGoal {
  id: string;
  name: string;
  description: string | null;
  target_points: number;
  current_points: number;
  starts_at: string;
  expires_at: string | null;
  icon: string | null;
  reward_description: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface GoalFormData {
  name: string;
  description: string;
  target_points: number;
  expires_at: string;
  icon: string;
  reward_description: string;
  active: boolean;
}

export default function CommunityGoalsAdmin() {
  const [goals, setGoals] = useState<CommunityGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentGoalId, setCurrentGoalId] = useState<string | null>(null);
  const [formData, setFormData] = useState<GoalFormData>({
    name: '',
    description: '',
    target_points: 1000,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    icon: 'coffee',
    reward_description: '',
    active: true
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('community_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching community goals:', error);
      toast.error('Failed to load community goals');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditGoal = (goal: CommunityGoal) => {
    setCurrentGoalId(goal.id);
    setFormData({
      name: goal.name,
      description: goal.description || '',
      target_points: goal.target_points,
      expires_at: goal.expires_at ? new Date(goal.expires_at).toISOString().split('T')[0] : '',
      icon: goal.icon || 'coffee',
      reward_description: goal.reward_description || '',
      active: goal.active
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleCreateNewGoal = () => {
    setCurrentGoalId(null);
    setFormData({
      name: '',
      description: '',
      target_points: 1000,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      icon: 'coffee',
      reward_description: '',
      active: true
    });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const goalData = {
        name: formData.name,
        description: formData.description,
        target_points: formData.target_points,
        expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
        icon: formData.icon,
        reward_description: formData.reward_description,
        active: formData.active
      };

      if (isEditing && currentGoalId) {
        const { error } = await supabase
          .from('community_goals')
          .update({
            ...goalData,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentGoalId);

        if (error) throw error;
        toast.success('Community goal updated successfully');
      } else {
        const { error } = await supabase
          .from('community_goals')
          .insert({
            ...goalData,
            current_points: 0,
            starts_at: new Date().toISOString()
          });

        if (error) throw error;
        toast.success('Community goal created successfully');
      }

      setDialogOpen(false);
      fetchGoals();
    } catch (error) {
      console.error('Error saving community goal:', error);
      toast.error('Failed to save community goal');
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this community goal?')) {
      try {
        const { error } = await supabase
          .from('community_goals')
          .delete()
          .eq('id', id);

        if (error) throw error;
        toast.success('Community goal deleted successfully');
        fetchGoals();
      } catch (error) {
        console.error('Error deleting community goal:', error);
        toast.error('Failed to delete community goal');
      }
    }
  };

  const getIconComponent = (iconType: string | null) => {
    switch(iconType) {
      case 'users': return <Users className="h-5 w-5" />;
      case 'award': return <Award className="h-5 w-5" />;
      case 'recycle': return <Recycle className="h-5 w-5" />;
      case 'coffee': return <Coffee className="h-5 w-5" />;
      case 'heart': return <Heart className="h-5 w-5" />;
      default: return <Coffee className="h-5 w-5" />;
    }
  };

  return (
    <Layout adminOnly>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-amber-900">Community Goals Management</h1>
          <Button 
            onClick={handleCreateNewGoal}
            className="bg-amber-700 hover:bg-amber-800 flex items-center gap-2"
          >
            <Plus size={16} /> Create New Goal
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Community Goals</CardTitle>
            <CardDescription>Manage your community challenges and track progress</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-700 border-t-transparent"></div>
              </div>
            ) : goals.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No community goals found. Create one to get started!</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {goals.map((goal) => (
                      <TableRow key={goal.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="bg-amber-100 p-1 rounded">
                              {getIconComponent(goal.icon)}
                            </div>
                            <div>
                              <p className="font-medium">{goal.name}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {goal.description}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              {goal.current_points} / {goal.target_points} pts
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-amber-600 rounded-full" 
                                style={{ width: `${Math.min((goal.current_points / goal.target_points) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {goal.expires_at ? format(new Date(goal.expires_at), 'MMM d, yyyy') : 'No expiration'}
                        </TableCell>
                        <TableCell>
                          <div className={`inline-block px-2 py-1 rounded-full text-xs ${goal.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {goal.active ? 'Active' : 'Inactive'}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditGoal(goal)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleDeleteGoal(goal.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Community Goal' : 'Create Community Goal'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the details of this community goal.' : 'Create a new community goal for users to contribute to.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="target_points" className="text-right">Target Points</Label>
                <Input
                  id="target_points"
                  name="target_points"
                  type="number"
                  min={1}
                  value={formData.target_points}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expires_at" className="text-right">Expiry Date</Label>
                <Input
                  id="expires_at"
                  name="expires_at"
                  type="date"
                  value={formData.expires_at}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icon" className="text-right">Icon</Label>
                <Select 
                  value={formData.icon} 
                  onValueChange={(value) => handleSelectChange('icon', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coffee">
                      <div className="flex items-center gap-2">
                        <Coffee className="h-4 w-4" /> Coffee
                      </div>
                    </SelectItem>
                    <SelectItem value="heart">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4" /> Heart
                      </div>
                    </SelectItem>
                    <SelectItem value="award">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4" /> Award
                      </div>
                    </SelectItem>
                    <SelectItem value="recycle">
                      <div className="flex items-center gap-2">
                        <Recycle className="h-4 w-4" /> Recycle
                      </div>
                    </SelectItem>
                    <SelectItem value="users">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" /> Users
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reward_description" className="text-right">Reward</Label>
                <Input
                  id="reward_description"
                  name="reward_description"
                  value={formData.reward_description}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="e.g. Free coffee for all gold members"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="active" className="text-right">Status</Label>
                <Select 
                  value={formData.active ? 'active' : 'inactive'} 
                  onValueChange={(value) => handleSelectChange('active', value === 'active' ? 'true' : 'false')}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-amber-700 hover:bg-amber-800">
                {isEditing ? 'Update Goal' : 'Create Goal'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
