
import { LivePointsDisplay } from './LivePointsDisplay';
import { SitChillTimer } from './SitChillTimer';
import { CommunityChat } from './CommunityChat';
import { CoffeeShopExperience } from './CoffeeShopExperience';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Coffee, MessageSquare, Timer, Store } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export const InteractiveCommunityHub = () => {
  const [showCoffeeShop, setShowCoffeeShop] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF6F0] via-white to-[#F5E6D3] p-4">
      {/* Header with Live Points */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#8B4513]">Community Café</h1>
          <p className="text-[#95A5A6]">Connect, chill, and earn rewards</p>
        </div>
        <LivePointsDisplay />
      </div>

      {/* Coffee Shop Experience Toggle */}
      <div className="mb-6">
        <Button
          onClick={() => setShowCoffeeShop(!showCoffeeShop)}
          className={`${
            showCoffeeShop 
              ? 'bg-[#8B4513] hover:bg-[#8B4513]/90' 
              : 'bg-gradient-to-r from-[#8B4513] to-[#D2B48C] hover:from-[#8B4513]/90 hover:to-[#D2B48C]/90'
          } text-white px-6 py-3 text-lg font-medium transition-all duration-300`}
        >
          <Store className="h-5 w-5 mr-2" />
          {showCoffeeShop ? 'Back to Hub' : 'Enter Virtual Café'}
        </Button>
      </div>

      {/* Coffee Shop Experience */}
      {showCoffeeShop ? (
        <CoffeeShopExperience 
          onEarnPoints={(points) => {
            console.log(`🎉 Earned ${points} points from coffee shop experience!`);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Left Column: Chill Area */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-[#8B4513]/5 to-[#D2B48C]/10">
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

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#8B4513]">
                  <Users className="h-5 w-5" />
                  Community Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-[#8B4513]/5 rounded-lg">
                    <div className="text-2xl font-bold text-[#8B4513]">127</div>
                    <div className="text-sm text-[#95A5A6]">Active Members</div>
                  </div>
                  <div className="p-4 bg-[#D2B48C]/10 rounded-lg">
                    <div className="text-2xl font-bold text-[#8B4513]">1,234</div>
                    <div className="text-sm text-[#95A5A6]">Points Earned Today</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Chat Area */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#8B4513]">
                  <MessageSquare className="h-5 w-5" />
                  Live Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <CommunityChat />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#8B4513]">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-[#8B4513]/5 rounded-lg text-center cursor-pointer hover:bg-[#8B4513]/10 transition-colors">
                    <Coffee className="h-6 w-6 mx-auto mb-2 text-[#8B4513]" />
                    <div className="text-sm font-medium text-[#8B4513]">Order Coffee</div>
                    <div className="text-xs text-[#95A5A6]">+3 XP</div>
                  </div>
                  <div 
                    className="p-4 bg-[#D2B48C]/10 rounded-lg text-center cursor-pointer hover:bg-[#D2B48C]/20 transition-colors"
                    onClick={() => setShowCoffeeShop(true)}
                  >
                    <Store className="h-6 w-6 mx-auto mb-2 text-[#8B4513]" />
                    <div className="text-sm font-medium text-[#8B4513]">Virtual Café</div>
                    <div className="text-xs text-[#95A5A6]">Immersive Experience</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
