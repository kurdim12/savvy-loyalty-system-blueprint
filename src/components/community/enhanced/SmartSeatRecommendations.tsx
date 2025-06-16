
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Coffee, Users, Heart, Zap, Brain } from 'lucide-react';

interface UserProfile {
  interests: string[];
  workStyle: 'focused' | 'social' | 'collaborative';
  coffeePreference: string;
  mood: string;
}

interface SmartSeatRecommendationsProps {
  userProfile: UserProfile;
  availableSeats: string[];
  onSeatRecommend: (seatId: string, reason: string) => void;
}

export const SmartSeatRecommendations = ({ 
  userProfile, 
  availableSeats, 
  onSeatRecommend 
}: SmartSeatRecommendationsProps) => {
  const [showRecommendations, setShowRecommendations] = useState(false);

  const generateRecommendations = () => {
    const recommendations = [
      {
        seatId: 'table-1',
        reason: 'Perfect for your focused work style',
        icon: Brain,
        confidence: 95
      },
      {
        seatId: 'lounge-chair-1',
        reason: 'Great for coffee enthusiasts like you',
        icon: Coffee,
        confidence: 88
      },
      {
        seatId: 'table-2',
        reason: 'Similar interests: tech & design',
        icon: Heart,
        confidence: 82
      }
    ];

    return recommendations.filter(r => availableSeats.includes(r.seatId));
  };

  if (!showRecommendations) {
    return (
      <Button
        onClick={() => setShowRecommendations(true)}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        <Zap className="h-4 w-4 mr-2" />
        AI Seat Recommendations
      </Button>
    );
  }

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-stone-800">Smart Recommendations</h3>
        </div>
        
        <div className="space-y-3">
          {generateRecommendations().map((rec, idx) => (
            <div 
              key={idx}
              className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500 cursor-pointer hover:bg-purple-100 transition-colors"
              onClick={() => onSeatRecommend(rec.seatId, rec.reason)}
            >
              <div className="flex items-center gap-3">
                <rec.icon className="h-4 w-4 text-purple-600" />
                <div>
                  <div className="font-medium text-sm">{rec.seatId}</div>
                  <div className="text-xs text-gray-600">{rec.reason}</div>
                </div>
              </div>
              <Badge className="bg-purple-600 text-white">
                {rec.confidence}%
              </Badge>
            </div>
          ))}
        </div>
        
        <Button
          onClick={() => setShowRecommendations(false)}
          variant="outline"
          size="sm"
          className="w-full mt-3"
        >
          Close
        </Button>
      </CardContent>
    </Card>
  );
};
