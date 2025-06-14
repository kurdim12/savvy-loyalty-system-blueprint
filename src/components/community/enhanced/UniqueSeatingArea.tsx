
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Coffee, Music, Wifi, ArrowLeft, MapPin } from 'lucide-react';

interface SeatArea {
  id: string;
  name: string;
  type: 'cosmic' | 'vinyl' | 'zen' | 'workspace' | 'social' | 'window' | 'counter';
  capacity: number;
  occupied: number;
  users: Array<{
    name: string;
    mood: string;
    activity: string;
  }>;
  position: { x: number; y: number; width: number; height: number };
  theme: {
    gradient: string;
    accent: string;
    music: string;
  };
}

interface UniqueSeatingAreaProps {
  onSeatSelect: (seatId: string) => void;
  onViewChange: (view: string) => void;
}

export const UniqueSeatingArea = ({ onSeatSelect, onViewChange }: UniqueSeatingAreaProps) => {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);

  const seatAreas: SeatArea[] = [
    {
      id: 'cosmic-corner',
      name: 'Cosmic Corner',
      type: 'cosmic',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Luna', mood: '🌙', activity: 'Stargazing vibes' },
        { name: 'Nova', mood: '✨', activity: 'Deep thoughts' }
      ],
      position: { x: 5, y: 10, width: 25, height: 20 },
      theme: {
        gradient: 'from-purple-900/40 to-indigo-900/40',
        accent: 'border-purple-400/50',
        music: '🌌 Ambient Space'
      }
    },
    {
      id: 'vinyl-lounge',
      name: 'Vinyl Lounge',
      type: 'vinyl',
      capacity: 6,
      occupied: 4,
      users: [
        { name: 'Jazz', mood: '🎵', activity: 'Vinyl discovery' },
        { name: 'Blues', mood: '🎶', activity: 'Music sharing' },
        { name: 'Rock', mood: '🎸', activity: 'Album reviews' },
        { name: 'Soul', mood: '💿', activity: 'Groove session' }
      ],
      position: { x: 35, y: 10, width: 30, height: 25 },
      theme: {
        gradient: 'from-amber-900/40 to-orange-900/40',
        accent: 'border-amber-400/50',
        music: '🎵 Classic Vinyl'
      }
    },
    {
      id: 'zen-garden',
      name: 'Zen Garden',
      type: 'zen',
      capacity: 3,
      occupied: 1,
      users: [
        { name: 'Sage', mood: '🧘', activity: 'Meditation' }
      ],
      position: { x: 70, y: 10, width: 25, height: 20 },
      theme: {
        gradient: 'from-emerald-900/40 to-teal-900/40',
        accent: 'border-emerald-400/50',
        music: '🌿 Nature Sounds'
      }
    },
    {
      id: 'window-table-1',
      name: 'Street View Window',
      type: 'window',
      capacity: 2,
      occupied: 1,
      users: [
        { name: 'Alex', mood: '☕', activity: 'People watching' }
      ],
      position: { x: 5, y: 35, width: 20, height: 15 },
      theme: {
        gradient: 'from-sky-900/40 to-blue-900/40',
        accent: 'border-sky-400/50',
        music: '☁️ Cafe Jazz'
      }
    },
    {
      id: 'social-hub',
      name: 'Social Hub',
      type: 'social',
      capacity: 8,
      occupied: 5,
      users: [
        { name: 'Maya', mood: '🗣️', activity: 'Group chat' },
        { name: 'Sam', mood: '😄', activity: 'Making friends' },
        { name: 'River', mood: '🤝', activity: 'Networking' },
        { name: 'Taylor', mood: '💭', activity: 'Brainstorming' },
        { name: 'Casey', mood: '☕', activity: 'Coffee meetup' }
      ],
      position: { x: 30, y: 40, width: 35, height: 25 },
      theme: {
        gradient: 'from-pink-900/40 to-rose-900/40',
        accent: 'border-pink-400/50',
        music: '🎉 Upbeat Social'
      }
    },
    {
      id: 'workspace-zone',
      name: 'Focus Workspace',
      type: 'workspace',
      capacity: 6,
      occupied: 3,
      users: [
        { name: 'Dev', mood: '💻', activity: 'Coding session' },
        { name: 'Writer', mood: '✍️', activity: 'Creative writing' },
        { name: 'Designer', mood: '🎨', activity: 'Design work' }
      ],
      position: { x: 70, y: 35, width: 25, height: 20 },
      theme: {
        gradient: 'from-slate-900/40 to-gray-900/40',
        accent: 'border-slate-400/50',
        music: '🎧 Focus Beats'
      }
    },
    {
      id: 'counter-seats',
      name: 'Coffee Counter',
      type: 'counter',
      capacity: 5,
      occupied: 3,
      users: [
        { name: 'Barista', mood: '☕', activity: 'Coffee chat' },
        { name: 'Emma', mood: '📱', activity: 'Quick break' },
        { name: 'Chris', mood: '🍰', activity: 'Pastry tasting' }
      ],
      position: { x: 15, y: 70, width: 70, height: 15 },
      theme: {
        gradient: 'from-amber-900/40 to-yellow-900/40',
        accent: 'border-amber-400/50',
        music: '☕ Barista Beats'
      }
    }
  ];

  const getOccupancyColor = (occupied: number, capacity: number) => {
    const ratio = occupied / capacity;
    if (ratio < 0.5) return 'text-green-400';
    if (ratio < 0.8) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-white">
              <MapPin className="h-5 w-5" />
              Choose Your Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-white/80 text-sm">Each zone offers unique vibes and community</p>
          </CardContent>
        </Card>
        
        <Button
          onClick={() => onViewChange('overview')}
          variant="outline"
          className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Hub
        </Button>
      </div>

      {/* Main Floor Plan */}
      <div className="absolute inset-0 pt-24 pb-4 px-4">
        <div className="relative w-full h-full">
          {/* Ambient Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-indigo-900/20 rounded-lg" />
          
          {/* Seat Areas */}
          {seatAreas.map((area) => (
            <div
              key={area.id}
              className={`absolute cursor-pointer transition-all duration-500 rounded-xl border-2 ${
                area.theme.gradient
              } ${area.theme.accent} backdrop-blur-sm ${
                hoveredSeat === area.id 
                  ? 'scale-105 shadow-2xl shadow-purple-500/20 z-10' 
                  : 'hover:scale-[1.02] hover:shadow-lg'
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
              {/* Area Content */}
              <div className="p-4 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">{area.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`flex items-center gap-1 text-sm ${getOccupancyColor(area.occupied, area.capacity)}`}>
                      <Users className="h-4 w-4" />
                      <span>{area.occupied}/{area.capacity}</span>
                    </div>
                    {area.type === 'workspace' && <Wifi className="h-4 w-4 text-blue-400" />}
                    <Music className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="text-xs text-white/70 mb-2">{area.theme.music}</div>
                </div>

                {/* User Avatars */}
                <div className="flex flex-wrap gap-1">
                  {area.users.slice(0, 4).map((user, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-sm"
                      title={`${user.name} - ${user.activity}`}
                    >
                      {user.mood}
                    </div>
                  ))}
                  {area.users.length > 4 && (
                    <div className="w-8 h-8 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-xs text-white">
                      +{area.users.length - 4}
                    </div>
                  )}
                </div>
              </div>

              {/* Hover Effects */}
              {hoveredSeat === area.id && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl pointer-events-none" />
              )}
            </div>
          ))}

          {/* Floor Plan Labels */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-sm">
            Coffee Shop Floor Plan • Click any area to join
          </div>
        </div>
      </div>

      {/* Area Details Popup */}
      {hoveredSeat && (
        <div className="absolute bottom-20 left-8 z-30 max-w-sm">
          <Card className="bg-black/80 backdrop-blur-xl border-white/20">
            <CardContent className="p-4">
              {(() => {
                const area = seatAreas.find(a => a.id === hoveredSeat);
                if (!area) return null;
                
                return (
                  <>
                    <h3 className="text-white font-bold mb-2">{area.name}</h3>
                    <div className="text-white/80 text-sm mb-3">{area.theme.music}</div>
                    <div className="space-y-1 mb-3">
                      {area.users.map((user, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <span className="text-base">{user.mood}</span>
                          <span className="text-white font-medium">{user.name}</span>
                          <span className="text-white/60">- {user.activity}</span>
                        </div>
                      ))}
                    </div>
                    <Badge className="bg-purple-600/80 text-white border-purple-400/50">
                      Click to join this zone
                    </Badge>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
