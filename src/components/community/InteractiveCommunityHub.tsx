
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, Users, Music, MapPin, Sparkles, Star, Volume2, MessageCircle } from 'lucide-react';
import { CoffeeShopExperience } from './CoffeeShopExperience';
import { CinematicLanding } from './CinematicLanding';

export const InteractiveCommunityHub = () => {
  const [currentExperience, setCurrentExperience] = useState<'hub' | 'cinematic' | 'coffee-shop'>('hub');

  const handleEnterCoffeeShop = () => {
    setCurrentExperience('cinematic');
  };

  const handleCinematicComplete = () => {
    // This should transition directly to the coffee shop experience with enhanced floor plan
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

      {/* Stunning Virtual Café Entry */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl">
        {/* Main Café Image with Overlay */}
        <div 
          className="relative h-[600px] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/lovable-uploads/e5e56c49-fc13-43d8-9998-ba147effb919.png')`
          }}
        >
          {/* Atmospheric Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            {/* Feature Cards - Floating */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Premium Seating */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-3">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">Premium Seating</h3>
                  <p className="text-white/80 text-xs">VIP lounges & window spots</p>
                </div>
              </div>

              {/* Music Voting */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mb-3">
                    <Music className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">Music Voting</h3>
                  <p className="text-white/80 text-xs">Spotify integration</p>
                </div>
              </div>

              {/* Private Chat */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-3">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">Private Chat</h3>
                  <p className="text-white/80 text-xs">Connect with neighbors</p>
                </div>
              </div>

              {/* Atmosphere */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center mb-3">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">Atmosphere</h3>
                  <p className="text-white/80 text-xs">Dynamic ambiance</p>
                </div>
              </div>
            </div>

            {/* Main Call to Action */}
            <div className="text-center">
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                Enter Virtual Café
              </h1>
              <p className="text-xl text-white/90 mb-8 drop-shadow max-w-2xl mx-auto">
                Experience our premium coffee shop with enhanced seating areas, music voting, 
                and private chat with nearby coffee lovers.
              </p>
              
              <Button
                onClick={handleEnterCoffeeShop}
                size="lg"
                className="bg-gradient-to-r from-[#8B4513] to-[#D2B48C] hover:from-[#8B4513]/90 hover:to-[#D2B48C]/90 text-white font-bold py-4 px-8 text-lg rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
              >
                <Coffee className="h-6 w-6 mr-3" />
                Enter Café Experience
              </Button>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-8 right-8">
            <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
              <div className="flex items-center gap-2 text-white">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium">47 people online</span>
              </div>
            </div>
          </div>

          <div className="absolute top-8 left-8">
            <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
              <div className="flex items-center gap-2 text-white">
                <Volume2 className="h-4 w-4" />
                <span className="text-sm font-medium">Lo-Fi Coffee Jazz</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Features Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-sky-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Music className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">Spotify Integration</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Vote for your favorite tracks and watch the most popular songs play automatically. 
                  Create the perfect café atmosphere together.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50 to-green-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">Private Conversations</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Connect with fellow coffee enthusiasts in your seating area. 
                  Share stories, discuss flavors, or simply enjoy quiet company.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Star className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">Premium Experience</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Choose from VIP lounges, window seats, cozy nooks, and collaborative workspaces. 
                  Each area offers unique views and atmospheres.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Activity Stats */}
      <div className="text-center">
        <div className="inline-flex items-center gap-8 px-8 py-4 bg-white rounded-2xl border border-[#8B4513]/10 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[#95A5A6] font-medium">47 people in café</span>
          </div>
          <div className="flex items-center gap-3">
            <Music className="h-5 w-5 text-[#8B4513]" />
            <span className="text-[#95A5A6] font-medium">Lo-Fi Coffee Jazz playing</span>
          </div>
          <div className="flex items-center gap-3">
            <Coffee className="h-5 w-5 text-[#8B4513]" />
            <span className="text-[#95A5A6] font-medium">Ethiopian Yirgacheffe featured</span>
          </div>
        </div>
      </div>
    </div>
  );
};
