
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Coffee, Wifi, Volume2, Music, Vote, Star, Heart, Zap, Sun, Crown, ChefHat } from 'lucide-react';

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
    activity: 'Crafting the perfect espresso',
    specialty: 'Latte Art Master',
    isWorking: true
  };

  const seatingZones: SeatZone[] = [
    // Coffee Bar Counter - Front row seating facing the barista
    {
      id: 'bar-counter-1',
      name: 'Espresso Bar Seat 1',
      theme: 'Watch the Magic',
      atmosphere: 'energetic',
      capacity: 1,
      occupied: 1,
      users: [
        { name: 'Sofia', mood: '😍', activity: 'Watching latte art', vibe: 'fascinated' }
      ],
      position: { x: 15, y: 75, width: 8, height: 6 },
      specialFeature: 'Front row barista view',
      musicGenre: 'Upbeat Coffee Shop',
      ambiance: 'amber-warm',
      shape: 'round'
    },
    {
      id: 'bar-counter-2',
      name: 'Espresso Bar Seat 2',
      theme: 'Coffee Conversation',
      atmosphere: 'social',
      capacity: 1,
      occupied: 1,
      users: [
        { name: 'Diego', mood: '🗣️', activity: 'Chatting with barista', vibe: 'friendly' }
      ],
      position: { x: 25, y: 75, width: 8, height: 6 },
      specialFeature: 'Direct barista chat',
      musicGenre: 'Café Jazz',
      ambiance: 'amber-warm',
      shape: 'round'
    },
    {
      id: 'bar-counter-3',
      name: 'Espresso Bar Seat 3',
      theme: 'Coffee Learning',
      atmosphere: 'curious',
      capacity: 1,
      occupied: 0,
      users: [],
      position: { x: 35, y: 75, width: 8, height: 6 },
      specialFeature: 'Coffee education spot',
      musicGenre: 'Smooth Jazz',
      ambiance: 'amber-warm',
      shape: 'round'
    },
    {
      id: 'bar-counter-4',
      name: 'Espresso Bar Seat 4',
      theme: 'Morning Rush',
      atmosphere: 'efficient',
      capacity: 1,
      occupied: 1,
      users: [
        { name: 'Alex', mood: '💼', activity: 'Quick coffee break', vibe: 'focused' }
      ],
      position: { x: 45, y: 75, width: 8, height: 6 },
      specialFeature: 'Express service',
      musicGenre: 'Energetic Beats',
      ambiance: 'amber-warm',
      shape: 'round'
    },

    // Window Seats - Perfect natural lighting
    {
      id: 'window-nook-1',
      name: 'Sunrise Window Nook',
      theme: 'Golden Hour Reading',
      atmosphere: 'peaceful',
      capacity: 2,
      occupied: 1,
      users: [
        { name: 'Luna', mood: '📖', activity: 'Reading poetry', vibe: 'serene' }
      ],
      position: { x: 8, y: 25, width: 15, height: 12 },
      specialFeature: 'Best natural light',
      musicGenre: 'Ambient Morning',
      ambiance: 'golden-warm',
      shape: 'rectangle'
    },
    {
      id: 'window-nook-2',
      name: 'Garden View Corner',
      theme: 'Nature Connection',
      atmosphere: 'inspiring',
      capacity: 2,
      occupied: 2,
      users: [
        { name: 'Sage', mood: '🌿', activity: 'Journal writing', vibe: 'reflective' },
        { name: 'River', mood: '🎨', activity: 'Sketching outdoors', vibe: 'creative' }
      ],
      position: { x: 8, y: 45, width: 15, height: 12 },
      specialFeature: 'Garden view & plants',
      musicGenre: 'Nature Sounds',
      ambiance: 'green-natural',
      shape: 'rectangle'
    },

    // Central Community Tables
    {
      id: 'community-round',
      name: 'Grand Community Circle',
      theme: 'Social Hub',
      atmosphere: 'vibrant',
      capacity: 8,
      occupied: 6,
      users: [
        { name: 'Maya', mood: '🎵', activity: 'DJ mixing', vibe: 'energetic' },
        { name: 'Jazz', mood: '🎶', activity: 'Music discussion', vibe: 'passionate' },
        { name: 'Harmony', mood: '😄', activity: 'Making friends', vibe: 'social' },
        { name: 'Beat', mood: '🥁', activity: 'Rhythm games', vibe: 'playful' },
        { name: 'Melody', mood: '🎼', activity: 'Songwriting', vibe: 'artistic' },
        { name: 'Chord', mood: '🎹', activity: 'Music theory', vibe: 'intellectual' }
      ],
      position: { x: 40, y: 35, width: 25, height: 20 },
      specialFeature: 'Community DJ booth & large space',
      musicGenre: 'Live DJ Mix',
      ambiance: 'purple-vibrant',
      shape: 'round'
    },

    // Cozy Corners
    {
      id: 'fireplace-corner',
      name: 'Fireplace Lounge',
      theme: 'Winter Warmth',
      atmosphere: 'cozy',
      capacity: 4,
      occupied: 3,
      users: [
        { name: 'Ember', mood: '🔥', activity: 'Warming up', vibe: 'comfortable' },
        { name: 'Ash', mood: '📚', activity: 'Reading by fire', vibe: 'content' },
        { name: 'Flame', mood: '☕', activity: 'Slow coffee', vibe: 'relaxed' }
      ],
      position: { x: 75, y: 25, width: 20, height: 15 },
      specialFeature: 'Real fireplace & soft seating',
      musicGenre: 'Cozy Acoustic',
      ambiance: 'orange-cozy',
      shape: 'rectangle'
    },

    // Work Spaces
    {
      id: 'focus-pod-1',
      name: 'Productivity Pod Alpha',
      theme: 'Deep Work Sanctuary',
      atmosphere: 'focused',
      capacity: 2,
      occupied: 2,
      users: [
        { name: 'Focus', mood: '💻', activity: 'Coding session', vibe: 'concentrated' },
        { name: 'Flow', mood: '📊', activity: 'Data analysis', vibe: 'analytical' }
      ],
      position: { x: 75, y: 50, width: 18, height: 12 },
      specialFeature: 'Noise isolation & power outlets',
      musicGenre: 'Focus Instrumentals',
      ambiance: 'blue-calm',
      shape: 'rectangle'
    },

    // Creative Space
    {
      id: 'artist-table',
      name: 'Creator\'s Canvas',
      theme: 'Artistic Expression',
      atmosphere: 'creative',
      capacity: 4,
      occupied: 3,
      users: [
        { name: 'Canvas', mood: '🎨', activity: 'Digital art', vibe: 'inspired' },
        { name: 'Brush', mood: '✏️', activity: 'Illustration', vibe: 'artistic' },
        { name: 'Color', mood: '🌈', activity: 'Design work', vibe: 'vibrant' }
      ],
      position: { x: 25, y: 15, width: 20, height: 15 },
      specialFeature: 'Art supplies & large table',
      musicGenre: 'Creative Flow',
      ambiance: 'rainbow-creative',
      shape: 'rectangle'
    },

    // Quiet Study Area
    {
      id: 'library-corner',
      name: 'Silent Study Sanctuary',
      theme: 'Academic Focus',
      atmosphere: 'studious',
      capacity: 3,
      occupied: 2,
      users: [
        { name: 'Scholar', mood: '📝', activity: 'Research writing', vibe: 'studious' },
        { name: 'Wisdom', mood: '🤓', activity: 'Exam prep', vibe: 'determined' }
      ],
      position: { x: 55, y: 15, width: 15, height: 12 },
      specialFeature: 'Library silence & study materials',
      musicGenre: 'White Noise',
      ambiance: 'green-study',
      shape: 'rectangle'
    }
  ];

  const getZoneStyle = (zone: SeatZone) => {
    const baseStyle = "absolute cursor-pointer transition-all duration-500 border-2 shadow-xl";
    const hoverStyle = hoveredZone === zone.id ? 'scale-105 shadow-2xl z-20' : 'hover:scale-102 hover:shadow-xl';
    
    const shapeClass = zone.shape === 'round' ? 'rounded-full' : 'rounded-2xl';
    
    const ambianceStyles = {
      'amber-warm': 'bg-gradient-to-br from-amber-800/40 to-orange-800/40 border-amber-400/60',
      'golden-warm': 'bg-gradient-to-br from-yellow-700/40 to-amber-700/40 border-yellow-400/60',
      'green-natural': 'bg-gradient-to-br from-emerald-800/40 to-green-800/40 border-emerald-400/60',
      'purple-vibrant': 'bg-gradient-to-br from-purple-800/40 to-indigo-800/40 border-purple-400/60',
      'orange-cozy': 'bg-gradient-to-br from-orange-800/40 to-red-800/40 border-orange-400/60',
      'blue-calm': 'bg-gradient-to-br from-blue-800/40 to-cyan-800/40 border-blue-400/60',
      'rainbow-creative': 'bg-gradient-to-br from-pink-800/40 to-purple-800/40 border-pink-400/60',
      'green-study': 'bg-gradient-to-br from-teal-800/40 to-green-800/40 border-teal-400/60'
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
      {/* Café Interior Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Coffee Bar Background */}
        <div className="absolute bg-gradient-to-t from-amber-800 to-amber-700 rounded-t-2xl shadow-2xl"
             style={{ left: '10%', top: '68%', width: '45%', height: '25%' }}>
          <div className="text-center pt-2">
            <div className="text-amber-100 font-bold text-lg">☕ ARTISAN COFFEE BAR ☕</div>
            <div className="text-amber-200 text-sm">Fresh • Handcrafted • Perfect</div>
          </div>
        </div>

        {/* Barista Station - Behind the bar */}
        <div 
          className="absolute bg-gradient-to-br from-amber-900 to-brown-900 rounded-xl border-4 border-amber-600 shadow-2xl flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300"
          style={{ left: '28%', top: '82%', width: '14%', height: '12%' }}
          title={`${barista.name} - ${barista.activity} | ${barista.specialty}`}
        >
          <div className="text-center text-white">
            <div className="flex items-center justify-center gap-1 mb-1">
              <ChefHat className="h-5 w-5 text-amber-300" />
              <Crown className="h-4 w-4 text-yellow-400" />
            </div>
            <div className="text-2xl mb-1">{barista.mood}</div>
            <div className="text-xs font-bold text-amber-200">{barista.name}</div>
            <div className="text-xs text-amber-300">Barista</div>
            {barista.isWorking && (
              <div className="w-2 h-2 bg-green-400 rounded-full mx-auto mt-1 animate-pulse"></div>
            )}
          </div>
        </div>

        {/* Coffee Machine & Equipment */}
        <div className="absolute bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg shadow-lg"
             style={{ left: '15%', top: '82%', width: '10%', height: '10%' }}>
          <div className="text-center pt-2 text-white text-xs">
            <div>🔥 ESPRESSO</div>
            <div>MACHINE</div>
          </div>
        </div>

        {/* Coffee Bean Storage */}
        <div className="absolute bg-gradient-to-r from-brown-700 to-brown-600 rounded-lg shadow-lg"
             style={{ left: '45%', top: '82%', width: '8%', height: '10%' }}>
          <div className="text-center pt-2 text-white text-xs">
            <div>☕ FRESH</div>
            <div>BEANS</div>
          </div>
        </div>

        {/* Animated steam from coffee machine */}
        <div className="absolute" style={{ left: '20%', top: '78%' }}>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-6 bg-white/30 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.5}s`,
                transform: `translateX(${i * 8}px)`
              }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Header */}
      <div className="absolute top-4 left-4 right-4 z-30 space-y-3">
        <div className="flex justify-between items-start">
          <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-2">
              {getTimeBasedGreeting()}
            </h1>
            <p className="text-white/80 text-sm">Choose your perfect coffee experience</p>
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
                <p className="text-amber-200 text-sm">{barista.specialty} • Now serving specialty drinks • All zones have perfect coffee</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Coffee className="h-5 w-5 text-amber-300" />
              <span className="text-amber-200 font-bold">Fresh Coffee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Seating Zones */}
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
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400" />
                    <span className="text-yellow-300 text-xs font-bold">4.9</span>
                  </div>
                </div>
                
                <p className="text-white/80 text-xs italic">"{zone.theme}"</p>
                
                <div className="flex items-center gap-1 text-xs">
                  <Badge className="bg-white/20 text-white border-white/30 text-xs px-1 py-0">
                    {zone.musicGenre}
                  </Badge>
                </div>

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

      {/* Enhanced Zone Details Popup */}
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
                    <Badge className="bg-orange-600 text-white">
                      <Music className="h-3 w-3 mr-1" />
                      {zone.musicGenre}
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
