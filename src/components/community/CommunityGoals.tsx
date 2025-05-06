
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress'; 
import { Button } from '@/components/ui/button';
import { Users, Award, Recycle, Coffee, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import ContributeGoalDialog from './ContributeGoalDialog';
import { toast } from 'sonner';

// Define CommunityGoal interface explicitly, not depending on Database type
interface CommunityGoal {
  id: string;
  name: string;
  description: string;
  target_points: number;
  current_points: number;
  expires_at: string;
  reward_description: string;
  icon: 'users' | 'award' | 'recycle' | 'coffee' | 'heart';
  active?: boolean;
}

export default function CommunityGoals() {
  const [goals, setGoals] = useState<CommunityGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState<CommunityGoal | null>(null);
  const [contributeDialogOpen, setContributeDialogOpen] = useState(false);
  const { user, profile, refreshProfile } = useAuth();

  useEffect(() => {
    const fetchCommunityGoals = async () => {
      try {
        const { data, error } = await supabase
          .from('community_goals')
          .select('*')
          .eq('active', true);

        if (error) throw error;

        if (data) {
          // Type assertion because we know the shape
          const formattedGoals = (data as any[]).map(goal => ({
            ...goal,
            icon: goal.icon as 'users' | 'award' | 'recycle' | 'coffee' | 'heart'
          }));
          
          setGoals(formattedGoals);
        }
      } catch (error) {
        console.error('Error fetching community goals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchCommunityGoals();
    }
    
    // Set up realtime subscription for updates
    const channel = supabase
      .channel('community_goals_changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'community_goals' },
        (payload) => {
          // Update the goal that changed
          setGoals(currentGoals => 
            currentGoals.map(goal => 
              goal.id === payload.new.id 
                ? { ...goal, ...payload.new as any, icon: (payload.new as any).icon as any } 
                : goal
            )
          );
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const getIconComponent = (iconType: string) => {
    switch(iconType) {
      case 'users': return <Users className="h-8 w-8 text-amber-700" />;
      case 'award': return <Award className="h-8 w-8 text-amber-700" />;
      case 'recycle': return <Recycle className="h-8 w-8 text-amber-700" />;
      case 'coffee': return <Coffee className="h-8 w-8 text-amber-700" />;
      case 'heart': return <Heart className="h-8 w-8 text-amber-700" />;
      default: return <Coffee className="h-8 w-8 text-amber-700" />;
    }
  };

  const handleContributeClick = (goal: CommunityGoal) => {
    if (!user) {
      toast.error('You need to be signed in to contribute to community goals');
      return;
    }
    
    setSelectedGoal(goal);
    setContributeDialogOpen(true);
  };

  const handleContributeSuccess = () => {
    refreshProfile();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-700 border-t-transparent"></div>
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Community Challenges</CardTitle>
          <CardDescription>No active community challenges at this time.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-amber-700 py-8">
            Check back soon for new opportunities to participate in community challenges!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-amber-700" />
          Community Challenges
        </CardTitle>
        <CardDescription>
          Contribute to community goals and earn rewards together
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = Math.min((goal.current_points / goal.target_points) * 100, 100);
            const daysLeft = Math.max(0, Math.ceil((new Date(goal.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
            
            return (
              <div key={goal.id} className="border rounded-lg p-4">
                <div className="flex items-start">
                  <div className="bg-amber-100 p-3 rounded-lg mr-4">
                    {getIconComponent(goal.icon)}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold">{goal.name}</h4>
                    <p className="text-sm text-amber-700 mb-2">{goal.description}</p>
                    
                    <div className="space-y-2 mt-3">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{goal.current_points} / {goal.target_points} pts</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-amber-700">{daysLeft} days left</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-xs border-amber-700 text-amber-800 hover:bg-amber-50"
                          onClick={() => handleContributeClick(goal)}
                        >
                          Contribute Points
                        </Button>
                      </div>
                      <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded block mt-2">
                        Reward: {goal.reward_description}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      
      {selectedGoal && (
        <ContributeGoalDialog
          open={contributeDialogOpen}
          onOpenChange={setContributeDialogOpen}
          goalId={selectedGoal.id}
          goalName={selectedGoal.name}
          userPoints={profile?.current_points || 0}
          onContribute={handleContributeSuccess}
        />
      )}
    </Card>
  );
}
