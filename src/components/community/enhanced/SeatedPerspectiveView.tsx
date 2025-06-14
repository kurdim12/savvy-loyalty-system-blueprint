
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Coffee, Users, MessageCircle, Music, Wifi, ArrowLeft } from 'lucide-react';
import { SitAndChillTimer } from './SitAndChillTimer';
import { PersonalTableSurface } from './PersonalTableSurface';
import { NearbyPatrons } from './NearbyPatrons';
import { CommunityMusicPlayer } from './CommunityMusicPlayer';
import { WifiInformationCard } from './WifiInformationCard';
import { RealTimeChat } from '../RealTimeChat';

interface SeatedPerspectiveViewProps {
  seatId: string;
  tableId: string;
  onStandUp: () => void;
}

const seatViews = {
  'cosmic-corner': {
    name: 'Cosmic Corner',
    view: 'Stargazing Haven',
    background: '/lovable-uploads/5404e14c-b49d-4de3-b6c1-4d58b8ec620f.png',
    description: 'Immerse yourself in cosmic vibes and deep conversations',
    atmosphere: 'cosmic',
    nearbyPatrons: [
      { id: '1', name: 'Luna', mood: '🌙', activity: 'Stargazing vibes', position: { x: 20, y: 30 } },
      { id: '2', name: 'Nova', mood: '✨', activity: 'Deep thoughts', position: { x: 60, y: 40 } }
    ]
  },
  'vinyl-lounge': {
    name: 'Vinyl Lounge',
    view: 'Music Discovery Zone',
    background: '/lovable-uploads/680bf950-de42-45c2-bcfd-0e9b786df840.png',
    description: 'Discover rare vinyl records and share musical experiences',
    atmosphere: 'musical',
    nearbyPatrons: [
      { id: '3', name: 'Jazz', mood: '🎵', activity: 'Vinyl discovery', position: { x: 40, y: 50 } },
      { id: '4', name: 'Blues', mood: '🎶', activity: 'Music sharing', position: { x: 70, y: 30 } },
      { id: '5', name: 'Rock', mood: '🎸', activity: 'Album reviews', position: { x: 30, y: 60 } }
    ]
  },
  'zen-garden': {
    name: 'Zen Garden',
    view: 'Peaceful Retreat',
    background: '/lovable-uploads/9e789f3f-a692-425c-b0fb-fdd4abbe5390.png',
    description: 'Find inner peace and mindful coffee moments',
    atmosphere: 'peaceful',
    nearbyPatrons: [
      { id: '6', name: 'Sage', mood: '🧘', activity: 'Meditation', position: { x: 50, y: 40 } }
    ]
  },
  'window-table-1': {
    name: 'Street View Window',
    view: 'Urban Observatory',
    background: '/lovable-uploads/e14bae4b-002f-43c3-afc6-604e5d3976a7.png',
    description: 'Watch the world go by while enjoying your coffee',
    atmosphere: 'observational',
    nearbyPatrons: [
      { id: '7', name: 'Alex', mood: '☕', activity: 'People watching', position: { x: 40, y: 50 } }
    ]
  },
  'social-hub': {
    name: 'Social Hub',
    view: 'Community Center',
    background: '/lovable-uploads/b8f1af39-0790-44a9-aaad-8883e0af6666.png',
    description: 'Perfect spot for conversations and community vibes',
    atmosphere: 'social',
    nearbyPatrons: [
      { id: '8', name: 'Maya', mood: '🗣️', activity: 'Group chat', position: { x: 30, y: 40 } },
      { id: '9', name: 'Sam', mood: '😄', activity: 'Making friends', position: { x: 50, y: 60 } },
      { id: '10', name: 'River', mood: '🤝', activity: 'Networking', position: { x: 70, y: 35 } }
    ]
  },
  'workspace-zone': {
    name: 'Focus Workspace',
    view: 'Productivity Hub',
    background: '/lovable-uploads/8d4d71ac-a5a9-4e5d-92d5-3083e04eeda7.png',
    description: 'Quiet zone for focused work and creative projects',
    atmosphere: 'focused',
    nearbyPatrons: [
      { id: '11', name: 'Dev', mood: '💻', activity: 'Coding session', position: { x: 25, y: 45 } },
      { id: '12', name: 'Writer', mood: '✍️', activity: 'Creative writing', position: { x: 65, y: 40 } }
    ]
  },
  'counter-seats': {
    name: 'Coffee Counter',
    view: 'Barista Connection',
    background: '/lovable-uploads/1cb7e4f9-a55e-4a48-aa05-f7e259a8657b.png',
    description: 'Front row seat to the coffee-making magic',
    atmosphere: 'energetic',
    nearbyPatrons: [
      { id: '13', name: 'Barista', mood: '☕', activity: 'Coffee chat', position: { x: 20, y: 30 } },
      { id: '14', name: 'Emma', mood: '📱', activity: 'Quick break', position: { x: 60, y: 40 } }
    ]
  }
};

export const SeatedPerspectiveView = ({ seatId, tableId, onStandUp }: SeatedPerspectiveViewProps) => {
  const [activePanel, setActivePanel] = useState<'chill' | 'music' | 'chat' | 'wifi'>('chill');
  const [sitDuration, setSitDuration] = useState(0);
  const currentSeat = seatViews[seatId as keyof typeof seatViews] || seatViews['counter-seats'];

  useEffect(() => {
    const timer = setInterval(() => {
      setSitDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getAtmosphereOverlay = (atmosphere: string) => {
    switch (atmosphere) {
      case 'cosmic': return 'bg-purple-900/20';
      case 'musical': return 'bg-amber-900/20';
      case 'peaceful': return 'bg-emerald-900/20';
      case 'observational': return 'bg-blue-900/20';
      case 'social': return 'bg-pink-900/20';
      case 'focused': return 'bg-slate-900/20';
      case 'energetic': return 'bg-yellow-900/20';
      default: return 'bg-gray-900/20';
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* First-Person Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.2)), url('${currentSeat.background}')`
        }}
      />

      {/* Atmospheric Overlay */}
      <div className={`absolute inset-0 ${getAtmosphereOverlay(currentSeat.atmosphere)}`} />

      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
        <Card className="bg-black/60 backdrop-blur-xl border-white/20">
          <CardContent className="p-4">
            <h2 className="text-xl font-bold text-white mb-1">{currentSeat.name}</h2>
            <p className="text-white/80 text-sm mb-2">{currentSeat.description}</p>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <span>Sitting for {Math.floor(sitDuration / 60)}:{(sitDuration % 60).toString().padStart(2, '0')}</span>
              <span>•</span>
              <span>{currentSeat.view}</span>
            </div>
          </CardContent>
        </Card>
        
        <Button
          onClick={onStandUp}
          variant="outline"
          className="bg-black/60 backdrop-blur-xl border-white/20 text-white hover:bg-black/80"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Stand Up
        </Button>
      </div>

      {/* Personal Table Surface */}
      <PersonalTableSurface seatId={seatId} />

      {/* Nearby Patrons */}
      <NearbyPatrons patrons={currentSeat.nearbyPatrons} />

      {/* Bottom Panel Navigation */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <Card className="bg-black/80 backdrop-blur-xl border-white/20">
          {/* Tab Navigation */}
          <div className="flex border-b border-white/20">
            {[
              { key: 'chill', label: 'Sit & Chill', icon: Coffee },
              { key: 'music', label: 'Music', icon: Music },
              { key: 'chat', label: 'Area Chat', icon: MessageCircle },
              { key: 'wifi', label: 'WiFi', icon: Wifi }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActivePanel(key as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 transition-colors ${
                  activePanel === key 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>

          {/* Panel Content */}
          <div className="p-4 max-h-96 overflow-y-auto">
            {activePanel === 'chill' && (
              <div className="space-y-4">
                <SitAndChillTimer />
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <Coffee className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Peaceful Moments</h3>
                  <p className="text-white/70 text-sm">
                    Relax and soak in the {currentSeat.name} atmosphere. Enjoy your {currentSeat.view.toLowerCase()}.
                  </p>
                </div>
              </div>
            )}

            {activePanel === 'music' && (
              <CommunityMusicPlayer />
            )}

            {activePanel === 'chat' && (
              <div className="h-80">
                <RealTimeChat 
                  seatArea={seatId} 
                  onlineUsers={currentSeat.nearbyPatrons.map(p => ({ 
                    name: p.name, 
                    mood: p.mood, 
                    activity: p.activity 
                  }))} 
                />
              </div>
            )}

            {activePanel === 'wifi' && (
              <WifiInformationCard location="seated" />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
