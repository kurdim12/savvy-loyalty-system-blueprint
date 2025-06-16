
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Zap, Target, Gift, Crown } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'social' | 'exploration' | 'time' | 'interaction';
  reward: number;
  timeLimit: number;
  completed: boolean;
  progress: number;
  maxProgress: number;
}

interface UserStats {
  level: number;
  totalPoints: number;
  pointsToNextLevel: number;
  streak: number;
  achievements: Achievement[];
  activeChallenges: Challenge[];
  rank: string;
  reputation: number;
}

export const GamificationEngine = () => {
  const [userStats, setUserStats] = useState<UserStats>({
    level: 8,
    totalPoints: 1250,
    pointsToNextLevel: 350,
    streak: 12,
    achievements: [
      {
        id: 'social-butterfly',
        title: 'Social Butterfly',
        description: 'Chat with 10 different people',
        icon: '🦋',
        points: 100,
        unlocked: true,
        progress: 10,
        maxProgress: 10
      },
      {
        id: 'coffee-master',
        title: 'Coffee Master',
        description: 'Visit café for 30 days',
        icon: '☕',
        points: 200,
        unlocked: false,
        progress: 23,
        maxProgress: 30
      },
      {
        id: 'conversation-starter',
        title: 'Conversation Starter',
        description: 'Start 5 conversations',
        icon: '💬',
        points: 75,
        unlocked: true,
        progress: 5,
        maxProgress: 5
      }
    ],
    activeChallenges: [
      {
        id: 'daily-social',
        title: 'Daily Social Hour',
        description: 'Chat with 3 people today',
        type: 'social',
        reward: 50,
        timeLimit: 24,
        completed: false,
        progress: 1,
        maxProgress: 3
      },
      {
        id: 'explore-zones',
        title: 'Zone Explorer',
        description: 'Visit all café zones',
        type: 'exploration',
        reward: 75,
        timeLimit: 48,
        completed: false,
        progress: 3,
        maxProgress: 6
      }
    ],
    rank: 'Coffee Connoisseur',
    reputation: 850
  });

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [recentAchievement, setRecentAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    // Simulate achievement unlocks and level ups
    const checkAchievements = () => {
      setUserStats(prev => ({
        ...prev,
        achievements: prev.achievements.map(achievement => {
          if (!achievement.unlocked && achievement.progress >= achievement.maxProgress) {
            setRecentAchievement(achievement);
            setTimeout(() => setRecentAchievement(null), 3000);
            return { ...achievement, unlocked: true };
          }
          return achievement;
        })
      }));
    };

    const timer = setInterval(checkAchievements, 5000);
    return () => clearInterval(timer);
  }, []);

  const getRankColor = (rank: string) => {
    const colors = {
      'Newcomer': 'bg-gray-100 text-gray-800',
      'Regular': 'bg-green-100 text-green-800',
      'Coffee Enthusiast': 'bg-blue-100 text-blue-800',
      'Coffee Connoisseur': 'bg-purple-100 text-purple-800',
      'Café Legend': 'bg-yellow-100 text-yellow-800'
    };
    return colors[rank as keyof typeof colors] || colors['Newcomer'];
  };

  const completeChallenge = (challengeId: string) => {
    setUserStats(prev => ({
      ...prev,
      activeChallenges: prev.activeChallenges.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, completed: true, progress: challenge.maxProgress }
          : challenge
      ),
      totalPoints: prev.totalPoints + (prev.activeChallenges.find(c => c.id === challengeId)?.reward || 0)
    }));
  };

  return (
    <div className="space-y-4">
      {/* Level Up Animation */}
      {showLevelUp && (
        <Card className="border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 animate-bounce">
          <CardContent className="p-4 text-center">
            <Crown className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <h3 className="font-bold text-yellow-800">Level Up!</h3>
            <p className="text-yellow-700">You reached level {userStats.level + 1}!</p>
          </CardContent>
        </Card>
      )}

      {/* Recent Achievement */}
      {recentAchievement && (
        <Card className="border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 animate-pulse">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">{recentAchievement.icon}</div>
            <h3 className="font-bold text-green-800">Achievement Unlocked!</h3>
            <p className="text-green-700">{recentAchievement.title}</p>
            <Badge className="mt-2 bg-green-600">+{recentAchievement.points} points</Badge>
          </CardContent>
        </Card>
      )}

      {/* User Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{userStats.level}</div>
              <div className="text-sm text-gray-600">Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userStats.totalPoints}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userStats.streak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{userStats.reputation}</div>
              <div className="text-sm text-gray-600">Reputation</div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress to Level {userStats.level + 1}</span>
              <Badge className={getRankColor(userStats.rank)}>{userStats.rank}</Badge>
            </div>
            <Progress 
              value={(userStats.totalPoints % 500) / 5} 
              className="h-3"
            />
            <div className="text-xs text-gray-500 mt-1">
              {userStats.pointsToNextLevel} points needed
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Daily Challenges
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {userStats.activeChallenges.map(challenge => (
            <div key={challenge.id} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{challenge.title}</h4>
                  <p className="text-sm text-gray-600">{challenge.description}</p>
                </div>
                <Badge variant="outline" className="ml-2">
                  <Gift className="h-3 w-3 mr-1" />
                  {challenge.reward} pts
                </Badge>
              </div>
              <div className="space-y-2">
                <Progress value={(challenge.progress / challenge.maxProgress) * 100} />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{challenge.progress}/{challenge.maxProgress}</span>
                  <span>{challenge.timeLimit}h remaining</span>
                </div>
              </div>
              {challenge.progress >= challenge.maxProgress && !challenge.completed && (
                <Button 
                  size="sm" 
                  className="mt-2 w-full"
                  onClick={() => completeChallenge(challenge.id)}
                >
                  Claim Reward
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-600" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {userStats.achievements.map(achievement => (
              <div 
                key={achievement.id}
                className={`p-3 border rounded-lg ${achievement.unlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    {!achievement.unlocked && (
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100}
                        className="mt-2 h-2"
                      />
                    )}
                  </div>
                  <div className="text-right">
                    {achievement.unlocked ? (
                      <Badge className="bg-green-600">
                        <Zap className="h-3 w-3 mr-1" />
                        {achievement.points}
                      </Badge>
                    ) : (
                      <Badge variant="outline">{achievement.progress}/{achievement.maxProgress}</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
