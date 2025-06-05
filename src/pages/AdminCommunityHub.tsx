
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Camera, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  Users,
  Target,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminCommunityHub = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('challenges');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isCreatingDemo, setIsCreatingDemo] = useState(false);

  // Form states with validation
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'weekly',
    target: 100,
    reward: '',
    theme: '',
    prize: '',
    maxSubmissions: 100,
    expiresAt: '',
    endsAt: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch challenges
  const { data: challenges = [], isLoading: challengesLoading, error: challengesError } = useQuery({
    queryKey: ['admin-challenges'],
    queryFn: async () => {
      console.log('🔍 Admin: Fetching challenges...');
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          *,
          challenge_participants (id)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Admin: Error fetching challenges:', error);
        throw error;
      }
      
      console.log('✅ Admin: Challenges fetched:', data?.length || 0);
      return data || [];
    }
  });

  // Fetch photo contests
  const { data: photoContests = [], isLoading: contestsLoading, error: contestsError } = useQuery({
    queryKey: ['admin-photo-contests'],
    queryFn: async () => {
      console.log('🔍 Admin: Fetching photo contests...');
      const { data, error } = await supabase
        .from('photo_contests')
        .select(`
          *,
          photo_contest_submissions (id)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Admin: Error fetching photo contests:', error);
        throw error;
      }
      
      console.log('✅ Admin: Photo contests fetched:', data?.length || 0);
      return data || [];
    }
  });

  // Create demo data mutation
  const createDemoDataMutation = useMutation({
    mutationFn: async () => {
      console.log('🎭 Admin: Creating demo data...');
      
      // Create demo challenge
      const { error: challengeError } = await supabase
        .from('challenges')
        .insert({
          title: 'Daily Coffee Explorer',
          description: 'Try a different coffee blend each day for a week',
          type: 'weekly',
          target: 7,
          reward: '50 bonus points + free pastry',
          expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          active: true
        });

      if (challengeError) throw challengeError;

      // Create demo photo contest
      const { error: contestError } = await supabase
        .from('photo_contests')
        .insert({
          title: 'Morning Coffee Ritual',
          description: 'Show us your perfect morning coffee setup',
          theme: 'Morning Vibes',
          prize: 'Free coffee for a month + Raw Smith merchandise',
          ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          max_submissions: 50,
          active: true
        });

      if (contestError) throw contestError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-challenges'] });
      queryClient.invalidateQueries({ queryKey: ['admin-photo-contests'] });
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['photo_contests'] });
      toast.success('🎭 Demo data created successfully!');
    },
    onError: (error: any) => {
      console.error('❌ Admin: Failed to create demo data:', error);
      toast.error('Failed to create demo data');
    }
  });

  // Validation function
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    
    if (activeTab === 'challenges') {
      if (!formData.reward.trim()) errors.reward = 'Reward is required';
      if (!formData.expiresAt) errors.expiresAt = 'Expiration date is required';
      if (formData.target < 1) errors.target = 'Target must be at least 1';
    }
    
    if (activeTab === 'photo-contests') {
      if (!formData.theme.trim()) errors.theme = 'Theme is required';
      if (!formData.prize.trim()) errors.prize = 'Prize is required';
      if (!formData.endsAt) errors.endsAt = 'End date is required';
      if (formData.maxSubmissions < 1) errors.maxSubmissions = 'Max submissions must be at least 1';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create challenge mutation
  const createChallengeMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('🎯 Admin: Creating challenge:', data);
      const { error } = await supabase
        .from('challenges')
        .insert({
          title: data.title,
          description: data.description,
          type: data.type,
          target: data.target,
          reward: data.reward,
          expires_at: data.expiresAt,
          active: true
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-challenges'] });
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      toast.success('🎯 Challenge created successfully!');
      resetForm();
    },
    onError: (error: any) => {
      console.error('❌ Admin: Failed to create challenge:', error);
      toast.error('Failed to create challenge');
    }
  });

  // Create photo contest mutation
  const createPhotoContestMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('📸 Admin: Creating photo contest:', data);
      const { error } = await supabase
        .from('photo_contests')
        .insert({
          title: data.title,
          description: data.description,
          theme: data.theme,
          prize: data.prize,
          ends_at: data.endsAt,
          max_submissions: data.maxSubmissions,
          active: true
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-photo-contests'] });
      queryClient.invalidateQueries({ queryKey: ['photo_contests'] });
      toast.success('📸 Photo contest created successfully!');
      resetForm();
    },
    onError: (error: any) => {
      console.error('❌ Admin: Failed to create photo contest:', error);
      toast.error('Failed to create photo contest');
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
      queryClient.invalidateQueries({ queryKey: ['admin-challenges'] });
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      toast.success('Challenge deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete challenge');
    }
  });

  // Delete photo contest mutation
  const deletePhotoContestMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('photo_contests')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-photo-contests'] });
      queryClient.invalidateQueries({ queryKey: ['photo_contests'] });
      toast.success('Photo contest deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete photo contest');
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'weekly',
      target: 100,
      reward: '',
      theme: '',
      prize: '',
      maxSubmissions: 100,
      expiresAt: '',
      endsAt: ''
    });
    setFormErrors({});
    setIsCreateDialogOpen(false);
    setEditingItem(null);
  };

  const handleCreate = () => {
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    if (activeTab === 'challenges') {
      createChallengeMutation.mutate(formData);
    } else if (activeTab === 'photo-contests') {
      createPhotoContestMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string, type: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      if (type === 'challenge') {
        deleteChallengeMutation.mutate(id);
      } else if (type === 'photo-contest') {
        deletePhotoContestMutation.mutate(id);
      }
    }
  };

  const handleCreateDemo = () => {
    setIsCreatingDemo(true);
    createDemoDataMutation.mutate();
    setTimeout(() => setIsCreatingDemo(false), 2000);
  };

  // Set default datetime values
  const getDefaultExpiresAt = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7); // Default to 1 week from now
    return date.toISOString().slice(0, 16);
  };

  const getDefaultEndsAt = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30); // Default to 1 month from now
    return date.toISOString().slice(0, 16);
  };

  return (
    <Layout adminOnly>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-amber-900">Community Hub Management</h1>
            <p className="text-amber-700">Manage challenges, photo contests, and community activities</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleCreateDemo}
              disabled={isCreatingDemo}
              variant="outline"
              className="border-amber-200 hover:bg-amber-50"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {isCreatingDemo ? 'Creating...' : 'Create Demo Data'}
            </Button>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-amber-700 hover:bg-amber-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-amber-50 border border-amber-200">
            <TabsTrigger value="challenges" className="data-[state=active]:bg-amber-100">
              <Trophy className="mr-2 h-4 w-4" />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="photo-contests" className="data-[state=active]:bg-amber-100">
              <Camera className="mr-2 h-4 w-4" />
              Photo Contests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="challenges" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Challenges Management</CardTitle>
                <CardDescription>Create and manage community challenges</CardDescription>
              </CardHeader>
              <CardContent>
                {challengesLoading ? (
                  <div className="text-center py-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-600 border-t-transparent mx-auto mb-2"></div>
                    Loading challenges...
                  </div>
                ) : challengesError ? (
                  <div className="text-center py-8">
                    <p className="text-red-600 mb-2">Failed to load challenges</p>
                    <Button 
                      onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-challenges'] })}
                      variant="outline"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : challenges.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="h-12 w-12 text-amber-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-amber-900 mb-2">No Challenges Yet</h3>
                    <p className="text-amber-700 mb-4">Create your first challenge to engage the community!</p>
                    <Button 
                      onClick={() => setIsCreateDialogOpen(true)}
                      className="bg-amber-700 hover:bg-amber-800"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Challenge
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {challenges.map((challenge) => (
                      <div key={challenge.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{challenge.title}</h3>
                              <Badge variant={challenge.active ? "default" : "secondary"}>
                                {challenge.active ? 'Active' : 'Inactive'}
                              </Badge>
                              <Badge variant="outline">{challenge.type}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{challenge.description}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span><Target className="inline h-3 w-3 mr-1" />Target: {challenge.target}</span>
                              <span><Trophy className="inline h-3 w-3 mr-1" />Reward: {challenge.reward}</span>
                              <span><Users className="inline h-3 w-3 mr-1" />Participants: {challenge.challenge_participants?.length || 0}</span>
                              <span><Calendar className="inline h-3 w-3 mr-1" />Expires: {new Date(challenge.expires_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDelete(challenge.id, 'challenge')}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photo-contests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Photo Contests Management</CardTitle>
                <CardDescription>Create and manage photo contests</CardDescription>
              </CardHeader>
              <CardContent>
                {contestsLoading ? (
                  <div className="text-center py-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-600 border-t-transparent mx-auto mb-2"></div>
                    Loading photo contests...
                  </div>
                ) : contestsError ? (
                  <div className="text-center py-8">
                    <p className="text-red-600 mb-2">Failed to load photo contests</p>
                    <Button 
                      onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-photo-contests'] })}
                      variant="outline"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : photoContests.length === 0 ? (
                  <div className="text-center py-12">
                    <Camera className="h-12 w-12 text-amber-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-amber-900 mb-2">No Photo Contests Yet</h3>
                    <p className="text-amber-700 mb-4">Create your first photo contest to showcase community creativity!</p>
                    <Button 
                      onClick={() => setIsCreateDialogOpen(true)}
                      className="bg-amber-700 hover:bg-amber-800"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Contest
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {photoContests.map((contest) => (
                      <div key={contest.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{contest.title}</h3>
                              <Badge variant={contest.active ? "default" : "secondary"}>
                                {contest.active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{contest.description}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span><Camera className="inline h-3 w-3 mr-1" />Theme: {contest.theme}</span>
                              <span><Trophy className="inline h-3 w-3 mr-1" />Prize: {contest.prize}</span>
                              <span><Users className="inline h-3 w-3 mr-1" />Submissions: {contest.photo_contest_submissions?.length || 0}/{contest.max_submissions}</span>
                              <span><Calendar className="inline h-3 w-3 mr-1" />Ends: {new Date(contest.ends_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDelete(contest.id, 'photo-contest')}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Create New {activeTab === 'challenges' ? 'Challenge' : 'Photo Contest'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter title"
                  className={formErrors.title ? 'border-red-500' : ''}
                />
                {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
              </div>
              
              <div>
                <label className="text-sm font-medium">Description *</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter description"
                  className={formErrors.description ? 'border-red-500' : ''}
                />
                {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
              </div>

              {activeTab === 'challenges' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Target *</label>
                      <Input
                        type="number"
                        value={formData.target}
                        onChange={(e) => setFormData({...formData, target: parseInt(e.target.value) || 0})}
                        min="1"
                        className={formErrors.target ? 'border-red-500' : ''}
                      />
                      {formErrors.target && <p className="text-red-500 text-xs mt-1">{formErrors.target}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Reward *</label>
                      <Input
                        value={formData.reward}
                        onChange={(e) => setFormData({...formData, reward: e.target.value})}
                        placeholder="e.g. 50 bonus points"
                        className={formErrors.reward ? 'border-red-500' : ''}
                      />
                      {formErrors.reward && <p className="text-red-500 text-xs mt-1">{formErrors.reward}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium">Expires At *</label>
                      <Input
                        type="datetime-local"
                        value={formData.expiresAt || getDefaultExpiresAt()}
                        onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                        className={formErrors.expiresAt ? 'border-red-500' : ''}
                      />
                      {formErrors.expiresAt && <p className="text-red-500 text-xs mt-1">{formErrors.expiresAt}</p>}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'photo-contests' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Theme *</label>
                      <Input
                        value={formData.theme}
                        onChange={(e) => setFormData({...formData, theme: e.target.value})}
                        placeholder="e.g. Morning Coffee"
                        className={formErrors.theme ? 'border-red-500' : ''}
                      />
                      {formErrors.theme && <p className="text-red-500 text-xs mt-1">{formErrors.theme}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium">Prize *</label>
                      <Input
                        value={formData.prize}
                        onChange={(e) => setFormData({...formData, prize: e.target.value})}
                        placeholder="e.g. Free coffee for a week"
                        className={formErrors.prize ? 'border-red-500' : ''}
                      />
                      {formErrors.prize && <p className="text-red-500 text-xs mt-1">{formErrors.prize}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Max Submissions *</label>
                      <Input
                        type="number"
                        value={formData.maxSubmissions}
                        onChange={(e) => setFormData({...formData, maxSubmissions: parseInt(e.target.value) || 0})}
                        min="1"
                        className={formErrors.maxSubmissions ? 'border-red-500' : ''}
                      />
                      {formErrors.maxSubmissions && <p className="text-red-500 text-xs mt-1">{formErrors.maxSubmissions}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium">Ends At *</label>
                      <Input
                        type="datetime-local"
                        value={formData.endsAt || getDefaultEndsAt()}
                        onChange={(e) => setFormData({...formData, endsAt: e.target.value})}
                        className={formErrors.endsAt ? 'border-red-500' : ''}
                      />
                      {formErrors.endsAt && <p className="text-red-500 text-xs mt-1">{formErrors.endsAt}</p>}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreate}
                className="bg-amber-700 hover:bg-amber-800"
                disabled={createChallengeMutation.isPending || createPhotoContestMutation.isPending}
              >
                {createChallengeMutation.isPending || createPhotoContestMutation.isPending ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AdminCommunityHub;
