
import { useState } from 'react';
import { PhysicalCafeFloorPlan } from './PhysicalCafeFloorPlan';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface CoffeeShopExperienceProps {
  onBack?: () => void;
}

export const CoffeeShopExperience = ({ onBack }: CoffeeShopExperienceProps) => {
  const [currentView, setCurrentView] = useState<'floor-plan' | 'seated'>('floor-plan');
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  const handleSeatSelect = (seatId: string) => {
    console.log('Seat selected:', seatId);
    setSelectedSeat(seatId);
    setCurrentView('seated');
  };

  const handleStandUp = () => {
    setCurrentView('floor-plan');
    setSelectedSeat(null);
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#8B4513]/10 to-[#D2B48C]/20">
      {/* Back Button */}
      {onBack && (
        <Button
          onClick={onBack}
          variant="outline"
          className="absolute top-4 left-4 z-50 bg-white/90 backdrop-blur-sm hover:bg-white border-white/50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Hub
        </Button>
      )}

      {/* Main Coffee Shop Experience */}
      <div className="w-full h-full">
        <PhysicalCafeFloorPlan />
      </div>
    </div>
  );
};
