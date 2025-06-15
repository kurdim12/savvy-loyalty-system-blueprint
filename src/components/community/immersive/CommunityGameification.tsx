
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Zap, Gift, Target, Crown } from 'lucide-react';
import { toast } from 'sonner';

interface CommunityGameificationProps {
  reputation: number;
  onReputationChange: (newReputation: number) => void;
}

export const CommunityGameification = ({
  reputation,
  onReputationChange
}: CommunityGameificationProps) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [dailyStreak, setDailyStreak] = useState(7);
  const [todaysGoals, setTodaysGoals] = useState([
    { id: 1, text: "Chat with 3 new people", progress: 2, target: 3, completed: false },
    { id: 2, text: "Spend 30 minutes in café", progress: 25, target: 30, completed: false },
    { id: 3, text: "Share a coffee photo", progress: 0, target: 1, completed: false }
  ]);
  
  const [achievements] = useState([
    { id: 1, name: "First Steps", icon: "🚶", unlocked: true, description: "Joined the café" },
    { id: 2, name: "Socialite", icon: "🗣️", unlocked: true, description: "Started 10 conversations" },
    { id: 3, name: "Coffee Connoisseur", icon: "☕", unlocked: false, description: "Try 20 different coffee types" },
    { id: 4, name: "Night Owl", icon: "🦉", unlocked: false, description: "Visit café after midnight" },
    { id: 5, name: "Community Builder", icon: "🏗️", unlocked: false, description: "Help 5 new members" }
  ]);

  const [weeklyChallenge] = useState({
    name: "Coffee Culture Week",
    description: "Learn about different coffee origins",
    progress: 4,
    target: 7,
    reward: "+500 reputation"
  });

  useEffect(() => {
    // Calculate level based on reputation
    const newLevel = Math.floor(reputation / 1000) + 1;
    if (newLevel !== currentLevel) {
      setCurrentLevel(newLevel);
      toast(`🎉 Level Up! You're now Level ${newLevel}`, {
        description: "New perks and features unlocked!",
        duration: 5000
      });
    }
  }, [reputation, currentLevel]);

  useEffect(() => {
    // Simulate goal progress
    const progressInterval = setInterval(() => {
      setTodaysGoals(prev => prev.map(goal => {
        if (!goal.completed && Math.random() > 0.8) {
          const newProgress = Math.min(goal.target, goal.progress + 1);
          const completed = newProgress >= goal.target;
          
          if (completed && !goal.completed) {
            const rewardPoints = 50;
            onReputationChange(reputation + rewardPoints);
            toast(`🎯 Goal completed: ${goal.text}`, {
              description: `+${rewardPoints} reputation earned!`
            });
          }
          
          return { ...goal, progress: newProgress, completed };
        }
        return goal;
      }));
    }, 10000);

    return () => clearInterval(progressInterval);
  }, [reputation, onReputationChange]);

  const getLevelColor = () => {
    if (currentLevel >= 10) return 'text-purple-400';
    if (currentLevel >= 5) return 'text-blue-400';
    return 'text-green-400';
  };

  const getProgressPercentage = (progress: number, target: number) => {
    return Math.min(100, (progress / target) * 100);
  };

  return (
    <div className="absolute top-20 right-6 z-30 space-y-3 max-w-xs">
      {/* Level and Reputation */}
      <Card className="bg-black/40 backdrop-blur-xl border border-purple-400/30">
        <CardContent className="p-4">
          <div className="text-center mb-3">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className={`h-5 w-5 ${getLevelColor()}`} />
              <span className={`text-lg font-bold ${getLevelColor()}`}>
                Level {currentLevel}
              </span>
            </div>
            <div className="text-white text-sm">
              {reputation.toLocaleString()} / {((currentLevel) * 1000).toLocaleString()} XP
            </div>
            
            {/* Level Progress Bar */}
            <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ 
                  width: `${((reputation % 1000) / 1000) * 100}%` 
                }}
              ></div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-yellow-400" />
              <span className="text-white">{dailyStreak} day streak</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Goals */}
      <Card className="bg-black/40 backdrop-blur-xl border border-green-400/30">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-green-400" />
            <span className="text-white font-semibold text-sm">Daily Goals</span>
          </div>
          
          <div className="space-y-2">
            {todaysGoals.map(goal => (
              <div key={goal.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${goal.completed ? 'text-green-300 line-through' : 'text-white'}`}>
                    {goal.text}
                  </span>
                  {goal.completed && <span className="text-green-400 text-xs">✓</span>}
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-600 rounded-full h-1">
                    <div 
                      className={`h-1 rounded-full transition-all duration-500 ${
                        goal.completed ? 'bg-green-400' : 'bg-blue-400'
                      }`}
                      style={{ width: `${getProgressPercentage(goal.progress, goal.target)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-300">
                    {goal.progress}/{goal.target}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Challenge */}
      <Card className="bg-black/40 backdrop-blur-xl border border-yellow-400/30">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span className="text-white font-semibold text-sm">Weekly Challenge</span>
          </div>
          
          <div className="space-y-2">
            <div className="text-xs text-white">{weeklyChallenge.name}</div>
            <div className="text-xs text-gray-300">{weeklyChallenge.description}</div>
            
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all"
                  style={{ 
                    width: `${(weeklyChallenge.progress / weeklyChallenge.target) * 100}%` 
                  }}
                ></div>
              </div>
              <span className="text-xs text-gray-300">
                {weeklyChallenge.progress}/{weeklyChallenge.target}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <Gift className="h-3 w-3 text-yellow-400" />
              <span className="text-xs text-yellow-300">{weeklyChallenge.reward}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card className="bg-black/40 backdrop-blur-xl border border-blue-400/30">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-4 w-4 text-blue-400" />
            <span className="text-white font-semibold text-sm">Achievements</span>
          </div>
          
          <div className="space-y-2">
            {achievements.slice(0, 3).map(achievement => (
              <div key={achievement.id} className="flex items-center gap-2">
                <span className="text-lg">{achievement.icon}</span>
                <div className="flex-1">
                  <div className={`text-xs font-medium ${
                    achievement.unlocked ? 'text-white' : 'text-gray-400'
                  }`}>
                    {achievement.name}
                  </div>
                  <div className="text-xs text-gray-400">{achievement.description}</div>
                </div>
                {achievement.unlocked && (
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                    ✓
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
