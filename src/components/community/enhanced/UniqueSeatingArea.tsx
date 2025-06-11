
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Coffee, ChefHat, Crown, Trees, Wifi } from 'lucide-react';

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
    activity: 'Crafting artisan espresso',
    specialty: 'Specialty Coffee Master',
    isWorking: true
  };

  const seatingZones: SeatZone[] = [
    // Bar Counter Stools (Back area with barista)
    {
      id: 'bar-stool-1',
      name: 'Bar Stool 1',
      theme: 'Barista Counter',
      atmosphere: 'interactive',
      capacity: 1,
      occupied: 1,
      users: [
        { name: 'Alex', mood: '💼', activity: 'Quick espresso', vibe: 'energetic' }
      ],
      position: { x: 15, y: 8, width: 6, height: 8 },
      specialFeature: 'Watch coffee being crafted',
      musicGenre: 'Café Jazz',
      ambiance: 'warm-wood',
      shape: 'round'
    },
    {
      id: 'bar-stool-2',
      name: 'Bar Stool 2',
      theme: 'Barista Counter',
      atmosphere: 'interactive',
      capacity: 1,
      occupied: 0,
      users: [],
      position: { x: 23, y: 8, width: 6, height: 8 },
      specialFeature: 'Front row coffee experience',
      musicGenre: 'Café Jazz',
      ambiance: 'warm-wood',
      shape: 'round'
    },
    {
      id: 'bar-stool-3',
      name: 'Bar Stool 3',
      theme: 'Barista Counter',
      atmosphere: 'interactive',
      capacity: 1,
      occupied: 1,
      users: [
        { name: 'Sofia', mood: '😊', activity: 'Chatting with barista', vibe: 'social' }
      ],
      position: { x: 31, y: 8, width: 6, height: 8 },
      specialFeature: 'Best view of coffee wall',
      musicGenre: 'Café Jazz',
      ambiance: 'warm-wood',
      shape: 'round'
    },
    {
      id: 'bar-stool-4',
      name: 'Bar Stool 4',
      theme: 'Barista Counter',
      atmosphere: 'interactive',
      capacity: 1,
      occupied: 0,
      users: [],
      position: { x: 39, y: 8, width: 6, height: 8 },
      specialFeature: 'Corner counter spot',
      musicGenre: 'Café Jazz',
      ambiance: 'warm-wood',
      shape: 'round'
    },

    // Green Leather Lounge Chairs (Central area)
    {
      id: 'green-chair-1',
      name: 'Green Lounge 1',
      theme: 'Comfortable Reading',
      atmosphere: 'relaxed',
      capacity: 1,
      occupied: 1,
      users: [
        { name: 'Luna', mood: '📖', activity: 'Reading novel', vibe: 'peaceful' }
      ],
      position: { x: 25, y: 35, width: 10, height: 12 },
      specialFeature: 'Premium leather comfort',
      musicGenre: 'Ambient Lounge',
      ambiance: 'forest-green',
      shape: 'square'
    },
    {
      id: 'green-chair-2',
      name: 'Green Lounge 2',
      theme: 'Comfortable Reading',
      atmosphere: 'relaxed',
      capacity: 1,
      occupied: 0,
      users: [],
      position: { x: 40, y: 35, width: 10, height: 12 },
      specialFeature: 'Stone archway view',
      musicGenre: 'Ambient Lounge',
      ambiance: 'forest-green',
      shape: 'square'
    },
    {
      id: 'green-chair-3',
      name: 'Green Lounge 3',
      theme: 'Comfortable Reading',
      atmosphere: 'relaxed',
      capacity: 1,
      occupied: 1,
      users: [
        { name: 'River', mood: '💭', activity: 'Contemplating', vibe: 'meditative' }
      ],
      position: { x: 55, y: 35, width: 10, height: 12 },
      specialFeature: 'Natural lighting',
      musicGenre: 'Ambient Lounge',
      ambiance: 'forest-green',
      shape: 'square'
    },
    {
      id: 'green-chair-4',
      name: 'Green Lounge 4',
      theme: 'Comfortable Reading',
      atmosphere: 'relaxed',
      capacity: 1,
      occupied: 1,
      users: [
        { name: 'Sage', mood: '🎵', activity: 'Listening to music', vibe: 'content' }
      ],
      position: { x: 70, y: 35, width: 10, height: 12 },
      specialFeature: 'Corner position',
      musicGenre: 'Ambient Lounge',
      ambiance: 'forest-green',
      shape: 'square'
    },

    // Round Wooden Tables (Interior seating)
    {
      id: 'round-table-1',
      name: 'Round Table 1',
      theme: 'Intimate Café',
      atmosphere: 'social',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Emma', mood: '☕', activity: 'Coffee date', vibe: 'romantic' },
        { name: 'James', mood: '😊', activity: 'Deep conversation', vibe: 'connected' }
      ],
      position: { x: 15, y: 55, width: 18, height: 18 },
      specialFeature: 'Intimate wooden table',
      musicGenre: 'Soft Acoustic',
      ambiance: 'warm-wood',
      shape: 'round'
    },
    {
      id: 'round-table-2',
      name: 'Round Table 2',
      theme: 'Work & Study',
      atmosphere: 'focused',
      capacity: 4,
      occupied: 3,
      users: [
        { name: 'Maya', mood: '💻', activity: 'Laptop work', vibe: 'productive' },
        { name: 'Chris', mood: '📝', activity: 'Writing', vibe: 'creative' },
        { name: 'Sam', mood: '🤔', activity: 'Planning', vibe: 'strategic' }
      ],
      position: { x: 45, y: 55, width: 18, height: 18 },
      specialFeature: 'Perfect for collaboration',
      musicGenre: 'Focus Beats',
      ambiance: 'cool-concrete',
      shape: 'round'
    },

    // Outdoor Terrace Area
    {
      id: 'terrace-table-1',
      name: 'Terrace Table 1',
      theme: 'Outdoor Dining',
      atmosphere: 'fresh',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Aria', mood: '🌱', activity: 'Fresh air coffee', vibe: 'refreshed' },
        { name: 'Leo', mood: '☀️', activity: 'People watching', vibe: 'observant' }
      ],
      position: { x: 75, y: 65, width: 20, height: 15 },
      specialFeature: 'Outdoor fresh air',
      musicGenre: 'Nature Sounds',
      ambiance: 'outdoor-fresh',
      shape: 'rectangle'
    },
    {
      id: 'terrace-table-2',
      name: 'Terrace Table 2',
      theme: 'Outdoor Dining',
      atmosphere: 'fresh',
      capacity: 2,
      occupied: 0,
      users: [],
      position: { x: 75, y: 82, width: 20, height: 12 },
      specialFeature: 'Garden view seating',
      musicGenre: 'Nature Sounds',
      ambiance: 'outdoor-fresh',
      shape: 'rectangle'
    },

    // Community Work Table (Large rectangular table)
    {
      id: 'community-table',
      name: 'Community Table',
      theme: 'Shared Workspace',
      atmosphere: 'collaborative',
      capacity: 8,
      occupied: 4,
      users: [
        { name: 'Jordan', mood: '💼', activity: 'Team meeting', vibe: 'professional' },
        { name: 'Taylor', mood: '🗣️', activity: 'Brainstorming', vibe: 'innovative' },
        { name: 'Casey', mood: '📊', activity: 'Data analysis', vibe: 'analytical' },
        { name: 'Morgan', mood: '💡', activity: 'Creative planning', vibe: 'inspired' }
      ],
      position: { x: 10, y: 78, width: 35, height: 16 },
      specialFeature: 'Large collaborative space',
      musicGenre: 'Background Jazz',
      ambiance: 'industrial-chic',
      shape: 'rectangle'
    }
  ];

  const getZoneStyle = (zone: SeatZone) => {
    const baseStyle = "absolute cursor-pointer transition-all duration-500 border-2 shadow-xl";
    const hoverStyle = hoveredZone === zone.id ? 'scale-105 shadow-2xl z-20' : 'hover:scale-102 hover:shadow-xl';
    
    const shapeClass = zone.shape === 'round' ? 'rounded-full' : zone.shape === 'rectangle' ? 'rounded-xl' : 'rounded-2xl';
    
    const ambianceStyles = {
      'warm-wood': 'bg-gradient-to-br from-amber-800/50 to-orange-700/50 border-amber-400/70',
      'forest-green': 'bg-gradient-to-br from-green-800/50 to-emerald-700/50 border-green-400/70',
      'cool-concrete': 'bg-gradient-to-br from-gray-700/50 to-slate-600/50 border-gray-400/70',
      'outdoor-fresh': 'bg-gradient-to-br from-teal-700/50 to-cyan-600/50 border-teal-400/70',
      'industrial-chic': 'bg-gradient-to-br from-slate-800/50 to-gray-700/50 border-slate-400/70'
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
    if (hour < 12) return '🌅 Good Morning, Welcome to Your Café!';
    if (hour < 17) return '☀️ Good Afternoon, Enjoy Your Space!';
    return '🌙 Good Evening, Relax & Unwind!';
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-stone-800 via-gray-800 to-slate-900 p-4 overflow-hidden">
      {/* Stone Archway Entrance */}
      <div className="absolute bg-gradient-to-b from-stone-600 to-stone-800 rounded-t-full shadow-2xl border-4 border-stone-500"
           style={{ left: '5%', top: '20%', width: '15%', height: '25%' }}>
        <div className="text-center pt-8">
          <div className="text-stone-200 font-bold text-lg">🏛️</div>
          <div className="text-stone-300 text-sm mt-2">Stone Archway</div>
          <div className="text-stone-400 text-xs">Historic Entrance</div>
        </div>
      </div>

      {/* Coffee Display Wall */}
      <div className="absolute bg-gradient-to-br from-amber-900 to-brown-800 rounded-lg shadow-2xl border-4 border-amber-600"
           style={{ left: '50%', top: '5%', width: '25%', height: '15%' }}>
        <div className="text-center pt-3">
          <div className="text-amber-100 font-bold text-xl">☕ COFFEE WALL ☕</div>
          <div className="text-amber-200 text-sm">Artisan Display • Premium Beans</div>
          <div className="text-amber-300 text-xs mt-1">Interactive Coffee Art</div>
        </div>
      </div>

      {/* Main Bar Counter */}
      <div className="absolute bg-gradient-to-t from-amber-800 to-amber-700 rounded-2xl shadow-2xl border-4 border-amber-600"
           style={{ left: '12%', top: '5%', width: '35%', height: '15%' }}>
        <div className="text-center pt-3">
          <div className="text-amber-100 font-bold text-xl">🍃 ARTISAN BAR 🍃</div>
          <div className="text-amber-200 text-sm">Handcrafted • Sustainable • Local</div>
        </div>
      </div>

      {/* Barista Working Area */}
      <div 
        className="absolute bg-gradient-to-br from-amber-900 to-brown-900 rounded-xl border-4 border-amber-600 shadow-2xl flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300"
        style={{ left: '20%', top: '22%', width: '20%', height: '10%' }}
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

      {/* Outdoor Terrace Background */}
      <div className="absolute bg-gradient-to-br from-green-700/30 to-teal-600/30 rounded-lg shadow-xl border-4 border-green-500/50"
           style={{ left: '72%', top: '60%', width: '26%', height: '38%' }}>
        <div className="text-center pt-4 text-white">
          <Trees className="h-8 w-8 mx-auto mb-2 text-green-300" />
          <div className="text-lg font-bold">🌿 TERRACE 🌿</div>
          <div className="text-sm text-green-200">Fresh Air Dining</div>
          <div className="text-xs text-green-300 mt-1">Garden Views</div>
        </div>
      </div>

      {/* Industrial Design Elements */}
      <div className="absolute opacity-20">
        {/* Track Lighting */}
        {Array.from({length: 6}).map((_, i) => (
          <div 
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
            style={{ 
              left: `${15 + (i * 12)}%`, 
              top: '2%',
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-30 space-y-3">
        <div className="flex justify-between items-start">
          <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent mb-2">
              {getTimeBasedGreeting()}
            </h1>
            <p className="text-white/80 text-sm">Choose your perfect spot in this beautiful space</p>
            <p className="text-white/60 text-xs">{currentTime.toLocaleTimeString()}</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Badge className="bg-green-600/80 text-white border-green-400/50">
              <Coffee className="h-4 w-4 mr-2" />
              Artisan Coffee House
            </Badge>
            <Badge className="bg-teal-600/80 text-white border-teal-400/50">
              <Wifi className="h-4 w-4 mr-2" />
              Free WiFi Available
            </Badge>
          </div>
        </div>

        {/* Live Barista Activity */}
        <div className="bg-gradient-to-r from-green-900/80 to-teal-900/80 backdrop-blur-lg rounded-xl p-3 border border-green-400/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center animate-pulse">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">🍃 {barista.name} is {barista.activity}</h3>
                <p className="text-green-200 text-sm">{barista.specialty} • Sustainable & Local Sourcing</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Trees className="h-5 w-5 text-green-300" />
              <span className="text-green-200 font-bold">Eco-Friendly</span>
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
            <div className="p-2 h-full flex flex-col justify-between relative overflow-hidden">
              {/* Zone Header */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-xs">{zone.name}</h3>
                </div>
                
                <div className={`flex items-center gap-1 text-xs ${getOccupancyColor(zone.occupied, zone.capacity)}`}>
                  <Users className="h-3 w-3" />
                  <span className="font-bold">{zone.occupied}/{zone.capacity}</span>
                </div>
              </div>

              {/* User Avatars */}
              <div className="space-y-1">
                <div className="flex flex-wrap gap-1">
                  {zone.users.slice(0, 2).map((user, index) => (
                    <div
                      key={index}
                      className="relative group"
                    >
                      <div className="w-5 h-5 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center text-xs border border-white/30 hover:scale-110 transition-transform">
                        {user.mood}
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-1 py-0.5 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                        {user.name}: {user.activity}
                      </div>
                    </div>
                  ))}
                  {zone.users.length > 2 && (
                    <div className="w-5 h-5 bg-white/30 text-white rounded-full flex items-center justify-center text-xs border border-white/30">
                      +{zone.users.length - 2}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>🎵 {zone.atmosphere}</span>
                  <span>☕</span>
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
                    <Badge className="bg-green-600 text-white">
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
                  className="w-full mt-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 text-lg"
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
