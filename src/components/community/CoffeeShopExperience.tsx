
import { useState } from 'react';
import { EnhancedFloorPlan } from './EnhancedFloorPlan';
import { CoffeeShopSeated } from './CoffeeShopSeated';
import { PrivateChatSystem } from './PrivateChatSystem';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface CoffeeShopExperienceProps {
  onBack?: () => void;
}

export const CoffeeShopExperience = ({ onBack }: CoffeeShopExperienceProps) => {
  const [currentView, setCurrentView] = useState<'floor-plan' | 'seated'>('floor-plan');
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [showPrivateChat, setShowPrivateChat] = useState(false);

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeat(seatId);
    setCurrentView('seated');
  };

  const handleStandUp = () => {
    setCurrentView('floor-plan');
    setSelectedSeat(null);
    setShowPrivateChat(false);
  };

  const handleStartPrivateChat = (userId: string) => {
    setShowPrivateChat(true);
  };

  const handleClosePrivateChat = () => {
    setShowPrivateChat(false);
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-[#8B4513]/10 to-[#D2B48C]/20">
      {/* Back Button */}
      {onBack && (
        <Button
          onClick={onBack}
          variant="outline"
          className="absolute top-4 left-4 z-50 bg-white/90 backdrop-blur-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Hub
        </Button>
      )}

      {/* Always show the Enhanced Floor Plan first, then switch to seated view */}
      {currentView === 'floor-plan' ? (
        <EnhancedFloorPlan 
          onSeatSelect={handleSeatSelect}
          onStartPrivateChat={handleStartPrivateChat}
        />
      ) : (
        <CoffeeShopSeated 
          seatId={selectedSeat!}
          onLeave={handleStandUp}
        />
      )}

      {/* Private Chat System */}
      {showPrivateChat && selectedSeat && (
        <PrivateChatSystem
          currentSeatId={selectedSeat}
          onClose={handleClosePrivateChat}
        />
      )}
    </div>
  );
};
