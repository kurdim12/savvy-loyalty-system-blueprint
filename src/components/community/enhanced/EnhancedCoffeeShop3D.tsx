
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coffee, Cube, ArrowLeft, Users, Eye } from 'lucide-react';
import { PhotoRealistic3DCoffeeShop } from './PhotoRealistic3DCoffeeShop';
import { UltimateSeatingPlan } from './UltimateSeatingPlan';

interface EnhancedCoffeeShop3DProps {
  onBack?: () => void;
}

export const EnhancedCoffeeShop3D: React.FC<EnhancedCoffeeShop3DProps> = ({ onBack }) => {
  const [currentView, setCurrentView] = useState<'3d-realistic' | 'seating-plan'>('3d-realistic');

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-stone-50 to-amber-50">
      {/* View Toggle */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
        <Card className="bg-white/95 backdrop-blur-sm border-white/50">
          <CardContent className="p-2">
            <div className="flex gap-1">
              <Button
                onClick={() => setCurrentView('3d-realistic')}
                variant={currentView === '3d-realistic' ? 'default' : 'outline'}
                size="sm"
                className="text-xs"
              >
                <Cube className="h-3 w-3 mr-1" />
                3D Realistic
              </Button>
              <Button
                onClick={() => setCurrentView('seating-plan')}
                variant={currentView === 'seating-plan' ? 'default' : 'outline'}
                size="sm"
                className="text-xs"
              >
                <Eye className="h-3 w-3 mr-1" />
                Seating Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current View */}
      {currentView === '3d-realistic' ? (
        <PhotoRealistic3DCoffeeShop onBack={onBack} />
      ) : (
        <div className="w-full h-full">
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
          <UltimateSeatingPlan 
            hideHeader={false}
            onlineUsers={[
              { id: '1', seatId: 'window-seat-1', name: 'Alex', mood: '☕', status: 'working', activity: 'Coding' },
              { id: '2', seatId: 'main-bar-2', name: 'Sarah', mood: '😊', status: 'chatting', activity: 'Coffee chat' },
              { id: '3', seatId: 'table-1', name: 'Mike', mood: '📚', status: 'focused', activity: 'Reading' },
              { id: '4', seatId: 'lounge-1', name: 'Emma', mood: '💻', status: 'working', activity: 'Design work' }
            ]}
          />
        </div>
      )}
    </div>
  );
};
