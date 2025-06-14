
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import CSS3DCafeSimulation from './CSS3DCafeSimulation';
import { SeatedPerspectiveView } from './SeatedPerspectiveView';

interface Enhanced3DSeatingViewProps {
  onBack: () => void;
}

export const Enhanced3DSeatingView = ({ onBack }: Enhanced3DSeatingViewProps) => {
  const [currentView, setCurrentView] = useState<'3d-simulation' | 'seated'>('3d-simulation');
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeat(seatId);
    setCurrentView('seated');
  };

  const handleStandUp = () => {
    setCurrentView('3d-simulation');
    setSelectedSeat(null);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
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
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-screen'} bg-gradient-to-br from-stone-100 to-amber-50`}>
      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
        <Card className="bg-white/90 backdrop-blur-sm border-white/50">
          <CardContent className="p-4">
            <h2 className="text-xl font-bold text-stone-800 mb-1">3D Cave Cafe Experience</h2>
            <p className="text-stone-600 text-sm">
              Explore the cave-style architecture and unique seating areas
            </p>
          </CardContent>
        </Card>
        
        <div className="flex gap-2">
          <Button
            onClick={toggleFullscreen}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm border-white/50"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm border-white/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Community
          </Button>
        </div>
      </div>

      {/* CSS 3D Simulation */}
      <CSS3DCafeSimulation onSeatSelect={handleSeatSelect} />
    </div>
  );
};
