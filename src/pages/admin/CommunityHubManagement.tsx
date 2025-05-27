
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import AdminLayout from '@/components/admin/AdminLayout';

const CommunityHubManagement = () => {
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

  // Fetch challenges with participant counts
  const { data: challenges = [], isLoading: challengesLoading, error: challengesError } = useQuery({
    queryKey: ['admin_challenges'],
    queryFn: async () => {
      console.log('Fetching challenges...');
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          *,
          challenge_participants (id)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching challenges:', error);
        throw error;
      }
      
      console.log('Challenges fetched:', data);
      return data?.map(challenge => ({
        ...challenge,
        participant_count: challenge.challenge_participants?.length || 0
      })) || [];
    }
  });

  // Fetch photo contests with submission counts
  const { data: contests = [], isLoading: contestsLoading, error: contestsError } = useQuery({
    queryKey: ['admin_contests'],
    queryFn: async () => {
      console.log('Fetching contests...');
      const { data, error } = await supabase
        .from('photo_contests')
        .select(`
          *,
          photo_contest_submissions (id, votes)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching contests:', error);
        throw error;
      }
      
      console.log('Contests fetched:', data);
      return data?.map(contest => ({
        ...contest,
        submission_count: contest.photo_contest_submissions?.length || 0,
        total_votes: contest.photo_contest_submissions?.reduce((sum: number, sub: any) => sum + (sub.votes || 0), 0) || 0
      })) || [];
    }
  });

  // Fetch user leaderboard
  const { data: leaderboard = [] } = useQuery({
    queryKey: ['admin_leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, current_points, membership_tier, visits')
        .eq('role', 'customer')
        .order('current_points', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Create challenge mutation
  const createChallengeMutation = useMutation({
    mutationFn: async (challenge: typeof challengeForm) => {
      console.log('Creating challenge:', challenge);
      
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
      
      if (error) {
        console.error('Error creating challenge:', error);
        throw error;
      }
      
      console.log('Challenge created:', data);
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
      console.error('Challenge creation failed:', error);
      toast.error(`Failed to create challenge: ${error.message}`);
    }
  });

  // Create contest mutation
  const createContestMutation = useMutation({
    mutationFn: async (contest: typeof contestForm) => {
      console.log('Creating contest:', contest);
      
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
      
      if (error) {
        console.error('Error creating contest:', error);
        throw error;
      }
      
      console.log('Contest created:', data);
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
      console.error('Contest creation failed:', error);
      toast.error(`Failed to create photo contest: ${error.message}`);
    }
  });

  // Toggle challenge active status
  const toggleChallengeMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      console.log('Toggling challenge status:', id, active);
      const { error } = await supabase
        .from('challenges')
        .update({ active })
        .eq('id', id);
      
      if (error) {
        console.error('Error toggling challenge:', error);
        throw error;
      }
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
      console.log('Toggling contest status:', id, active);
      const { error } = await supabase
        .from('photo_contests')
        .update({ active })
        .eq('id', id);
      
      if (error) {
        console.error('Error toggling contest:', error);
        throw error;
      }
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
      console.log('Deleting challenge:', id);
      const { error } = await supabase
        .from('challenges')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting challenge:', error);
        throw error;
      }
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
      console.log('Deleting contest:', id);
      const { error } = await supabase
        .from('photo_contests')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting contest:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_contests'] });
      toast.success('🗑️ Contest deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete contest: ${error.message}`);
    }
  });

  const handleCreateChallenge = () => {
    if (!challengeForm.title.trim() || !challengeForm.description.trim() || !challengeForm.expires_at) {
      toast.error('Please fill in all required fields');
      return;
    }
    createChallengeMutation.mutate(challengeForm);
  };

  const handleCreateContest = () => {
    if (!contestForm.title.trim() || !contestForm.ends_at) {
      toast.error('Please fill in all required fields');
      return;
    }
    createContestMutation.mutate(contestForm);
  };

  // Set default datetime for forms
  const getDefaultDateTime = () => {
    const now = new Date();
    now.setDate(now.getDate() + 7); // Default to 1 week from now
    return now.toISOString().slice(0, 16);
  };

  if (challengesLoading || contestsLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          <span className="ml-3 text-black">Loading community hub data...</span>
        </div>
      </AdminLayout>
    );
  }

  if (challengesError || contestsError) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-black mb-2">Error Loading Data</h3>
            <p className="text-[#95A5A6]">
              {challengesError?.message || contestsError?.message || 'Failed to load community hub data'}
            </p>
            <Button 
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ['admin_challenges'] });
                queryClient.invalidateQueries({ queryKey: ['admin_contests'] });
              }}
              className="mt-4 bg-black hover:bg-[#95A5A6] text-white"
            >
              Retry
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-black">Community Hub Management</h1>
          <p className="text-[#95A5A6]">Complete control over challenges, photo contests, and community features</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Challenges</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{challenges.filter(c => c.active).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Contests</CardTitle>
              <Camera className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contests.filter(c => c.active).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {challenges.reduce((sum, c) => sum + (c.participant_count || 0), 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {contests.reduce((sum, c) => sum + (c.total_votes || 0), 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="challenges" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Challenges ({challenges.length})
            </TabsTrigger>
            <TabsTrigger value="contests" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Photo Contests ({contests.length})
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="challenges" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-black">Community Challenges</h2>
              <Dialog open={isCreateChallengeOpen} onOpenChange={setIsCreateChallengeOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-black hover:bg-[#95A5A6] text-white">
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
                      onClick={handleCreateChallenge} 
                      disabled={createChallengeMutation.isPending}
                      className="w-full bg-black hover:bg-[#95A5A6] text-white"
                    >
                      {createChallengeMutation.isPending ? 'Creating...' : 'Create Challenge'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {challenges.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Trophy className="h-12 w-12 text-[#95A5A6] mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-black mb-2">No challenges yet</h3>
                    <p className="text-[#95A5A6] mb-4">Create your first community challenge to engage users!</p>
                  </CardContent>
                </Card>
              ) : (
                challenges.map((challenge) => (
                  <Card key={challenge.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {challenge.title}
                            <Badge variant={challenge.active ? "default" : "secondary"}>
                              {challenge.active ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant="outline" className="capitalize">{challenge.type}</Badge>
                          </CardTitle>
                          <CardDescription>{challenge.description}</CardDescription>
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
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Target:</span> {challenge.target}
                        </div>
                        <div>
                          <span className="font-medium">Reward:</span> {challenge.reward || 'None'}
                        </div>
                        <div>
                          <span className="font-medium">Participants:</span> {challenge.participant_count}
                        </div>
                        <div>
                          <span className="font-medium">Expires:</span> {new Date(challenge.expires_at).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="contests" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-black">Photo Contests</h2>
              <Dialog open={isCreateContestOpen} onOpenChange={setIsCreateContestOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-black hover:bg-[#95A5A6] text-white">
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
                      onClick={handleCreateContest} 
                      disabled={createContestMutation.isPending}
                      className="w-full bg-black hover:bg-[#95A5A6] text-white"
                    >
                      {createContestMutation.isPending ? 'Creating...' : 'Create Contest'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {contests.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Camera className="h-12 w-12 text-[#95A5A6] mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-black mb-2">No photo contests yet</h3>
                    <p className="text-[#95A5A6] mb-4">Create your first photo contest to showcase community creativity!</p>
                  </CardContent>
                </Card>
              ) : (
                contests.map((contest) => (
                  <Card key={contest.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {contest.title}
                            <Badge variant={contest.active ? "default" : "secondary"}>
                              {contest.active ? "Active" : "Inactive"}
                            </Badge>
                          </CardTitle>
                          <CardDescription>{contest.description}</CardDescription>
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
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Theme:</span> {contest.theme || 'No theme'}
                        </div>
                        <div>
                          <span className="font-medium">Prize:</span> {contest.prize || 'No prize set'}
                        </div>
                        <div>
                          <span className="font-medium">Submissions:</span> {contest.submission_count}
                        </div>
                        <div>
                          <span className="font-medium">Ends:</span> {new Date(contest.ends_at).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-black">User Leaderboard</h2>
              <Badge variant="outline">{leaderboard.length} Active Users</Badge>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Users by Points</CardTitle>
                <CardDescription>Current rankings based on loyalty points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-[#95A5A6] mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-black mb-2">No active users yet</h3>
                      <p className="text-[#95A5A6]">Users will appear here as they start earning points!</p>
                    </div>
                  ) : (
                    leaderboard.map((user, index) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.visits} visits • {user.membership_tier} tier
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{user.current_points}</div>
                          <div className="text-sm text-gray-500">points</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default CommunityHubManagement;
