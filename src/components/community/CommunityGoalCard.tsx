
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Coffee, Award, Heart, Recycle, Users } from 'lucide-react';
import { CommunityGoalRow } from '@/types/communityGoals';
import { format, isAfter, parseISO } from 'date-fns';
import { useState } from 'react';

interface CommunityGoalCardProps {
  goal: CommunityGoalRow;
  userPoints: number;
  onContribute: (goalId: string) => void;
  isAdmin?: boolean;
  onEdit?: (goal: CommunityGoalRow) => void;
  onDelete?: (id: string) => void;
}

export default function CommunityGoalCard({ 
  goal, 
  userPoints, 
  onContribute,
  isAdmin = false,
  onEdit,
  onDelete
}: CommunityGoalCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const progressPercentage = Math.min((goal.current_points / goal.target_points) * 100, 100);
  const isExpired = goal.expires_at ? isAfter(new Date(), parseISO(goal.expires_at)) : false;
  const remainingPoints = goal.target_points - goal.current_points;
  
  const getIconComponent = (iconType: string | null) => {
    switch(iconType) {
      case 'users': return <Users className="h-5 w-5 text-amber-700" />;
      case 'award': return <Award className="h-5 w-5 text-amber-700" />;
      case 'recycle': return <Recycle className="h-5 w-5 text-amber-700" />;
      case 'coffee': return <Coffee className="h-5 w-5 text-amber-700" />;
      case 'heart': return <Heart className="h-5 w-5 text-amber-700" />;
      default: return <Coffee className="h-5 w-5 text-amber-700" />;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-amber-100 p-2 rounded-md">
              {getIconComponent(goal.icon)}
            </div>
            <CardTitle className="text-lg">{goal.name}</CardTitle>
          </div>
          {!goal.active && (
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              Inactive
            </span>
          )}
          {isExpired && goal.active && (
            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
              Expired
            </span>
          )}
        </div>
        <CardDescription>
          {isExpanded ? goal.description : goal.description?.substring(0, 80)}
          {goal.description && goal.description.length > 80 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-amber-700 hover:text-amber-800 ml-1 text-sm font-medium"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-amber-900">Progress</span>
            <span className="text-sm font-medium">
              {goal.current_points} / {goal.target_points} points
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="space-y-1 text-sm">
          {goal.reward_description && (
            <div className="flex items-start gap-2">
              <Award className="h-4 w-4 text-amber-700 mt-0.5" />
              <span>Reward: {goal.reward_description}</span>
            </div>
          )}
          
          {goal.expires_at && (
            <div className="flex items-center gap-2">
              <span className="text-amber-700">
                Expires: {format(new Date(goal.expires_at), 'MMM d, yyyy')}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex gap-2 justify-between">
        {isAdmin ? (
          <div className="flex gap-2">
            {onEdit && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit(goal)}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => {
                  if (confirm('Are you sure you want to delete this goal?')) {
                    onDelete(goal.id);
                  }
                }}
              >
                Delete
              </Button>
            )}
          </div>
        ) : (
          <div>
            <span className="text-xs text-amber-600">
              {remainingPoints > 0 
                ? `${remainingPoints} more points needed` 
                : 'Goal reached!'}
            </span>
          </div>
        )}
        
        <Button 
          variant="outline"
          className="bg-amber-700 text-white hover:bg-amber-800"
          disabled={userPoints <= 0 || !goal.active || isExpired || remainingPoints <= 0}
          onClick={() => onContribute(goal.id)}
        >
          Contribute Points
        </Button>
      </CardFooter>
    </Card>
  );
}
