
import { useState } from 'react';
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

  // FULL SCREEN SEATING ZONES - MUCH LARGER AND MORE VISIBLE
  const seatingZones: SeatZone[] = [
    // OUTDOOR AREA - Bar Top (Window Counter)
    {
      id: 'outdoor-bar',
      name: 'Bar Top',
      type: 'bar-counter',
      capacity: 2,
      occupied: 1,
      users: [
        { name: 'Alex', mood: '☕', activity: 'Morning coffee', status: 'active' }
      ],
      position: { x: 5, y: 5, width: 35, height: 12 },
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
      position: { x: 5, y: 20, width: 25, height: 15 },
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
      position: { x: 55, y: 20, width: 20, height: 12 },
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
      position: { x: 15, y: 45, width: 40, height: 12 },
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
      position: { x: 5, y: 60, width: 20, height: 12 },
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
      position: { x: 30, y: 60, width: 25, height: 15 },
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
      position: { x: 35, y: 77, width: 15, height: 10 },
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
      position: { x: 5, y: 85, width: 18, height: 12 },
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
      position: { x: 25, y: 85, width: 18, height: 12 },
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
      position: { x: 60, y: 80, width: 18, height: 12 },
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
      position: { x: 80, y: 85, width: 18, height: 12 },
      isAvailable: true
    }
  ];

  const getZoneStyle = (zone: SeatZone) => {
    const baseClasses = "absolute cursor-pointer transition-all duration-200 border-3 rounded-lg flex items-center justify-center";
    const hoverClasses = hoveredZone === zone.id 
      ? 'scale-105 shadow-2xl z-30 ring-4 ring-blue-400' 
      : selectedZone === zone.id
      ? 'ring-3 ring-blue-400 z-20'
      : 'hover:scale-102 hover:shadow-xl z-10';
    
    const typeStyles = {
      'table-4': 'bg-orange-300 border-orange-600',
      'bar-stool': 'bg-orange-400 border-orange-700',
      'bar-counter': 'bg-orange-200 border-orange-600',
      'high-bar': 'bg-purple-300 border-purple-600',
      'green-chair': 'bg-green-400 border-green-700',
      'coffee-table': 'bg-orange-300 border-orange-600',
      'sofa': 'bg-blue-400 border-blue-700',
      'folding-chair': 'bg-yellow-300 border-yellow-600'
    };

    return `${baseClasses} ${hoverClasses} ${typeStyles[zone.type]}`;
  };

  const getZoneIcon = (type: string) => {
    const iconClass = `h-8 w-8 text-gray-900`;
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

  const handleZoneClick = (zoneId: string) => {
    setSelectedZone(zoneId);
    onSeatSelect(zoneId);
  };

  return (
    <div className="w-screen h-screen bg-gray-100 relative overflow-hidden m-0 p-0">
      
      {/* Header - Compact */}
      <div className="absolute top-2 left-2 z-40">
        <div className="bg-white rounded-lg p-2 shadow-lg">
          <h1 className="text-lg font-bold text-gray-800">Café Floor Plan</h1>
        </div>
      </div>

      {/* FULL SCREEN FLOOR PLAN */}
      <div className="absolute inset-0 w-full h-full">
        
        {/* OUTDOOR AREA - Top third */}
        <div className="absolute top-0 left-0 w-full h-2/5 bg-green-100 border-b-4 border-gray-700">
          <div className="absolute top-3 left-4 bg-green-700 text-white px-4 py-2 rounded text-lg font-bold">
            OUTDOOR AREA
          </div>
        </div>

        {/* INDOOR AREA - Bottom section */}
        <div className="absolute top-2/5 left-0 w-full h-3/5 bg-amber-100">
          <div className="absolute top-3 left-4 bg-amber-700 text-white px-4 py-2 rounded text-lg font-bold">
            INDOOR AREA
          </div>
        </div>

        {/* All Seating Zones - LARGE AND VISIBLE */}
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
            <div className="w-full h-full p-3 flex flex-col justify-between text-center">
              <div className="flex items-center justify-center gap-2">
                {getZoneIcon(zone.type)}
                <div className="flex items-center gap-1 text-lg font-bold text-gray-900">
                  <Users className="h-5 w-5" />
                  <span>{zone.occupied}/{zone.capacity}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-lg">{zone.name}</h4>
              </div>

              <div>
                {zone.isAvailable ? (
                  <div className="bg-green-700 text-white rounded-lg px-3 py-2 text-sm font-bold">
                    Available
                  </div>
                ) : (
                  <div className="bg-red-700 text-white rounded-lg px-3 py-2 text-sm font-bold">
                    Full
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Zone Details Popup - Only when hovered */}
      {hoveredZone && (
        <div className="absolute bottom-4 left-4 right-4 z-50 bg-white rounded-xl p-6 shadow-2xl max-w-md mx-auto">
          {(() => {
            const zone = seatingZones.find(z => z.id === hoveredZone);
            if (!zone) return null;
            
            return (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getZoneIcon(zone.type)}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{zone.name}</h3>
                      <p className="text-gray-600 text-lg">Capacity: {zone.capacity} • {zone.type.replace('-', ' ')}</p>
                    </div>
                  </div>
                  <Badge className={zone.isAvailable ? 'bg-green-700 text-white text-lg' : 'bg-red-700 text-white text-lg'}>
                    <MapPin className="h-4 w-4 mr-1" />
                    {zone.isAvailable ? 'Available' : 'Full'}
                  </Badge>
                </div>
                
                {zone.users.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-3 text-lg">Current Users:</h4>
                    <div className="space-y-2">
                      {zone.users.map((user, index) => (
                        <div key={index} className="flex items-center gap-3 text-gray-600">
                          <span className="text-2xl">{user.mood}</span>
                          <span className="font-medium text-lg">{user.name}</span>
                          <span className="text-sm opacity-75">• {user.activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={() => handleZoneClick(zone.id)}
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white py-4 text-lg"
                  disabled={!zone.isAvailable}
                >
                  <Coffee className="h-5 w-5 mr-2" />
                  {zone.isAvailable ? 'Join This Spot' : 'Spot Full - Join Waitlist'}
                </Button>
              </>
            );
          })()}
        </div>
      )}

      {/* Status Bar */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-30">
        <div className="bg-white rounded-full px-6 py-3 shadow-lg">
          <div className="flex items-center justify-center gap-8 text-gray-700 font-semibold">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-lg">{seatingZones.reduce((acc, zone) => acc + zone.occupied, 0)} people here</span>
            </div>
            <div className="flex items-center gap-2">
              <Coffee className="h-5 w-5 text-orange-600" />
              <span className="text-lg">{seatingZones.filter(z => z.isAvailable).length} spots available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
