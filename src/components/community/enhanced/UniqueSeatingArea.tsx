
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
  furnitureType: 'chair' | 'sofa' | 'table' | 'stool' | 'lounge';
  woodType: string;
}

export const UniqueSeatingArea = ({ onSeatSelect, onViewChange }: UniqueSeatingAreaProps) => {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Seating zones based on your actual café layout
  const seatingZones: SeatZone[] = [
    // Stone Archway Entrance Area - Green Leather Lounge Chairs
    {
      id: 'green-lounge-1',
      name: 'Green Leather Chair 1',
      theme: 'Stone Archway Lounge',
      atmosphere: 'intimate',
      capacity: 1,
      occupied: 1,
      users: [
        { name: 'Luna', mood: '📖', activity: 'Reading peacefully', vibe: 'contemplative' }
      ],
      position: { x: 8, y: 35, width: 12, height: 12 },
      specialFeature: 'Stone archway ambiance',
      furnitureType: 'lounge',
      woodType: 'Teak Frame'
    },
    {
      id: 'green-lounge-2',
      name: 'Green Leather Chair 2',
      theme: 'Stone Archway Lounge',
      atmosphere: 'intimate',
      capacity: 1,
      occupied: 1,
      users: [
        { name: 'River', mood: '☕', activity: 'Coffee meditation', vibe: 'peaceful' }
      ],
      position: { x: 8, y: 50, width: 12, height: 12 },
      specialFeature: 'Historic stone wall view',
      furnitureType: 'lounge',
      woodType: 'Teak Frame'
    },

    // Main Interior Seating - Wooden Tables with Metal Chairs
    {
      id: 'main-table-1',
      name: 'Window Table',
      theme: 'Industrial Modern',
      atmosphere: 'focused',
      capacity: 2,
      occupied: 2,
      users: [
        { name: 'Alex', mood: '💻', activity: 'Laptop work', vibe: 'productive' },
        { name: 'Maya', mood: '📝', activity: 'Writing', vibe: 'creative' }
      ],
      position: { x: 25, y: 40, width: 16, height: 12 },
      specialFeature: 'Natural window light',
      furnitureType: 'table',
      woodType: 'Natural Wood'
    },
    {
      id: 'main-table-2',
      name: 'Central Table',
      theme: 'Industrial Modern',
      atmosphere: 'social',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Emma', mood: '🗣️', activity: 'Coffee meeting', vibe: 'collaborative' },
        { name: 'James', mood: '📊', activity: 'Business discussion', vibe: 'professional' }
      ],
      position: { x: 25, y: 55, width: 16, height: 12 },
      specialFeature: 'Central location',
      furnitureType: 'table',
      woodType: 'Natural Wood'
    },
    {
      id: 'main-table-3',
      name: 'Corner Table',
      theme: 'Industrial Modern',
      atmosphere: 'quiet',
      capacity: 2,
      occupied: 1,
      users: [
        { name: 'Sage', mood: '🤔', activity: 'Deep thinking', vibe: 'contemplative' }
      ],
      position: { x: 25, y: 70, width: 16, height: 12 },
      specialFeature: 'Quiet corner spot',
      furnitureType: 'table',
      woodType: 'Natural Wood'
    },

    // Coffee Cupping Counter
    {
      id: 'cupping-counter',
      name: 'Coffee Cupping Station',
      theme: 'Specialty Coffee',
      atmosphere: 'educational',
      capacity: 6,
      occupied: 3,
      users: [
        { name: 'Marco', mood: '👨‍🍳', activity: 'Coffee cupping', vibe: 'expert' },
        { name: 'Sofia', mood: '🤓', activity: 'Learning tasting', vibe: 'curious' },
        { name: 'Chris', mood: '✨', activity: 'Flavor discovery', vibe: 'amazed' }
      ],
      position: { x: 45, y: 25, width: 20, height: 10 },
      specialFeature: 'Professional cupping bowls',
      furnitureType: 'table',
      woodType: 'Solid Wood Counter'
    },

    // Bar Counter Seating
    {
      id: 'bar-counter',
      name: 'Coffee Bar',
      theme: 'Barista Experience',
      atmosphere: 'energetic',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Cedar', mood: '☕', activity: 'Watching brewing', vibe: 'fascinated' },
        { name: 'Aria', mood: '😊', activity: 'Chatting with barista', vibe: 'social' }
      ],
      position: { x: 45, y: 40, width: 20, height: 8 },
      specialFeature: 'Front row brewing view',
      furnitureType: 'stool',
      woodType: 'Bar Height Stools'
    },

    // Outdoor Terrace Tables
    {
      id: 'outdoor-table-1',
      name: 'Terrace Table 1',
      theme: 'Outdoor Dining',
      atmosphere: 'fresh',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Pine', mood: '🌱', activity: 'Fresh air coffee', vibe: 'refreshed' },
        { name: 'Oak', mood: '☀️', activity: 'Morning sunshine', vibe: 'energized' }
      ],
      position: { x: 70, y: 30, width: 18, height: 14 },
      specialFeature: 'Street view seating',
      furnitureType: 'table',
      woodType: 'Weather-Resistant Teak'
    },
    {
      id: 'outdoor-table-2',
      name: 'Terrace Table 2',
      theme: 'Outdoor Dining',
      atmosphere: 'fresh',
      capacity: 4,
      occupied: 1,
      users: [
        { name: 'Willow', mood: '🍃', activity: 'People watching', vibe: 'relaxed' }
      ],
      position: { x: 70, y: 48, width: 18, height: 14 },
      specialFeature: 'Prime outdoor spot',
      furnitureType: 'table',
      woodType: 'Weather-Resistant Teak'
    },
    {
      id: 'outdoor-table-3',
      name: 'Terrace Table 3',
      theme: 'Outdoor Dining',
      atmosphere: 'fresh',
      capacity: 2,
      occupied: 0,
      users: [],
      position: { x: 70, y: 66, width: 18, height: 14 },
      specialFeature: 'Intimate outdoor dining',
      furnitureType: 'table',
      woodType: 'Weather-Resistant Teak'
    }
  ];

  const getZoneStyle = (zone: SeatZone) => {
    const baseStyle = "absolute cursor-pointer transition-all duration-300 border-2 shadow-lg rounded-lg";
    const hoverStyle = hoveredZone === zone.id ? 'scale-110 shadow-xl z-20' : 'hover:scale-105';
    
    const furnitureStyles = {
      'lounge': 'border-green-600 bg-green-600/30',
      'table': 'border-amber-600 bg-amber-600/30',
      'stool': 'border-orange-600 bg-orange-600/30',
      'chair': 'border-blue-600 bg-blue-600/30',
      'sofa': 'border-purple-600 bg-purple-600/30'
    };

    return `${baseStyle} ${hoverStyle} ${furnitureStyles[zone.furnitureType]}`;
  };

  const getFurnitureIcon = (type: string) => {
    switch(type) {
      case 'lounge': return <Armchair className="h-6 w-6 text-white" />;
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
    if (hour < 12) return '🏛️ Morning at the Stone Archway Café';
    if (hour < 17) return '☕ Afternoon Specialty Coffee';
    return '🌙 Evening Coffee Culture';
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-stone-100 via-gray-100 to-stone-200 overflow-hidden">
      {/* Concrete texture overlay */}
      <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(100,116,139,0.1)_10px,rgba(100,116,139,0.1)_20px)]"></div>

      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-30">
        <div className="flex justify-between items-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-stone-200">
            <h1 className="text-xl font-bold text-stone-800 mb-1">
              {getTimeBasedGreeting()}
            </h1>
            <p className="text-stone-600">Industrial Modern Coffee Experience</p>
            <p className="text-stone-500 text-sm">{currentTime.toLocaleTimeString()}</p>
          </div>
          
          <div className="flex gap-2">
            <Badge className="bg-stone-600 text-white">
              <Coffee className="h-4 w-4 mr-1" />
              Specialty Coffee
            </Badge>
            <Badge className="bg-green-600 text-white">
              <Wifi className="h-4 w-4 mr-1" />
              Free WiFi
            </Badge>
          </div>
        </div>
      </div>

      {/* Stone Archway Entrance */}
      <div 
        className="absolute bg-gradient-to-b from-slate-700 to-slate-800 rounded-t-full border-4 border-slate-600 shadow-2xl"
        style={{ left: '2%', top: '25%', width: '20%', height: '45%' }}
      >
        <div className="text-center pt-6 text-white">
          <div className="text-3xl mb-3">🏛️</div>
          <div className="text-lg font-bold">STONE</div>
          <div className="text-lg font-bold">ARCHWAY</div>
          <div className="text-sm mt-2 opacity-80">Historic Entrance</div>
        </div>
      </div>

      {/* Main Interior Space */}
      <div 
        className="absolute bg-gradient-to-br from-stone-200 to-gray-300 border-4 border-stone-400 shadow-xl"
        style={{ left: '22%', top: '20%', width: '45%', height: '65%' }}
      >
        <div className="text-center pt-8 text-stone-700">
          <div className="text-2xl font-bold mb-2">MAIN DINING HALL</div>
          <div className="text-lg">Industrial Modern Interior</div>
          <div className="text-sm mt-2">Concrete Walls • Natural Light</div>
        </div>
      </div>

      {/* Coffee Counter & Cupping Station */}
      <div 
        className="absolute bg-gradient-to-br from-amber-200 to-orange-300 border-4 border-amber-500 shadow-xl rounded-lg"
        style={{ left: '42%', top: '15%', width: '25%', height: '25%' }}
      >
        <div className="text-center pt-4 text-amber-800">
          <ChefHat className="h-8 w-8 mx-auto mb-2" />
          <div className="text-lg font-bold">COFFEE STATION</div>
          <div className="text-sm">Cupping • Brewing • Tasting</div>
        </div>
      </div>

      {/* Outdoor Terrace */}
      <div 
        className="absolute bg-gradient-to-br from-green-200 to-emerald-300 border-4 border-green-500 shadow-xl rounded-lg"
        style={{ left: '68%', top: '25%', width: '30%', height: '60%' }}
      >
        <div className="text-center pt-8 text-green-800">
          <Trees className="h-10 w-10 mx-auto mb-3" />
          <div className="text-xl font-bold">OUTDOOR TERRACE</div>
          <div className="text-lg">Street Side Dining</div>
          <div className="text-sm mt-2">Fresh Air • People Watching</div>
        </div>
      </div>

      {/* Seating Areas */}
      <div className="relative w-full h-full pt-20">
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
            <div className="p-3 h-full flex flex-col justify-between">
              {/* Furniture Icon */}
              <div className="flex justify-center">
                {getFurnitureIcon(zone.furnitureType)}
              </div>

              {/* Zone Info */}
              <div className="text-center">
                <h4 className="font-semibold text-white text-sm mb-1">{zone.name}</h4>
                <div className={`flex items-center justify-center gap-1 text-xs ${getOccupancyColor(zone.occupied, zone.capacity)}`}>
                  <Users className="h-3 w-3" />
                  <span>{zone.occupied}/{zone.capacity}</span>
                </div>
              </div>

              {/* User Avatars */}
              <div className="flex justify-center gap-1">
                {zone.users.slice(0, 3).map((user, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 bg-white/30 text-white rounded-full flex items-center justify-center text-xs"
                    title={`${user.name}: ${user.activity}`}
                  >
                    {user.mood}
                  </div>
                ))}
                {zone.users.length > 3 && (
                  <div className="w-6 h-6 bg-white/40 text-white rounded-full flex items-center justify-center text-xs">
                    +{zone.users.length - 3}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Zone Details Popup */}
      {hoveredZone && (
        <div className="absolute bottom-4 left-4 right-4 z-30 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-stone-200">
          {(() => {
            const zone = seatingZones.find(z => z.id === hoveredZone);
            if (!zone) return null;
            
            return (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getFurnitureIcon(zone.furnitureType)}
                    <div>
                      <h3 className="text-lg font-bold text-stone-800">{zone.name}</h3>
                      <p className="text-stone-600">{zone.woodType} • {zone.atmosphere}</p>
                    </div>
                  </div>
                  <Badge className="bg-stone-600 text-white">
                    <Coffee className="h-3 w-3 mr-1" />
                    {zone.theme}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-stone-700 mb-2">{zone.specialFeature}</p>
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
                  className="w-full mt-3 bg-stone-700 hover:bg-stone-800 text-white"
                >
                  <Coffee className="h-4 w-4 mr-2" />
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
