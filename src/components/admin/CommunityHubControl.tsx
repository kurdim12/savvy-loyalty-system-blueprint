
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Camera, Plus, Edit, Trash2, Users, BarChart3, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const CommunityHubControl = () => {
  const queryClient = useQueryClient();
  const [isCreateChallengeOpen, setIsCreateChallengeOpen] = useState(false);
  const [isCreateContestOpen, setIsCreateContestOpen] = useState(false);
  
  // Challenge form state
  const [challengeForm, setChallengeForm] = useState({
    title: '',
    description: '',
    type: 'weekly' as 'daily' | 'weekly' | 'monthly',
    target: 1,
    reward: '',
    expires_at: ''
  });

  // Contest form state
  const [contestForm, setContestForm] = useState({
    title: '',
    description: '',
    theme: '',
    prize: '',
    ends_at: '',
    max_submissions: 100
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

  // Fetch photo contests
  const { data: contests = [], isLoading: contestsLoading } = useQuery({
    queryKey: ['admin_contests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('photo_contests')
        .select(`
          *,
          photo_contest_submissions (id, votes)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data?.map(contest => ({
        ...contest,
        submission_count: contest.photo_contest_submissions?.length || 0,
        total_votes: contest.photo_contest_submissions?.reduce((sum: number, sub: any) => sum + (sub.votes || 0), 0) || 0
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
      setIsCreateChallengeOpen(false);
      setChallengeForm({
        title: '',
        description: '',
        type: 'weekly',
        target: 1,
        reward: '',
        expires_at: ''
      });
    },
    onError: (error: any) => {
      toast.error(`Failed to create challenge: ${error.message}`);
    }
  });

  // Create contest mutation
  const createContestMutation = useMutation({
    mutationFn: async (contest: typeof contestForm) => {
      if (!contest.title.trim() || !contest.ends_at) {
        throw new Error('Please fill in all required fields');
      }

      const { data, error } = await supabase
        .from('photo_contests')
        .insert({
          title: contest.title.trim(),
          description: contest.description.trim(),
          theme: contest.theme.trim(),
          prize: contest.prize.trim(),
          ends_at: new Date(contest.ends_at).toISOString(),
          max_submissions: contest.max_submissions,
          active: true
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('📸 Photo contest created successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin_contests'] });
      setIsCreateContestOpen(false);
      setContestForm({
        title: '',
        description: '',
        theme: '',
        prize: '',
        ends_at: '',
        max_submissions: 100
      });
    },
    onError: (error: any) => {
      toast.error(`Failed to create photo contest: ${error.message}`);
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

  // Toggle contest active status
  const toggleContestMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from('photo_contests')
        .update({ active })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_contests'] });
      toast.success('✅ Contest updated successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to update contest: ${error.message}`);
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

  // Delete contest mutation
  const deleteContestMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('photo_contests')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_contests'] });
      toast.success('🗑️ Contest deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete contest: ${error.message}`);
    }
  });

  const getDefaultDateTime = () => {
    const now = new Date();
    now.setDate(now.getDate() + 7);
    return now.toISOString().slice(0, 16);
  };

  if (challengesLoading || contestsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
        <span className="ml-3 text-amber-800">Loading community hub data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-800">Active Challenges</p>
              <p className="text-2xl font-bold text-amber-900">{challenges.filter(c => c.active).length}</p>
            </div>
            <Trophy className="h-8 w-8 text-amber-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-800">Active Contests</p>
              <p className="text-2xl font-bold text-amber-900">{contests.filter(c => c.active).length}</p>
            </div>
            <Camera className="h-8 w-8 text-amber-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-800">Total Participants</p>
              <p className="text-2xl font-bold text-amber-900">
                {challenges.reduce((sum, c) => sum + (c.participant_count || 0), 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-amber-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-800">Total Votes</p>
              <p className="text-2xl font-bold text-amber-900">
                {contests.reduce((sum, c) => sum + (c.total_votes || 0), 0)}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-amber-600" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="challenges" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Challenges ({challenges.length})
          </TabsTrigger>
          <TabsTrigger value="contests" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Photo Contests ({contests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-amber-900">Community Challenges</h3>
            <Dialog open={isCreateChallengeOpen} onOpenChange={setIsCreateChallengeOpen}>
              <DialogTrigger asChild>
                <Button className="bg-amber-700 hover:bg-amber-800 text-white">
                  <Plus className="h-4 w-4 mr-2" />
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
                    value={challengeForm.title}
                    onChange={(e) => setChallengeForm({ ...challengeForm, title: e.target.value })}
                  />
                  <Textarea
                    placeholder="Challenge description*"
                    value={challengeForm.description}
                    onChange={(e) => setChallengeForm({ ...challengeForm, description: e.target.value })}
                  />
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
                  <Input
                    type="number"
                    placeholder="Target (e.g., 7 for 7 visits)*"
                    min="1"
                    value={challengeForm.target}
                    onChange={(e) => setChallengeForm({ ...challengeForm, target: parseInt(e.target.value) || 1 })}
                  />
                  <Input
                    placeholder="Reward description"
                    value={challengeForm.reward}
                    onChange={(e) => setChallengeForm({ ...challengeForm, reward: e.target.value })}
                  />
                  <Input
                    type="datetime-local"
                    value={challengeForm.expires_at || getDefaultDateTime()}
                    onChange={(e) => setChallengeForm({ ...challengeForm, expires_at: e.target.value })}
                  />
                  <Button 
                    onClick={() => createChallengeMutation.mutate(challengeForm)} 
                    disabled={createChallengeMutation.isPending}
                    className="w-full bg-amber-700 hover:bg-amber-800 text-white"
                  >
                    {createChallengeMutation.isPending ? 'Creating...' : 'Create Challenge'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {challenges.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg border border-amber-200">
                <Trophy className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-amber-900 mb-2">No challenges yet</h4>
                <p className="text-amber-700">Create your first community challenge to engage users!</p>
              </div>
            ) : (
              challenges.map((challenge) => (
                <div key={challenge.id} className="bg-white rounded-lg border border-amber-200 p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-amber-900">{challenge.title}</h4>
                        <Badge variant={challenge.active ? "default" : "secondary"}>
                          {challenge.active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline" className="capitalize">{challenge.type}</Badge>
                      </div>
                      <p className="text-sm text-amber-700 mb-2">{challenge.description}</p>
                      <div className="grid grid-cols-4 gap-4 text-sm text-amber-800">
                        <div><span className="font-medium">Target:</span> {challenge.target}</div>
                        <div><span className="font-medium">Reward:</span> {challenge.reward || 'None'}</div>
                        <div><span className="font-medium">Participants:</span> {challenge.participant_count}</div>
                        <div><span className="font-medium">Expires:</span> {new Date(challenge.expires_at).toLocaleDateString()}</div>
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
        </TabsContent>

        <TabsContent value="contests" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-amber-900">Photo Contests</h3>
            <Dialog open={isCreateContestOpen} onOpenChange={setIsCreateContestOpen}>
              <DialogTrigger asChild>
                <Button className="bg-amber-700 hover:bg-amber-800 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Contest
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Photo Contest</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Contest title*"
                    value={contestForm.title}
                    onChange={(e) => setContestForm({ ...contestForm, title: e.target.value })}
                  />
                  <Textarea
                    placeholder="Contest description"
                    value={contestForm.description}
                    onChange={(e) => setContestForm({ ...contestForm, description: e.target.value })}
                  />
                  <Input
                    placeholder="Contest theme"
                    value={contestForm.theme}
                    onChange={(e) => setContestForm({ ...contestForm, theme: e.target.value })}
                  />
                  <Input
                    placeholder="Prize description"
                    value={contestForm.prize}
                    onChange={(e) => setContestForm({ ...contestForm, prize: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Max submissions"
                    min="1"
                    value={contestForm.max_submissions}
                    onChange={(e) => setContestForm({ ...contestForm, max_submissions: parseInt(e.target.value) || 100 })}
                  />
                  <Input
                    type="datetime-local"
                    value={contestForm.ends_at || getDefaultDateTime()}
                    onChange={(e) => setContestForm({ ...contestForm, ends_at: e.target.value })}
                  />
                  <Button 
                    onClick={() => createContestMutation.mutate(contestForm)} 
                    disabled={createContestMutation.isPending}
                    className="w-full bg-amber-700 hover:bg-amber-800 text-white"
                  >
                    {createContestMutation.isPending ? 'Creating...' : 'Create Contest'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {contests.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg border border-amber-200">
                <Camera className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-amber-900 mb-2">No photo contests yet</h4>
                <p className="text-amber-700">Create your first photo contest to showcase community creativity!</p>
              </div>
            ) : (
              contests.map((contest) => (
                <div key={contest.id} className="bg-white rounded-lg border border-amber-200 p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-amber-900">{contest.title}</h4>
                        <Badge variant={contest.active ? "default" : "secondary"}>
                          {contest.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-amber-700 mb-2">{contest.description}</p>
                      <div className="grid grid-cols-4 gap-4 text-sm text-amber-800">
                        <div><span className="font-medium">Theme:</span> {contest.theme || 'No theme'}</div>
                        <div><span className="font-medium">Prize:</span> {contest.prize || 'No prize set'}</div>
                        <div><span className="font-medium">Submissions:</span> {contest.submission_count}</div>
                        <div><span className="font-medium">Ends:</span> {new Date(contest.ends_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleContestMutation.mutate({ 
                          id: contest.id, 
                          active: !contest.active 
                        })}
                        disabled={toggleContestMutation.isPending}
                      >
                        {contest.active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this contest?')) {
                            deleteContestMutation.mutate(contest.id);
                          }
                        }}
                        disabled={deleteContestMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityHubControl;
