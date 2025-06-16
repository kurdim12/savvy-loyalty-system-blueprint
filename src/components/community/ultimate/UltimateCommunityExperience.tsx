
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Coffee, 
  Users, 
  Gamepad2, 
  Smartphone, 
  Brain, 
  Volume2, 
  Settings,
  ArrowLeft,
  Maximize2,
  Crown
} from 'lucide-react';
import { UltimateWebGL3DEngine } from './UltimateWebGL3DEngine';
import { AIIntelligenceLayer } from './AIIntelligenceLayer';
import { NextGenAvatar, AvatarCustomizationPanel } from './NextGenAvatarSystem';
import { Revolutionary3DAudio } from './Revolutionary3DAudio';
import { GamificationEngine } from './GamificationEngine';
import { MobileARExperience } from './MobileARExperience';
import { RealTimeSocialDynamics } from './RealTimeSocialDynamics';

interface UltimateCommunityExperienceProps {
  onBack: () => void;
}

export const UltimateCommunityExperience = ({ onBack }: UltimateCommunityExperienceProps) => {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [userPosition, setUserPosition] = useState<[number, number, number]>([0, 1, 0]);
  const [weather, setWeather] = useState<'sunny' | 'cloudy' | 'rainy' | 'evening' | 'snowy'>('sunny');
  const [timeOfDay, setTimeOfDay] = useState(14); // 2 PM
  const [userMood, setUserMood] = useState('😊');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('3d-world');
  
  // Avatar system state
  const [userEmotion, setUserEmotion] = useState<'happy' | 'excited' | 'calm' | 'focused' | 'creative' | 'social'>('happy');
  const [userGesture, setUserGesture] = useState<'wave' | 'coffee_sip' | 'typing' | 'listening' | 'thinking' | 'idle'>('idle');
  const [userAura, setUserAura] = useState<'creative' | 'social' | 'focused' | 'energetic' | 'calm'>('social');
  
  // Audio system state
  const [audioZones] = useState([
    { id: 'ambient', name: 'Café Ambience', position: [0, 0, 0] as [number, number, number], radius: 10, audioUrl: '', volume: 0.3, type: 'ambient' as const },
    { id: 'music', name: 'Background Music', position: [-2, 0, -5] as [number, number, number], radius: 8, audioUrl: '', volume: 0.4, type: 'music' as const },
    { id: 'social-area', name: 'Social Zone', position: [3, 0, 2] as [number, number, number], radius: 5, audioUrl: '', volume: 0.2, type: 'conversation' as const }
  ]);

  // Mock user data for AI system
  const currentUser = {
    id: 'current-user',
    name: 'You',
    interests: ['coffee', 'technology', 'books', 'travel'],
    personality: 'ambivert' as const,
    mood: userMood,
    conversationStyle: 'casual' as const
  };

  const nearbyUsers = [
    {
      id: 'user-1',
      name: 'Alex',
      interests: ['coffee', 'technology', 'startup'],
      personality: 'extrovert' as const,
      mood: '☕',
      conversationStyle: 'professional' as const
    },
    {
      id: 'user-2', 
      name: 'Sarah',
      interests: ['books', 'coffee', 'art'],
      personality: 'introvert' as const,
      mood: '📚',
      conversationStyle: 'deep' as const
    }
  ];

  // Mock AR markers
  const arMarkers = [
    { id: 'user-1', position: [2, 1] as [number, number], type: 'user' as const, data: { name: 'Alex' }, distance: 3.2 },
    { id: 'seat-1', position: [-1, 2] as [number, number], type: 'seat' as const, data: { name: 'Corner Table' }, distance: 2.1 },
    { id: 'menu-1', position: [0, -3] as [number, number], type: 'menu' as const, data: { name: 'Today\'s Specials' }, distance: 4.5 },
    { id: 'event-1', position: [3, -1] as [number, number], type: 'event' as const, data: { name: 'Book Club' }, distance: 1.8 }
  ];

  useEffect(() => {
    // Update time of day every minute (simulated)
    const timeInterval = setInterval(() => {
      setTimeOfDay(prev => (prev + 0.1) % 24);
    }, 10000);

    // Change weather every 30 seconds (simulated)
    const weatherInterval = setInterval(() => {
      const weathers: ('sunny' | 'cloudy' | 'rainy' | 'evening' | 'snowy')[] = 
        ['sunny', 'cloudy', 'rainy', 'evening', 'snowy'];
      setWeather(weathers[Math.floor(Math.random() * weathers.length)]);
    }, 30000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(weatherInterval);
    };
  }, []);

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeat(seatId);
    // Update user position based on seat
    const seatPositions: Record<string, [number, number, number]> = {
      'table-1': [-3, 1, -2],
      'table-2': [3, 1, -2],
      'table-3': [-3, 1, 2],
      'table-4': [3, 1, 2],
      'counter-1': [0, 1, -6],
      'counter-2': [2, 1, -6]
    };
    setUserPosition(seatPositions[seatId] || [0, 1, 0]);
  };

  const handleAIRecommendation = (recommendation: string) => {
    console.log('AI Recommendation:', recommendation);
    // In a real app, this would trigger appropriate actions
  };

  const handleVolumeChange = (zoneId: string, volume: number) => {
    // Update audio zone volume
    console.log(`Zone ${zoneId} volume changed to ${volume}`);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full min-h-screen'} bg-gradient-to-br from-amber-50 to-orange-50`}>
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
        <Card className="bg-white/90 backdrop-blur-sm border-white/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-yellow-600" />
              <div>
                <h2 className="text-xl font-bold text-amber-800">Ultimate Café Experience</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    Netflix Production Quality
                  </Badge>
                  <Badge variant="outline">{weather} • {Math.floor(timeOfDay)}:00</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex gap-2">
          <Button
            onClick={toggleFullscreen}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm border-white/50"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm border-white/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Main Experience */}
      <div className="flex h-screen pt-20">
        {/* Left Panel - 3D World */}
        <div className="flex-1">
          <UltimateWebGL3DEngine
            weather={weather}
            timeOfDay={timeOfDay}
            userMood={userMood}
            onSeatSelect={handleSeatSelect}
          />
        </div>

        {/* Right Panel - Features */}
        <div className="w-96 bg-white/95 backdrop-blur-sm border-l border-white/50 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 sticky top-0 z-10">
              <TabsTrigger value="3d-world" className="text-xs">
                <Coffee className="h-3 w-3 mr-1" />
                World
              </TabsTrigger>
              <TabsTrigger value="social" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                Social
              </TabsTrigger>
              <TabsTrigger value="features" className="text-xs">
                <Settings className="h-3 w-3 mr-1" />
                Features
              </TabsTrigger>
            </TabsList>

            <div className="p-4">
              <TabsContent value="3d-world" className="space-y-4 mt-0">
                {/* Avatar Customization */}
                <AvatarCustomizationPanel
                  onEmotionChange={(emotion) => setUserEmotion(emotion as any)}
                  onGestureChange={(gesture) => setUserGesture(gesture as any)}
                  onAuraChange={(aura) => setUserAura(aura as any)}
                />

                {/* AI Intelligence */}
                <AIIntelligenceLayer
                  currentUser={currentUser}
                  nearbyUsers={nearbyUsers}
                  onRecommendation={handleAIRecommendation}
                />

                {/* 3D Audio */}
                <Revolutionary3DAudio
                  userPosition={userPosition}
                  audioZones={audioZones}
                  onVolumeChange={handleVolumeChange}
                />
              </TabsContent>

              <TabsContent value="social" className="space-y-4 mt-0">
                <RealTimeSocialDynamics />
              </TabsContent>

              <TabsContent value="features" className="space-y-4 mt-0">
                {/* Gamification */}
                <GamificationEngine />

                {/* Mobile AR */}
                <MobileARExperience
                  userLocation={[userPosition[0], userPosition[2]]}
                  nearbyMarkers={arMarkers}
                  onMarkerSelect={(marker) => console.log('AR Marker selected:', marker)}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Floating Avatar (if seated) */}
      {selectedSeat && (
        <div className="absolute bottom-4 left-4 z-20">
          <NextGenAvatar
            userId="current-user"
            name="You"
            mood={userMood}
            activity="Having coffee"
            emotion={userEmotion}
            gesture={userGesture}
            aura={userAura}
            position={[0, 0, 0]}
            onInteract={(action) => console.log('Avatar interaction:', action)}
          />
        </div>
      )}

      {/* Status Bar */}
      <div className="absolute bottom-4 right-4 z-20">
        <Card className="bg-black/80 backdrop-blur-sm border-white/20 text-white">
          <CardContent className="p-3">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{nearbyUsers.length + 1} online</span>
              </div>
              <div className="flex items-center gap-1">
                <Volume2 className="h-3 w-3" />
                <span>3D Audio</span>
              </div>
              <div className="flex items-center gap-1">
                <Brain className="h-3 w-3" />
                <span>AI Active</span>
              </div>
              {selectedSeat && (
                <div className="flex items-center gap-1">
                  <Coffee className="h-3 w-3" />
                  <span>Seated</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
