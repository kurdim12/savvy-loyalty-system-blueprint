
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Coffee, ChefHat, Crown } from 'lucide-react';

interface UniqueSeatingAreaProps {
  onSeatSelect: (seatId: string) => void;
  onViewChange: (view: 'interior') => void;
}

interface SeatZone {
  id: string;
  name: string;
  theme: string;
  atmosphere: string;
  capacity: number;
  occupied: number;
  users: Array<{
    name: string;
    mood: string;
    activity: string;
    vibe: string;
  }>;
  position: { x: number; y: number; width: number; height: number };
  specialFeature: string;
  musicGenre: string;
  ambiance: string;
  shape?: 'round' | 'square' | 'rectangle';
}

interface Barista {
  name: string;
  mood: string;
  activity: string;
  specialty: string;
  isWorking: boolean;
}

export const UniqueSeatingArea = ({ onSeatSelect, onViewChange }: UniqueSeatingAreaProps) => {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const barista: Barista = {
    name: 'Marco',
    mood: '☕',
    activity: 'Crafting perfect espresso',
    specialty: 'Latte Art Master',
    isWorking: true
  };

  const seatingZones: SeatZone[] = [
    // Bar Counter Stools (Top right area from image)
    {
      id: 'bar-stool-1',
      name: 'Bar Stool 1',
      theme: 'Counter Service',
      atmosphere: 'social',
      capacity: 1,
      occupied: 1,
      users: [
        { name: 'Alex', mood: '💼', activity: 'Quick coffee', vibe: 'focused' }
      ],
      position: { x: 70, y: 15, width: 6, height: 8 },
      specialFeature: 'Direct barista interaction',
      musicGenre: 'Upbeat Coffee',
      ambiance: 'amber-warm',
      shape: 'round'
    },
    {
      id: 'bar-stool-2',
      name: 'Bar Stool 2',
      theme: 'Counter Service',
      atmosphere: 'social',
      capacity: 1,
      occupied: 0,
      users: [],
      position: { x: 78, y: 15, width: 6, height: 8 },
      specialFeature: 'Direct barista interaction',
      musicGenre: 'Upbeat Coffee',
      ambiance: 'amber-warm',
      shape: 'round'
    },
    {
      id: 'bar-stool-3',
      name: 'Bar Stool 3',
      theme: 'Counter Service',
      atmosphere: 'social',
      capacity: 1,
      occupied: 1,
      users: [
        { name: 'Sofia', mood: '😊', activity: 'Chatting with barista', vibe: 'friendly' }
      ],
      position: { x: 86, y: 15, width: 6, height: 8 },
      specialFeature: 'Direct barista interaction',
      musicGenre: 'Upbeat Coffee',
      ambiance: 'amber-warm',
      shape: 'round'
    },

    // Round Table 1 (Left side from image)
    {
      id: 'round-table-1',
      name: 'Round Table 1',
      theme: 'Intimate Conversations',
      atmosphere: 'cozy',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Emma', mood: '📖', activity: 'Reading book', vibe: 'peaceful' },
        { name: 'James', mood: '☕', activity: 'Enjoying latte', vibe: 'relaxed' }
      ],
      position: { x: 15, y: 25, width: 18, height: 18 },
      specialFeature: 'Perfect for small groups',
      musicGenre: 'Soft Acoustic',
      ambiance: 'green-natural',
      shape: 'round'
    },

    // Round Table 2 (Left side, lower from image)
    {
      id: 'round-table-2',
      name: 'Round Table 2',
      theme: 'Study Corner',
      atmosphere: 'focused',
      capacity: 4,
      occupied: 3,
      users: [
        { name: 'Maya', mood: '💻', activity: 'Working on laptop', vibe: 'concentrated' },
        { name: 'Chris', mood: '📝', activity: 'Taking notes', vibe: 'studious' },
        { name: 'Sam', mood: '🤔', activity: 'Deep thinking', vibe: 'contemplative' }
      ],
      position: { x: 15, y: 55, width: 18, height: 18 },
      specialFeature: 'Great for work sessions',
      musicGenre: 'Focus Instrumentals',
      ambiance: 'blue-calm',
      shape: 'round'
    },

    // Lounge Seating (Green chairs from image - middle right area)
    {
      id: 'lounge-seating',
      name: 'Lounge Area',
      theme: 'Comfortable Relaxation',
      atmosphere: 'cozy',
      capacity: 6,
      occupied: 4,
      users: [
        { name: 'Luna', mood: '🌿', activity: 'Reading magazine', vibe: 'relaxed' },
        { name: 'River', mood: '☕', activity: 'Slow coffee', vibe: 'peaceful' },
        { name: 'Sage', mood: '🎵', activity: 'Listening to music', vibe: 'content' },
        { name: 'Ash', mood: '😌', activity: 'People watching', vibe: 'calm' }
      ],
      position: { x: 50, y: 35, width: 25, height: 20 },
      specialFeature: 'Plush armchairs & sofas',
      musicGenre: 'Chill Lounge',
      ambiance: 'green-study',
      shape: 'rectangle'
    },

    // Rectangular Table (From image layout)
    {
      id: 'rectangular-table',
      name: 'Community Table',
      theme: 'Shared Workspace',
      atmosphere: 'collaborative',
      capacity: 8,
      occupied: 5,
      users: [
        { name: 'Jordan', mood: '💼', activity: 'Business meeting', vibe: 'professional' },
        { name: 'Taylor', mood: '🗣️', activity: 'Group discussion', vibe: 'engaged' },
        { name: 'Casey', mood: '📊', activity: 'Presentation prep', vibe: 'focused' },
        { name: 'Alex', mood: '🤝', activity: 'Networking', vibe: 'social' },
        { name: 'Morgan', mood: '💡', activity: 'Brainstorming', vibe: 'creative' }
      ],
      position: { x: 45, y: 65, width: 30, height: 15 },
      specialFeature: 'Large shared workspace',
      musicGenre: 'Background Jazz',
      ambiance: 'purple-vibrant',
      shape: 'rectangle'
    }
  ];

  const getZoneStyle = (zone: SeatZone) => {
    const baseStyle = "absolute cursor-pointer transition-all duration-500 border-2 shadow-xl";
    const hoverStyle = hoveredZone === zone.id ? 'scale-105 shadow-2xl z-20' : 'hover:scale-102 hover:shadow-xl';
    
    const shapeClass = zone.shape === 'round' ? 'rounded-full' : 'rounded-2xl';
    
    const ambianceStyles = {
      'amber-warm': 'bg-gradient-to-br from-amber-800/40 to-orange-800/40 border-amber-400/60',
      'green-natural': 'bg-gradient-to-br from-emerald-800/40 to-green-800/40 border-emerald-400/60',
      'blue-calm': 'bg-gradient-to-br from-blue-800/40 to-cyan-800/40 border-blue-400/60',
      'green-study': 'bg-gradient-to-br from-teal-800/40 to-green-800/40 border-teal-400/60',
      'purple-vibrant': 'bg-gradient-to-br from-purple-800/40 to-indigo-800/40 border-purple-400/60'
    };

    return `${baseStyle} ${hoverStyle} ${shapeClass} ${ambianceStyles[zone.ambiance as keyof typeof ambianceStyles]}`;
  };

  const getOccupancyColor = (occupied: number, capacity: number) => {
    const ratio = occupied / capacity;
    if (ratio < 0.5) return 'text-green-300';
    if (ratio < 0.8) return 'text-yellow-300';
    return 'text-red-300';
  };

  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '☀️ Good Morning, Coffee Explorer!';
    if (hour < 17) return '🌤️ Good Afternoon, Café Adventurer!';
    return '🌙 Good Evening, Night Owl!';
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-amber-900 via-orange-900 to-brown-900 p-4 overflow-hidden">
      {/* Café Floor Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main Bar Counter (Top right area) */}
        <div className="absolute bg-gradient-to-t from-amber-800 to-amber-700 rounded-2xl shadow-2xl border-4 border-amber-600"
             style={{ left: '65%', top: '8%', width: '32%', height: '20%' }}>
          <div className="text-center pt-3">
            <div className="text-amber-100 font-bold text-xl">☕ ESPRESSO BAR ☕</div>
            <div className="text-amber-200 text-sm">Handcrafted • Fresh • Perfect</div>
          </div>
        </div>

        {/* Barista Working Area (Behind the bar) */}
        <div 
          className="absolute bg-gradient-to-br from-amber-900 to-brown-900 rounded-xl border-4 border-amber-600 shadow-2xl flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300"
          style={{ left: '72%', top: '30%', width: '18%', height: '15%' }}
          title={`${barista.name} - ${barista.activity} | ${barista.specialty}`}
        >
          <div className="text-center text-white">
            <div className="flex items-center justify-center gap-1 mb-1">
              <ChefHat className="h-6 w-6 text-amber-300" />
              <Crown className="h-4 w-4 text-yellow-400" />
            </div>
            <div className="text-3xl mb-1">{barista.mood}</div>
            <div className="text-sm font-bold text-amber-200">{barista.name}</div>
            <div className="text-xs text-amber-300">Master Barista</div>
            {barista.isWorking && (
              <div className="w-2 h-2 bg-green-400 rounded-full mx-auto mt-1 animate-pulse"></div>
            )}
          </div>
        </div>

        {/* Coffee Equipment Behind Bar */}
        <div className="absolute bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg shadow-lg"
             style={{ left: '68%', top: '30%', width: '6%', height: '12%' }}>
          <div className="text-center pt-2 text-white text-xs">
            <div>🔥</div>
            <div>MACHINE</div>
          </div>
        </div>

        {/* Decorative Stone/Water Feature (Bottom right from image) */}
        <div className="absolute bg-gradient-to-br from-gray-600 to-gray-800 rounded-full shadow-xl border-4 border-gray-500"
             style={{ left: '78%', top: '75%', width: '18%', height: '20%' }}>
          <div className="text-center pt-6 text-white">
            <div className="text-2xl mb-2">🪨</div>
            <div className="text-xs">Stone Feature</div>
          </div>
        </div>

        {/* Floor Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg"></div>
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-30 space-y-3">
        <div className="flex justify-between items-start">
          <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-2">
              {getTimeBasedGreeting()}
            </h1>
            <p className="text-white/80 text-sm">Choose your perfect coffee spot</p>
            <p className="text-white/60 text-xs">{currentTime.toLocaleTimeString()}</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Badge className="bg-amber-600/80 text-white border-amber-400/50">
              <Coffee className="h-4 w-4 mr-2" />
              Artisan Coffee House
            </Badge>
            <Badge className="bg-green-600/80 text-white border-green-400/50">
              <ChefHat className="h-4 w-4 mr-2" />
              Master Barista: {barista.name}
            </Badge>
          </div>
        </div>

        {/* Live Barista Activity */}
        <div className="bg-gradient-to-r from-amber-900/80 to-orange-900/80 backdrop-blur-lg rounded-xl p-3 border border-amber-400/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">☕ {barista.name} is {barista.activity}</h3>
                <p className="text-amber-200 text-sm">{barista.specialty} • Fresh coffee available at all tables</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Coffee className="h-5 w-5 text-amber-300" />
              <span className="text-amber-200 font-bold">Fresh Coffee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seating Zones */}
      <div className="relative w-full h-full pt-32">
        {seatingZones.map((zone) => (
          <div
            key={zone.id}
            className={getZoneStyle(zone)}
            style={{
              left: `${zone.position.x}%`,
              top: `${zone.position.y}%`,
              width: `${zone.position.width}%`,
              height: `${zone.position.height}%`
            }}
            onMouseEnter={() => setHoveredZone(zone.id)}
            onMouseLeave={() => setHoveredZone(null)}
            onClick={() => onSeatSelect(zone.id)}
          >
            <div className="p-3 h-full flex flex-col justify-between relative overflow-hidden">
              {/* Zone Header */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">{zone.name}</h3>
                </div>
                
                <p className="text-white/80 text-xs italic">"{zone.theme}"</p>

                <div className={`flex items-center gap-1 text-xs ${getOccupancyColor(zone.occupied, zone.capacity)}`}>
                  <Users className="h-3 w-3" />
                  <span className="font-bold">{zone.occupied}/{zone.capacity}</span>
                </div>
              </div>

              {/* User Avatars */}
              <div className="space-y-1">
                <div className="flex flex-wrap gap-1">
                  {zone.users.slice(0, 3).map((user, index) => (
                    <div
                      key={index}
                      className="relative group"
                    >
                      <div className="w-6 h-6 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center text-xs border border-white/30 hover:scale-110 transition-transform">
                        {user.mood}
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-1 py-0.5 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                        {user.name}: {user.activity}
                      </div>
                    </div>
                  ))}
                  {zone.users.length > 3 && (
                    <div className="w-6 h-6 bg-white/30 text-white rounded-full flex items-center justify-center text-xs border border-white/30">
                      +{zone.users.length - 3}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>🎵 {zone.atmosphere}</span>
                  <span>☕ Fresh coffee</span>
                </div>
              </div>

              {/* Hover Effect Glow */}
              {hoveredZone === zone.id && (
                <div className="absolute inset-0 bg-white/10 rounded-2xl animate-pulse pointer-events-none" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Zone Details Popup */}
      {hoveredZone && (
        <div className="absolute bottom-4 left-4 right-4 z-30 bg-black/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 transform transition-all duration-300">
          {(() => {
            const zone = seatingZones.find(z => z.id === hoveredZone);
            if (!zone) return null;
            
            return (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">{zone.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-600 text-white">
                      <Coffee className="h-3 w-3 mr-1" />
                      {zone.atmosphere}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">✨ Special Features</h4>
                    <p className="text-white/80 text-sm mb-3">{zone.specialFeature}</p>
                    
                    <h4 className="font-semibold text-white mb-2">🎭 Atmosphere</h4>
                    <p className="text-white/80 text-sm italic">"{zone.theme}" • Perfect for {zone.atmosphere} moments</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">👥 Coffee Lovers Here</h4>
                    <div className="space-y-1 max-h-20 overflow-y-auto">
                      {zone.users.map((user, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-white/80">
                          <span className="text-base">{user.mood}</span>
                          <span className="font-medium text-white">{user.name}</span>
                          <span className="text-white/60">• {user.activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => onSeatSelect(zone.id)}
                  className="w-full mt-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-3 text-lg"
                >
                  <Coffee className="h-5 w-5 mr-2" />
                  Join {zone.name}
                </Button>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
