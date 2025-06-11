
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Coffee, ChefHat, Trees, Wifi, Sofa, Armchair, MapPin } from 'lucide-react';

interface UniqueSeatingAreaProps {
  onSeatSelect: (seatId: string) => void;
  onViewChange: (view: 'interior') => void;
}

interface SeatZone {
  id: string;
  name: string;
  type: 'table-4' | 'bar-stool' | 'green-chair' | 'coffee-table' | 'sofa';
  capacity: number;
  occupied: number;
  users: Array<{
    name: string;
    mood: string;
    activity: string;
    status: 'active' | 'away' | 'focused';
  }>;
  position: { x: number; y: number; width: number; height: number };
  isAvailable: boolean;
}

export const UniqueSeatingArea = ({ onSeatSelect, onViewChange }: UniqueSeatingAreaProps) => {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Exact recreation of the floor plan from the reference image
  const seatingZones: SeatZone[] = [
    // Left side tables (2 tables with 4 chairs each)
    {
      id: 'table-left-1',
      name: 'Table 1',
      type: 'table-4',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Emma', mood: '☕', activity: 'Morning coffee', status: 'active' },
        { name: 'Alex', mood: '💻', activity: 'Working', status: 'focused' }
      ],
      position: { x: 12, y: 20, width: 12, height: 12 },
      isAvailable: true
    },
    {
      id: 'table-left-2',
      name: 'Table 2',
      type: 'table-4',
      capacity: 4,
      occupied: 3,
      users: [
        { name: 'Maya', mood: '🗣️', activity: 'Team meeting', status: 'active' },
        { name: 'Sam', mood: '📝', activity: 'Taking notes', status: 'focused' },
        { name: 'Jordan', mood: '☕', activity: 'Coffee break', status: 'active' }
      ],
      position: { x: 12, y: 45, width: 12, height: 12 },
      isAvailable: true
    },

    // Bar area - top right
    {
      id: 'bar-counter',
      name: 'Bar Counter',
      type: 'bar-stool',
      capacity: 6,
      occupied: 4,
      users: [
        { name: 'Chris', mood: '👨‍🍳', activity: 'Watching coffee craft', status: 'active' },
        { name: 'Luna', mood: '😊', activity: 'Barista chat', status: 'active' },
        { name: 'River', mood: '☕', activity: 'Quick espresso', status: 'active' },
        { name: 'Sky', mood: '📱', activity: 'Social media', status: 'active' }
      ],
      position: { x: 55, y: 15, width: 35, height: 8 },
      isAvailable: true
    },

    // Bar stools (2 round stools)
    {
      id: 'bar-stool-1',
      name: 'Bar Stool 1',
      type: 'bar-stool',
      capacity: 1,
      occupied: 1,
      users: [
        { name: 'Ocean', mood: '🎵', activity: 'Listening to music', status: 'focused' }
      ],
      position: { x: 58, y: 28, width: 6, height: 6 },
      isAvailable: false
    },
    {
      id: 'bar-stool-2',
      name: 'Bar Stool 2',
      type: 'bar-stool',
      capacity: 1,
      occupied: 0,
      users: [],
      position: { x: 68, y: 28, width: 6, height: 6 },
      isAvailable: true
    },

    // Coffee table (rectangular table in center-right)
    {
      id: 'coffee-table-1',
      name: 'Coffee Table',
      type: 'coffee-table',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Pine', mood: '📖', activity: 'Reading', status: 'focused' },
        { name: 'Cedar', mood: '✍️', activity: 'Writing', status: 'focused' }
      ],
      position: { x: 58, y: 38, width: 18, height: 8 },
      isAvailable: true
    },

    // Small rectangular table
    {
      id: 'small-table-1',
      name: 'Small Table',
      type: 'coffee-table',
      capacity: 2,
      occupied: 1,
      users: [
        { name: 'Sage', mood: '🤔', activity: 'Deep thinking', status: 'focused' }
      ],
      position: { x: 58, y: 50, width: 12, height: 8 },
      isAvailable: true
    },

    // Green chairs (2 armchairs)
    {
      id: 'green-chair-1',
      name: 'Green Chair 1',
      type: 'green-chair',
      capacity: 1,
      occupied: 1,
      users: [
        { name: 'Willow', mood: '🧘', activity: 'Meditation', status: 'focused' }
      ],
      position: { x: 58, y: 62, width: 8, height: 8 },
      isAvailable: false
    },
    {
      id: 'green-chair-2',
      name: 'Green Chair 2',
      type: 'green-chair',
      capacity: 1,
      occupied: 0,
      users: [],
      position: { x: 70, y: 62, width: 8, height: 8 },
      isAvailable: true
    },

    // Plant/decoration area (right side green element)
    {
      id: 'plant-area',
      name: 'Plant Lounge',
      type: 'sofa',
      capacity: 2,
      occupied: 1,
      users: [
        { name: 'Ivy', mood: '🌱', activity: 'Nature vibes', status: 'active' }
      ],
      position: { x: 85, y: 40, width: 8, height: 25 },
      isAvailable: true
    }
  ];

  const getZoneStyle = (zone: SeatZone) => {
    const baseClasses = "absolute cursor-pointer transition-all duration-300 border-2 shadow-lg backdrop-blur-sm";
    const hoverClasses = hoveredZone === zone.id 
      ? 'scale-105 shadow-2xl z-30 ring-2 ring-blue-400/60' 
      : selectedZone === zone.id
      ? 'ring-2 ring-blue-400/60 z-20'
      : 'hover:scale-[1.02] hover:shadow-xl z-10';
    
    // Exact colors and shapes from the floor plan
    const typeStyles = {
      'table-4': 'bg-orange-200 border-orange-800 rounded-lg',
      'bar-stool': zone.id.includes('stool') 
        ? 'bg-orange-300 border-orange-900 rounded-full' 
        : 'bg-orange-100 border-orange-700 rounded-lg',
      'green-chair': 'bg-green-500 border-green-800 rounded-lg',
      'coffee-table': 'bg-orange-200 border-orange-800 rounded-lg',
      'sofa': 'bg-green-400 border-green-700 rounded-lg'
    };

    return `${baseClasses} ${hoverClasses} ${typeStyles[zone.type]}`;
  };

  const getZoneIcon = (type: string) => {
    const iconClass = `h-${isMobile ? '3' : '4'} w-${isMobile ? '3' : '4'} text-gray-800`;
    switch(type) {
      case 'table-4': return <Coffee className={iconClass} />;
      case 'bar-stool': return <ChefHat className={iconClass} />;
      case 'green-chair': return <Armchair className={iconClass} />;
      case 'coffee-table': return <Coffee className={iconClass} />;
      case 'sofa': return <Trees className={iconClass} />;
      default: return <Coffee className={iconClass} />;
    }
  };

  const getOccupancyColor = (occupied: number, capacity: number) => {
    const ratio = occupied / capacity;
    if (ratio === 0) return 'text-green-700 font-bold';
    if (ratio < 0.7) return 'text-yellow-700 font-semibold';
    return 'text-red-700 font-bold';
  };

  const handleZoneClick = (zoneId: string) => {
    setSelectedZone(zoneId);
    onSeatSelect(zoneId);
  };

  return (
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden">
      {/* Header */}
      <div className={`absolute top-4 left-4 right-4 z-40 ${isMobile ? 'flex-col space-y-2' : 'flex justify-between items-center'}`}>
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200">
          <h1 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-800 mb-1`}>
            Café Floor Plan - Top View
          </h1>
          <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
            Exact recreation of architectural layout
          </p>
        </div>
      </div>

      {/* Main Floor Plan Container - Exact proportions from reference */}
      <div 
        className="absolute bg-gray-200 border-4 border-gray-800 shadow-2xl"
        style={{ 
          left: '10%', 
          top: '15%', 
          width: '80%', 
          height: '70%' 
        }}
      >
        {/* Left Gray Zone */}
        <div 
          className="absolute bg-gray-300 border-r-2 border-gray-800"
          style={{ 
            left: '0', 
            top: '0', 
            width: '45%', 
            height: '100%' 
          }}
        />

        {/* Kitchen/Counter area (top-left gray trapezoid) */}
        <div 
          className="absolute bg-gray-400 border-2 border-gray-800"
          style={{ 
            left: '8%', 
            top: '8%', 
            width: '25%', 
            height: '15%',
            clipPath: 'polygon(0 0, 85% 0, 100% 100%, 15% 100%)'
          }}
        />

        {/* Outdoor/Natural area (bottom-right curved section) */}
        <div 
          className="absolute bg-yellow-200 border-2 border-gray-800"
          style={{ 
            right: '0', 
            bottom: '0', 
            width: '35%', 
            height: '60%',
            clipPath: 'polygon(0 40%, 30% 20%, 60% 10%, 80% 15%, 90% 25%, 100% 40%, 100% 100%, 0 100%)'
          }}
        />

        {/* Interactive Seating Zones */}
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
            onClick={() => handleZoneClick(zone.id)}
          >
            <div className={`p-${isMobile ? '1' : '2'} h-full flex flex-col justify-between`}>
              <div className="flex items-center justify-between">
                {getZoneIcon(zone.type)}
                <div className={`flex items-center gap-1 ${getOccupancyColor(zone.occupied, zone.capacity)}`}>
                  <Users className={`h-${isMobile ? '2' : '3'} w-${isMobile ? '2' : '3'}`} />
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold`}>
                    {zone.occupied}/{zone.capacity}
                  </span>
                </div>
              </div>

              <div className="text-center">
                <h4 className={`font-bold text-gray-800 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {zone.name}
                </h4>
              </div>

              <div className="text-center">
                {zone.isAvailable ? (
                  <div className={`bg-green-600 text-white rounded-full px-1 py-1 ${isMobile ? 'text-xs' : 'text-sm'} font-semibold`}>
                    Available
                  </div>
                ) : (
                  <div className={`bg-red-600 text-white rounded-full px-1 py-1 ${isMobile ? 'text-xs' : 'text-sm'} font-semibold`}>
                    Full
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Chair representations for tables */}
        {/* Table 1 chairs */}
        <div className="absolute w-3 h-3 bg-gray-800 rounded" style={{ left: '9%', top: '23%' }} />
        <div className="absolute w-3 h-3 bg-gray-800 rounded" style={{ left: '9%', top: '29%' }} />
        <div className="absolute w-3 h-3 bg-gray-800 rounded" style={{ left: '25%', top: '23%' }} />
        <div className="absolute w-3 h-3 bg-gray-800 rounded" style={{ left: '25%', top: '29%' }} />

        {/* Table 2 chairs */}
        <div className="absolute w-3 h-3 bg-gray-800 rounded" style={{ left: '9%', top: '48%' }} />
        <div className="absolute w-3 h-3 bg-gray-800 rounded" style={{ left: '9%', top: '54%' }} />
        <div className="absolute w-3 h-3 bg-gray-800 rounded" style={{ left: '25%', top: '48%' }} />
        <div className="absolute w-3 h-3 bg-gray-800 rounded" style={{ left: '25%', top: '54%' }} />
      </div>

      {/* Zone Details Popup */}
      {hoveredZone && (
        <div className={`absolute ${isMobile ? 'bottom-4 left-2 right-2' : 'bottom-4 left-4 right-4'} z-50 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl border border-gray-200`}>
          {(() => {
            const zone = seatingZones.find(z => z.id === hoveredZone);
            if (!zone) return null;
            
            return (
              <>
                <div className={`flex items-center justify-between mb-3 ${isMobile ? 'flex-col space-y-2' : ''}`}>
                  <div className="flex items-center gap-3">
                    {getZoneIcon(zone.type)}
                    <div>
                      <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-800`}>
                        {zone.name}
                      </h3>
                      <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
                        Capacity: {zone.capacity} • {zone.type.replace('-', ' ')}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${zone.isAvailable ? 'bg-green-700' : 'bg-red-700'} text-white`}>
                    <MapPin className="h-3 w-3 mr-1" />
                    {zone.isAvailable ? 'Available' : 'Full'}
                  </Badge>
                </div>
                
                {zone.users.length > 0 && (
                  <div className="mb-4">
                    <h4 className={`font-semibold text-gray-700 mb-2 ${isMobile ? 'text-sm' : ''}`}>
                      Current Users:
                    </h4>
                    <div className="space-y-1">
                      {zone.users.map((user, index) => (
                        <div key={index} className={`flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-sm'} text-gray-600`}>
                          <span className="text-lg">{user.mood}</span>
                          <span className="font-medium">{user.name}</span>
                          <span className="text-xs opacity-75">• {user.activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={() => handleZoneClick(zone.id)}
                  className={`w-full bg-gray-700 hover:bg-gray-800 text-white ${isMobile ? 'text-sm py-2' : 'py-3'}`}
                  disabled={!zone.isAvailable}
                >
                  <Coffee className="h-4 w-4 mr-2" />
                  {zone.isAvailable ? 'Join This Spot' : 'Spot Full - Join Waitlist'}
                </Button>
              </>
            );
          })()}
        </div>
      )}

      {/* Status Bar */}
      <div className={`absolute ${isMobile ? 'bottom-20 left-2 right-2' : 'top-20 left-1/2 transform -translate-x-1/2'} z-30`}>
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/50">
          <div className={`flex items-center justify-center gap-${isMobile ? '3' : '6'} text-gray-700 font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>{seatingZones.reduce((acc, zone) => acc + zone.occupied, 0)} people here</span>
            </div>
            <div className="flex items-center gap-1">
              <Coffee className="h-3 w-3 text-orange-600" />
              <span>{seatingZones.filter(z => z.isAvailable).length} spots available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
