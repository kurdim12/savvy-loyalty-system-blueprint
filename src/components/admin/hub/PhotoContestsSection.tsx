
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Camera, Plus, Edit, Trash2, Eye, Trophy, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PhotoContest {
  id: string;
  title: string;
  description: string;
  theme: string;
  prize: string;
  starts_at: string;
  ends_at: string;
  max_submissions: number;
  active: boolean;
  header_image_url?: string;
  created_at: string;
}

interface Submission {
  id: string;
  title: string;
  description: string;
  image_url: string;
  votes: number;
  user_id: string;
  contest_id: string;
  status: string;
  created_at: string;
}

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

const PhotoContestsSection = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedContest, setSelectedContest] = useState<PhotoContest | null>(null);
  const [submissions, setSubmissions] = useState<(Submission & { user?: UserProfile })[]>([]);
  const [contestForm, setContestForm] = useState({
    title: '',
    description: '',
    theme: '',
    prize: '',
    starts_at: '',
    ends_at: '',
    max_submissions: 100
  });

  const queryClient = useQueryClient();

  // Fetch all photo contests
  const { data: contests = [], isLoading } = useQuery({
    queryKey: ['photo-contests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('photo_contests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PhotoContest[];
    }
  });

  // Create contest mutation
  const createContest = useMutation({
    mutationFn: async (contestData: Omit<PhotoContest, 'id' | 'created_at' | 'active'>) => {
      const { error } = await supabase
        .from('photo_contests')
        .insert([{ ...contestData, active: true }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photo-contests'] });
      toast.success('Photo contest created successfully');
      setIsCreateModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(`Failed to create contest: ${error.message}`);
    }
  });

  // Update contest mutation
  const updateContest = useMutation({
    mutationFn: async (contestData: Partial<PhotoContest> & { id: string }) => {
      const { id, ...updateData } = contestData;
      const { error } = await supabase
        .from('photo_contests')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photo-contests'] });
      toast.success('Photo contest updated successfully');
      setIsEditModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(`Failed to update contest: ${error.message}`);
    }
  });

  // Delete contest mutation
  const deleteContest = useMutation({
    mutationFn: async (contestId: string) => {
      const { error } = await supabase
        .from('photo_contests')
        .delete()
        .eq('id', contestId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photo-contests'] });
      toast.success('Photo contest deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete contest: ${error.message}`);
    }
  });

  // Fetch submissions for a contest
  const fetchSubmissions = async (contestId: string) => {
    try {
      // First get submissions
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('photo_contest_submissions')
        .select('*')
        .eq('contest_id', contestId)
        .order('votes', { ascending: false });

      if (submissionsError) throw submissionsError;

      // Then get user profiles for each submission
      const userIds = submissionsData?.map(s => s.user_id) || [];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Combine data
      const submissionsWithUsers = submissionsData?.map(submission => ({
        ...submission,
        user: profilesData?.find(profile => profile.id === submission.user_id)
      })) || [];

      setSubmissions(submissionsWithUsers);
    } catch (error: any) {
      toast.error(`Failed to fetch submissions: ${error.message}`);
      setSubmissions([]);
    }
  };

  const resetForm = () => {
    setContestForm({
      title: '',
      description: '',
      theme: '',
      prize: '',
      starts_at: '',
      ends_at: '',
      max_submissions: 100
    });
    setSelectedContest(null);
  };

  const handleCreate = () => {
    createContest.mutate(contestForm);
  };

  const handleEdit = (contest: PhotoContest) => {
    setSelectedContest(contest);
    setContestForm({
      title: contest.title,
      description: contest.description || '',
      theme: contest.theme || '',
      prize: contest.prize || '',
      starts_at: contest.starts_at.split('T')[0],
      ends_at: contest.ends_at.split('T')[0],
      max_submissions: contest.max_submissions
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (selectedContest) {
      updateContest.mutate({
        id: selectedContest.id,
        ...contestForm
      });
    }
  };

  const handleView = async (contest: PhotoContest) => {
    setSelectedContest(contest);
    await fetchSubmissions(contest.id);
    setIsViewModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getContestStatus = (contest: PhotoContest) => {
    const now = new Date();
    const start = new Date(contest.starts_at);
    const end = new Date(contest.ends_at);

    if (now < start) return 'upcoming';
    if (now > end) return 'ended';
    return 'active';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Photo Contests
            </CardTitle>
            <CardDescription>
              Manage photo contests to engage your community
            </CardDescription>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Contest
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading contests...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Theme</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Max Submissions</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No photo contests found. Create your first contest to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  contests.map((contest) => {
                    const status = getContestStatus(contest);
                    return (
                      <TableRow key={contest.id}>
                        <TableCell className="font-medium">{contest.title}</TableCell>
                        <TableCell>{contest.theme || 'No theme'}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={status === 'active' ? 'default' : status === 'upcoming' ? 'secondary' : 'outline'}
                          >
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(contest.starts_at)}</TableCell>
                        <TableCell>{formatDate(contest.ends_at)}</TableCell>
                        <TableCell>{contest.max_submissions}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleView(contest)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(contest)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteContest.mutate(contest.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Contest Dialog */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Photo Contest</DialogTitle>
            <DialogDescription>
              Set up a new photo contest for your community
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={contestForm.title}
                onChange={(e) => setContestForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter contest title"
              />
            </div>
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Input
                id="theme"
                value={contestForm.theme}
                onChange={(e) => setContestForm(prev => ({ ...prev, theme: e.target.value }))}
                placeholder="Contest theme"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={contestForm.description}
                onChange={(e) => setContestForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Contest description"
              />
            </div>
            <div>
              <Label htmlFor="prize">Prize</Label>
              <Input
                id="prize"
                value={contestForm.prize}
                onChange={(e) => setContestForm(prev => ({ ...prev, prize: e.target.value }))}
                placeholder="Contest prize"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start">Start Date</Label>
                <Input
                  id="start"
                  type="date"
                  value={contestForm.starts_at}
                  onChange={(e) => setContestForm(prev => ({ ...prev, starts_at: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="end">End Date</Label>
                <Input
                  id="end"
                  type="date"
                  value={contestForm.ends_at}
                  onChange={(e) => setContestForm(prev => ({ ...prev, ends_at: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="maxSub">Max Submissions</Label>
              <Input
                id="maxSub"
                type="number"
                value={contestForm.max_submissions}
                onChange={(e) => setContestForm(prev => ({ ...prev, max_submissions: parseInt(e.target.value) || 100 }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createContest.isPending}>
              {createContest.isPending ? 'Creating...' : 'Create Contest'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Contest Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Photo Contest</DialogTitle>
            <DialogDescription>
              Update contest details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={contestForm.title}
                onChange={(e) => setContestForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter contest title"
              />
            </div>
            <div>
              <Label htmlFor="edit-theme">Theme</Label>
              <Input
                id="edit-theme"
                value={contestForm.theme}
                onChange={(e) => setContestForm(prev => ({ ...prev, theme: e.target.value }))}
                placeholder="Contest theme"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={contestForm.description}
                onChange={(e) => setContestForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Contest description"
              />
            </div>
            <div>
              <Label htmlFor="edit-prize">Prize</Label>
              <Input
                id="edit-prize"
                value={contestForm.prize}
                onChange={(e) => setContestForm(prev => ({ ...prev, prize: e.target.value }))}
                placeholder="Contest prize"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-start">Start Date</Label>
                <Input
                  id="edit-start"
                  type="date"
                  value={contestForm.starts_at}
                  onChange={(e) => setContestForm(prev => ({ ...prev, starts_at: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-end">End Date</Label>
                <Input
                  id="edit-end"
                  type="date"
                  value={contestForm.ends_at}
                  onChange={(e) => setContestForm(prev => ({ ...prev, ends_at: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-maxSub">Max Submissions</Label>
              <Input
                id="edit-maxSub"
                type="number"
                value={contestForm.max_submissions}
                onChange={(e) => setContestForm(prev => ({ ...prev, max_submissions: parseInt(e.target.value) || 100 }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateContest.isPending}>
              {updateContest.isPending ? 'Updating...' : 'Update Contest'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Contest Submissions Dialog */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedContest?.title} - Submissions</DialogTitle>
            <DialogDescription>
              View and manage contest submissions
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {submissions.length === 0 ? (
              <div className="text-center py-8">
                <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No submissions yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Participant</TableHead>
                    <TableHead>Votes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.title}</TableCell>
                      <TableCell>
                        {submission.user ? 
                          `${submission.user.first_name || ''} ${submission.user.last_name || ''}`.trim() || 
                          submission.user.email :
                          'Unknown User'
                        }
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          <Trophy className="h-3 w-3 mr-1" />
                          {submission.votes}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={submission.status === 'approved' ? 'default' : 'secondary'}>
                          {submission.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(submission.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotoContestsSection;
