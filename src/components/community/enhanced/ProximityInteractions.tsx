
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hand, MessageCircle, Coffee, Music, Star, Heart, ThumbsUp } from 'lucide-react';

interface NearbyUser {
  id: string;
  name: string;
  seatId: string;
  distance: number;
  mood: string;
  activity: string;
  isInteractive: boolean;
}

interface ProximityInteractionsProps {
  currentSeatId: string;
  nearbyUsers: NearbyUser[];
  onInteraction: (targetUserId: string, interactionType: string) => void;
}

export const ProximityInteractions: React.FC<ProximityInteractionsProps> = ({
  currentSeatId,
  nearbyUsers,
  onInteraction
}) => {
  const [activeInteractions, setActiveInteractions] = useState<{[key: string]: string}>({});
  const [showInteractions, setShowInteractions] = useState(false);

  useEffect(() => {
    // Auto-show interactions when someone is nearby
    setShowInteractions(nearbyUsers.some(user => user.distance < 3));
  }, [nearbyUsers]);

  const handleInteraction = (userId: string, type: string) => {
    setActiveInteractions(prev => ({ ...prev, [userId]: type }));
    onInteraction(userId, type);
    
    // Clear interaction after animation
    setTimeout(() => {
      setActiveInteractions(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    }, 2000);
  };

  const interactions = [
    { type: 'wave', icon: Hand, label: 'Wave', color: 'bg-blue-500' },
    { type: 'chat', icon: MessageCircle, label: 'Chat', color: 'bg-green-500' },
    { type: 'coffee', icon: Coffee, label: 'Coffee?', color: 'bg-amber-500' },
    { type: 'like', icon: ThumbsUp, label: 'Like', color: 'bg-purple-500' },
    { type: 'music', icon: Music, label: 'Music', color: 'bg-pink-500' },
  ];

  if (!showInteractions || nearbyUsers.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg">
      <CardContent className="p-4">
        <div className="text-sm font-medium text-blue-800 mb-3 flex items-center gap-2">
          <Star className="h-4 w-4" />
          People Nearby ({nearbyUsers.length})
        </div>
        
        <div className="space-y-3">
          {nearbyUsers.slice(0, 3).map((user) => (
            <div key={user.id} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm">
                  {user.mood}
                </div>
                <div>
                  <div className="text-sm font-medium text-blue-800">{user.name}</div>
                  <div className="text-xs text-blue-600">{user.activity}</div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {user.distance}m away
                </Badge>
              </div>
              
              <div className="flex gap-1">
                {interactions.slice(0, 3).map((interaction) => {
                  const Icon = interaction.icon;
                  const isActive = activeInteractions[user.id] === interaction.type;
                  
                  return (
                    <Button
                      key={interaction.type}
                      size="sm"
                      variant="outline"
                      onClick={() => handleInteraction(user.id, interaction.type)}
                      className={`h-8 w-8 p-0 transition-all duration-300 ${
                        isActive 
                          ? `${interaction.color} text-white scale-125 animate-pulse` 
                          : 'hover:scale-110'
                      }`}
                      disabled={isActive}
                    >
                      <Icon className="h-3 w-3" />
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {nearbyUsers.length > 3 && (
          <div className="text-center mt-3">
            <Badge variant="outline" className="text-xs">
              +{nearbyUsers.length - 3} more people in the area
            </Badge>
          </div>
        )}

        <div className="text-xs text-blue-500 text-center mt-3 bg-blue-50 p-2 rounded">
          💫 Quick interactions help build connections in the café!
        </div>
      </CardContent>
    </Card>
  );
};
