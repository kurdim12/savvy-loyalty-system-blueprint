
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Users, Clock } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  target: number;
  current: number;
  reward: string;
  expiresAt: Date;
  participants: number;
}

interface CommunityChallengeProps {
  challenges: Challenge[];
  onJoinChallenge: (challengeId: string) => void;
}

export const CommunityChallenge = ({ challenges, onJoinChallenge }: CommunityChallengeProps) => {
  if (challenges.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="h-12 w-12 text-[#95A5A6] mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-black mb-2">No Active Challenges</h3>
        <p className="text-[#95A5A6]">Check back soon for new challenges!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-black mb-2">Community Challenges</h2>
        <p className="text-[#95A5A6]">Join challenges and compete with fellow coffee lovers</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge) => {
          const progress = (challenge.current / challenge.target) * 100;
          const timeLeft = Math.ceil((challenge.expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <Card key={challenge.id} className="bg-white border-2 border-[#95A5A6]/20 hover:border-black transition-all duration-300 hover:shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="secondary" 
                    className={`
                      ${challenge.type === 'daily' ? 'bg-green-100 text-green-800' : 
                        challenge.type === 'weekly' ? 'bg-blue-100 text-blue-800' : 
                        'bg-purple-100 text-purple-800'}
                    `}
                  >
                    {challenge.type.toUpperCase()}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-[#95A5A6]">
                    <Users className="h-4 w-4" />
                    {challenge.participants}
                  </div>
                </div>
                <CardTitle className="text-xl text-black">{challenge.title}</CardTitle>
                <CardDescription className="text-[#95A5A6]">{challenge.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#95A5A6]">Progress</span>
                    <span className="font-medium text-black">{challenge.current} / {challenge.target}</span>
                  </div>
                  <Progress 
                    value={progress} 
                    className="h-3 bg-[#95A5A6]/20"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-[#95A5A6]" />
                    <span className="text-sm font-medium text-black">{challenge.reward}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-[#95A5A6]">
                    <Clock className="h-4 w-4" />
                    {timeLeft}d left
                  </div>
                </div>
                
                <Button 
                  onClick={() => onJoinChallenge(challenge.id)}
                  className="w-full bg-black hover:bg-[#95A5A6] text-white transition-colors duration-200"
                >
                  Join Challenge
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
