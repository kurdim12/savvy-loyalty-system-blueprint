
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, Users, MapPin, ArrowLeft } from 'lucide-react';
import { UniqueSeatingArea } from './enhanced/UniqueSeatingArea';
import { SeatedPerspectiveView } from './enhanced/SeatedPerspectiveView';

export const PhysicalCafeFloorPlan = () => {
  const [currentView, setCurrentView] = useState<'floor-plan' | 'seated'>('floor-plan');
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeat(seatId);
    setCurrentView('seated');
  };

  const handleStandUp = () => {
    setCurrentView('floor-plan');
    setSelectedSeat(null);
  };

  if (currentView === 'seated' && selectedSeat) {
    return (
      <SeatedPerspectiveView
        seatId={selectedSeat}
        tableId={selectedSeat}
        onStandUp={handleStandUp}
      />
    );
  }

  return (
    <Card className="w-full h-full min-h-[600px] bg-gradient-to-br from-stone-50 to-amber-50 border-stone-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-stone-800">
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-stone-600" />
            <div>
              <span className="text-xl">Your Café Floor Plan</span>
              <div className="text-sm text-stone-600 font-normal">Find your perfect spot</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500 text-white">
              <Users className="h-3 w-3 mr-1" />
              Live View
            </Badge>
            <Badge className="bg-amber-600 text-white">
              <Coffee className="h-3 w-3 mr-1" />
              Now Open
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 h-full">
        <div className="relative w-full h-[600px] overflow-hidden rounded-b-lg">
          <UniqueSeatingArea 
            onSeatSelect={handleSeatSelect}
            onViewChange={() => setCurrentView('floor-plan')}
          />
        </div>
      </CardContent>
    </Card>
  );
};
