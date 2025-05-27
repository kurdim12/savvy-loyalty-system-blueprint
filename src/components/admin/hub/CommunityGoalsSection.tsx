
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Plus, Target, Trophy, Archive, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const CommunityGoalsSection = () => {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    target_points: 1000,
    reward_description: '',
    expires_at: ''
  });

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['community-goals-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_goals')
        .select(`
          *,
          community_goal_contributions (
            id,
            points_contributed,
            user_id
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data?.map(goal => ({
        ...goal,
        contributor_count: new Set(goal.community_goal_contributions?.map((c: any) => c.user_id)).size || 0,
        progress_percentage: goal.target_points > 0 ? Math.min((goal.current_points / goal.target_points) * 100, 100) : 0
      })) || [];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('community_goals')
        .insert({
          name: data.name,
          description: data.description,
          target_points: data.target_points,
          reward_description: data.reward_description,
          expires_at: data.expires_at || null,
          active: true,
          current_points: 0
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-goals-admin'] });
      toast.success('Community goal created successfully!');
      setIsCreateOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error('Failed to create community goal');
    }
  });

  const toggleGoalMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from('community_goals')
        .update({ active })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-goals-admin'] });
      toast.success('Goal updated successfully!');
    }
  });

  const resetGoalMutation = useMutation({
    mutationFn: async (id: string) => {
      // Reset goal progress and clear contributions
      const { error: updateError } = await supabase
        .from('community_goals')
        .update({ current_points: 0 })
        .eq('id', id);
      
      if (updateError) throw updateError;

      const { error: deleteError } = await supabase
        .from('community_goal_contributions')
        .delete()
        .eq('goal_id', id);
      
      if (deleteError) throw deleteError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-goals-admin'] });
      toast.success('Goal reset successfully!');
    },
    onError: () => {
      toast.error('Failed to reset goal');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      target_points: 1000,
      reward_description: '',
      expires_at: ''
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || formData.target_points <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    createMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading community goals...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Community Goals</h2>
          <p className="text-gray-500">Create and manage community-wide objectives</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Community Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Goal name*"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Textarea
                placeholder="Goal description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Target points*"
                min="1"
                value={formData.target_points}
                onChange={(e) => setFormData({ ...formData, target_points: parseInt(e.target.value) || 1000 })}
              />
              <Input
                placeholder="Reward description"
                value={formData.reward_description}
                onChange={(e) => setFormData({ ...formData, reward_description: e.target.value })}
              />
              <Input
                type="datetime-local"
                placeholder="Expires at (optional)"
                value={formData.expires_at}
                onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
              />
              <Button 
                onClick={handleSubmit} 
                disabled={createMutation.isPending}
                className="w-full"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Goal'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <Card key={goal.id} className={`${goal.active ? 'border-green-200' : 'border-gray-200'}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{goal.name}</CardTitle>
                <Badge variant={goal.active ? "default" : "secondary"}>
                  {goal.active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardDescription>{goal.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{goal.current_points} / {goal.target_points} points</span>
                </div>
                <Progress value={goal.progress_percentage} className="h-2" />
                <div className="text-xs text-gray-500">
                  {Math.round(goal.progress_percentage)}% completed
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Contributors:</span>
                  <span className="font-medium">{goal.contributor_count}</span>
                </div>
                {goal.reward_description && (
                  <div>
                    <span className="font-medium">Reward:</span>
                    <p className="text-gray-600">{goal.reward_description}</p>
                  </div>
                )}
                {goal.expires_at && (
                  <div>
                    <span className="font-medium">Expires:</span>
                    <p className="text-gray-600">{new Date(goal.expires_at).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleGoalMutation.mutate({ 
                    id: goal.id, 
                    active: !goal.active 
                  })}
                  className="flex-1"
                >
                  {goal.active ? <Archive className="h-3 w-3 mr-1" /> : <Target className="h-3 w-3 mr-1" />}
                  {goal.active ? 'Archive' : 'Activate'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to reset this goal? This will clear all progress and contributions.')) {
                      resetGoalMutation.mutate(goal.id);
                    }
                  }}
                  disabled={resetGoalMutation.isPending}
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {goals.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Community Goals</h3>
            <p className="text-gray-500 mb-4">Create your first community goal to engage users in collective achievements.</p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommunityGoalsSection;
