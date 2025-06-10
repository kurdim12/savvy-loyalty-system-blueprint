
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import loyaltyService, { LOYALTY_ACTIONS } from '@/services/loyaltyService';
import { Coffee, Users, Star, Gift, MapPin, MessageSquare, Camera, Music } from 'lucide-react';
import { toast } from 'sonner';

const ACTION_ICONS = {
  visit: MapPin,
  purchase: Coffee,
  referral: Users,
  social: MessageSquare,
  challenge: Star,
  review: Star
};

export const LoyaltyActions = () => {
  const { user } = useAuth();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAction = async (actionKey: string) => {
    if (!user) {
      toast.error('Please log in to earn points');
      return;
    }

    setLoadingAction(actionKey);
    try {
      const success = await loyaltyService.awardPoints(user.id, actionKey);
      if (!success) {
        toast.error('Failed to award points. Please try again.');
      }
    } catch (error) {
      console.error('Error performing action:', error);
      toast.error('An error occurred while awarding points');
    } finally {
      setLoadingAction(null);
    }
  };

  const quickActions = [
    { key: 'cafe_visit', label: 'Check In', icon: MapPin, color: 'bg-blue-500' },
    { key: 'community_chat', label: 'Chat', icon: MessageSquare, color: 'bg-green-500' },
    { key: 'photo_upload', label: 'Share Photo', icon: Camera, color: 'bg-purple-500' },
    { key: 'song_request', label: 'Request Song', icon: Music, color: 'bg-pink-500' },
    { key: 'daily_checkin', label: 'Daily Bonus', icon: Gift, color: 'bg-orange-500' },
    { key: 'social_post', label: 'Social Share', icon: Users, color: 'bg-indigo-500' }
  ];

  return (
    <Card className="border-[#8B4513]/20">
      <CardHeader>
        <CardTitle className="text-[#8B4513] flex items-center gap-2">
          <Star className="h-5 w-5" />
          Earn Points
        </CardTitle>
        <CardDescription className="text-[#6F4E37]">
          Complete activities to earn loyalty points and unlock rewards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const actionData = LOYALTY_ACTIONS[action.key];
            const IconComponent = action.icon;
            
            if (!actionData) {
              console.warn(`Action data not found for key: ${action.key}`);
              return null;
            }
            
            return (
              <Button
                key={action.key}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 border-[#8B4513]/20 hover:bg-[#FFF8DC] hover:border-[#8B4513]/40"
                onClick={() => handleAction(action.key)}
                disabled={loadingAction === action.key}
              >
                <div className={`p-3 rounded-full ${action.color} text-white`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm text-[#8B4513]">
                    {loadingAction === action.key ? 'Processing...' : action.label}
                  </div>
                  <Badge variant="secondary" className="text-xs mt-1">
                    +{actionData.points} pts
                  </Badge>
                </div>
              </Button>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-[#8B4513]/20">
          <h4 className="font-medium text-[#8B4513] mb-3">More Ways to Earn</h4>
          <div className="space-y-2">
            {Object.entries(LOYALTY_ACTIONS).slice(6).map(([key, action]) => (
              <div key={key} className="flex items-center justify-between p-2 rounded-lg bg-[#FFF8DC]/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-[#8B4513]/10">
                    {React.createElement(ACTION_ICONS[action.type] || Star, { 
                      className: "h-4 w-4 text-[#8B4513]" 
                    })}
                  </div>
                  <span className="text-sm text-[#6F4E37]">{action.description}</span>
                </div>
                <Badge variant="outline" className="border-[#8B4513]/20 text-[#8B4513]">
                  +{action.points}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
