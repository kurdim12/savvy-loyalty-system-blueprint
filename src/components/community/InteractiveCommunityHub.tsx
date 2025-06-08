import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, Users, Music, MapPin, Sparkles } from 'lucide-react';
import { CoffeeShopExperience } from './CoffeeShopExperience';
import { CinematicLanding } from './CinematicLanding';

export const InteractiveCommunityHub = () => {
  const [currentExperience, setCurrentExperience] = useState<'hub' | 'cinematic' | 'coffee-shop'>('hub');

  const handleEnterCoffeeShop = () => {
    setCurrentExperience('cinematic');
  };

  const handleCinematicComplete = () => {
    setCurrentExperience('coffee-shop');
  };

  const handleBackToHub = () => {
    setCurrentExperience('hub');
  };

  if (currentExperience === 'cinematic') {
    return (
      <CinematicLanding onEnterCoffeeShop={handleCinematicComplete} />
    );
  }

  if (currentExperience === 'coffee-shop') {
    return (
      <CoffeeShopExperience onBack={handleBackToHub} />
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8B4513]/10 to-[#D2B48C]/10 rounded-full border border-[#8B4513]/20">
          <Sparkles className="h-5 w-5 text-[#8B4513]" />
          <span className="text-[#8B4513] font-medium">Welcome to Raw Smith Virtual Café</span>
        </div>
        <h2 className="text-3xl font-bold text-black">
          Your Digital Coffee Experience Awaits
        </h2>
        <p className="text-lg text-[#95A5A6] max-w-2xl mx-auto">
          Step into our immersive virtual café space where you can enjoy premium coffee culture, 
          connect with fellow enthusiasts, and discover new experiences.
        </p>
      </div>

      {/* Enhanced Virtual Café Entry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Café Experience */}
        <Card className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 bg-gradient-to-br from-[#8B4513]/5 to-[#D2B48C]/10 border-[#8B4513]/20">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#8B4513] to-[#D2B48C] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Coffee className="h-10 w-10 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-[#8B4513] mb-4">Enter Virtual Café</h3>
            <p className="text-[#95A5A6] mb-6 leading-relaxed">
              Experience our premium coffee shop with enhanced seating areas, music voting, 
              and private chat with nearby coffee lovers.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#8B4513]" />
                <span className="text-sm text-[#8B4513]">Premium Seating</span>
              </div>
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-[#8B4513]" />
                <span className="text-sm text-[#8B4513]">Music Voting</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#8B4513]" />
                <span className="text-sm text-[#8B4513]">Private Chat</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#8B4513]" />
                <span className="text-sm text-[#8B4513]">Atmosphere</span>
              </div>
            </div>
            
            <Button
              onClick={handleEnterCoffeeShop}
              className="w-full bg-[#8B4513] hover:bg-[#8B4513]/90 text-white font-medium py-3 text-lg group-hover:shadow-lg transition-shadow"
            >
              Enter Café Experience
            </Button>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="space-y-4">
          <Card className="bg-gradient-to-r from-blue-50 to-sky-50 border-sky-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Music className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Spotify Integration</h4>
                  <p className="text-sm text-gray-600">Vote for your favorite tracks - most voted songs play automatically</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-emerald-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Private Conversations</h4>
                  <p className="text-sm text-gray-600">Chat privately with people in your seating area</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Premium Seating Areas</h4>
                  <p className="text-sm text-gray-600">Choose from VIP lounges, window seats, cozy nooks, and more</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Atmospheric Experience</h4>
                  <p className="text-sm text-gray-600">Dynamic lighting, weather effects, and ambient sounds</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Current Stats */}
      <div className="text-center">
        <div className="inline-flex items-center gap-6 px-6 py-3 bg-white rounded-lg border border-[#8B4513]/20 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-[#95A5A6]">47 people online in café</span>
          </div>
          <div className="flex items-center gap-2">
            <Music className="h-4 w-4 text-[#8B4513]" />
            <span className="text-sm text-[#95A5A6]">Now playing: Lo-Fi Coffee Jazz</span>
          </div>
          <div className="flex items-center gap-2">
            <Coffee className="h-4 w-4 text-[#8B4513]" />
            <span className="text-sm text-[#95A5A6]">Daily special: Ethiopian Yirgacheffe</span>
          </div>
        </div>
      </div>
    </div>
  );
};
