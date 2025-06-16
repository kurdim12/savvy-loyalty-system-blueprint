
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coffee, Users, MessageSquare, MapPin, Calendar, Star, Trophy, Zap } from 'lucide-react';
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
      {/* Community Header */}
      <Card className="bg-gradient-to-r from-[#8B4513] to-[#D2B48C] text-white border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
            <Coffee className="h-8 w-8" />
            Raw Smith Café Community
          </CardTitle>
          <p className="text-white/90 text-lg">
            Connect, collaborate, and create in our virtual coffee space
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">127</div>
              <div className="text-sm opacity-90">Members Online</div>
            </div>
            
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <MessageSquare className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">1.2k</div>
              <div className="text-sm opacity-90">Messages Today</div>
            </div>
            
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Calendar className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">5</div>
              <div className="text-sm opacity-90">Events This Week</div>
            </div>

            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Star className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">98%</div>
              <div className="text-sm opacity-90">Satisfaction</div>
            </div>
          </div>

          {/* Enhanced Features Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-yellow-300" />
                <span className="font-semibold">Real-Time Proximity Chat</span>
              </div>
              <p className="text-sm text-white/80">Chat with people sitting near you in the café</p>
            </div>
            
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-yellow-300" />
                <span className="font-semibold">Interest-Based Zones</span>
              </div>
              <p className="text-sm text-white/80">Find your tribe in specialized café areas</p>
            </div>
            
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Coffee className="h-5 w-5 text-yellow-300" />
                <span className="font-semibold">Interactive Seating</span>
              </div>
              <p className="text-sm text-white/80">Click any seat to join area conversations</p>
            </div>
          </div>

          {/* Café Experience Entry Button */}
          <div className="text-center">
            <Button
              onClick={handleEnterCafe}
              size="lg"
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <MapPin className="h-6 w-6 mr-3" />
              Enter Interactive Café Experience
            </Button>
            <p className="text-white/80 text-sm mt-2">
              Step into the real-time seating plan and connect with people around you
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg">
          <TabsTrigger 
            value="spaces" 
            className="flex items-center gap-2 data-[state=active]:bg-[#8B4513] data-[state=active]:text-white"
          >
            <MapPin className="h-4 w-4" />
            Spaces
          </TabsTrigger>
          <TabsTrigger 
            value="chat" 
            className="flex items-center gap-2 data-[state=active]:bg-[#8B4513] data-[state=active]:text-white"
          >
            <MessageSquare className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger 
            value="members" 
            className="flex items-center gap-2 data-[state=active]:bg-[#8B4513] data-[state=active]:text-white"
          >
            <Users className="h-4 w-4" />
            Members
          </TabsTrigger>
          <TabsTrigger 
            value="events" 
            className="flex items-center gap-2 data-[state=active]:bg-[#8B4513] data-[state=active]:text-white"
          >
            <Calendar className="h-4 w-4" />
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
