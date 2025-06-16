
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, Users, MessageSquare, Calendar, Star, Crown, Sparkles, Zap } from 'lucide-react';
import { CinematicLanding } from './CinematicLanding';
import { UltimateCommunityExperience } from './ultimate/UltimateCommunityExperience';

export const CinematicCommunityHub = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'ultimate-experience'>('landing');
  
  const handleEnterCoffeeShop = () => {
    setCurrentView('ultimate-experience');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  if (currentView === 'ultimate-experience') {
    return <UltimateCommunityExperience onBack={handleBackToLanding} />;
  }

  if (currentView === 'landing') {
    return <CinematicLanding onEnterCoffeeShop={handleEnterCoffeeShop} />;
  }

  // Fallback hub view (shouldn't reach here)
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Card className="bg-gradient-to-r from-[#8B4513] to-[#D2B48C] text-white border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
            <Crown className="h-8 w-8 text-yellow-300" />
            Ultimate Raw Smith Café Community
          </CardTitle>
          <p className="text-white/90 text-lg">
            Experience the future of virtual community interaction
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">247</div>
              <div className="text-sm opacity-90">Members Online</div>
            </div>
            
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <MessageSquare className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">3.2k</div>
              <div className="text-sm opacity-90">Messages Today</div>
            </div>
            
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Calendar className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm opacity-90">Events This Week</div>
            </div>

            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Star className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">99%</div>
              <div className="text-sm opacity-90">Satisfaction</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-lg backdrop-blur-sm border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-yellow-300" />
                <span className="font-semibold">Netflix Production Quality</span>
              </div>
              <p className="text-sm text-white/80">Cinematic 3D environments with professional-grade visuals</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-4 rounded-lg backdrop-blur-sm border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-yellow-300" />
                <span className="font-semibold">AI-Powered Social Intelligence</span>
              </div>
              <p className="text-sm text-white/80">Smart recommendations and real-time social dynamics</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-4 rounded-lg backdrop-blur-sm border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-yellow-300" />
                <span className="font-semibold">Revolutionary 3D Audio</span>
              </div>
              <p className="text-sm text-white/80">Spatial audio that changes based on your location</p>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-4 rounded-lg backdrop-blur-sm border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Coffee className="h-5 w-5 text-yellow-300" />
                <span className="font-semibold">Mobile AR Integration</span>
              </div>
              <p className="text-sm text-white/80">See the café through augmented reality on your phone</p>
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={handleEnterCoffeeShop}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Crown className="h-6 w-6 mr-3" />
              Enter Ultimate Café Experience
            </Button>
            <p className="text-white/80 text-sm mt-2">
              Immerse yourself in the most advanced virtual café ever created
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
