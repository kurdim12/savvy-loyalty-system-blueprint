
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Coffee, Users, MessageCircle, Music, Wifi } from 'lucide-react';
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
  'counter-1': {
    name: 'Coffee Counter',
    view: 'Barista View',
    background: '/lovable-uploads/1cb7e4f9-a55e-4a48-aa05-f7e259a8657b.png',
    description: 'Front row seat to the coffee-making magic',
    atmosphere: 'energetic',
    nearbyPatrons: [
      { id: '1', name: 'Sarah M.', mood: '😊', activity: 'Ordering espresso', position: { x: 20, y: 30 } },
      { id: '2', name: 'Mike R.', mood: '💻', activity: 'Working on laptop', position: { x: 60, y: 40 } }
    ]
  },
  'window-table-1': {
    name: 'Window Table',
    view: 'Street View',
    background: '/lovable-uploads/e14bae4b-002f-43c3-afc6-604e5d3976a7.png',
    description: 'Watch the world go by while enjoying your coffee',
    atmosphere: 'peaceful',
    nearbyPatrons: [
      { id: '3', name: 'Alex K.', mood: '☕', activity: 'Coffee tasting', position: { x: 40, y: 50 } },
      { id: '4', name: 'Jordan P.', mood: '📖', activity: 'Reading novel', position: { x: 70, y: 30 } }
    ]
  },
  'center-table-1': {
    name: 'Social Hub',
    view: 'Community Center',
    background: '/lovable-uploads/b8f1af39-0790-44a9-aaad-8883e0af6666.png',
    description: 'Perfect spot for conversations and community vibes',
    atmosphere: 'social',
    nearbyPatrons: [
      { id: '5', name: 'Maya S.', mood: '🗣️', activity: 'Group discussion', position: { x: 30, y: 40 } },
      { id: '6', name: 'Chris T.', mood: '☕', activity: 'Coffee meeting', position: { x: 50, y: 60 } },
      { id: '7', name: 'Zoe W.', mood: '📝', activity: 'Taking notes', position: { x: 80, y: 35 } }
    ]
  }
};

export const SeatedPerspectiveView = ({ seatId, tableId, onStandUp }: SeatedPerspectiveViewProps) => {
  const [activePanel, setActivePanel] = useState<'chill' | 'music' | 'chat' | 'wifi'>('chill');
  const [sitDuration, setSitDuration] = useState(0);
  const currentSeat = seatViews[seatId as keyof typeof seatViews] || seatViews['counter-1'];

  useEffect(() => {
    const timer = setInterval(() => {
      setSitDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* First-Person Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.1)), url('${currentSeat.background}')`
        }}
      />

      {/* Atmospheric Overlay */}
      <div className={`absolute inset-0 ${
        currentSeat.atmosphere === 'energetic' ? 'bg-amber-900/10' :
        currentSeat.atmosphere === 'peaceful' ? 'bg-blue-900/10' :
        'bg-purple-900/10'
      }`} />

      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <h2 className="text-xl font-bold text-[#8B4513] mb-1">{currentSeat.name}</h2>
          <p className="text-sm text-gray-600 mb-2">{currentSeat.description}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Sitting for {Math.floor(sitDuration / 60)}:{(sitDuration % 60).toString().padStart(2, '0')}</span>
            <span>•</span>
            <span>{currentSeat.view}</span>
          </div>
        </div>
        
        <Button
          onClick={onStandUp}
          variant="outline"
          className="bg-white/90 backdrop-blur-sm hover:bg-white border-white/50"
        >
          Stand Up
        </Button>
      </div>

      {/* Personal Table Surface */}
      <PersonalTableSurface seatId={seatId} />

      {/* Nearby Patrons */}
      <NearbyPatrons patrons={currentSeat.nearbyPatrons} />

      {/* Bottom Panel Navigation */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            {[
              { key: 'chill', label: 'Sit & Chill', icon: Coffee },
              { key: 'music', label: 'Music', icon: Music },
              { key: 'chat', label: 'Chat', icon: MessageCircle },
              { key: 'wifi', label: 'WiFi', icon: Wifi }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActivePanel(key as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 ${
                  activePanel === key 
                    ? 'bg-[#8B4513] text-white' 
                    : 'text-gray-600 hover:bg-gray-50'
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
                  <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-[#8B4513] to-[#D2B48C] rounded-full flex items-center justify-center">
                    <Coffee className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-[#8B4513] mb-2">Peaceful Moments</h3>
                  <p className="text-gray-600 text-sm">
                    Relax and soak in the café atmosphere. Enjoy your {currentSeat.view.toLowerCase()}.
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
        </div>
      </div>
    </div>
  );
};
