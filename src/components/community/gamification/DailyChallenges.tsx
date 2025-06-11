import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Star, Gift } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ChallengeWithCompletion {
  id: string;
  title: string;
  description: string;
  reward: string;
  target: number;
  type: string;
  expires_at: string;
  completed?: boolean;
  current_progress?: number;
}

export const DailyChallenges = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch active challenges
  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ['challenges', user?.id],
    queryFn: async () => {
      const { data: challengesData, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('active', true)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (!user?.id) return challengesData;

      // Check which challenges the user has completed
      const challengeIds = challengesData.map(c => c.id);
      const { data: participations } = await supabase
        .from('challenge_participants')
        .select('challenge_id, current_progress, completed')
        .in('challenge_id', challengeIds)
        .eq('user_id', user.id);
      
      const participationMap = new Map(
        participations?.map(p => [p.challenge_id, p]) || []
      );
      
      return challengesData.map(challenge => ({
        ...challenge,
        completed: participationMap.get(challenge.id)?.completed || false,
        current_progress: participationMap.get(challenge.id)?.current_progress || 0
      })) as ChallengeWithCompletion[];
    },
    enabled: !!user?.id,
  });

  // Fetch user's challenge stats
  const { data: stats } = useQuery({
    queryKey: ['challenge-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return { totalCompleted: 0, pointsEarned: 0 };
      
      const { data, error } = await supabase
        .from('challenge_participants')
        .select('completed')
        .eq('user_id', user.id)
        .eq('completed', true);
      
      if (error) throw error;
      
      const totalCompleted = data.length;
      const pointsEarned = totalCompleted * 50; // Assume 50 points per challenge
      
      return { totalCompleted, pointsEarned };
    },
    enabled: !!user?.id,
  });

  // Complete challenge
  const completeChallenge = useMutation({
    mutationFn: async (challengeId: string) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      // Insert or update challenge participation
      const { error } = await supabase
        .from('challenge_participants')
        .upsert({
          user_id: user.id,
          challenge_id: challengeId,
          completed: true,
          completed_at: new Date().toISOString(),
          current_progress: challenges.find(c => c.id === challengeId)?.target || 1
        });
      
      if (error) throw error;
    },
    onSuccess: (_, challengeId) => {
      const challenge = challenges.find(c => c.id === challengeId);
      toast.success(`Challenge completed! You earned points!`);
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['challenge-stats'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to complete challenge');
    }
  });

  const completedToday = challenges.filter(c => c.completed).length;
  const totalToday = challenges.length;
  const progressPercentage = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Loading challenges...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#8B4513]">
            <Star className="h-5 w-5" />
            Challenge Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Active Challenges</span>
            <span>{completedToday}/{totalToday} completed</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          
          {stats && (
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#8B4513]">{stats.totalCompleted}</p>
                <p className="text-sm text-muted-foreground">Total Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#8B4513]">{stats.pointsEarned}</p>
                <p className="text-sm text-muted-foreground">Points Earned</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#8B4513]">
            <Clock className="h-5 w-5" />
            Active Challenges
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {challenges.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No active challenges available. Check back soon!
            </p>
          ) : (
            challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`p-4 border rounded-lg ${
                  challenge.completed ? 'bg-green-50 border-green-200' : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{challenge.title}</h4>
                      {challenge.completed && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {challenge.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[#8B4513] text-white">
                        <Gift className="h-3 w-3 mr-1" />
                        {challenge.reward}
                      </Badge>
                      <Badge variant="outline">
                        {challenge.type}
                      </Badge>
                    </div>
                    {!challenge.completed && challenge.current_progress !== undefined && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{challenge.current_progress}/{challenge.target}</span>
                        </div>
                        <Progress 
                          value={(challenge.current_progress / challenge.target) * 100} 
                          className="h-1" 
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    {challenge.completed ? (
                      <Badge className="bg-green-600 text-white">
                        Completed
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => completeChallenge.mutate(challenge.id)}
                        disabled={completeChallenge.isPending}
                        className="bg-[#8B4513] hover:bg-[#8B4513]/90"
                      >
                        {completeChallenge.isPending ? 'Completing...' : 'Complete'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
