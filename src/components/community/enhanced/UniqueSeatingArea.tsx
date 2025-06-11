
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
  type: 'table-4' | 'bar-stool' | 'green-chair' | 'coffee-table' | 'sofa' | 'bar-counter' | 'high-bar' | 'folding-chair';
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

  // Seating zones matching the ASCII layout exactly
  const seatingZones: SeatZone[] = [
    // OUTDOOR AREA - Window Counter Bar Top
    {
      id: 'outdoor-bar',
      name: 'Bar Top',
      type: 'bar-counter',
      capacity: 2,
      occupied: 1,
      users: [
        { name: 'Alex', mood: '☕', activity: 'Morning coffee', status: 'active' }
      ],
      position: { x: 5, y: 5, width: 20, height: 6 },
      isAvailable: true
    },
    
    // Table T3 (Outdoor)
    {
      id: 'table-t3',
      name: 'Table T3',
      type: 'table-4',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Emma', mood: '🌞', activity: 'Outdoor breakfast', status: 'active' },
        { name: 'Sam', mood: '📖', activity: 'Reading outside', status: 'focused' }
      ],
      position: { x: 5, y: 15, width: 12, height: 8 },
      isAvailable: true
    },

    // Folding Chair Pair (Outdoor)
    {
      id: 'folding-chairs',
      name: 'Folding Chairs',
      type: 'folding-chair',
      capacity: 2,
      occupied: 0,
      users: [],
      position: { x: 30, y: 15, width: 8, height: 6 },
      isAvailable: true
    },

    // INDOOR AREA - High Bar Table
    {
      id: 'high-bar-table',
      name: 'High Bar Table',
      type: 'high-bar',
      capacity: 2,
      occupied: 1,
      users: [
        { name: 'Jordan', mood: '💻', activity: 'Working under LED', status: 'focused' }
      ],
      position: { x: 5, y: 35, width: 25, height: 6 },
      isAvailable: true
    },

    // Table T1 (Small table & 2 chairs)
    {
      id: 'table-t1',
      name: 'Table T1',
      type: 'table-4',
      capacity: 2,
      occupied: 1,
      users: [
        { name: 'Maya', mood: '☕', activity: 'Quiet work', status: 'focused' }
      ],
      position: { x: 5, y: 45, width: 10, height: 6 },
      isAvailable: true
    },

    // Leather Sofa
    {
      id: 'leather-sofa',
      name: 'Leather Sofa',
      type: 'sofa',
      capacity: 3,
      occupied: 2,
      users: [
        { name: 'Chris', mood: '📱', activity: 'Relaxing', status: 'active' },
        { name: 'Luna', mood: '🎵', activity: 'Listening music', status: 'active' }
      ],
      position: { x: 20, y: 45, width: 15, height: 8 },
      isAvailable: true
    },

    // Low Coffee Table T2
    {
      id: 'table-t2',
      name: 'Table T2',
      type: 'coffee-table',
      capacity: 2,
      occupied: 0,
      users: [],
      position: { x: 20, y: 55, width: 6, height: 4 },
      isAvailable: true
    },

    // Green Lounge Chair C1
    {
      id: 'green-chair-c1',
      name: 'Chair C1',
      type: 'green-chair',
      capacity: 1,
      occupied: 1,
      users: [
        { name: 'River', mood: '📖', activity: 'Reading', status: 'focused' }
      ],
      position: { x: 5, y: 65, width: 8, height: 6 },
      isAvailable: false
    },

    // Green Lounge Chair C2
    {
      id: 'green-chair-c2',
      name: 'Chair C2',
      type: 'green-chair',
      capacity: 1,
      occupied: 0,
      users: [],
      position: { x: 15, y: 65, width: 8, height: 6 },
      isAvailable: true
    },

    // Green Lounge Chair T4
    {
      id: 'table-t4',
      name: 'Table T4',
      type: 'green-chair',
      capacity: 1,
      occupied: 1,
      users: [
        { name: 'Sky', mood: '✍️', activity: 'Writing', status: 'focused' }
      ],
      position: { x: 30, y: 65, width: 8, height: 6 },
      isAvailable: false
    },

    // Green Lounge Chair T5
    {
      id: 'table-t5',
      name: 'Table T5',
      type: 'green-chair',
      capacity: 1,
      occupied: 0,
      users: [],
      position: { x: 40, y: 65, width: 8, height: 6 },
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
    
    const typeStyles = {
      'table-4': 'bg-orange-200/90 border-orange-600 rounded-lg',
      'bar-stool': 'bg-orange-300/90 border-orange-700 rounded-full',
      'bar-counter': 'bg-orange-100/90 border-orange-600 rounded-lg',
      'high-bar': 'bg-purple-200/90 border-purple-600 rounded-lg',
      'green-chair': 'bg-green-500/90 border-green-700 rounded-lg',
      'coffee-table': 'bg-orange-200/90 border-orange-600 rounded-lg',
      'sofa': 'bg-blue-400/90 border-blue-600 rounded-lg',
      'folding-chair': 'bg-yellow-300/90 border-yellow-600 rounded-lg'
    };

    return `${baseClasses} ${hoverClasses} ${typeStyles[zone.type]}`;
  };

  const getZoneIcon = (type: string) => {
    const iconClass = `h-4 w-4 text-gray-800`;
    switch(type) {
      case 'table-4': return <Coffee className={iconClass} />;
      case 'bar-stool': return <ChefHat className={iconClass} />;
      case 'bar-counter': return <ChefHat className={iconClass} />;
      case 'high-bar': return <Wifi className={iconClass} />;
      case 'green-chair': return <Armchair className={iconClass} />;
      case 'coffee-table': return <Coffee className={iconClass} />;
      case 'sofa': return <Sofa className={iconClass} />;
      case 'folding-chair': return <Trees className={iconClass} />;
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
    <div className="relative w-full h-screen bg-gray-100 overflow-auto">
      {/* Header */}
      <div className="absolute top-2 left-4 right-4 z-40">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">
            Complete Café Floor Plan
          </h1>
        </div>
      </div>

      {/* Main Floor Plan Container - FIXED SIZE TO SHOW EVERYTHING */}
      <div 
        className="absolute bg-gray-200 border-4 border-gray-800 shadow-2xl"
        style={{ 
          left: '5%', 
          top: '15%', 
          width: '90%', 
          height: '80%',
          minHeight: '600px'
        }}
      >
        {/* OUTDOOR AREA - Top 30% */}
        <div 
          className="absolute bg-green-100 border-b-4 border-gray-800"
          style={{ 
            left: '0', 
            top: '0', 
            width: '100%', 
            height: '30%' 
          }}
        >
          <div className="absolute top-2 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            OUTDOOR AREA
          </div>
        </div>

        {/* Arch Opening */}
        <div 
          className="absolute bg-gradient-to-b from-gray-400 to-gray-600 rounded-t-full border-x-2 border-t-2 border-gray-800"
          style={{ 
            left: '45%', 
            top: '28%', 
            width: '10%', 
            height: '4%' 
          }}
        >
          <div className="text-center text-xs text-white font-bold mt-1">ARCH</div>
        </div>

        {/* INDOOR AREA - Bottom 70% */}
        <div 
          className="absolute bg-amber-50"
          style={{ 
            left: '0', 
            top: '30%', 
            width: '100%', 
            height: '70%' 
          }}
        >
          <div className="absolute top-2 left-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            INDOOR AREA
          </div>
        </div>

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
            <div className="p-2 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                {getZoneIcon(zone.type)}
                <div className={`flex items-center gap-1 ${getOccupancyColor(zone.occupied, zone.capacity)}`}>
                  <Users className="h-3 w-3" />
                  <span className="text-sm font-bold">
                    {zone.occupied}/{zone.capacity}
                  </span>
                </div>
              </div>

              <div className="text-center">
                <h4 className="font-bold text-gray-800 text-sm">
                  {zone.name}
                </h4>
              </div>

              <div className="text-center">
                {zone.isAvailable ? (
                  <div className="bg-green-600 text-white rounded-full px-2 py-1 text-xs font-semibold">
                    Available
                  </div>
                ) : (
                  <div className="bg-red-600 text-white rounded-full px-2 py-1 text-xs font-semibold">
                    Full
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Zone Details Popup */}
      {hoveredZone && (
        <div className="absolute bottom-4 left-4 right-4 z-50 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl border border-gray-200">
          {(() => {
            const zone = seatingZones.find(z => z.id === hoveredZone);
            if (!zone) return null;
            
            return (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getZoneIcon(zone.type)}
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {zone.name}
                      </h3>
                      <p className="text-gray-600">
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
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Current Users:
                    </h4>
                    <div className="space-y-1">
                      {zone.users.map((user, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
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
                  className="w-full bg-gray-700 hover:bg-gray-800 text-white py-3"
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
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-30">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/50">
          <div className="flex items-center justify-center gap-6 text-gray-700 font-semibold text-sm">
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
