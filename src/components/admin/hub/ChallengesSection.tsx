
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Download, Users, Target } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ChallengesSection = () => {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'weekly',
    target: 1,
    reward: '',
    difficulty_level: 'medium',
    expires_at: ''
  });

  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ['admin-challenges-detailed'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          *,
          challenge_participants (
            id,
            completed,
            user_id
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data?.map(challenge => ({
        ...challenge,
        participant_count: challenge.challenge_participants?.length || 0,
        completion_rate: challenge.challenge_participants?.length > 0 
          ? Math.round((challenge.challenge_participants.filter((p: any) => p.completed).length / challenge.challenge_participants.length) * 100)
          : 0
      })) || [];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('challenges')
        .insert({
          title: data.title,
          description: data.description,
          type: data.type,
          target: data.target,
          reward: data.reward,
          difficulty_level: data.difficulty_level,
          expires_at: data.expires_at,
          active: true
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-challenges-detailed'] });
      toast.success('Challenge created successfully!');
      setIsCreateOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error('Failed to create challenge');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('challenges')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-challenges-detailed'] });
      toast.success('Challenge deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete challenge');
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from('challenges')
        .update({ active })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-challenges-detailed'] });
      toast.success('Challenge updated successfully!');
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'weekly',
      target: 1,
      reward: '',
      difficulty_level: 'medium',
      expires_at: ''
    });
    setEditingChallenge(null);
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    createMutation.mutate(formData);
  };

  const exportToCSV = () => {
    const csvData = challenges.map(challenge => ({
      Title: challenge.title,
      Type: challenge.type,
      Participants: challenge.participant_count,
      'Completion Rate': `${challenge.completion_rate}%`,
      Active: challenge.active ? 'Yes' : 'No',
      'Created At': new Date(challenge.created_at).toLocaleDateString()
    }));
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + Object.keys(csvData[0] || {}).join(",") + "\n"
      + csvData.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "challenges_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Challenges exported to CSV!');
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading challenges...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Challenges Management</h2>
          <p className="text-gray-500">Create and manage community challenges</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Challenge
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Challenge</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Challenge title*"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <Textarea
                  placeholder="Challenge description*"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select 
                    value={formData.difficulty_level} 
                    onValueChange={(value) => setFormData({ ...formData, difficulty_level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Target*"
                    min="1"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: parseInt(e.target.value) || 1 })}
                  />
                  <Input
                    placeholder="Reward points"
                    value={formData.reward}
                    onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                  />
                </div>
                <Input
                  type="datetime-local"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                />
                <Button 
                  onClick={handleSubmit} 
                  disabled={createMutation.isPending}
                  className="w-full"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Challenge'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Challenges</CardTitle>
          <CardDescription>Manage challenge lifecycle and track performance</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Challenge</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Completion Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {challenges.map((challenge) => (
                <TableRow key={challenge.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{challenge.title}</div>
                      <div className="text-sm text-gray-500">Target: {challenge.target}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{challenge.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={challenge.difficulty_level === 'easy' ? 'secondary' : 
                               challenge.difficulty_level === 'hard' ? 'destructive' : 'default'}
                      className="capitalize"
                    >
                      {challenge.difficulty_level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {challenge.participant_count}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {challenge.completion_rate}%
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={challenge.active ? "default" : "secondary"}>
                      {challenge.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActiveMutation.mutate({ 
                          id: challenge.id, 
                          active: !challenge.active 
                        })}
                      >
                        {challenge.active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this challenge?')) {
                            deleteMutation.mutate(challenge.id);
                          }
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChallengesSection;
