
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Users, Coffee, Wifi, Volume2, Music, Vote } from 'lucide-react';

interface SeatArea {
  id: string;
  name: string;
  type: 'counter' | 'table' | 'lounge' | 'workspace' | 'patio';
  capacity: number;
  occupied: number;
  users: Array<{
    name: string;
    mood: string;
    activity: string;
  }>;
  position: { x: number; y: number; width: number; height: number };
  shape: 'round' | 'square' | 'rectangle';
}

interface CoffeeShopFloorPlanProps {
  onSeatSelect: (seatId: string) => void;
  onViewChange: (view: 'interior') => void;
}

export const CoffeeShopFloorPlan = ({ onSeatSelect, onViewChange }: CoffeeShopFloorPlanProps) => {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);

  // Layout matching the uploaded image with unique twist
  const seatAreas: SeatArea[] = [
    // Bar area (top)
    {
      id: 'bar-1',
      name: 'Coffee Bar',
      type: 'counter',
      capacity: 6,
      occupied: 4,
      users: [
        { name: 'Sarah M.', mood: '😊', activity: 'Ordering espresso' },
        { name: 'Mike R.', mood: '💻', activity: 'Working on laptop' },
        { name: 'Emma L.', mood: '📱', activity: 'Taking photos' },
        { name: 'Chris K.', mood: '🎵', activity: 'DJ voting' }
      ],
      position: { x: 20, y: 8, width: 60, height: 12 },
      shape: 'rectangle'
    },
    
    // First row tables
    {
      id: 'table-t1-1',
      name: 'Round Table T1',
      type: 'table',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Alex K.', mood: '☕', activity: 'Coffee tasting' },
        { name: 'Jordan P.', mood: '📖', activity: 'Reading novel' }
      ],
      position: { x: 10, y: 25, width: 15, height: 15 },
      shape: 'round'
    },
    {
      id: 'table-t2-1',
      name: 'Square Table T2',
      type: 'workspace',
      capacity: 4,
      occupied: 3,
      users: [
        { name: 'Maya S.', mood: '🗣️', activity: 'Team meeting' },
        { name: 'Casey T.', mood: '☕', activity: 'Coffee break' },
        { name: 'Zoe W.', mood: '📝', activity: 'Taking notes' }
      ],
      position: { x: 35, y: 25, width: 12, height: 12 },
      shape: 'square'
    },
    {
      id: 'table-t3-1',
      name: 'Round Table T3',
      type: 'table',
      capacity: 4,
      occupied: 1,
      users: [
        { name: 'Riley H.', mood: '😄', activity: 'Music voting' }
      ],
      position: { x: 60, y: 25, width: 15, height: 15 },
      shape: 'round'
    },

    // Second row tables
    {
      id: 'table-t2-2',
      name: 'Round Table T2',
      type: 'table',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Luna D.', mood: '🎵', activity: 'Listening to music' },
        { name: 'Noah G.', mood: '🌙', activity: 'Evening chill' }
      ],
      position: { x: 10, y: 42, width: 15, height: 15 },
      shape: 'round'
    },
    {
      id: 'table-t5-1',
      name: 'Square Table T5',
      type: 'workspace',
      capacity: 4,
      occupied: 1,
      users: [
        { name: 'Ivy C.', mood: '💼', activity: 'Focus work' }
      ],
      position: { x: 35, y: 42, width: 12, height: 12 },
      shape: 'square'
    },
    {
      id: 'table-t1-2',
      name: 'Round Table T1',
      type: 'table',
      capacity: 4,
      occupied: 3,
      users: [
        { name: 'Sam B.', mood: '💡', activity: 'Brainstorming' },
        { name: 'Taylor M.', mood: '📊', activity: 'Data analysis' },
        { name: 'River L.', mood: '🤝', activity: 'Collaboration' }
      ],
      position: { x: 60, y: 42, width: 15, height: 15 },
      shape: 'round'
    },

    // Third row tables
    {
      id: 'table-t3-2',
      name: 'Square Table T3',
      type: 'workspace',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Quinn D.', mood: '🎨', activity: 'Creative work' },
        { name: 'Avery M.', mood: '✨', activity: 'Design thinking' }
      ],
      position: { x: 10, y: 59, width: 12, height: 12 },
      shape: 'square'
    },
    {
      id: 'table-t6-1',
      name: 'Square Table T6',
      type: 'workspace',
      capacity: 4,
      occupied: 1,
      users: [
        { name: 'Blake R.', mood: '🧠', activity: 'Problem solving' }
      ],
      position: { x: 35, y: 59, width: 12, height: 12 },
      shape: 'square'
    },

    // Bottom center table
    {
      id: 'table-t1-3',
      name: 'Round Table T1',
      type: 'table',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Phoenix K.', mood: '🔥', activity: 'Networking' },
        { name: 'Sage L.', mood: '🌿', activity: 'Meditation' }
      ],
      position: { x: 22, y: 76, width: 15, height: 15 },
      shape: 'round'
    },

    // Bottom row square tables
    {
      id: 'table-t3-3',
      name: 'Square Table T3',
      type: 'workspace',
      capacity: 4,
      occupied: 3,
      users: [
        { name: 'Ocean D.', mood: '🌊', activity: 'Flow state' },
        { name: 'Sky M.', mood: '☁️', activity: 'Cloud computing' },
        { name: 'Storm P.', mood: '⚡', activity: 'Energy work' }
      ],
      position: { x: 50, y: 76, width: 12, height: 12 },
      shape: 'square'
    },

    // Patio area tables (optional patio area)
    {
      id: 'patio-t9',
      name: 'Patio Table T9',
      type: 'patio',
      capacity: 2,
      occupied: 1,
      users: [
        { name: 'Sunny R.', mood: '☀️', activity: 'Outdoor vibes' }
      ],
      position: { x: 75, y: 65, width: 10, height: 8 },
      shape: 'square'
    },
    {
      id: 'patio-t2',
      name: 'Patio Table T2',
      type: 'patio',
      capacity: 2,
      occupied: 2,
      users: [
        { name: 'Breeze L.', mood: '🍃', activity: 'Fresh air' },
        { name: 'Cloud S.', mood: '☁️', activity: 'Sky gazing' }
      ],
      position: { x: 87, y: 65, width: 10, height: 8 },
      shape: 'square'
    },
    {
      id: 'patio-t2-2',
      name: 'Patio Table T2',
      type: 'patio',
      capacity: 2,
      occupied: 1,
      users: [
        { name: 'Willow T.', mood: '🌳', activity: 'Nature connection' }
      ],
      position: { x: 75, y: 76, width: 10, height: 8 },
      shape: 'square'
    },
    {
      id: 'patio-t3-4',
      name: 'Patio Table T3',
      type: 'patio',
      capacity: 2,
      occupied: 2,
      users: [
        { name: 'Rain M.', mood: '🌧️', activity: 'Peaceful moments' },
        { name: 'Mist K.', mood: '🌫️', activity: 'Quiet reflection' }
      ],
      position: { x: 87, y: 76, width: 10, height: 8 },
      shape: 'square'
    }
  ];

  const getAreaColor = (type: string) => {
    switch (type) {
      case 'counter': return 'bg-[#8B4513]/30 border-[#8B4513]/60';
      case 'table': return 'bg-[#D2B48C]/30 border-[#D2B48C]/60';
      case 'workspace': return 'bg-[#F5DEB3]/30 border-[#F5DEB3]/60';
      case 'patio': return 'bg-[#98FB98]/30 border-[#98FB98]/60';
      default: return 'bg-gray-200/30 border-gray-400/60';
    }
  };

  const getShapeClasses = (shape: string) => {
    switch (shape) {
      case 'round': return 'rounded-full';
      case 'square': return 'rounded-lg';
      case 'rectangle': return 'rounded-lg';
      default: return 'rounded-lg';
    }
  };

  const getOccupancyColor = (occupied: number, capacity: number) => {
    const ratio = occupied / capacity;
    if (ratio < 0.5) return 'text-green-600';
    if (ratio < 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#F5E6D3] to-[#E6D7C7] p-4">
      {/* Floor Plan Title with Music Status */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        <Badge className="bg-[#8B4513] text-white">
          <Coffee className="h-4 w-4 mr-2" />
          Raw Smith Floor Plan
        </Badge>
        <Badge className="bg-purple-600 text-white">
          <Music className="h-4 w-4 mr-2" />
          🎵 "Café Jazz Vibes" Playing
        </Badge>
        <Badge className="bg-green-600 text-white">
          <Vote className="h-4 w-4 mr-2" />
          23 songs in voting queue
        </Badge>
      </div>

      {/* Interactive Floor Plan */}
      <div className="relative w-full h-full">
        {/* Coffee Shop Layout Background */}
        <div className="absolute inset-0 rounded-lg border-2 border-[#8B4513]/30">
          {/* Entrance */}
          <div className="absolute bottom-0 left-4 w-12 h-4 bg-[#8B4513]/30 rounded-t-lg flex items-center justify-center">
            <div className="text-center text-xs text-[#8B4513] font-medium">↑</div>
          </div>
          <div className="absolute bottom-4 left-2 text-sm font-medium text-[#8B4513]">Entrance</div>
          
          {/* Optional Patio Area Label */}
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-lg font-bold text-[#98FB98] opacity-70">
            Optional<br />Patio<br />Area
          </div>
        </div>

        {/* Bar Stools (circles at the bar) */}
        <div className="absolute" style={{ left: '22%', top: '20%', width: '56%' }}>
          <div className="flex justify-between">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 bg-[#8B4513]/40 border-2 border-[#8B4513]/60 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#8B4513]/60 transition-colors"
                title={`Bar Stool ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Seat Areas */}
        {seatAreas.map((area) => (
          <div
            key={area.id}
            className={`absolute cursor-pointer transition-all duration-300 border-2 ${getAreaColor(area.type)} ${getShapeClasses(area.shape)} ${
              hoveredSeat === area.id 
                ? 'scale-110 shadow-lg bg-[#8B4513]/40 border-[#8B4513]/80' 
                : 'hover:scale-105 hover:shadow-md'
            }`}
            style={{
              left: `${area.position.x}%`,
              top: `${area.position.y}%`,
              width: `${area.position.width}%`,
              height: `${area.position.height}%`
            }}
            onMouseEnter={() => setHoveredSeat(area.id)}
            onMouseLeave={() => setHoveredSeat(null)}
            onClick={() => onSeatSelect(area.id)}
          >
            {/* Area Info */}
            <div className="p-2 h-full flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-[#8B4513] text-xs mb-1">{area.name}</h4>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`flex items-center gap-1 text-xs ${getOccupancyColor(area.occupied, area.capacity)}`}>
                    <Users className="h-3 w-3" />
                    <span>{area.occupied}/{area.capacity}</span>
                  </div>
                  {area.type === 'workspace' && <Wifi className="h-3 w-3 text-[#8B4513]" />}
                  {area.type === 'patio' && <span className="text-xs">🌿</span>}
                  {area.type === 'counter' && <Coffee className="h-3 w-3 text-[#8B4513]" />}
                </div>
              </div>

              {/* User Avatars */}
              <div className="flex flex-wrap gap-1">
                {area.users.slice(0, 2).map((user, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 bg-[#8B4513] text-white rounded-full flex items-center justify-center text-xs"
                    title={`${user.name} - ${user.activity}`}
                  >
                    {user.mood}
                  </div>
                ))}
                {area.users.length > 2 && (
                  <div className="w-4 h-4 bg-[#95A5A6] text-white rounded-full flex items-center justify-center text-xs">
                    +{area.users.length - 2}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Current Music Status */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-[#8B4513]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <Music className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[#8B4513] text-sm">🎵 Now Playing: "Café Jazz Vibes"</h3>
              <p className="text-xs text-gray-600">Requested by Maya S. • 15 votes • Playing in all areas</p>
            </div>
            <div className="flex items-center gap-1">
              <Vote className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-bold text-purple-600">Vote for next song</span>
            </div>
          </div>
        </div>

        {/* Hovered Area Details */}
        {hoveredSeat && (
          <div className="absolute bottom-20 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-[#8B4513]/20 max-w-xs">
            {(() => {
              const area = seatAreas.find(a => a.id === hoveredSeat);
              if (!area) return null;
              
              return (
                <>
                  <h3 className="font-bold text-[#8B4513] mb-2">{area.name}</h3>
                  <div className="space-y-1">
                    {area.users.map((user, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-[#95A5A6]">
                        <span className="text-base">{user.mood}</span>
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs">- {user.activity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-[#8B4513] font-medium">
                    Click to join this area • Music plays here too!
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
