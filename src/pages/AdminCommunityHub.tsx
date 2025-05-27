
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
  Target
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

  // Form states
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

  // Fetch challenges
  const { data: challenges = [], isLoading: challengesLoading } = useQuery({
    queryKey: ['admin-challenges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch photo contests
  const { data: photoContests = [], isLoading: contestsLoading } = useQuery({
    queryKey: ['admin-photo-contests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('photo_contests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Create challenge mutation
  const createChallengeMutation = useMutation({
    mutationFn: async (data: any) => {
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
      toast.success('Challenge created successfully!');
      resetForm();
    },
    onError: () => {
      toast.error('Failed to create challenge');
    }
  });

  // Create photo contest mutation
  const createPhotoContestMutation = useMutation({
    mutationFn: async (data: any) => {
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
      toast.success('Photo contest created successfully!');
      resetForm();
    },
    onError: () => {
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
    setIsCreateDialogOpen(false);
    setEditingItem(null);
  };

  const handleCreate = () => {
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

  return (
    <Layout adminOnly>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-amber-900">Community Hub Management</h1>
            <p className="text-amber-700">Manage challenges, photo contests, and community activities</p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-amber-700 hover:bg-amber-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Button>
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
                  <div className="text-center py-8">Loading challenges...</div>
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
                  <div className="text-center py-8">Loading photo contests...</div>
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
                              <span><Users className="inline h-3 w-3 mr-1" />Max: {contest.max_submissions}</span>
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
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter title"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter description"
                />
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
                      <label className="text-sm font-medium">Target</label>
                      <Input
                        type="number"
                        value={formData.target}
                        onChange={(e) => setFormData({...formData, target: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Reward</label>
                      <Input
                        value={formData.reward}
                        onChange={(e) => setFormData({...formData, reward: e.target.value})}
                        placeholder="e.g. 50 bonus points"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Expires At</label>
                      <Input
                        type="datetime-local"
                        value={formData.expiresAt}
                        onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'photo-contests' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Theme</label>
                      <Input
                        value={formData.theme}
                        onChange={(e) => setFormData({...formData, theme: e.target.value})}
                        placeholder="e.g. Morning Coffee"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Prize</label>
                      <Input
                        value={formData.prize}
                        onChange={(e) => setFormData({...formData, prize: e.target.value})}
                        placeholder="e.g. Free coffee for a week"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Max Submissions</label>
                      <Input
                        type="number"
                        value={formData.maxSubmissions}
                        onChange={(e) => setFormData({...formData, maxSubmissions: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Ends At</label>
                      <Input
                        type="datetime-local"
                        value={formData.endsAt}
                        onChange={(e) => setFormData({...formData, endsAt: e.target.value})}
                      />
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
                disabled={!formData.title || !formData.description}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AdminCommunityHub;
