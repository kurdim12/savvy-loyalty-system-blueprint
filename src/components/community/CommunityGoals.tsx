import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Timer } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { CommunityGoalRow, asParam, castDbResult } from '@/integrations/supabase/typeUtils';

const CommunityGoals: React.FC = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []);

  const { data: activeGoals, isLoading } = useQuery({
    queryKey: ['communityGoals', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_goals')
        .select('*')
        .eq('active', true)
        .order('expires_at', { ascending: true });
    
      if (error) throw error;
      return castDbResult<CommunityGoalRow[]>(data);
    }
  });

  const calculateProgress = (goal: CommunityGoalRow): number => {
    return Math.min((goal.current_points / goal.target_points) * 100, 100);
  };

  const timeRemaining = (expiryDate: string | null): string => {
    if (!expiryDate) return 'No Expiry';

    const expiry = new Date(expiryDate);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) {
      return 'Expired';
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Goals</CardTitle>
        <CardDescription>
          Contribute to reach common goals and unlock rewards!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p>Loading community goals...</p>
        ) : activeGoals && activeGoals.length > 0 ? (
          activeGoals.map((goal) => (
            <div key={goal.id} className="border rounded-md p-4">
              <div className="flex items-center space-x-4">
                {goal.icon && (
                  <div className="text-3xl">{goal.icon}</div>
                )}
                <div>
                  <h3 className="text-lg font-semibold">{goal.name}</h3>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{goal.current_points} / {goal.target_points} Points</span>
                  <span className="flex items-center gap-1">
                    <Timer className="h-4 w-4" />
                    {timeRemaining(goal.expires_at)}
                  </span>
                </div>
                <Progress value={calculateProgress(goal)} className="h-2 mt-1" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Reward:</p>
                  <p className="text-sm text-muted-foreground">{goal.reward_description}</p>
                </div>
                <Button variant="outline" size="sm">
                  Contribute
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p>No active community goals at the moment.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CommunityGoals;
