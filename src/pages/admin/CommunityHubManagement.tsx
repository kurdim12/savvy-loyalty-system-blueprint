
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
import { Trophy, Camera, Plus, Edit, Trash2, Users, Eye, BarChart3 } from 'lucide-react';
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
    target: 0,
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

  // Fetch photo contests with submission counts
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
      const { error } = await supabase
        .from('challenges')
        .insert({
          ...challenge,
          expires_at: new Date(challenge.expires_at).toISOString()
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Challenge created successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin_challenges'] });
      setIsCreateChallengeOpen(false);
      setChallengeForm({
        title: '',
        description: '',
        type: 'weekly',
        target: 0,
        reward: '',
        expires_at: ''
      });
    },
    onError: () => {
      toast.error('Failed to create challenge');
    }
  });

  // Create contest mutation
  const createContestMutation = useMutation({
    mutationFn: async (contest: typeof contestForm) => {
      const { error } = await supabase
        .from('photo_contests')
        .insert({
          ...contest,
          ends_at: new Date(contest.ends_at).toISOString()
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Photo contest created successfully!');
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
    onError: () => {
      toast.error('Failed to create photo contest');
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
      toast.success('Challenge updated successfully!');
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
      toast.success('Contest updated successfully!');
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
      toast.success('Challenge deleted successfully!');
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
      toast.success('Contest deleted successfully!');
    }
  });

  const handleCreateChallenge = () => {
    if (!challengeForm.title || !challengeForm.description || !challengeForm.expires_at) {
      toast.error('Please fill in all required fields');
      return;
    }
    createChallengeMutation.mutate(challengeForm);
  };

  const handleCreateContest = () => {
    if (!contestForm.title || !contestForm.ends_at) {
      toast.error('Please fill in all required fields');
      return;
    }
    createContestMutation.mutate(contestForm);
  };

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
              Challenges
            </TabsTrigger>
            <TabsTrigger value="contests" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Photo Contests
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
                      placeholder="Challenge title"
                      value={challengeForm.title}
                      onChange={(e) => setChallengeForm({ ...challengeForm, title: e.target.value })}
                    />
                    <Textarea
                      placeholder="Challenge description"
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
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="Target (e.g., 7 for 7 visits)"
                      value={challengeForm.target}
                      onChange={(e) => setChallengeForm({ ...challengeForm, target: parseInt(e.target.value) || 0 })}
                    />
                    <Input
                      placeholder="Reward description"
                      value={challengeForm.reward}
                      onChange={(e) => setChallengeForm({ ...challengeForm, reward: e.target.value })}
                    />
                    <Input
                      type="datetime-local"
                      value={challengeForm.expires_at}
                      onChange={(e) => setChallengeForm({ ...challengeForm, expires_at: e.target.value })}
                    />
                    <Button onClick={handleCreateChallenge} className="w-full bg-black hover:bg-[#95A5A6] text-white">
                      Create Challenge
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {challenges.map((challenge) => (
                <Card key={challenge.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {challenge.title}
                          <Badge variant={challenge.active ? "default" : "secondary"}>
                            {challenge.active ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline">{challenge.type}</Badge>
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
                        >
                          {challenge.active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteChallengeMutation.mutate(challenge.id)}
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
                        <span className="font-medium">Reward:</span> {challenge.reward}
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
              ))}
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
                      placeholder="Contest title"
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
                      value={contestForm.max_submissions}
                      onChange={(e) => setContestForm({ ...contestForm, max_submissions: parseInt(e.target.value) || 100 })}
                    />
                    <Input
                      type="datetime-local"
                      value={contestForm.ends_at}
                      onChange={(e) => setContestForm({ ...contestForm, ends_at: e.target.value })}
                    />
                    <Button onClick={handleCreateContest} className="w-full bg-black hover:bg-[#95A5A6] text-white">
                      Create Contest
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {contests.map((contest) => (
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
                        >
                          {contest.active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteContestMutation.mutate(contest.id)}
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
              ))}
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
                  {leaderboard.map((user, index) => (
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
                  ))}
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
