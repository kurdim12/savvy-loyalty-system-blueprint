import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Plus, Edit, Trash2, Users, Calendar, Target, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import ChallengeTemplates from './challenges/ChallengeTemplates';

const ChallengesSection = () => {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  
  // Challenge form state
  const [challengeForm, setChallengeForm] = useState({
    title: '',
    description: '',
    type: 'weekly' as 'daily' | 'weekly' | 'monthly',
    target: 1,
    reward: '',
    expires_at: '',
    difficulty_level: 'medium' as 'easy' | 'medium' | 'hard'
  });

  // Fetch challenges
  const { data: challenges = [], isLoading: challengesLoading } = useQuery({
    queryKey: ['admin_challenges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          *,
          challenge_participants (id)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data?.map(challenge => ({
        ...challenge,
        participant_count: challenge.challenge_participants?.length || 0
      })) || [];
    }
  });

  // Create challenge mutation
  const createChallengeMutation = useMutation({
    mutationFn: async (challenge: typeof challengeForm) => {
      if (!challenge.title.trim() || !challenge.description.trim() || !challenge.expires_at) {
        throw new Error('Please fill in all required fields');
      }

      const { data, error } = await supabase
        .from('challenges')
        .insert({
          title: challenge.title.trim(),
          description: challenge.description.trim(),
          type: challenge.type,
          target: challenge.target,
          reward: challenge.reward.trim(),
          expires_at: new Date(challenge.expires_at).toISOString(),
          difficulty_level: challenge.difficulty_level,
          active: true
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('🎯 Challenge created successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin_challenges'] });
      setIsCreateOpen(false);
      setShowTemplates(false);
      setChallengeForm({
        title: '',
        description: '',
        type: 'weekly',
        target: 1,
        reward: '',
        expires_at: '',
        difficulty_level: 'medium'
      });
    },
    onError: (error: any) => {
      toast.error(`Failed to create challenge: ${error.message}`);
    }
  });

  // Toggle challenge active status
  const toggleChallengeMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from('challenges')
        .update({ active })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_challenges'] });
      toast.success('✅ Challenge updated successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to update challenge: ${error.message}`);
    }
  });

  // Delete challenge mutation
  const deleteChallengeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('challenges')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_challenges'] });
      toast.success('🗑️ Challenge deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete challenge: ${error.message}`);
    }
  });

  const handleSelectTemplate = (template: any) => {
    setChallengeForm({
      title: template.title,
      description: template.description,
      type: template.type,
      target: template.suggestedTarget,
      reward: template.suggestedReward,
      expires_at: '',
      difficulty_level: template.difficulty === 'beginner' ? 'easy' : template.difficulty === 'advanced' ? 'hard' : 'medium'
    });
    setShowTemplates(false);
  };

  const getDefaultDateTime = () => {
    const now = new Date();
    now.setDate(now.getDate() + 7);
    return now.toISOString().slice(0, 16);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (challengesLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
        <span className="ml-3 text-amber-800">Loading challenges...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-amber-900">Community Challenges</h2>
          <p className="text-amber-700">Create engaging challenges to boost customer participation</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-700 hover:bg-amber-800 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Challenge
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Challenge</DialogTitle>
            </DialogHeader>
            
            <Tabs value={showTemplates ? "templates" : "manual"} onValueChange={(value) => setShowTemplates(value === "templates")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="templates" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Templates
                </TabsTrigger>
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              </TabsList>
              
              <TabsContent value="templates" className="mt-4">
                <ChallengeTemplates onSelectTemplate={handleSelectTemplate} />
              </TabsContent>
              
              <TabsContent value="manual" className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Challenge Title*</label>
                    <Input
                      placeholder="Enter challenge title"
                      value={challengeForm.title}
                      onChange={(e) => setChallengeForm({ ...challengeForm, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Type*</label>
                    <Select 
                      value={challengeForm.type} 
                      onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                        setChallengeForm({ ...challengeForm, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily Challenge</SelectItem>
                        <SelectItem value="weekly">Weekly Challenge</SelectItem>
                        <SelectItem value="monthly">Monthly Challenge</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Description*</label>
                  <Textarea
                    placeholder="Describe the challenge"
                    value={challengeForm.description}
                    onChange={(e) => setChallengeForm({ ...challengeForm, description: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Target*</label>
                    <Input
                      type="number"
                      placeholder="e.g., 7"
                      min="1"
                      value={challengeForm.target}
                      onChange={(e) => setChallengeForm({ ...challengeForm, target: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Difficulty</label>
                    <Select 
                      value={challengeForm.difficulty_level} 
                      onValueChange={(value: 'easy' | 'medium' | 'hard') => 
                        setChallengeForm({ ...challengeForm, difficulty_level: value })
                      }
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
                  <div>
                    <label className="text-sm font-medium">Expires At*</label>
                    <Input
                      type="datetime-local"
                      value={challengeForm.expires_at || getDefaultDateTime()}
                      onChange={(e) => setChallengeForm({ ...challengeForm, expires_at: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Reward Description</label>
                  <Input
                    placeholder="Describe the reward (points will be set separately)"
                    value={challengeForm.reward}
                    onChange={(e) => setChallengeForm({ ...challengeForm, reward: e.target.value })}
                  />
                </div>
                
                <Button 
                  onClick={() => createChallengeMutation.mutate(challengeForm)} 
                  disabled={createChallengeMutation.isPending}
                  className="w-full bg-amber-700 hover:bg-amber-800 text-white"
                >
                  {createChallengeMutation.isPending ? 'Creating...' : 'Create Challenge'}
                </Button>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {challenges.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg border border-amber-200">
            <Trophy className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-amber-900 mb-2">No challenges yet</h4>
            <p className="text-amber-700">Create your first community challenge to engage users!</p>
          </div>
        ) : (
          challenges.map((challenge) => (
            <div key={challenge.id} className="bg-white rounded-lg border border-amber-200 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="font-semibold text-amber-900 text-lg">{challenge.title}</h4>
                    <Badge variant={challenge.active ? "default" : "secondary"}>
                      {challenge.active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline" className="capitalize">{challenge.type}</Badge>
                    <Badge className={getDifficultyColor(challenge.difficulty_level)}>
                      {challenge.difficulty_level}
                    </Badge>
                  </div>
                  <p className="text-amber-700 mb-3">{challenge.description}</p>
                  <div className="grid grid-cols-4 gap-4 text-sm text-amber-800">
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      <span><span className="font-medium">Target:</span> {challenge.target}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      <span><span className="font-medium">Reward:</span> {challenge.reward || 'None'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span><span className="font-medium">Participants:</span> {challenge.participant_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span><span className="font-medium">Expires:</span> {new Date(challenge.expires_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleChallengeMutation.mutate({ 
                      id: challenge.id, 
                      active: !challenge.active 
                    })}
                    disabled={toggleChallengeMutation.isPending}
                  >
                    {challenge.active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this challenge?')) {
                        deleteChallengeMutation.mutate(challenge.id);
                      }
                    }}
                    disabled={deleteChallengeMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChallengesSection;
