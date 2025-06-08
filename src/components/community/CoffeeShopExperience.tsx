
import { useState } from 'react';
import { CoffeeShopFloorPlan } from './CoffeeShopFloorPlan';
import { CoffeeShopSeated } from './CoffeeShopSeated';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface CoffeeShopExperienceProps {
  onEarnPoints: (points: number) => void;
  onBack?: () => void;
}

export const CoffeeShopExperience = ({ onEarnPoints, onBack }: CoffeeShopExperienceProps) => {
  const [currentView, setCurrentView] = useState<'floor-plan' | 'seated'>('floor-plan');
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeat(seatId);
    setCurrentView('seated');
    onEarnPoints(2); // Award points for selecting a seat
  };

  const handleStandUp = () => {
    setCurrentView('floor-plan');
    setSelectedSeat(null);
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

      {currentView === 'floor-plan' ? (
        <CoffeeShopFloorPlan onSeatSelect={handleSeatSelect} />
      ) : (
        <CoffeeShopSeated 
          seatId={selectedSeat!}
          onStandUp={handleStandUp}
          onEarnPoints={onEarnPoints}
        />
      )}
    </div>
  );
};
