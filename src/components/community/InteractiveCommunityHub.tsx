
import { LivePointsDisplay } from './LivePointsDisplay';
import { SitChillTimer } from './SitChillTimer';
import { EnhancedCommunityChat } from './EnhancedCommunityChat';
import { CoffeeShopExperience } from './CoffeeShopExperience';
import { CinematicLanding } from './CinematicLanding';
import { CoffeeActivities } from './CoffeeActivities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Coffee, MessageSquare, Timer, Store, Gamepad2, Sparkles, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const InteractiveCommunityHub = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'hub' | 'coffee-shop'>('landing');

  const handleEnterCoffeeShop = () => {
    setCurrentView('hub');
  };

  const handleShowCoffeeShop = () => {
    setCurrentView('coffee-shop');
  };

  const handleBackToHub = () => {
    setCurrentView('hub');
  };

  if (currentView === 'landing') {
    return <CinematicLanding onEnterCoffeeShop={handleEnterCoffeeShop} />;
  }

  if (currentView === 'coffee-shop') {
    return (
      <CoffeeShopExperience 
        onEarnPoints={(points) => {
          console.log(`🎉 Earned ${points} points from coffee shop experience!`);
        }}
        onBack={handleBackToHub}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF6F0] via-white to-[#F5E6D3] p-4">
      {/* Enhanced Header with Live Points */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#8B4513] flex items-center gap-2">
            <Coffee className="h-8 w-8" />
            Community Café
            <Badge className="bg-gradient-to-r from-[#8B4513] to-[#D2B48C] text-white">
              <Sparkles className="h-3 w-3 mr-1" />
              Enhanced
            </Badge>
          </h1>
          <p className="text-[#95A5A6] flex items-center gap-2 mt-1">
            <Users className="h-4 w-4" />
            Connect, chill, learn, and earn rewards
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setCurrentView('landing')}
            variant="outline"
            className="text-[#8B4513] border-[#8B4513] hover:bg-[#8B4513]/10"
          >
            Return to Entrance
          </Button>
          <LivePointsDisplay />
        </div>
      </div>

      {/* Coffee Shop Experience Toggle */}
      <div className="mb-6">
        <Card className="bg-gradient-to-r from-[#8B4513]/10 to-[#D2B48C]/20 border-[#8B4513]/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#8B4513] mb-1">
                  Immersive Virtual Café Experience
                </h3>
                <p className="text-[#95A5A6] text-sm">
                  Step into our fully interactive café with atmospheric effects, AI barista, and activities
                </p>
              </div>
              <Button
                onClick={handleShowCoffeeShop}
                className="bg-gradient-to-r from-[#8B4513] to-[#D2B48C] hover:from-[#8B4513]/90 hover:to-[#D2B48C]/90 text-white px-6 py-3 text-lg font-medium transition-all duration-300"
              >
                <Store className="h-5 w-5 mr-2" />
                Enter Virtual Café
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Left Column: Chill Area */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-[#8B4513]/5 to-[#D2B48C]/10 border-[#8B4513]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#8B4513]">
                <Coffee className="h-5 w-5" />
                Chill Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#8B4513]/20 to-[#D2B48C]/30 rounded-full flex items-center justify-center mb-4">
                  <Timer className="h-12 w-12 text-[#8B4513]" />
                </div>
                <h3 className="text-xl font-semibold text-[#8B4513] mb-2">Take a Coffee Break</h3>
                <p className="text-[#95A5A6] text-sm mb-4">
                  Sit back, relax, and enjoy the café atmosphere
                </p>
              </div>
              
              <SitChillTimer onPointsEarned={(points) => {
                console.log(`🎉 Earned ${points} points from chilling!`);
              }} />
            </CardContent>
          </Card>

          {/* Enhanced Community Stats */}
          <Card className="border-[#8B4513]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#8B4513]">
                <TrendingUp className="h-5 w-5" />
                Live Community Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-[#8B4513]/5 rounded-lg">
                  <div className="text-2xl font-bold text-[#8B4513]">127</div>
                  <div className="text-sm text-[#95A5A6]">Active Members</div>
                  <div className="text-xs text-green-600 mt-1">+12 today</div>
                </div>
                <div className="p-4 bg-[#D2B48C]/10 rounded-lg">
                  <div className="text-2xl font-bold text-[#8B4513]">1,234</div>
                  <div className="text-sm text-[#95A5A6]">Points Earned Today</div>
                  <div className="text-xs text-green-600 mt-1">+234 this hour</div>
                </div>
                <div className="p-4 bg-[#8B4513]/5 rounded-lg">
                  <div className="text-2xl font-bold text-[#8B4513]">89</div>
                  <div className="text-sm text-[#95A5A6]">Activities Completed</div>
                  <div className="text-xs text-blue-600 mt-1">+15 today</div>
                </div>
                <div className="p-4 bg-[#D2B48C]/10 rounded-lg">
                  <div className="text-2xl font-bold text-[#8B4513]">456</div>
                  <div className="text-sm text-[#95A5A6]">Chat Messages</div>
                  <div className="text-xs text-green-600 mt-1">Very active!</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column: Enhanced Chat Area */}
        <div className="space-y-6">
          <Card className="border-[#8B4513]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#8B4513]">
                <MessageSquare className="h-5 w-5" />
                Enhanced Live Chat
                <Badge className="bg-green-100 text-green-800 text-xs">
                  ✨ New Features
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <EnhancedCommunityChat />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Activities & Quick Actions */}
        <div className="space-y-6">
          <Card className="border-[#8B4513]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#8B4513]">
                <Gamepad2 className="h-5 w-5" />
                Coffee Activities
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  Interactive
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              <CoffeeActivities onActivityComplete={(activityId, score) => {
                console.log(`Activity ${activityId} completed with score: ${score}`);
              }} />
            </CardContent>
          </Card>

          {/* Enhanced Quick Actions */}
          <Card className="border-[#8B4513]/20">
            <CardHeader>
              <CardTitle className="text-[#8B4513]">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <div 
                  className="p-4 bg-gradient-to-r from-[#8B4513]/10 to-[#D2B48C]/10 rounded-lg text-center cursor-pointer hover:from-[#8B4513]/20 hover:to-[#D2B48C]/20 transition-all duration-300 border border-[#8B4513]/20"
                  onClick={handleShowCoffeeShop}
                >
                  <Store className="h-6 w-6 mx-auto mb-2 text-[#8B4513]" />
                  <div className="text-sm font-medium text-[#8B4513]">Virtual Café</div>
                  <div className="text-xs text-[#95A5A6]">Immersive Experience</div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-[#D2B48C]/10 to-[#8B4513]/10 rounded-lg text-center cursor-pointer hover:from-[#D2B48C]/20 hover:to-[#8B4513]/20 transition-all duration-300 border border-[#8B4513]/20">
                  <Coffee className="h-6 w-6 mx-auto mb-2 text-[#8B4513]" />
                  <div className="text-sm font-medium text-[#8B4513]">Order Coffee</div>
                  <div className="text-xs text-[#95A5A6]">+3 Points</div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-[#8B4513]/10 to-[#D2B48C]/10 rounded-lg text-center cursor-pointer hover:from-[#8B4513]/20 hover:to-[#D2B48C]/20 transition-all duration-300 border border-[#8B4513]/20">
                  <Gamepad2 className="h-6 w-6 mx-auto mb-2 text-[#8B4513]" />
                  <div className="text-sm font-medium text-[#8B4513]">Daily Challenge</div>
                  <div className="text-xs text-[#95A5A6]">+5 Points</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
