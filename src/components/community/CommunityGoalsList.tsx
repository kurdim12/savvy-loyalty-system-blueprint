
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useActiveCommunityGoals, useCommunityGoals, useContributeToGoal } from '@/hooks/useCommunityGoals';
import CommunityGoalCard from './CommunityGoalCard';
import ContributeGoalDialog from './ContributeGoalDialog';
import { CommunityGoalRow } from '@/types/communityGoals';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface CommunityGoalsListProps {
  isAdminView?: boolean;
  onEditGoal?: (goal: CommunityGoalRow) => void;
  onDeleteGoal?: (id: string) => void;
}

export default function CommunityGoalsList({ 
  isAdminView = false,
  onEditGoal,
  onDeleteGoal
}: CommunityGoalsListProps) {
  const { user, profile } = useAuth();
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [selectedGoalName, setSelectedGoalName] = useState<string>('');
  const [contributeDialogOpen, setContributeDialogOpen] = useState(false);
  
  // Use the appropriate query based on whether this is the admin view
  const { data: goals, isLoading, isError } = isAdminView 
    ? useCommunityGoals()
    : useActiveCommunityGoals();
  
  const { mutate: contributeToGoal } = useContributeToGoal();
  
  const userPoints = profile?.current_points || 0;
  
  const handleContributeClick = (goalId: string) => {
    const goal = goals?.find(g => g.id === goalId);
    if (goal) {
      setSelectedGoalId(goalId);
      setSelectedGoalName(goal.name);
      setContributeDialogOpen(true);
    }
  };
  
  const handleContribute = (points: number) => {
    if (user?.id && selectedGoalId) {
      contributeToGoal({
        userId: user.id,
        goalId: selectedGoalId,
        points,
      });
      setContributeDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-700 border-t-transparent"></div>
      </div>
    );
  }

  if (isError || !goals) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load community goals. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (goals.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-600">No community goals available</h3>
        <p className="text-sm text-gray-500">
          {isAdminView 
            ? 'Create a new goal to get started' 
            : 'Check back later for new opportunities to contribute'}
        </p>
      </div>
    );
  }

  if (isAdminView) {
    // Admin view shows all goals in a single list
    return (
      <div className="space-y-6">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <CommunityGoalCard
              key={goal.id}
              goal={goal}
              userPoints={userPoints}
              onContribute={handleContributeClick}
              isAdmin={true}
              onEdit={onEditGoal}
              onDelete={onDeleteGoal}
            />
          ))}
        </div>

        {selectedGoalId && (
          <ContributeGoalDialog
            open={contributeDialogOpen}
            onOpenChange={setContributeDialogOpen}
            goalId={selectedGoalId}
            goalName={selectedGoalName}
            userPoints={userPoints}
            onContribute={handleContribute}
          />
        )}
      </div>
    );
  }
  
  // User view with active/completed tabs
  return (
    <div className="space-y-4">
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Goals</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="pt-4">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {goals
              .filter(goal => goal.active && goal.current_points < goal.target_points)
              .map((goal) => (
                <CommunityGoalCard
                  key={goal.id}
                  goal={goal}
                  userPoints={userPoints}
                  onContribute={handleContributeClick}
                />
              ))}
          </div>
          {goals.filter(goal => goal.active && goal.current_points < goal.target_points).length === 0 && (
            <p className="text-center py-4 text-amber-700">No active community goals at the moment.</p>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="pt-4">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {goals
              .filter(goal => goal.current_points >= goal.target_points)
              .map((goal) => (
                <CommunityGoalCard
                  key={goal.id}
                  goal={goal}
                  userPoints={userPoints}
                  onContribute={handleContributeClick}
                />
              ))}
          </div>
          {goals.filter(goal => goal.current_points >= goal.target_points).length === 0 && (
            <p className="text-center py-4 text-amber-700">No completed community goals yet.</p>
          )}
        </TabsContent>
      </Tabs>
      
      {selectedGoalId && (
        <ContributeGoalDialog
          open={contributeDialogOpen}
          onOpenChange={setContributeDialogOpen}
          goalId={selectedGoalId}
          goalName={selectedGoalName}
          userPoints={userPoints}
          onContribute={handleContribute}
        />
      )}
    </div>
  );
}
