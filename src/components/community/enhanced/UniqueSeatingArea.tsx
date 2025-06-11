
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Coffee, ChefHat, Trees, Wifi, Sofa, Armchair } from 'lucide-react';

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

export const UniqueSeatingArea = ({ onSeatSelect, onViewChange }: UniqueSeatingAreaProps) => {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Clean, accurate seating zones based on actual café layout
  const seatingZones: SeatZone[] = [
    // Front counter area with stools
    {
      id: 'counter-seat-1',
      name: 'Counter Seat 1',
      theme: 'Coffee Counter',
      atmosphere: 'energetic',
      capacity: 1,
      occupied: 1,
      users: [
        { name: 'Alex', mood: '☕', activity: 'Morning coffee', vibe: 'focused' }
      ],
      position: { x: 25, y: 15, width: 8, height: 8 },
      specialFeature: 'Barista view',
      furnitureType: 'stool',
      woodType: 'Oak'
    },
    {
      id: 'counter-seat-2',
      name: 'Counter Seat 2',
      theme: 'Coffee Counter',
      atmosphere: 'energetic',
      capacity: 1,
      occupied: 0,
      users: [],
      position: { x: 35, y: 15, width: 8, height: 8 },
      specialFeature: 'Barista view',
      furnitureType: 'stool',
      woodType: 'Oak'
    },
    {
      id: 'counter-seat-3',
      name: 'Counter Seat 3',
      theme: 'Coffee Counter',
      atmosphere: 'energetic',
      capacity: 1,
      occupied: 1,
      users: [
        { name: 'Sofia', mood: '😊', activity: 'Chatting', vibe: 'social' }
      ],
      position: { x: 45, y: 15, width: 8, height: 8 },
      specialFeature: 'Barista view',
      furnitureType: 'stool',
      woodType: 'Oak'
    },
    {
      id: 'counter-seat-4',
      name: 'Counter Seat 4',
      theme: 'Coffee Counter',
      atmosphere: 'energetic',
      capacity: 1,
      occupied: 0,
      users: [],
      position: { x: 55, y: 15, width: 8, height: 8 },
      specialFeature: 'Barista view',
      furnitureType: 'stool',
      woodType: 'Oak'
    },

    // Green leather armchairs (center area)
    {
      id: 'green-chair-1',
      name: 'Green Armchair',
      theme: 'Lounge',
      atmosphere: 'relaxed',
      capacity: 1,
      occupied: 1,
      users: [
        { name: 'Luna', mood: '📖', activity: 'Reading', vibe: 'peaceful' }
      ],
      position: { x: 20, y: 40, width: 15, height: 15 },
      specialFeature: 'Premium comfort',
      furnitureType: 'chair',
      woodType: 'Mahogany'
    },
    {
      id: 'green-chair-2',
      name: 'Green Armchair',
      theme: 'Lounge',
      atmosphere: 'relaxed',
      capacity: 1,
      occupied: 0,
      users: [],
      position: { x: 40, y: 40, width: 15, height: 15 },
      specialFeature: 'Premium comfort',
      furnitureType: 'chair',
      woodType: 'Mahogany'
    },
    {
      id: 'green-chair-3',
      name: 'Green Armchair',
      theme: 'Lounge',
      atmosphere: 'relaxed',
      capacity: 1,
      occupied: 1,
      users: [
        { name: 'River', mood: '💭', activity: 'Thinking', vibe: 'contemplative' }
      ],
      position: { x: 60, y: 40, width: 15, height: 15 },
      specialFeature: 'Premium comfort',
      furnitureType: 'chair',
      woodType: 'Mahogany'
    },

    // Round wooden tables
    {
      id: 'round-table-1',
      name: 'Round Table 1',
      theme: 'Social Dining',
      atmosphere: 'social',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Emma', mood: '☕', activity: 'Coffee date', vibe: 'romantic' },
        { name: 'James', mood: '😊', activity: 'Conversation', vibe: 'happy' }
      ],
      position: { x: 15, y: 65, width: 20, height: 20 },
      specialFeature: 'Perfect for groups',
      furnitureType: 'table',
      woodType: 'Natural Oak'
    },
    {
      id: 'round-table-2',
      name: 'Round Table 2',
      theme: 'Work Space',
      atmosphere: 'focused',
      capacity: 4,
      occupied: 3,
      users: [
        { name: 'Maya', mood: '💻', activity: 'Working', vibe: 'productive' },
        { name: 'Chris', mood: '📝', activity: 'Writing', vibe: 'creative' },
        { name: 'Sam', mood: '🤔', activity: 'Studying', vibe: 'focused' }
      ],
      position: { x: 45, y: 65, width: 20, height: 20 },
      specialFeature: 'Great for work',
      furnitureType: 'table',
      woodType: 'Natural Oak'
    },

    // Wooden sofa corner
    {
      id: 'wooden-sofa',
      name: 'Wooden Sofa',
      theme: 'Cozy Corner',
      atmosphere: 'comfortable',
      capacity: 3,
      occupied: 2,
      users: [
        { name: 'Aria', mood: '😌', activity: 'Relaxing', vibe: 'cozy' },
        { name: 'Leo', mood: '🛋️', activity: 'Chilling', vibe: 'laid-back' }
      ],
      position: { x: 5, y: 30, width: 25, height: 18 },
      specialFeature: 'Handcrafted comfort',
      furnitureType: 'sofa',
      woodType: 'Reclaimed Pine'
    },

    // Outdoor terrace tables
    {
      id: 'terrace-table-1',
      name: 'Terrace Table 1',
      theme: 'Outdoor',
      atmosphere: 'fresh',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Sage', mood: '🌱', activity: 'Fresh air', vibe: 'refreshed' },
        { name: 'Cedar', mood: '☀️', activity: 'Sun bathing', vibe: 'peaceful' }
      ],
      position: { x: 75, y: 65, width: 20, height: 15 },
      specialFeature: 'Garden view',
      furnitureType: 'table',
      woodType: 'Weather-treated Oak'
    },
    {
      id: 'terrace-table-2',
      name: 'Terrace Table 2',
      theme: 'Outdoor',
      atmosphere: 'fresh',
      capacity: 2,
      occupied: 0,
      users: [],
      position: { x: 75, y: 85, width: 20, height: 12 },
      specialFeature: 'Garden view',
      furnitureType: 'table',
      woodType: 'Weather-treated Oak'
    }
  ];

  const getZoneStyle = (zone: SeatZone) => {
    const baseStyle = "absolute cursor-pointer transition-all duration-300 border-3 shadow-lg";
    const hoverStyle = hoveredZone === zone.id ? 'scale-110 shadow-xl z-20' : 'hover:scale-105';
    
    const furnitureStyles = {
      'chair': 'rounded-full border-green-600 bg-green-700/40',
      'sofa': 'rounded-2xl border-brown-600 bg-amber-700/40',
      'table': 'rounded-xl border-yellow-600 bg-yellow-700/40',
      'stool': 'rounded-full border-orange-600 bg-orange-700/40'
    };

    return `${baseStyle} ${hoverStyle} ${furnitureStyles[zone.furnitureType]}`;
  };

  const getFurnitureIcon = (type: string) => {
    switch(type) {
      case 'chair': return <Armchair className="h-6 w-6 text-white" />;
      case 'sofa': return <Sofa className="h-6 w-6 text-white" />;
      case 'table': return <Coffee className="h-6 w-6 text-white" />;
      case 'stool': return <Coffee className="h-5 w-5 text-white" />;
      default: return <Coffee className="h-5 w-5 text-white" />;
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
    if (hour < 12) return '🌳 Welcome to Our Wooden Café';
    if (hour < 17) return '🪵 Afternoon at the Wood Café';
    return '🔥 Evening at the Cozy Café';
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6 overflow-hidden">
      {/* Simple wood texture */}
      <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(139,69,19,0.1)_20px,rgba(139,69,19,0.1)_22px)]"></div>

      {/* Clean Header */}
      <div className="absolute top-4 left-4 right-4 z-30">
        <div className="flex justify-between items-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-amber-200">
            <h1 className="text-xl font-bold text-amber-800 mb-1">
              {getTimeBasedGreeting()}
            </h1>
            <p className="text-amber-600">Choose your perfect wooden spot</p>
            <p className="text-amber-500 text-sm">{currentTime.toLocaleTimeString()}</p>
          </div>
          
          <div className="flex gap-2">
            <Badge className="bg-amber-600 text-white">
              <Trees className="h-4 w-4 mr-1" />
              Wood Café
            </Badge>
            <Badge className="bg-green-600 text-white">
              <Wifi className="h-4 w-4 mr-1" />
              Free WiFi
            </Badge>
          </div>
        </div>
      </div>

      {/* Simple Coffee Counter */}
      <div className="absolute bg-amber-800/20 rounded-lg border-2 border-amber-600/40"
           style={{ left: '20%', top: '8%', width: '45%', height: '12%' }}>
        <div className="text-center pt-2">
          <div className="text-amber-800 font-bold text-lg">☕ Coffee Counter</div>
          <div className="text-amber-700 text-sm">Handcrafted Wooden Bar</div>
        </div>
      </div>

      {/* Simple Barista Area */}
      <div 
        className="absolute bg-amber-700/30 rounded-lg border-2 border-amber-600/50 flex items-center justify-center cursor-pointer hover:bg-amber-700/40 transition-colors"
        style={{ left: '30%', top: '22%', width: '25%', height: '8%' }}
        title="Marco - Master Barista"
      >
        <div className="text-center">
          <ChefHat className="h-6 w-6 mx-auto mb-1 text-amber-800" />
          <div className="text-amber-800 font-medium text-sm">Marco ☕</div>
        </div>
      </div>

      {/* Simple Outdoor Terrace Label */}
      <div className="absolute bg-green-700/20 rounded-lg border-2 border-green-600/40"
           style={{ left: '73%', top: '60%', width: '25%', height: '35%' }}>
        <div className="text-center pt-4">
          <Trees className="h-8 w-8 mx-auto mb-2 text-green-700" />
          <div className="text-green-800 font-bold">🌲 Terrace</div>
          <div className="text-green-700 text-sm">Outdoor Seating</div>
        </div>
      </div>

      {/* Clean Seating Areas */}
      <div className="relative w-full h-full pt-24">
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
            <div className="p-2 h-full flex flex-col justify-between">
              {/* Furniture Icon */}
              <div className="flex justify-center">
                {getFurnitureIcon(zone.furnitureType)}
              </div>

              {/* Zone Info */}
              <div className="text-center">
                <h4 className="font-semibold text-white text-xs mb-1">{zone.name}</h4>
                <div className={`flex items-center justify-center gap-1 text-xs ${getOccupancyColor(zone.occupied, zone.capacity)}`}>
                  <Users className="h-3 w-3" />
                  <span>{zone.occupied}/{zone.capacity}</span>
                </div>
              </div>

              {/* User Avatars */}
              <div className="flex justify-center gap-1">
                {zone.users.slice(0, 2).map((user, index) => (
                  <div
                    key={index}
                    className="w-5 h-5 bg-white/30 text-white rounded-full flex items-center justify-center text-xs"
                    title={`${user.name}: ${user.activity}`}
                  >
                    {user.mood}
                  </div>
                ))}
                {zone.users.length > 2 && (
                  <div className="w-5 h-5 bg-white/40 text-white rounded-full flex items-center justify-center text-xs">
                    +{zone.users.length - 2}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Clean Zone Details Popup */}
      {hoveredZone && (
        <div className="absolute bottom-4 left-4 right-4 z-30 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-amber-200">
          {(() => {
            const zone = seatingZones.find(z => z.id === hoveredZone);
            if (!zone) return null;
            
            return (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getFurnitureIcon(zone.furnitureType)}
                    <div>
                      <h3 className="text-lg font-bold text-amber-800">{zone.name}</h3>
                      <p className="text-amber-600">{zone.woodType} • {zone.atmosphere}</p>
                    </div>
                  </div>
                  <Badge className="bg-amber-600 text-white">
                    <Coffee className="h-3 w-3 mr-1" />
                    {zone.theme}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-amber-700 mb-2">{zone.specialFeature}</p>
                    <div className="space-y-1">
                      {zone.users.map((user, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{user.mood}</span>
                          <span className="font-medium">{user.name}</span>
                          <span>• {user.activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => onSeatSelect(zone.id)}
                  className="w-full mt-3 bg-amber-700 hover:bg-amber-800 text-white"
                >
                  <Trees className="h-4 w-4 mr-2" />
                  Choose This Spot
                </Button>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
