
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Coffee, Music, MessageCircle, MapPin, Volume2, Wifi, Star, Headphones } from 'lucide-react';

interface SeatArea {
  id: string;
  name: string;
  type: 'counter' | 'table' | 'lounge' | 'workspace';
  capacity: number;
  occupied: number;
  users: Array<{
    name: string;
    mood: string;
    activity: string;
  }>;
  position: { x: number; y: number; width: number; height: number };
}

interface EnhancedFloorPlanProps {
  onSeatSelect: (seatId: string) => void;
  onStartPrivateChat: (userId: string) => void;
}

export const EnhancedFloorPlan = ({ onSeatSelect, onStartPrivateChat }: EnhancedFloorPlanProps) => {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);
  const [showMusicRequest, setShowMusicRequest] = useState(false);

  const seatAreas: SeatArea[] = [
    {
      id: 'counter-1',
      name: 'Coffee Counter',
      type: 'counter',
      capacity: 6,
      occupied: 3,
      users: [
        { name: 'Sarah M.', mood: '😊', activity: 'Ordering espresso' },
        { name: 'Mike R.', mood: '💻', activity: 'Working on laptop' },
        { name: 'Emma L.', mood: '📱', activity: 'Taking photos' }
      ],
      position: { x: 15, y: 20, width: 25, height: 8 }
    },
    {
      id: 'window-table-1',
      name: 'Window Table',
      type: 'table',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Alex K.', mood: '☕', activity: 'Coffee tasting' },
        { name: 'Jordan P.', mood: '📖', activity: 'Reading novel' }
      ],
      position: { x: 10, y: 40, width: 18, height: 15 }
    },
    {
      id: 'center-table-1',
      name: 'Center Table',
      type: 'table',
      capacity: 6,
      occupied: 4,
      users: [
        { name: 'Maya S.', mood: '🗣️', activity: 'Group discussion' },
        { name: 'Chris T.', mood: '☕', activity: 'Coffee meeting' },
        { name: 'Zoe W.', mood: '📝', activity: 'Taking notes' },
        { name: 'Ryan H.', mood: '😄', activity: 'Sharing stories' }
      ],
      position: { x: 35, y: 35, width: 20, height: 20 }
    },
    {
      id: 'lounge-1',
      name: 'Cozy Lounge',
      type: 'lounge',
      capacity: 6,
      occupied: 2,
      users: [
        { name: 'Luna D.', mood: '🎵', activity: 'Listening to jazz' },
        { name: 'Noah G.', mood: '🌙', activity: 'Evening chill' }
      ],
      position: { x: 65, y: 25, width: 25, height: 25 }
    },
    {
      id: 'workspace-1',
      name: 'Quiet Workspace',
      type: 'workspace',
      capacity: 4,
      occupied: 1,
      users: [
        { name: 'Ivy C.', mood: '💼', activity: 'Focus work' }
      ],
      position: { x: 15, y: 65, width: 25, height: 15 }
    },
    {
      id: 'workspace-2',
      name: 'Collaborative Space',
      type: 'workspace',
      capacity: 8,
      occupied: 3,
      users: [
        { name: 'Sam B.', mood: '💡', activity: 'Brainstorming' },
        { name: 'Taylor M.', mood: '📊', activity: 'Data analysis' },
        { name: 'Casey L.', mood: '🤝', activity: 'Team meeting' }
      ],
      position: { x: 60, y: 60, width: 30, height: 20 }
    }
  ];

  const getAreaColor = (type: string) => {
    switch (type) {
      case 'counter': return 'bg-amber-500/30 border-amber-500/60 hover:bg-amber-500/40';
      case 'table': return 'bg-blue-500/30 border-blue-500/60 hover:bg-blue-500/40';
      case 'lounge': return 'bg-purple-500/30 border-purple-500/60 hover:bg-purple-500/40';
      case 'workspace': return 'bg-green-500/30 border-green-500/60 hover:bg-green-500/40';
      default: return 'bg-gray-500/30 border-gray-500/60 hover:bg-gray-500/40';
    }
  };

  const getOccupancyColor = (occupied: number, capacity: number) => {
    const ratio = occupied / capacity;
    if (ratio < 0.5) return 'text-green-300';
    if (ratio < 0.8) return 'text-yellow-300';
    return 'text-red-300';
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Café Interior */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lovable-uploads/1cb7e4f9-a55e-4a48-aa05-f7e259a8657b.png')`
        }}
      >
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <div className="flex justify-between items-center">
          <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
            <Coffee className="h-4 w-4 mr-2" />
            Raw Smith Virtual Café
          </Badge>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setShowMusicRequest(!showMusicRequest)}
              className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
            >
              <Music className="h-4 w-4 mr-2" />
              Music Requests
            </Button>
          </div>
        </div>
      </div>

      {/* Music Request Panel */}
      {showMusicRequest && (
        <div className="absolute top-20 right-4 z-30">
          <Card className="w-80 bg-white/90 backdrop-blur-sm border-white/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Headphones className="h-5 w-5 text-[#8B4513]" />
                <h3 className="font-semibold text-[#8B4513]">Now Playing</h3>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg mb-3">
                <p className="font-medium text-sm">Lo-Fi Coffee Jazz</p>
                <p className="text-xs text-gray-600">Requested by Maya S.</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-[#8B4513]">Request Queue</h4>
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  • Smooth Jazz Café Mix
                  • Acoustic Coffee Vibes
                  • Ambient Study Music
                </div>
              </div>
              <Button 
                size="sm" 
                className="w-full mt-3 bg-[#8B4513] hover:bg-[#8B4513]/90 text-white"
              >
                <Music className="h-4 w-4 mr-2" />
                Add Request
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Interactive Seating Areas */}
      {seatAreas.map((area) => (
        <div
          key={area.id}
          className={`absolute cursor-pointer transition-all duration-300 rounded-xl border-2 backdrop-blur-sm ${getAreaColor(area.type)} ${
            hoveredSeat === area.id 
              ? 'scale-105 shadow-2xl ring-2 ring-white/50' 
              : 'hover:scale-102 hover:shadow-lg'
          }`}
          style={{
            left: `${area.position.x}%`,
            top: `${area.position.y}%`,
            width: `${area.position.width}%`,
            height: `${area.position.height}%`
          }}
          onMouseEnter={() => setHoveredSeat(area.id)}
          onMouseLeave={() => setHoveredSeat(null)}
          onClick={() => onSeatSelect(area.id)}
        >
          <div className="p-3 h-full flex flex-col justify-between text-white">
            <div>
              <h4 className="font-bold text-sm mb-1 drop-shadow-lg">{area.name}</h4>
              <div className="flex items-center gap-2 mb-2">
                <div className={`flex items-center gap-1 text-xs ${getOccupancyColor(area.occupied, area.capacity)}`}>
                  <Users className="h-3 w-3" />
                  <span>{area.occupied}/{area.capacity}</span>
                </div>
                {area.type === 'workspace' && <Wifi className="h-3 w-3" />}
                {area.type === 'lounge' && <Volume2 className="h-3 w-3" />}
                {area.type === 'counter' && <Coffee className="h-3 w-3" />}
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {area.users.slice(0, 4).map((user, index) => (
                <div
                  key={index}
                  className="w-6 h-6 bg-black/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center text-xs border border-white/30"
                  title={`${user.name} - ${user.activity}`}
                >
                  {user.mood}
                </div>
              ))}
              {area.users.length > 4 && (
                <div className="w-6 h-6 bg-black/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center text-xs border border-white/30">
                  +{area.users.length - 4}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Feature Icons */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <div className="flex justify-center gap-4">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
            <MapPin className="h-4 w-4 text-white" />
            <span className="text-white text-sm font-medium">Premium Seating</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
            <MessageCircle className="h-4 w-4 text-white" />
            <span className="text-white text-sm font-medium">Private Chat</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
            <Star className="h-4 w-4 text-white" />
            <span className="text-white text-sm font-medium">Atmosphere</span>
          </div>
        </div>
      </div>

      {/* Hovered Area Details */}
      {hoveredSeat && (
        <div className="absolute bottom-20 left-4 z-30">
          <Card className="bg-white/95 backdrop-blur-sm border-white/50 max-w-xs">
            <CardContent className="p-4">
              {(() => {
                const area = seatAreas.find(a => a.id === hoveredSeat);
                if (!area) return null;
                
                return (
                  <>
                    <h3 className="font-bold text-[#8B4513] mb-2">{area.name}</h3>
                    <div className="space-y-1 mb-3">
                      {area.users.map((user, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-[#95A5A6]">
                          <span className="text-base">{user.mood}</span>
                          <span className="font-medium">{user.name}</span>
                          <span className="text-xs">- {user.activity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-[#8B4513] hover:bg-[#8B4513]/90 text-white">
                        <Coffee className="h-3 w-3 mr-1" />
                        Join
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartPrivateChat('nearby-users');
                        }}
                      >
                        <MessageCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Status Bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
          <div className="flex items-center gap-4 text-white text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>47 people online</span>
            </div>
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <span>Lo-Fi Jazz playing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
