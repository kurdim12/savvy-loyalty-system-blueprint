
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Coffee, ChefHat, Crown, Trees, Wifi, Sofa, Armchair } from 'lucide-react';

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
  furnitureType: 'chair' | 'sofa' | 'table' | 'stool';
  woodType: string;
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
    activity: 'Crafting artisan coffee',
    specialty: 'Master Barista',
    isWorking: true
  };

  const seatingZones: SeatZone[] = [
    // Bar Counter Stools (Behind the counter)
    {
      id: 'bar-stool-1',
      name: 'Bar Counter 1',
      theme: 'Coffee Counter Experience',
      atmosphere: 'energetic',
      capacity: 1,
      occupied: 1,
      users: [
        { name: 'Alex', mood: '💼', activity: 'Morning espresso', vibe: 'focused' }
      ],
      position: { x: 12, y: 15, width: 8, height: 6 },
      specialFeature: 'Front row coffee crafting view',
      furnitureType: 'stool',
      woodType: 'Dark Walnut'
    },
    {
      id: 'bar-stool-2',
      name: 'Bar Counter 2',
      theme: 'Coffee Counter Experience',
      atmosphere: 'energetic',
      capacity: 1,
      occupied: 0,
      users: [],
      position: { x: 22, y: 15, width: 8, height: 6 },
      specialFeature: 'Perfect barista interaction spot',
      furnitureType: 'stool',
      woodType: 'Dark Walnut'
    },
    {
      id: 'bar-stool-3',
      name: 'Bar Counter 3',
      theme: 'Coffee Counter Experience',
      atmosphere: 'energetic',
      capacity: 1,
      occupied: 1,
      users: [
        { name: 'Sofia', mood: '😊', activity: 'Chatting with barista', vibe: 'social' }
      ],
      position: { x: 32, y: 15, width: 8, height: 6 },
      specialFeature: 'Coffee wall view',
      furnitureType: 'stool',
      woodType: 'Dark Walnut'
    },
    {
      id: 'bar-stool-4',
      name: 'Bar Counter 4',
      theme: 'Coffee Counter Experience',
      atmosphere: 'energetic',
      capacity: 1,
      occupied: 0,
      users: [],
      position: { x: 42, y: 15, width: 8, height: 6 },
      specialFeature: 'Corner counter position',
      furnitureType: 'stool',
      woodType: 'Dark Walnut'
    },

    // Green Leather Armchairs (Central lounge area)
    {
      id: 'green-armchair-1',
      name: 'Green Armchair 1',
      theme: 'Luxury Lounge',
      atmosphere: 'relaxed',
      capacity: 1,
      occupied: 1,
      users: [
        { name: 'Luna', mood: '📖', activity: 'Reading philosophy', vibe: 'contemplative' }
      ],
      position: { x: 18, y: 40, width: 12, height: 14 },
      specialFeature: 'Premium leather comfort',
      furnitureType: 'chair',
      woodType: 'Rich Mahogany'
    },
    {
      id: 'green-armchair-2',
      name: 'Green Armchair 2',
      theme: 'Luxury Lounge',
      atmosphere: 'relaxed',
      capacity: 1,
      occupied: 0,
      users: [],
      position: { x: 35, y: 40, width: 12, height: 14 },
      specialFeature: 'Stone archway view',
      furnitureType: 'chair',
      woodType: 'Rich Mahogany'
    },
    {
      id: 'green-armchair-3',
      name: 'Green Armchair 3',
      theme: 'Luxury Lounge',
      atmosphere: 'relaxed',
      capacity: 1,
      occupied: 1,
      users: [
        { name: 'River', mood: '💭', activity: 'Creative thinking', vibe: 'inspired' }
      ],
      position: { x: 52, y: 40, width: 12, height: 14 },
      specialFeature: 'Natural lighting spot',
      furnitureType: 'chair',
      woodType: 'Rich Mahogany'
    },

    // Round Wooden Tables (Mid-section)
    {
      id: 'round-table-1',
      name: 'Round Oak Table 1',
      theme: 'Intimate Conversations',
      atmosphere: 'social',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Emma', mood: '☕', activity: 'Coffee date', vibe: 'romantic' },
        { name: 'James', mood: '😊', activity: 'Deep conversation', vibe: 'connected' }
      ],
      position: { x: 10, y: 62, width: 20, height: 20 },
      specialFeature: 'Handcrafted oak table',
      furnitureType: 'table',
      woodType: 'Natural Oak'
    },
    {
      id: 'round-table-2',
      name: 'Round Oak Table 2',
      theme: 'Work & Study',
      atmosphere: 'focused',
      capacity: 4,
      occupied: 3,
      users: [
        { name: 'Maya', mood: '💻', activity: 'Laptop work', vibe: 'productive' },
        { name: 'Chris', mood: '📝', activity: 'Writing', vibe: 'creative' },
        { name: 'Sam', mood: '🤔', activity: 'Studying', vibe: 'concentrated' }
      ],
      position: { x: 40, y: 62, width: 20, height: 20 },
      specialFeature: 'Perfect work environment',
      furnitureType: 'table',
      woodType: 'Natural Oak'
    },

    // Cozy Sofa Corner (Left side)
    {
      id: 'wooden-sofa-1',
      name: 'Wooden Sofa Corner',
      theme: 'Cozy Relaxation',
      atmosphere: 'comfortable',
      capacity: 3,
      occupied: 2,
      users: [
        { name: 'Aria', mood: '🛋️', activity: 'Relaxing with friends', vibe: 'cozy' },
        { name: 'Leo', mood: '😌', activity: 'Casual conversation', vibe: 'laid-back' }
      ],
      position: { x: 5, y: 30, width: 25, height: 16 },
      specialFeature: 'Handcrafted wooden sofa',
      furnitureType: 'sofa',
      woodType: 'Reclaimed Pine'
    },

    // Outdoor Wooden Terrace
    {
      id: 'terrace-table-1',
      name: 'Terrace Oak Table',
      theme: 'Outdoor Serenity',
      atmosphere: 'fresh',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Sage', mood: '🌱', activity: 'Fresh air coffee', vibe: 'refreshed' },
        { name: 'Cedar', mood: '☀️', activity: 'Nature observation', vibe: 'peaceful' }
      ],
      position: { x: 72, y: 65, width: 22, height: 18 },
      specialFeature: 'Weather-treated oak',
      furnitureType: 'table',
      woodType: 'Weather-Treated Oak'
    },
    {
      id: 'terrace-table-2',
      name: 'Garden View Table',
      theme: 'Outdoor Serenity',
      atmosphere: 'fresh',
      capacity: 2,
      occupied: 0,
      users: [],
      position: { x: 72, y: 85, width: 22, height: 12 },
      specialFeature: 'Garden panorama view',
      furnitureType: 'table',
      woodType: 'Weather-Treated Oak'
    },

    // Community Wooden Table (Large shared space)
    {
      id: 'community-oak-table',
      name: 'Community Oak Table',
      theme: 'Collaborative Workspace',
      atmosphere: 'collaborative',
      capacity: 8,
      occupied: 4,
      users: [
        { name: 'Oak', mood: '💼', activity: 'Team collaboration', vibe: 'professional' },
        { name: 'Birch', mood: '🗣️', activity: 'Creative session', vibe: 'innovative' },
        { name: 'Maple', mood: '📊', activity: 'Project planning', vibe: 'strategic' },
        { name: 'Pine', mood: '💡', activity: 'Brainstorming', vibe: 'energetic' }
      ],
      position: { x: 8, y: 85, width: 40, height: 12 },
      specialFeature: 'Massive reclaimed wood table',
      furnitureType: 'table',
      woodType: 'Reclaimed Barn Wood'
    }
  ];

  const getZoneStyle = (zone: SeatZone) => {
    const baseStyle = "absolute cursor-pointer transition-all duration-500 border-4 shadow-2xl";
    const hoverStyle = hoveredZone === zone.id ? 'scale-110 shadow-3xl z-20 brightness-110' : 'hover:scale-105 hover:shadow-2xl';
    
    const furnitureStyles = {
      'chair': 'rounded-full border-amber-800/80 bg-gradient-to-br from-amber-700/60 to-orange-800/60',
      'sofa': 'rounded-3xl border-green-800/80 bg-gradient-to-br from-green-700/60 to-emerald-800/60',
      'table': 'rounded-2xl border-yellow-900/80 bg-gradient-to-br from-yellow-800/60 to-amber-900/60',
      'stool': 'rounded-full border-orange-800/80 bg-gradient-to-br from-orange-700/60 to-red-800/60'
    };

    const woodGrain = zone.furnitureType === 'table' || zone.furnitureType === 'sofa' ? 
      'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]' : '';

    return `${baseStyle} ${hoverStyle} ${furnitureStyles[zone.furnitureType]} ${woodGrain}`;
  };

  const getFurnitureIcon = (type: string) => {
    switch(type) {
      case 'chair': return <Armchair className="h-8 w-8 text-amber-200" />;
      case 'sofa': return <Sofa className="h-8 w-8 text-green-200" />;
      case 'table': return <Coffee className="h-8 w-8 text-yellow-200" />;
      case 'stool': return <Coffee className="h-6 w-6 text-orange-200" />;
      default: return <Coffee className="h-6 w-6 text-white" />;
    }
  };

  const getOccupancyColor = (occupied: number, capacity: number) => {
    const ratio = occupied / capacity;
    if (ratio < 0.5) return 'text-green-300';
    if (ratio < 0.8) return 'text-yellow-300';
    return 'text-red-300';
  };

  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '🌳 Welcome to Our Wooden Sanctuary';
    if (hour < 17) return '🪵 Afternoon in the Wood-Crafted Café';
    return '🔥 Evening Warmth by the Fireplace';
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-amber-900 via-orange-900 to-yellow-900 p-4 overflow-hidden">
      {/* Wood Grain Texture Overlay */}
      <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(210,105,30,0.1)_10px,rgba(210,105,30,0.1)_20px)]"></div>

      {/* Stone Archway Entrance */}
      <div className="absolute bg-gradient-to-b from-stone-700 to-stone-900 rounded-t-full shadow-2xl border-4 border-stone-600"
           style={{ left: '2%', top: '25%', width: '18%', height: '30%' }}>
        <div className="text-center pt-8">
          <div className="text-stone-200 font-bold text-2xl">🏛️</div>
          <div className="text-stone-300 text-lg mt-3 font-bold">STONE</div>
          <div className="text-stone-300 text-lg font-bold">ARCHWAY</div>
          <div className="text-stone-400 text-sm mt-2">Historic Entrance</div>
        </div>
      </div>

      {/* Coffee Display Wall */}
      <div className="absolute bg-gradient-to-br from-amber-800 to-yellow-900 rounded-lg shadow-2xl border-4 border-amber-700"
           style={{ left: '55%', top: '5%', width: '30%', height: '18%' }}>
        <div className="text-center pt-4">
          <div className="text-amber-100 font-bold text-2xl">☕ ARTISAN COFFEE WALL ☕</div>
          <div className="text-amber-200 text-lg mt-2">Premium Bean Display</div>
          <div className="text-amber-300 text-sm">Hand-Selected • Small Batch</div>
        </div>
      </div>

      {/* Main Bar Counter (Wooden) */}
      <div className="absolute bg-gradient-to-t from-amber-900 to-yellow-800 rounded-2xl shadow-2xl border-4 border-amber-700"
           style={{ left: '10%', top: '5%', width: '42%', height: '18%' }}>
        <div className="text-center pt-4">
          <div className="text-amber-100 font-bold text-2xl">🌳 HANDCRAFTED BAR 🌳</div>
          <div className="text-amber-200 text-lg">Reclaimed Wood • Live Edge</div>
          <div className="text-amber-300 text-sm mt-1">Artisan Coffee Counter</div>
        </div>
      </div>

      {/* Barista Working Area */}
      <div 
        className="absolute bg-gradient-to-br from-amber-800 to-orange-900 rounded-xl border-4 border-amber-700 shadow-2xl flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300"
        style={{ left: '18%', top: '25%', width: '26%', height: '12%' }}
        title={`${barista.name} - ${barista.activity} | ${barista.specialty}`}
      >
        <div className="text-center text-white">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ChefHat className="h-8 w-8 text-amber-300" />
            <Crown className="h-6 w-6 text-yellow-400" />
          </div>
          <div className="text-4xl mb-2">{barista.mood}</div>
          <div className="text-lg font-bold text-amber-200">{barista.name}</div>
          <div className="text-sm text-amber-300">{barista.specialty}</div>
          {barista.isWorking && (
            <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mt-2 animate-pulse"></div>
          )}
        </div>
      </div>

      {/* Outdoor Wooden Terrace Background */}
      <div className="absolute bg-gradient-to-br from-green-800/40 to-emerald-700/40 rounded-xl shadow-xl border-4 border-green-600/60"
           style={{ left: '70%', top: '60%', width: '28%', height: '38%' }}>
        <div className="text-center pt-6 text-white">
          <Trees className="h-10 w-10 mx-auto mb-3 text-green-300" />
          <div className="text-xl font-bold">🌲 WOODEN TERRACE 🌲</div>
          <div className="text-lg text-green-200 mt-2">Outdoor Dining</div>
          <div className="text-sm text-green-300 mt-1">Garden & Nature Views</div>
        </div>
      </div>

      {/* Wood Texture Elements */}
      <div className="absolute opacity-30">
        {/* Wood Plank Lines */}
        {Array.from({length: 8}).map((_, i) => (
          <div 
            key={i}
            className="absolute w-full h-1 bg-gradient-to-r from-amber-800 to-orange-800"
            style={{ 
              top: `${20 + (i * 10)}%`,
              transform: `rotate(${i % 2 === 0 ? 1 : -1}deg)`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-30 space-y-3">
        <div className="flex justify-between items-start">
          <div className="bg-gradient-to-br from-amber-900/90 to-orange-900/90 backdrop-blur-lg rounded-2xl p-4 border-2 border-amber-700/50">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent mb-2">
              {getTimeBasedGreeting()}
            </h1>
            <p className="text-amber-100 text-lg">Discover Your Perfect Wooden Retreat</p>
            <p className="text-amber-200 text-sm">{currentTime.toLocaleTimeString()}</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Badge className="bg-amber-700/80 text-white border-amber-500/50 text-lg px-4 py-2">
              <Trees className="h-5 w-5 mr-2" />
              Artisan Wood Café
            </Badge>
            <Badge className="bg-green-700/80 text-white border-green-500/50 text-lg px-4 py-2">
              <Wifi className="h-5 w-5 mr-2" />
              Free WiFi & Power
            </Badge>
          </div>
        </div>

        {/* Live Barista Activity */}
        <div className="bg-gradient-to-r from-amber-900/90 to-yellow-900/90 backdrop-blur-lg rounded-xl p-4 border-2 border-amber-600/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center animate-pulse">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-xl">🌳 {barista.name} is {barista.activity}</h3>
                <p className="text-amber-200 text-lg">{barista.specialty} • Sustainable Wood & Coffee</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Trees className="h-6 w-6 text-green-300" />
              <span className="text-green-200 font-bold text-lg">Eco-Crafted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seating Zones */}
      <div className="relative w-full h-full pt-40">
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
              {/* Furniture Icon */}
              <div className="flex items-center justify-center mb-2">
                {getFurnitureIcon(zone.furnitureType)}
              </div>

              {/* Zone Header */}
              <div className="text-center space-y-1">
                <h3 className="font-bold text-white text-sm">{zone.name}</h3>
                <div className="text-xs text-amber-200 font-semibold">{zone.woodType}</div>
                
                <div className={`flex items-center justify-center gap-1 text-sm ${getOccupancyColor(zone.occupied, zone.capacity)}`}>
                  <Users className="h-4 w-4" />
                  <span className="font-bold">{zone.occupied}/{zone.capacity}</span>
                </div>
              </div>

              {/* User Avatars */}
              <div className="flex justify-center">
                <div className="flex flex-wrap gap-1 justify-center">
                  {zone.users.slice(0, 3).map((user, index) => (
                    <div
                      key={index}
                      className="relative group"
                    >
                      <div className="w-6 h-6 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center text-sm border-2 border-white/30 hover:scale-110 transition-transform">
                        {user.mood}
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                        {user.name}: {user.activity}
                      </div>
                    </div>
                  ))}
                  {zone.users.length > 3 && (
                    <div className="w-6 h-6 bg-white/30 text-white rounded-full flex items-center justify-center text-xs border-2 border-white/30">
                      +{zone.users.length - 3}
                    </div>
                  )}
                </div>
              </div>

              {/* Wood Grain Effect */}
              {hoveredZone === zone.id && (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-2xl animate-pulse pointer-events-none" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Zone Details Popup */}
      {hoveredZone && (
        <div className="absolute bottom-4 left-4 right-4 z-30 bg-gradient-to-br from-amber-900/95 to-orange-900/95 backdrop-blur-xl rounded-2xl p-6 border-2 border-amber-600/50 transform transition-all duration-300">
          {(() => {
            const zone = seatingZones.find(z => z.id === hoveredZone);
            if (!zone) return null;
            
            return (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getFurnitureIcon(zone.furnitureType)}
                    <div>
                      <h3 className="text-2xl font-bold text-white">{zone.name}</h3>
                      <p className="text-amber-200 text-lg">{zone.woodType} Craftsmanship</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-600 text-white text-lg px-3 py-1">
                      <Coffee className="h-4 w-4 mr-1" />
                      {zone.atmosphere}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3 text-lg">✨ Artisan Features</h4>
                    <p className="text-white/90 text-base mb-4">{zone.specialFeature}</p>
                    
                    <h4 className="font-semibold text-white mb-3 text-lg">🌳 Wood & Atmosphere</h4>
                    <p className="text-white/90 text-base italic">"{zone.theme}" crafted from premium {zone.woodType}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-3 text-lg">👥 Coffee Enthusiasts</h4>
                    <div className="space-y-2 max-h-24 overflow-y-auto">
                      {zone.users.map((user, index) => (
                        <div key={index} className="flex items-center gap-3 text-base text-white/90">
                          <span className="text-xl">{user.mood}</span>
                          <span className="font-medium text-white">{user.name}</span>
                          <span className="text-white/70">• {user.activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => onSeatSelect(zone.id)}
                  className="w-full mt-6 bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white py-4 text-xl border-2 border-amber-600"
                >
                  <Trees className="h-6 w-6 mr-3" />
                  Choose This {zone.furnitureType === 'chair' ? 'Chair' : zone.furnitureType === 'sofa' ? 'Sofa' : zone.furnitureType === 'stool' ? 'Stool' : 'Table'}
                </Button>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
