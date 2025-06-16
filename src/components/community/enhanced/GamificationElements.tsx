
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Star, Coffee, Users, Target, Gift } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
}

interface GamificationElementsProps {
  userPoints: number;
  streak: number;
  achievements: Achievement[];
}

export const GamificationElements = ({ 
  userPoints, 
  streak, 
  achievements 
}: GamificationElementsProps) => {
  const [showAchievements, setShowAchievements] = useState(false);

  const sampleAchievements: Achievement[] = [
    {
      id: 'social-butterfly',
      name: 'Social Butterfly',
      description: 'Start conversations with 10 different people',
      icon: Users,
      progress: 7,
      maxProgress: 10,
      unlocked: false
    },
    {
      id: 'coffee-connoisseur',
      name: 'Coffee Connoisseur',
      description: 'Try 5 different coffee types',
      icon: Coffee,
      progress: 5,
      maxProgress: 5,
      unlocked: true
    },
    {
      id: 'regular-visitor',
      name: 'Regular Visitor',
      description: 'Visit the café 7 days in a row',
      icon: Target,
      progress: streak,
      maxProgress: 7,
      unlocked: streak >= 7
    }
  ];

  return (
    <div className="space-y-2">
      {/* Points & Streak Display */}
      <div className="flex items-center gap-4">
        <Badge className="bg-amber-600 text-white px-3 py-1">
          <Star className="h-3 w-3 mr-1" />
          {userPoints} pts
        </Badge>
        
        <Badge className="bg-green-600 text-white px-3 py-1">
          <Coffee className="h-3 w-3 mr-1" />
          {streak} day streak
        </Badge>
        
        <Badge 
          className="bg-purple-600 text-white px-3 py-1 cursor-pointer hover:bg-purple-700"
          onClick={() => setShowAchievements(!showAchievements)}
        >
          <Trophy className="h-3 w-3 mr-1" />
          Achievements
        </Badge>
      </div>

      {/* Achievement Panel */}
      {showAchievements && (
        <Card className="w-80 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-600" />
              Your Achievements
            </h3>
            
            <div className="space-y-3">
              {sampleAchievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`p-3 rounded-lg border ${
                    achievement.unlocked 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      achievement.unlocked 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-400 text-white'
                    }`}>
                      <achievement.icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{achievement.name}</h4>
                      <p className="text-xs text-gray-600">{achievement.description}</p>
                      
                      {!achievement.unlocked && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.maxProgress}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {achievement.unlocked && (
                      <Gift className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
