
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Download, Image, Check, X, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const PhotoContestsSection = () => {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedContest, setSelectedContest] = useState<any>(null);
  const [showSubmissions, setShowSubmissions] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    theme: '',
    prize: '',
    ends_at: '',
    max_submissions: 100
  });

  const { data: contests = [], isLoading } = useQuery({
    queryKey: ['admin-photo-contests-detailed'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('photo_contests')
        .select(`
          *,
          photo_contest_submissions (
            id,
            status,
            votes,
            user_id,
            title,
            image_url
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data?.map(contest => ({
        ...contest,
        submission_count: contest.photo_contest_submissions?.length || 0,
        approved_submissions: contest.photo_contest_submissions?.filter((s: any) => s.status === 'approved').length || 0,
        total_votes: contest.photo_contest_submissions?.reduce((sum: number, s: any) => sum + (s.votes || 0), 0) || 0
      })) || [];
    }
  });

  const { data: submissions = [] } = useQuery({
    queryKey: ['contest-submissions', selectedContest?.id],
    queryFn: async () => {
      if (!selectedContest?.id) return [];
      
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('photo_contest_submissions')
        .select('*')
        .eq('contest_id', selectedContest.id)
        .order('votes', { ascending: false });
      
      if (submissionsError) throw submissionsError;
      
      // Get user details separately
      const userIds = submissionsData?.map(s => s.user_id) || [];
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .in('id', userIds);
      
      if (usersError) throw usersError;
      
      // Combine submissions with user data
      return submissionsData?.map(submission => ({
        ...submission,
        user: usersData?.find(user => user.id === submission.user_id)
      })) || [];
    },
    enabled: !!selectedContest?.id
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('photo_contests')
        .insert({
          title: data.title,
          description: data.description,
          theme: data.theme,
          prize: data.prize,
          ends_at: data.ends_at,
          max_submissions: data.max_submissions,
          active: true
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-photo-contests-detailed'] });
      toast.success('Photo contest created successfully!');
      setIsCreateOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error('Failed to create photo contest');
    }
  });

  const updateSubmissionMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('photo_contest_submissions')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contest-submissions'] });
      toast.success('Submission updated successfully!');
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      theme: '',
      prize: '',
      ends_at: '',
      max_submissions: 100
    });
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.ends_at) {
      toast.error('Please fill in all required fields');
      return;
    }
    createMutation.mutate(formData);
  };

  const exportWinners = (contest: any) => {
    const winners = submissions
      .filter(s => s.status === 'approved')
      .slice(0, 3)
      .map((submission, index) => ({
        Rank: index + 1,
        Title: submission.title,
        'User Name': submission.user ? `${submission.user.first_name || ''} ${submission.user.last_name || ''}`.trim() : 'Unknown',
        Email: submission.user?.email || 'Unknown',
        Votes: submission.votes,
        'Image URL': submission.image_url
      }));
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + Object.keys(winners[0] || {}).join(",") + "\n"
      + winners.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${contest.title}_winners.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Winners exported to CSV!');
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading photo contests...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Photo Contests</h2>
          <p className="text-gray-500">Manage photo contests and submissions</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
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
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <Textarea
                placeholder="Contest description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <Input
                placeholder="Contest theme"
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
              />
              <Input
                placeholder="Prize description"
                value={formData.prize}
                onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Max submissions"
                  min="1"
                  value={formData.max_submissions}
                  onChange={(e) => setFormData({ ...formData, max_submissions: parseInt(e.target.value) || 100 })}
                />
                <Input
                  type="datetime-local"
                  value={formData.ends_at}
                  onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                />
              </div>
              <Button 
                onClick={handleSubmit} 
                disabled={createMutation.isPending}
                className="w-full"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Contest'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Photo Contests</CardTitle>
          <CardDescription>Manage contests and review submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contest</TableHead>
                <TableHead>Theme</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Total Votes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contests.map((contest) => (
                <TableRow key={contest.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{contest.title}</div>
                      <div className="text-sm text-gray-500">
                        Ends: {new Date(contest.ends_at).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{contest.theme || 'No theme'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Image className="h-3 w-3" />
                      {contest.approved_submissions}/{contest.submission_count}
                    </div>
                  </TableCell>
                  <TableCell>{contest.total_votes}</TableCell>
                  <TableCell>
                    <Badge variant={contest.active ? "default" : "secondary"}>
                      {contest.active ? "Active" : "Ended"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedContest(contest);
                          setShowSubmissions(true);
                        }}
                      >
                        View Submissions
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportWinners(contest)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Submissions Dialog */}
      <Dialog open={showSubmissions} onOpenChange={setShowSubmissions}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Contest Submissions: {selectedContest?.title}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 max-h-96 overflow-y-auto">
            {submissions.map((submission) => (
              <div key={submission.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <img 
                  src={submission.image_url} 
                  alt={submission.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{submission.title}</h4>
                  <p className="text-sm text-gray-500">
                    {submission.user ? `${submission.user.first_name || ''} ${submission.user.last_name || ''}`.trim() : 'Unknown User'}
                  </p>
                  <p className="text-sm">Votes: {submission.votes}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={
                    submission.status === 'approved' ? 'default' :
                    submission.status === 'rejected' ? 'destructive' : 'secondary'
                  }>
                    {submission.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateSubmissionMutation.mutate({ 
                      id: submission.id, 
                      status: 'approved' 
                    })}
                    disabled={submission.status === 'approved'}
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateSubmissionMutation.mutate({ 
                      id: submission.id, 
                      status: 'rejected' 
                    })}
                    disabled={submission.status === 'rejected'}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotoContestsSection;
