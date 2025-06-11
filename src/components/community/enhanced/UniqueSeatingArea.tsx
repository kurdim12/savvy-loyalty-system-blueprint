
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

  // Accurate seating zones based on your café photos
  const seatingZones: SeatZone[] = [
    // Stone Archway Entrance - Two Green Leather Chairs
    {
      id: 'stone-entrance-chair-1',
      name: 'Stone Archway Chair 1',
      theme: 'Historic Entrance Lounge',
      atmosphere: 'intimate',
      capacity: 1,
      occupied: 1,
      users: [
        { name: 'Luna', mood: '📖', activity: 'Reading by archway', vibe: 'contemplative' }
      ],
      position: { x: 3, y: 45, width: 8, height: 10 },
      specialFeature: 'Stone archway ambiance',
      furnitureType: 'lounge',
      woodType: 'Green Leather'
    },
    {
      id: 'stone-entrance-chair-2',
      name: 'Stone Archway Chair 2',
      theme: 'Historic Entrance Lounge',
      atmosphere: 'intimate',
      capacity: 1,
      occupied: 0,
      users: [],
      position: { x: 3, y: 58, width: 8, height: 10 },
      specialFeature: 'Historic stone wall view',
      furnitureType: 'lounge',
      woodType: 'Green Leather'
    },

    // Main Interior Tables - Central Dining Area
    {
      id: 'main-table-front',
      name: 'Front Window Table',
      theme: 'Industrial Modern',
      atmosphere: 'bright',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Alex', mood: '💻', activity: 'Morning coffee work', vibe: 'productive' },
        { name: 'Maya', mood: '📱', activity: 'Social media', vibe: 'casual' }
      ],
      position: { x: 20, y: 25, width: 14, height: 12 },
      specialFeature: 'Street view windows',
      furnitureType: 'table',
      woodType: 'Natural Wood & Metal'
    },
    {
      id: 'main-table-center-left',
      name: 'Center Left Table',
      theme: 'Industrial Modern',
      atmosphere: 'social',
      capacity: 4,
      occupied: 3,
      users: [
        { name: 'Emma', mood: '☕', activity: 'Coffee meeting', vibe: 'professional' },
        { name: 'James', mood: '🗣️', activity: 'Business chat', vibe: 'engaged' },
        { name: 'Sage', mood: '📝', activity: 'Taking notes', vibe: 'focused' }
      ],
      position: { x: 20, y: 42, width: 14, height: 12 },
      specialFeature: 'Central location buzz',
      furnitureType: 'table',
      woodType: 'Natural Wood & Metal'
    },
    {
      id: 'main-table-center-right',
      name: 'Center Right Table',
      theme: 'Industrial Modern',
      atmosphere: 'relaxed',
      capacity: 4,
      occupied: 1,
      users: [
        { name: 'River', mood: '🤔', activity: 'Quiet contemplation', vibe: 'peaceful' }
      ],
      position: { x: 37, y: 42, width: 14, height: 12 },
      specialFeature: 'Perfect for pairs',
      furnitureType: 'table',
      woodType: 'Natural Wood & Metal'
    },
    {
      id: 'main-table-back',
      name: 'Back Corner Table',
      theme: 'Industrial Modern',
      atmosphere: 'quiet',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Cedar', mood: '📚', activity: 'Studying', vibe: 'concentrated' },
        { name: 'Oak', mood: '✍️', activity: 'Writing', vibe: 'creative' }
      ],
      position: { x: 20, y: 60, width: 14, height: 12 },
      specialFeature: 'Quiet corner spot',
      furnitureType: 'table',
      woodType: 'Natural Wood & Metal'
    },
    {
      id: 'main-table-back-right',
      name: 'Back Right Table',
      theme: 'Industrial Modern',
      atmosphere: 'cozy',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Willow', mood: '😊', activity: 'Friend catch-up', vibe: 'social' },
        { name: 'Pine', mood: '☕', activity: 'Coffee appreciation', vibe: 'relaxed' }
      ],
      position: { x: 37, y: 60, width: 14, height: 12 },
      specialFeature: 'Intimate corner',
      furnitureType: 'table',
      woodType: 'Natural Wood & Metal'
    },

    // Coffee Counter/Bar Seating
    {
      id: 'coffee-counter',
      name: 'Coffee Counter Bar',
      theme: 'Barista Experience',
      atmosphere: 'energetic',
      capacity: 6,
      occupied: 3,
      users: [
        { name: 'Marco', mood: '👨‍🍳', activity: 'Watching coffee craft', vibe: 'fascinated' },
        { name: 'Sofia', mood: '😊', activity: 'Barista chat', vibe: 'friendly' },
        { name: 'Chris', mood: '☕', activity: 'Quick espresso', vibe: 'efficient' }
      ],
      position: { x: 55, y: 25, width: 20, height: 10 },
      specialFeature: 'Front row brewing view',
      furnitureType: 'stool',
      woodType: 'High Bar Stools'
    },

    // Coffee Cupping Station
    {
      id: 'cupping-station',
      name: 'Coffee Cupping Table',
      theme: 'Specialty Coffee Education',
      atmosphere: 'educational',
      capacity: 8,
      occupied: 4,
      users: [
        { name: 'Aria', mood: '🤓', activity: 'Coffee cupping', vibe: 'learning' },
        { name: 'Leo', mood: '👃', activity: 'Aroma analysis', vibe: 'focused' },
        { name: 'Sage', mood: '✨', activity: 'Flavor notes', vibe: 'discovering' },
        { name: 'Rowan', mood: '📊', activity: 'Scoring coffees', vibe: 'analytical' }
      ],
      position: { x: 55, y: 40, width: 20, height: 15 },
      specialFeature: 'Professional cupping setup',
      furnitureType: 'table',
      woodType: 'Specialty Coffee Table'
    },

    // Outdoor Terrace - Multiple Tables
    {
      id: 'outdoor-front-table',
      name: 'Terrace Front Table',
      theme: 'Outdoor Dining',
      atmosphere: 'fresh',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Sunny', mood: '☀️', activity: 'Morning sunshine', vibe: 'energized' },
        { name: 'Breeze', mood: '🌱', activity: 'Fresh air coffee', vibe: 'refreshed' }
      ],
      position: { x: 78, y: 20, width: 18, height: 15 },
      specialFeature: 'Prime street view',
      furnitureType: 'table',
      woodType: 'Weather-Resistant Teak'
    },
    {
      id: 'outdoor-middle-table',
      name: 'Terrace Middle Table',
      theme: 'Outdoor Dining',
      atmosphere: 'social',
      capacity: 4,
      occupied: 3,
      users: [
        { name: 'Storm', mood: '🗣️', activity: 'Outdoor meeting', vibe: 'collaborative' },
        { name: 'Rain', mood: '📞', activity: 'Business call', vibe: 'professional' },
        { name: 'Cloud', mood: '☕', activity: 'Coffee break', vibe: 'casual' }
      ],
      position: { x: 78, y: 40, width: 18, height: 15 },
      specialFeature: 'Perfect people watching',
      furnitureType: 'table',
      woodType: 'Weather-Resistant Teak'
    },
    {
      id: 'outdoor-back-table',
      name: 'Terrace Back Table',
      theme: 'Outdoor Dining',
      atmosphere: 'peaceful',
      capacity: 4,
      occupied: 1,
      users: [
        { name: 'Dawn', mood: '🧘', activity: 'Peaceful reflection', vibe: 'zen' }
      ],
      position: { x: 78, y: 60, width: 18, height: 15 },
      specialFeature: 'Quiet outdoor corner',
      furnitureType: 'table',
      woodType: 'Weather-Resistant Teak'
    },
    {
      id: 'outdoor-intimate-table',
      name: 'Intimate Terrace Table',
      theme: 'Outdoor Dining',
      atmosphere: 'romantic',
      capacity: 2,
      occupied: 0,
      users: [],
      position: { x: 78, y: 80, width: 18, height: 12 },
      specialFeature: 'Perfect for couples',
      furnitureType: 'table',
      woodType: 'Weather-Resistant Teak'
    }
  ];

  const getZoneStyle = (zone: SeatZone) => {
    const baseStyle = "absolute cursor-pointer transition-all duration-300 border-2 shadow-lg rounded-lg";
    const hoverStyle = hoveredZone === zone.id ? 'scale-105 shadow-xl z-20 ring-2 ring-white/50' : 'hover:scale-102';
    
    const furnitureStyles = {
      'lounge': 'border-emerald-700 bg-emerald-600/80 text-white',
      'table': 'border-amber-700 bg-amber-600/80 text-white',
      'stool': 'border-orange-700 bg-orange-600/80 text-white',
      'chair': 'border-blue-700 bg-blue-600/80 text-white',
      'sofa': 'border-purple-700 bg-purple-600/80 text-white'
    };

    return `${baseStyle} ${hoverStyle} ${furnitureStyles[zone.furnitureType]}`;
  };

  const getFurnitureIcon = (type: string) => {
    switch(type) {
      case 'lounge': return <Armchair className="h-5 w-5 text-white" />;
      case 'sofa': return <Sofa className="h-5 w-5 text-white" />;
      case 'table': return <Coffee className="h-5 w-5 text-white" />;
      case 'stool': return <Coffee className="h-4 w-4 text-white" />;
      default: return <Coffee className="h-4 w-4 text-white" />;
    }
  };

  const getOccupancyColor = (occupied: number, capacity: number) => {
    const ratio = occupied / capacity;
    if (ratio < 0.5) return 'text-green-200';
    if (ratio < 0.8) return 'text-yellow-200';
    return 'text-red-200';
  };

  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '🏛️ Morning at Stone Archway Café';
    if (hour < 17) return '☕ Afternoon Coffee Culture';
    return '🌙 Evening Café Experience';
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-stone-200 via-neutral-100 to-stone-300 overflow-hidden">
      {/* Concrete/Industrial texture overlay */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle,_rgba(100,100,100,0.3)_1px,_transparent_1px)] bg-[length:20px_20px]"></div>

      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-30">
        <div className="flex justify-between items-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-stone-300">
            <h1 className="text-xl font-bold text-stone-800 mb-1">
              {getTimeBasedGreeting()}
            </h1>
            <p className="text-stone-600">Industrial Modern Coffee Experience</p>
            <p className="text-stone-500 text-sm">{currentTime.toLocaleTimeString()}</p>
          </div>
          
          <div className="flex gap-2">
            <Badge className="bg-stone-700 text-white">
              <Coffee className="h-4 w-4 mr-1" />
              Specialty Coffee
            </Badge>
            <Badge className="bg-green-700 text-white">
              <Wifi className="h-4 w-4 mr-1" />
              Free WiFi
            </Badge>
          </div>
        </div>
      </div>

      {/* Stone Archway Entrance */}
      <div 
        className="absolute bg-gradient-to-b from-stone-600 to-stone-800 border-4 border-stone-500 shadow-2xl"
        style={{ 
          left: '1%', 
          top: '30%', 
          width: '15%', 
          height: '50%',
          borderRadius: '50% 50% 10px 10px'
        }}
      >
        <div className="text-center pt-8 text-white">
          <div className="text-4xl mb-4">🏛️</div>
          <div className="text-lg font-bold">STONE</div>
          <div className="text-lg font-bold">ARCHWAY</div>
          <div className="text-sm mt-3 opacity-80">Historic Entrance</div>
        </div>
      </div>

      {/* Main Interior Dining Hall */}
      <div 
        className="absolute bg-gradient-to-br from-neutral-100 to-stone-200 border-4 border-stone-400 shadow-xl"
        style={{ left: '16%', top: '15%', width: '42%', height: '70%' }}
      >
        <div className="text-center pt-6 text-stone-700">
          <div className="text-2xl font-bold mb-2">MAIN DINING HALL</div>
          <div className="text-lg">Industrial Modern Interior</div>
          <div className="text-sm mt-2">Concrete • Steel • Natural Light</div>
        </div>
      </div>

      {/* Coffee Counter Area */}
      <div 
        className="absolute bg-gradient-to-br from-amber-100 to-orange-200 border-4 border-amber-500 shadow-xl rounded-lg"
        style={{ left: '53%', top: '15%', width: '25%', height: '45%' }}
      >
        <div className="text-center pt-6 text-amber-800">
          <ChefHat className="h-10 w-10 mx-auto mb-3" />
          <div className="text-xl font-bold">COFFEE STATION</div>
          <div className="text-lg">Counter • Cupping • Brewing</div>
          <div className="text-sm mt-2">Specialty Coffee Experience</div>
        </div>
      </div>

      {/* Outdoor Terrace */}
      <div 
        className="absolute bg-gradient-to-br from-green-100 to-emerald-200 border-4 border-green-500 shadow-xl rounded-lg"
        style={{ left: '76%', top: '15%', width: '23%', height: '80%' }}
      >
        <div className="text-center pt-8 text-green-800">
          <Trees className="h-12 w-12 mx-auto mb-4" />
          <div className="text-2xl font-bold">OUTDOOR</div>
          <div className="text-2xl font-bold">TERRACE</div>
          <div className="text-lg mt-3">Street Side Dining</div>
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
            <div className="p-2 h-full flex flex-col justify-between">
              {/* Furniture Icon */}
              <div className="flex justify-center mb-1">
                {getFurnitureIcon(zone.furnitureType)}
              </div>

              {/* Zone Info */}
              <div className="text-center">
                <h4 className="font-semibold text-xs mb-1">{zone.name.split(' ').slice(-2).join(' ')}</h4>
                <div className={`flex items-center justify-center gap-1 text-xs ${getOccupancyColor(zone.occupied, zone.capacity)}`}>
                  <Users className="h-3 w-3" />
                  <span>{zone.occupied}/{zone.capacity}</span>
                </div>
              </div>

              {/* User Avatars */}
              <div className="flex justify-center gap-1 flex-wrap">
                {zone.users.slice(0, 4).map((user, index) => (
                  <div
                    key={index}
                    className="w-5 h-5 bg-white/30 text-white rounded-full flex items-center justify-center text-xs"
                    title={`${user.name}: ${user.activity}`}
                  >
                    {user.mood}
                  </div>
                ))}
                {zone.users.length > 4 && (
                  <div className="w-5 h-5 bg-white/40 text-white rounded-full flex items-center justify-center text-xs">
                    +{zone.users.length - 4}
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
                  <Badge className="bg-stone-700 text-white">
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
