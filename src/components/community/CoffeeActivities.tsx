
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Coffee, Trophy, Target, Clock, Star, Book, Users } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  description: string;
  type: 'trivia' | 'tasting' | 'brewing' | 'social' | 'learning';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // in minutes
  participants?: number;
  status: 'available' | 'in_progress' | 'completed';
  progress?: number;
}

interface CoffeeActivitiesProps {
  onActivityComplete?: (activityId: string, score: number) => void;
}

export const CoffeeActivities = ({ onActivityComplete }: CoffeeActivitiesProps) => {
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filter, setFilter] = useState<'all' | 'trivia' | 'tasting' | 'brewing' | 'social' | 'learning'>('all');

  useEffect(() => {
    // Initialize activities
    const initialActivities: Activity[] = [
      {
        id: '1',
        title: 'Coffee Origin Challenge',
        description: 'Test your knowledge about coffee-growing regions around the world',
        type: 'trivia',
        difficulty: 'easy',
        duration: 5,
        status: 'available'
      },
      {
        id: '2',
        title: 'Virtual Cupping Session',
        description: 'Learn to taste and evaluate coffee like a professional',
        type: 'tasting',
        difficulty: 'medium',
        duration: 15,
        participants: 8,
        status: 'available'
      },
      {
        id: '3',
        title: 'Brewing Method Mastery',
        description: 'Practice different brewing techniques and learn the science behind each',
        type: 'brewing',
        difficulty: 'hard',
        duration: 20,
        status: 'available'
      },
      {
        id: '4',
        title: 'Coffee Culture Discussion',
        description: 'Join a live discussion about coffee culture around the world',
        type: 'social',
        difficulty: 'easy',
        duration: 30,
        participants: 12,
        status: 'available'
      },
      {
        id: '5',
        title: 'Barista Skills Workshop',
        description: 'Learn latte art and espresso extraction fundamentals',
        type: 'learning',
        difficulty: 'medium',
        duration: 25,
        participants: 6,
        status: 'available'
      },
      {
        id: '6',
        title: 'Daily Coffee Facts',
        description: 'Quick daily trivia to expand your coffee knowledge',
        type: 'trivia',
        difficulty: 'easy',
        duration: 2,
        status: 'completed',
        progress: 100
      }
    ];

    setActivities(initialActivities);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'trivia': return <Trophy className="h-5 w-5" />;
      case 'tasting': return <Coffee className="h-5 w-5" />;
      case 'brewing': return <Target className="h-5 w-5" />;
      case 'social': return <Users className="h-5 w-5" />;
      case 'learning': return <Book className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const startActivity = (activity: Activity) => {
    setCurrentActivity({ ...activity, status: 'in_progress', progress: 0 });
    
    // Simulate activity progress
    const progressInterval = setInterval(() => {
      setCurrentActivity(prev => {
        if (!prev) return null;
        
        const newProgress = (prev.progress || 0) + 10;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          onActivityComplete?.(prev.id, 85); // Sample score
          return { ...prev, status: 'completed', progress: 100 };
        }
        
        return { ...prev, progress: newProgress };
      });
    }, 1000);
  };

  const filteredActivities = activities.filter(activity => 
    filter === 'all' || activity.type === filter
  );

  const activityTypes = [
    { key: 'all' as const, label: 'All Activities', icon: Star },
    { key: 'trivia' as const, label: 'Trivia', icon: Trophy },
    { key: 'tasting' as const, label: 'Tasting', icon: Coffee },
    { key: 'brewing' as const, label: 'Brewing', icon: Target },
    { key: 'social' as const, label: 'Social', icon: Users },
    { key: 'learning' as const, label: 'Learning', icon: Book }
  ];

  return (
    <div className="space-y-4">
      {/* Activity Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#8B4513]">
            <Coffee className="h-5 w-5" />
            Coffee Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {activityTypes.map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={filter === key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(key)}
                className={
                  filter === key
                    ? 'bg-[#8B4513] text-white'
                    : 'border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513]/10'
                }
              >
                <Icon className="h-4 w-4 mr-1" />
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Activity */}
      {currentActivity && currentActivity.status === 'in_progress' && (
        <Card className="border-[#8B4513]/50 bg-gradient-to-r from-[#8B4513]/5 to-[#D2B48C]/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#8B4513]">
              {getActivityIcon(currentActivity.type)}
              {currentActivity.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#95A5A6] mb-4">{currentActivity.description}</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#8B4513]">Progress</span>
                <span className="text-[#95A5A6]">{currentActivity.progress}%</span>
              </div>
              <Progress 
                value={currentActivity.progress || 0} 
                className="h-2"
              />
              <div className="flex items-center gap-4 text-sm text-[#95A5A6]">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {currentActivity.duration} min
                </div>
                {currentActivity.participants && (
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {currentActivity.participants} joined
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activities List */}
      <div className="grid gap-3">
        {filteredActivities.map((activity) => (
          <Card 
            key={activity.id} 
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              activity.status === 'completed' ? 'opacity-75' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#8B4513]/10 rounded-lg text-[#8B4513]">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-[#8B4513] mb-1">{activity.title}</h3>
                    <p className="text-sm text-[#95A5A6] line-clamp-2">{activity.description}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <Badge className={getDifficultyColor(activity.difficulty)}>
                    {activity.difficulty}
                  </Badge>
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-[#95A5A6]">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {activity.duration} min
                  </div>
                  {activity.participants && (
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {activity.participants} spots
                    </div>
                  )}
                </div>

                {activity.status === 'available' && (
                  <Button
                    size="sm"
                    onClick={() => startActivity(activity)}
                    className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white"
                  >
                    Start Activity
                  </Button>
                )}

                {activity.status === 'completed' && activity.progress && (
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-[#8B4513]">Completed</span>
                  </div>
                )}
              </div>

              {activity.status === 'completed' && activity.progress && (
                <div className="mt-3">
                  <Progress value={activity.progress} className="h-1" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Coffee className="h-12 w-12 mx-auto mb-4 text-[#95A5A6]" />
            <p className="text-[#95A5A6]">No activities found for this category.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
