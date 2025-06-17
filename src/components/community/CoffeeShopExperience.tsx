import { useState } from 'react';
import { PhysicalCafeFloorPlan } from './PhysicalCafeFloorPlan';
import { EnhancedCoffeeShop3D } from './enhanced/EnhancedCoffeeShop3D';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Box, Map, Coffee } from 'lucide-react';

interface CoffeeShopExperienceProps {
  onBack?: () => void;
}

export const CoffeeShopExperience = ({ onBack }: CoffeeShopExperienceProps) => {
  const [currentView, setCurrentView] = useState<'selection' | 'enhanced-3d' | 'floor-plan'>('selection');

  if (currentView === 'enhanced-3d') {
    return <EnhancedCoffeeShop3D onBack={() => setCurrentView('selection')} />;
  }

  if (currentView === 'floor-plan') {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-[#8B4513]/10 to-[#D2B48C]/20">
        <Button
          onClick={() => setCurrentView('selection')}
          variant="outline"
          className="absolute top-4 left-4 z-50 bg-white/90 backdrop-blur-sm hover:bg-white border-white/50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Selection
        </Button>
        <PhysicalCafeFloorPlan />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-stone-50 to-amber-50 flex items-center justify-center">
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

      {/* Experience Selection */}
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-stone-800 mb-4 flex items-center justify-center gap-3">
            <Coffee className="h-10 w-10 text-amber-600" />
            A Matter of Coffee
          </h1>
          <p className="text-xl text-stone-600">Choose your coffee shop experience</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 3D Realistic Experience */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-2 hover:border-amber-400"
            onClick={() => setCurrentView('enhanced-3d')}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Box className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">3D Realistic View</h3>
              <p className="text-stone-600 mb-4">
                Immersive photorealistic 3D coffee shop with industrial-minimalist design. 
                Features L-shaped bar, exterior service window, and seamless interior flow.
              </p>
              <div className="text-sm text-stone-500 space-y-1">
                <div>• Photorealistic materials and lighting</div>
                <div>• Interactive camera controls</div>
                <div>• Complete interior and exterior</div>
                <div>• Based on reference photos</div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Seating Plan */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-2 hover:border-amber-400"
            onClick={() => setCurrentView('floor-plan')}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Map className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">Interactive Floor Plan</h3>
              <p className="text-stone-600 mb-4">
                Top-down seating view with real-time user presence, seat selection, 
                and community features. Perfect for social interaction.
              </p>
              <div className="text-sm text-stone-500 space-y-1">
                <div>• Real-time user presence</div>
                <div>• Seat selection and chat</div>
                <div>• Zone-based interactions</div>
                <div>• Community features</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-stone-500 text-sm">
            Both experiences feature the same L-shaped bar layout with window seating, 
            modern furniture, and expert baristas behind the counter.
          </p>
        </div>
      </div>
    </div>
  );
};
