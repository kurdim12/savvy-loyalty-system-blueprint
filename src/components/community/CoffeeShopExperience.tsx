
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coffee, Users, MessageCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { CoffeeShopFloorPlan } from './CoffeeShopFloorPlan';
import { CoffeeShopInterior } from './CoffeeShopInterior';
import { CoffeeShopSeated } from './CoffeeShopSeated';

type ViewState = 'landing' | 'floorplan' | 'interior' | 'seated';

interface CoffeeShopExperienceProps {
  onEarnPoints?: (points: number) => void;
}

export const CoffeeShopExperience = ({ onEarnPoints }: CoffeeShopExperienceProps) => {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleViewChange = (newView: ViewState) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(newView);
      setIsTransitioning(false);
    }, 500);
  };

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeat(seatId);
    handleViewChange('seated');
  };

  const handleBackToHub = () => {
    handleViewChange('landing');
    setSelectedSeat(null);
  };

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden bg-gradient-to-br from-[#8B4513] to-[#D2B48C] shadow-2xl">
      {/* Transition Overlay */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-[#8B4513]/90 z-50 flex items-center justify-center">
          <div className="text-white text-center">
            <Coffee className="h-8 w-8 mx-auto mb-2 animate-pulse" />
            <p className="text-lg font-medium">Entering the café...</p>
          </div>
        </div>
      )}

      {/* Landing View - Exterior */}
      {currentView === 'landing' && (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Coffee Shop Exterior Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(139, 69, 19, 0.3), rgba(210, 180, 140, 0.3)), url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><rect fill="%23654321" width="1200" height="600"/><rect fill="%238B4513" x="0" y="400" width="1200" height="200"/><rect fill="%23D2B48C" x="300" y="100" width="600" height="300" rx="20"/><rect fill="%23F5DEB3" x="320" y="120" width="560" height="260" rx="10"/><circle fill="%238B4513" cx="600" cy="250" r="30"/></svg>')`
            }}
          />
          
          {/* Floating Steam Effects */}
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white/30 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.5}s`,
                  transform: `translateX(${i * 20 - 20}px)`
                }}
              />
            ))}
          </div>

          {/* Welcome Content */}
          <div className="relative z-10 text-center text-white px-8">
            <div className="mb-6">
              <Badge className="bg-white/20 text-white border-white/30 mb-4">
                <Coffee className="h-4 w-4 mr-2" />
                Raw Smith Virtual Café
              </Badge>
            </div>
            
            <h2 className="text-4xl font-bold mb-4 text-shadow">
              Step Into Our Coffee World
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
              Experience our café atmosphere, meet fellow coffee lovers, and earn rewards in our immersive virtual space.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => handleViewChange('floorplan')}
                size="lg"
                className="bg-white text-[#8B4513] hover:bg-white/90 px-8 py-6 text-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Enter Café
              </Button>
              
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>12 online</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>Live chat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floor Plan View */}
      {currentView === 'floorplan' && (
        <div className="relative w-full h-full">
          <div className="absolute top-4 left-4 z-10">
            <Button
              onClick={handleBackToHub}
              variant="outline"
              size="sm"
              className="bg-white/90 text-[#8B4513] border-[#8B4513]/30 hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hub
            </Button>
          </div>
          
          <CoffeeShopFloorPlan 
            onSeatSelect={handleSeatSelect}
            onViewChange={handleViewChange}
          />
        </div>
      )}

      {/* Interior View */}
      {currentView === 'interior' && (
        <div className="relative w-full h-full">
          <div className="absolute top-4 left-4 z-10">
            <Button
              onClick={() => handleViewChange('floorplan')}
              variant="outline"
              size="sm"
              className="bg-white/90 text-[#8B4513] border-[#8B4513]/30 hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Floor Plan
            </Button>
          </div>
          
          <CoffeeShopInterior 
            onSeatSelect={handleSeatSelect}
            onBack={() => handleViewChange('floorplan')}
          />
        </div>
      )}

      {/* Seated Experience */}
      {currentView === 'seated' && selectedSeat && (
        <div className="relative w-full h-full">
          <div className="absolute top-4 left-4 z-10">
            <Button
              onClick={() => handleViewChange('interior')}
              variant="outline"
              size="sm"
              className="bg-white/90 text-[#8B4513] border-[#8B4513]/30 hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Stand Up
            </Button>
          </div>
          
          <CoffeeShopSeated 
            seatId={selectedSeat}
            onEarnPoints={onEarnPoints}
            onLeave={() => handleViewChange('interior')}
          />
        </div>
      )}
    </div>
  );
};
