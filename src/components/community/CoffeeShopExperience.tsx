
import { useState } from 'react';
import { PhysicalCafeFloorPlan } from './PhysicalCafeFloorPlan';
import { EnhancedCoffeeShop3D } from './enhanced/EnhancedCoffeeShop3D';
import { PhotoRealistic3DCafe } from './enhanced/PhotoRealistic3DCafe';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Box, Map, Coffee, Camera } from 'lucide-react';

interface CoffeeShopExperienceProps {
  onBack?: () => void;
}

export const CoffeeShopExperience = ({ onBack }: CoffeeShopExperienceProps) => {
  const [currentView, setCurrentView] = useState<'selection' | 'enhanced-3d' | 'photorealistic-3d' | 'floor-plan'>('selection');

  if (currentView === 'enhanced-3d') {
    return <EnhancedCoffeeShop3D onBack={() => setCurrentView('selection')} />;
  }

  if (currentView === 'photorealistic-3d') {
    return <PhotoRealistic3DCafe onBack={() => setCurrentView('selection')} />;
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
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-stone-800 mb-4 flex items-center justify-center gap-3">
            <Coffee className="h-10 w-10 text-amber-600" />
            RawSmith Coffee Experience
          </h1>
          <p className="text-xl text-stone-600">Choose your immersive coffee shop experience</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Photorealistic 3D Experience */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-2 hover:border-amber-400"
            onClick={() => setCurrentView('photorealistic-3d')}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-stone-600 to-stone-800 rounded-xl flex items-center justify-center">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">Photorealistic 3D</h3>
              <p className="text-stone-600 mb-4">
                Professional-grade 3D interior with L-shaped concrete bar, brass accents, 
                and authentic industrial materials. Realistic lighting and shadows.
              </p>
              <div className="text-sm text-stone-500 space-y-1">
                <div>• Precise L-shaped bar dimensions</div>
                <div>• Concrete and brass materials</div>
                <div>• Professional lighting setup</div>
                <div>• Interactive camera controls</div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced 3D Experience */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-2 hover:border-amber-400"
            onClick={() => setCurrentView('enhanced-3d')}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Box className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">Enhanced 3D View</h3>
              <p className="text-stone-600 mb-4">
                Stylized 3D coffee shop with interactive elements, user avatars, 
                and gamified features. Perfect for social interaction.
              </p>
              <div className="text-sm text-stone-500 space-y-1">
                <div>• Stylized 3D environment</div>
                <div>• User avatar system</div>
                <div>• Interactive elements</div>
                <div>• Social features</div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Floor Plan */}
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
                and community features. Quick and functional.
              </p>
              <div className="text-sm text-stone-500 space-y-1">
                <div>• Real-time user presence</div>
                <div>• Seat selection and chat</div>
                <div>• Zone-based interactions</div>
                <div>• Quick navigation</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-stone-500 text-sm">
            All experiences feature the same L-shaped concrete bar with brass kick plates, 
            industrial seating, and expert baristas. Choose the level of immersion that suits you.
          </p>
        </div>
      </div>
    </div>
  );
};
