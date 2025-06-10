
import { useState } from 'react';
import { RealPhysicalCafeExperience } from './RealPhysicalCafeExperience';
import { LoyaltyActions } from '@/components/loyalty/LoyaltyActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, Users, Music, MapPin, Star, Gift } from 'lucide-react';

export const InteractiveCommunityHub = () => {
  const [currentView, setCurrentView] = useState<'hub' | 'cafe'>('hub');

  if (currentView === 'cafe') {
    return (
      <RealPhysicalCafeExperience 
        onBack={() => setCurrentView('hub')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF6F0] to-[#F5E6D3] p-4">
      {/* Header */}
      <Card className="mb-6 bg-white/95 backdrop-blur-sm border-[#8B4513]/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-[#8B4513]">
            <div className="flex items-center gap-3">
              <Coffee className="h-8 w-8" />
              <div>
                <span className="text-2xl">Community Hub</span>
                <div className="text-sm text-gray-600 font-normal">Connect with your local coffee community</div>
              </div>
            </div>
            <Badge className="bg-[#8B4513] text-white text-lg px-4 py-2">
              <Users className="h-4 w-4 mr-2" />
              12 Active
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Café Experience */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-[#8B4513]/10 to-[#D2B48C]/20 border-[#8B4513]/30 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-[#8B4513]">
              <MapPin className="h-6 w-6" />
              <div>
                <span className="text-xl">Physical Café Experience</span>
                <div className="text-sm text-gray-600 font-normal">Check in, request music, and chat with people at the real café</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/70 rounded-lg">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-[#8B4513]" />
                <div className="font-medium text-[#8B4513]">Real Floor Plan</div>
                <div className="text-sm text-gray-600">Check into your actual seat</div>
              </div>
              
              <div className="text-center p-4 bg-white/70 rounded-lg">
                <Music className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="font-medium text-green-700">Spotify Integration</div>
                <div className="text-sm text-gray-600">Request songs for café speakers</div>
              </div>
              
              <div className="text-center p-4 bg-white/70 rounded-lg">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="font-medium text-blue-700">Purpose-Based Chat</div>
                <div className="text-sm text-gray-600">Connect with like-minded people</div>
              </div>
            </div>
            
            <Button 
              onClick={() => setCurrentView('cafe')}
              className="w-full bg-[#8B4513] hover:bg-[#8B4513]/90 text-white text-lg py-6"
            >
              <Coffee className="h-5 w-5 mr-2" />
              Enter Café Experience
            </Button>
          </CardContent>
        </Card>

        {/* Loyalty Actions */}
        <LoyaltyActions />

        {/* Quick Stats */}
        <Card className="bg-white/95 backdrop-blur-sm border-[#8B4513]/20">
          <CardHeader>
            <CardTitle className="text-[#8B4513] flex items-center gap-2">
              <Star className="h-5 w-5" />
              Today's Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">People checked in</span>
              </div>
              <Badge className="bg-green-500 text-white">12</Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Songs requested</span>
              </div>
              <Badge className="bg-blue-500 text-white">8</Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Points earned today</span>
              </div>
              <Badge className="bg-purple-500 text-white">45</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
