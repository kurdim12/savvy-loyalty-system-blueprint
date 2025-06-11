
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BarChart3, Plus, Clock, Users, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Poll {
  id: string;
  title: string;
  description: string;
  options: string[];
  created_by: string;
  expires_at: string;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
  votes?: { option_index: number; count: number }[];
  userVote?: number;
  totalVotes?: number;
}

export const CommunityPolls = () => {
  const { user } = useAuth();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPoll, setNewPoll] = useState({
    title: '',
    description: '',
    options: ['', ''],
    expiresAt: ''
  });
  const queryClient = useQueryClient();

  // Fetch polls
  const { data: polls = [], isLoading } = useQuery({
    queryKey: ['community-polls', user?.id],
    queryFn: async () => {
      const { data: pollsData, error } = await supabase
        .from('polls')
        .select(`
          *,
          profiles:created_by (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Get vote counts and user votes
      const pollIds = pollsData.map(p => p.id);
      const { data: votes } = await supabase
        .from('poll_votes')
        .select('poll_id, option_index, user_id')
        .in('poll_id', pollIds);
      
      const voteCounts = votes?.reduce((acc, vote) => {
        if (!acc[vote.poll_id]) acc[vote.poll_id] = {};
        acc[vote.poll_id][vote.option_index] = (acc[vote.poll_id][vote.option_index] || 0) + 1;
        return acc;
      }, {} as Record<string, Record<number, number>>) || {};
      
      const userVotes = user?.id ? votes?.filter(v => v.user_id === user.id) : [];
      const userVoteMap = userVotes?.reduce((acc, vote) => {
        acc[vote.poll_id] = vote.option_index;
        return acc;
      }, {} as Record<string, number>) || {};
      
      return pollsData.map(poll => {
        const pollVotes = voteCounts[poll.id] || {};
        const totalVotes = Object.values(pollVotes).reduce((sum, count) => sum + count, 0);
        const voteData = poll.options.map((_, index) => ({
          option_index: index,
          count: pollVotes[index] || 0
        }));
        
        return {
          ...poll,
          votes: voteData,
          userVote: userVoteMap[poll.id],
          totalVotes
        };
      }) as Poll[];
    },
  });

  // Create poll
  const createPoll = useMutation({
    mutationFn: async (pollData: typeof newPoll) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('polls')
        .insert({
          title: pollData.title,
          description: pollData.description,
          options: pollData.options.filter(opt => opt.trim()),
          created_by: user.id,
          expires_at: pollData.expiresAt || null
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Poll created successfully!');
      setNewPoll({
        title: '',
        description: '',
        options: ['', ''],
        expiresAt: ''
      });
      setShowCreateDialog(false);
      queryClient.invalidateQueries({ queryKey: ['community-polls'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create poll');
    }
  });

  // Vote on poll
  const vote = useMutation({
    mutationFn: async ({ pollId, optionIndex }: { pollId: string; optionIndex: number }) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('poll_votes')
        .insert({
          poll_id: pollId,
          user_id: user.id,
          option_index: optionIndex
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Vote recorded!');
      queryClient.invalidateQueries({ queryKey: ['community-polls'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to vote');
    }
  });

  const addOption = () => {
    setNewPoll(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const updateOption = (index: number, value: string) => {
    setNewPoll(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const removeOption = (index: number) => {
    if (newPoll.options.length > 2) {
      setNewPoll(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const isExpired = (expiresAt: string) => {
    return expiresAt && new Date(expiresAt) < new Date();
  };

  const formatTimeLeft = (expiresAt: string) => {
    if (!expiresAt) return 'No expiry';
    
    const expiry = new Date(expiresAt);
    const now = new Date();
    const diffInHours = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 0) return 'Expired';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h left`;
    return `${Math.floor(diffInHours / 24)}d left`;
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 16);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[#8B4513]">
              <BarChart3 className="h-5 w-5" />
              Community Polls
            </CardTitle>
            
            {user && (
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-[#8B4513] hover:bg-[#8B4513]/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Poll
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create a Poll</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Poll Question</label>
                      <Input
                        placeholder="What's your favorite coffee origin?"
                        value={newPoll.title}
                        onChange={(e) => setNewPoll(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description (optional)</label>
                      <Textarea
                        placeholder="Add more context..."
                        value={newPoll.description}
                        onChange={(e) => setNewPoll(prev => ({ ...prev, description: e.target.value }))}
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Options</label>
                      {newPoll.options.map((option, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Input
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                          />
                          {newPoll.options.length > 2 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeOption(index)}
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      ))}
                      {newPoll.options.length < 6 && (
                        <Button variant="outline" size="sm" onClick={addOption}>
                          Add Option
                        </Button>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Expires At (optional)</label>
                      <Input
                        type="datetime-local"
                        min={getTomorrowDate()}
                        value={newPoll.expiresAt}
                        onChange={(e) => setNewPoll(prev => ({ ...prev, expiresAt: e.target.value }))}
                      />
                    </div>
                    <Button
                      onClick={() => createPoll.mutate(newPoll)}
                      disabled={
                        createPoll.isPending || 
                        !newPoll.title || 
                        newPoll.options.filter(opt => opt.trim()).length < 2
                      }
                      className="w-full bg-[#8B4513] hover:bg-[#8B4513]/90"
                    >
                      {createPoll.isPending ? 'Creating...' : 'Create Poll'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Ask the community questions and see what everyone thinks!
          </p>
        </CardContent>
      </Card>

      {/* Polls List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Loading polls...</p>
            </CardContent>
          </Card>
        ) : polls.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                No polls yet. Create the first one!
              </p>
            </CardContent>
          </Card>
        ) : (
          polls.map((poll) => {
            const expired = isExpired(poll.expires_at);
            const hasVoted = poll.userVote !== undefined;
            
            return (
              <Card key={poll.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Poll header */}
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-[#8B4513] text-white">
                          {getInitials(poll.profiles.first_name, poll.profiles.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">
                            {poll.profiles.first_name} {poll.profiles.last_name}
                          </p>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(poll.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg">{poll.title}</h3>
                        {poll.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {poll.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Poll stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {poll.totalVotes || 0} votes
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatTimeLeft(poll.expires_at)}
                      </div>
                      {expired && (
                        <Badge variant="destructive">Expired</Badge>
                      )}
                      {hasVoted && (
                        <Badge className="bg-green-600 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Voted
                        </Badge>
                      )}
                    </div>

                    {/* Poll options */}
                    <div className="space-y-3">
                      {poll.options.map((option, index) => {
                        const votes = poll.votes?.find(v => v.option_index === index)?.count || 0;
                        const percentage = poll.totalVotes ? (votes / poll.totalVotes) * 100 : 0;
                        const isUserChoice = poll.userVote === index;
                        
                        return (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Button
                                variant={hasVoted || expired ? "ghost" : "outline"}
                                className={`justify-start text-left flex-1 ${
                                  isUserChoice ? 'bg-[#8B4513]/10 border-[#8B4513]' : ''
                                }`}
                                onClick={() => {
                                  if (!hasVoted && !expired && user) {
                                    vote.mutate({ pollId: poll.id, optionIndex: index });
                                  }
                                }}
                                disabled={hasVoted || expired || !user || vote.isPending}
                              >
                                <span className="flex-1">{option}</span>
                                {hasVoted && (
                                  <span className="ml-2 text-sm text-muted-foreground">
                                    {votes} ({percentage.toFixed(1)}%)
                                  </span>
                                )}
                                {isUserChoice && (
                                  <CheckCircle className="h-4 w-4 ml-2 text-[#8B4513]" />
                                )}
                              </Button>
                            </div>
                            {hasVoted && (
                              <Progress value={percentage} className="h-2" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {!user && (
                      <p className="text-sm text-muted-foreground text-center">
                        Sign in to vote on polls
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
