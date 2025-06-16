
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coffee, Users, MessageSquare, MapPin, Calendar, Star, Trophy, Zap, Crown, Sparkles, Volume2 } from 'lucide-react';
import { CommunityChat } from './CommunityChat';
import { CommunityEvents } from './CommunityEvents';
import { CommunityMembers } from './CommunityMembers';
import { CommunitySpaces } from './CommunitySpaces';
import { CafeEntranceTransition } from './CafeEntranceTransition';
import { CoffeeShopExperience } from './CoffeeShopExperience';

export const InteractiveCommunityHub = () => {
  const [activeTab, setActiveTab] = useState('spaces');
  const [showCafeExperience, setShowCafeExperience] = useState(false);
  const [showEntranceTransition, setShowEntranceTransition] = useState(false);

  const handleEnterCafe = () => {
    setShowEntranceTransition(true);
  };

  const handleEntranceComplete = () => {
    setShowEntranceTransition(false);
    setShowCafeExperience(true);
  };

  const handleBackToHub = () => {
    setShowCafeExperience(false);
    setShowEntranceTransition(false);
  };

  // Show entrance transition
  if (showEntranceTransition) {
    return (
      <CafeEntranceTransition
        onEnter={handleEntranceComplete}
        SeatingPlan={<CoffeeShopExperience onBack={handleBackToHub} />}
      />
    );
  }

  // Show café experience
  if (showCafeExperience) {
    return <CoffeeShopExperience onBack={handleBackToHub} />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Enhanced Community Header */}
      <Card className="bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#D2B48C] text-white border-0 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold flex items-center justify-center gap-3 mb-2">
            <Coffee className="h-10 w-10 animate-pulse" />
            Raw Smith Café Community
            <Sparkles className="h-10 w-10 animate-pulse" />
          </CardTitle>
          <p className="text-white/90 text-xl">
            The Ultimate Interactive Coffee Experience
          </p>
          <Badge className="bg-yellow-500 text-black font-bold text-lg px-4 py-2 mx-auto mt-2">
            🚀 NOW WITH ULTRA ENHANCEMENTS!
          </Badge>
        </CardHeader>
        
        <CardContent>
          {/* Enhanced Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-white/15 rounded-xl backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform">
              <Users className="h-10 w-10 mx-auto mb-2 animate-bounce" />
              <div className="text-3xl font-bold">127</div>
              <div className="text-sm opacity-90">Members Online</div>
            </div>
            
            <div className="text-center p-4 bg-white/15 rounded-xl backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform">
              <MessageSquare className="h-10 w-10 mx-auto mb-2 animate-pulse" />
              <div className="text-3xl font-bold">1.2k</div>
              <div className="text-sm opacity-90">Messages Today</div>
            </div>
            
            <div className="text-center p-4 bg-white/15 rounded-xl backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform">
              <Calendar className="h-10 w-10 mx-auto mb-2 animate-spin" />
              <div className="text-3xl font-bold">5</div>
              <div className="text-sm opacity-90">Events This Week</div>
            </div>

            <div className="text-center p-4 bg-white/15 rounded-xl backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform">
              <Crown className="h-10 w-10 mx-auto mb-2 text-yellow-300 animate-pulse" />
              <div className="text-3xl font-bold">98%</div>
              <div className="text-sm opacity-90">Satisfaction</div>
            </div>
          </div>

          {/* Revolutionary Features Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/15 p-4 rounded-xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-6 w-6 text-yellow-300 animate-pulse" />
                <span className="font-bold">AI Smart Recommendations</span>
              </div>
              <p className="text-sm text-white/80">Intelligent seat matching based on your preferences</p>
            </div>
            
            <div className="bg-white/15 p-4 rounded-xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="h-6 w-6 text-blue-300 animate-pulse" />
                <span className="font-bold">3D Spatial Audio</span>
              </div>
              <p className="text-sm text-white/80">Immersive soundscapes for each café zone</p>
            </div>
            
            <div className="bg-white/15 p-4 rounded-xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-6 w-6 text-purple-300 animate-pulse" />
                <span className="font-bold">Gamification System</span>
              </div>
              <p className="text-sm text-white/80">Earn achievements and unlock special features</p>
            </div>
            
            <div className="bg-white/15 p-4 rounded-xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-6 w-6 text-pink-300 animate-pulse" />
                <span className="font-bold">Dynamic Atmosphere</span>
              </div>
              <p className="text-sm text-white/80">Real-time weather and lighting effects</p>
            </div>
          </div>

          {/* Ultimate Café Experience Entry Button */}
          <div className="text-center">
            <Button
              onClick={handleEnterCafe}
              size="lg"
              className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:via-orange-700 hover:to-red-700 text-white px-12 py-6 text-xl font-bold shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-yellow-400 animate-pulse"
            >
              <MapPin className="h-8 w-8 mr-4" />
              Enter ULTIMATE Café Experience
              <Crown className="h-8 w-8 ml-4 text-yellow-300" />
            </Button>
            <p className="text-white/90 text-base mt-3 font-medium">
              🚀 Experience the most advanced virtual café in existence!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs - Enhanced */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white shadow-xl rounded-xl border-2 border-amber-200">
          <TabsTrigger 
            value="spaces" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8B4513] data-[state=active]:to-[#A0522D] data-[state=active]:text-white font-semibold"
          >
            <MapPin className="h-5 w-5" />
            Ultimate Spaces
          </TabsTrigger>
          <TabsTrigger 
            value="chat" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8B4513] data-[state=active]:to-[#A0522D] data-[state=active]:text-white font-semibold"
          >
            <MessageSquare className="h-5 w-5" />
            Smart Chat
          </TabsTrigger>
          <TabsTrigger 
            value="members" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8B4513] data-[state=active]:to-[#A0522D] data-[state=active]:text-white font-semibold"
          >
            <Users className="h-5 w-5" />
            Community
          </TabsTrigger>
          <TabsTrigger 
            value="events" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8B4513] data-[state=active]:to-[#A0522D] data-[state=active]:text-white font-semibold"
          >
            <Calendar className="h-5 w-5" />
            Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="spaces" className="mt-6">
          <CommunitySpaces />
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <CommunityChat />
        </TabsContent>

        <TabsContent value="members" className="mt-6">
          <CommunityMembers />
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <CommunityEvents />
        </TabsContent>
      </Tabs>
    </div>
  );
};
