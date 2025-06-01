import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Plus, Trash2, Users, Calendar, Image, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import ContestTemplates from './contests/ContestTemplates';

const PhotoContestsSection = () => {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  
  // Contest form state
  const [contestForm, setContestForm] = useState({
    title: '',
    description: '',
    theme: '',
    prize: '',
    ends_at: '',
    max_submissions: 100
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
      setIsCreateOpen(false);
      setShowTemplates(false);
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

  const handleSelectTemplate = (template: any) => {
    const duration = template.duration;
    let daysToAdd = 7; // default
    
    if (duration.includes('week')) {
      const weeks = parseInt(duration) || 1;
      daysToAdd = weeks * 7;
    } else if (duration.includes('month')) {
      daysToAdd = 30;
    }
    
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + daysToAdd);
    
    setContestForm({
      title: template.title,
      description: template.description,
      theme: template.theme,
      prize: template.suggestedPrize,
      ends_at: endDate.toISOString().slice(0, 16),
      max_submissions: 100
    });
    setShowTemplates(false);
  };

  const getDefaultDateTime = () => {
    const now = new Date();
    now.setDate(now.getDate() + 14);
    return now.toISOString().slice(0, 16);
  };

  if (contestsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
        <span className="ml-3 text-amber-800">Loading photo contests...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-amber-900">Photo Contests</h2>
          <p className="text-amber-700">Create engaging photo contests to showcase community creativity</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-700 hover:bg-amber-800 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Contest
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Photo Contest</DialogTitle>
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
                <ContestTemplates onSelectTemplate={handleSelectTemplate} />
              </TabsContent>
              
              <TabsContent value="manual" className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium">Contest Title*</label>
                  <Input
                    placeholder="Enter contest title"
                    value={contestForm.title}
                    onChange={(e) => setContestForm({ ...contestForm, title: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Describe the contest"
                    value={contestForm.description}
                    onChange={(e) => setContestForm({ ...contestForm, description: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Theme</label>
                    <Input
                      placeholder="e.g., Latte Art"
                      value={contestForm.theme}
                      onChange={(e) => setContestForm({ ...contestForm, theme: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Prize Description</label>
                    <Input
                      placeholder="Describe the prize"
                      value={contestForm.prize}
                      onChange={(e) => setContestForm({ ...contestForm, prize: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Max Submissions</label>
                    <Input
                      type="number"
                      placeholder="100"
                      min="1"
                      value={contestForm.max_submissions}
                      onChange={(e) => setContestForm({ ...contestForm, max_submissions: parseInt(e.target.value) || 100 })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Ends At*</label>
                    <Input
                      type="datetime-local"
                      value={contestForm.ends_at || getDefaultDateTime()}
                      onChange={(e) => setContestForm({ ...contestForm, ends_at: e.target.value })}
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={() => createContestMutation.mutate(contestForm)} 
                  disabled={createContestMutation.isPending}
                  className="w-full bg-amber-700 hover:bg-amber-800 text-white"
                >
                  {createContestMutation.isPending ? 'Creating...' : 'Create Contest'}
                </Button>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {contests.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg border border-amber-200">
            <Camera className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-amber-900 mb-2">No photo contests yet</h4>
            <p className="text-amber-700">Create your first photo contest to showcase community creativity!</p>
          </div>
        ) : (
          contests.map((contest) => (
            <div key={contest.id} className="bg-white rounded-lg border border-amber-200 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="font-semibold text-amber-900 text-lg">{contest.title}</h4>
                    <Badge variant={contest.active ? "default" : "secondary"}>
                      {contest.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-amber-700 mb-3">{contest.description}</p>
                  <div className="grid grid-cols-4 gap-4 text-sm text-amber-800">
                    <div className="flex items-center gap-1">
                      <Image className="h-4 w-4" />
                      <span><span className="font-medium">Theme:</span> {contest.theme || 'No theme'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Camera className="h-4 w-4" />
                      <span><span className="font-medium">Prize:</span> {contest.prize || 'No prize set'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span><span className="font-medium">Submissions:</span> {contest.submission_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span><span className="font-medium">Ends:</span> {new Date(contest.ends_at).toLocaleDateString()}</span>
                    </div>
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
    </div>
  );
};

export default PhotoContestsSection;
