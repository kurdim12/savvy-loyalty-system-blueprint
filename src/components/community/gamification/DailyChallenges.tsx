
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

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward_points: number;
  challenge_date: string;
  completed?: boolean;
}

export const DailyChallenges = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch today's challenges
  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ['daily-challenges', user?.id],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: challengesData, error } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('challenge_date', today);
      
      if (error) throw error;
      
      if (!user?.id) return challengesData;

      // Check which challenges the user has completed
      const challengeIds = challengesData.map(c => c.id);
      const { data: completions } = await supabase
        .from('user_challenge_completions')
        .select('challenge_id')
        .in('challenge_id', challengeIds)
        .eq('user_id', user.id);
      
      const completedIds = new Set(completions?.map(c => c.challenge_id) || []);
      
      return challengesData.map(challenge => ({
        ...challenge,
        completed: completedIds.has(challenge.id)
      })) as Challenge[];
    },
    enabled: !!user?.id,
  });

  // Fetch user's challenge stats
  const { data: stats } = useQuery({
    queryKey: ['challenge-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return { totalCompleted: 0, pointsEarned: 0 };
      
      const { data, error } = await supabase
        .from('user_challenge_completions')
        .select(`
          challenge_id,
          daily_challenges (reward_points)
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const totalCompleted = data.length;
      const pointsEarned = data.reduce((sum, completion) => {
        return sum + (completion.daily_challenges?.reward_points || 0);
      }, 0);
      
      return { totalCompleted, pointsEarned };
    },
    enabled: !!user?.id,
  });

  // Complete challenge
  const completeChallenge = useMutation({
    mutationFn: async (challengeId: string) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('user_challenge_completions')
        .insert({
          user_id: user.id,
          challenge_id: challengeId
        });
      
      if (error) throw error;
    },
    onSuccess: (_, challengeId) => {
      const challenge = challenges.find(c => c.id === challengeId);
      toast.success(`Challenge completed! You earned ${challenge?.reward_points} points!`);
      queryClient.invalidateQueries({ queryKey: ['daily-challenges'] });
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
            Daily Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Today's Challenges</span>
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

      {/* Today's Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#8B4513]">
            <Clock className="h-5 w-5" />
            Today's Challenges
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {challenges.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No challenges available today. Check back tomorrow!
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
                    <Badge className="bg-[#8B4513] text-white">
                      <Gift className="h-3 w-3 mr-1" />
                      {challenge.reward_points} points
                    </Badge>
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
