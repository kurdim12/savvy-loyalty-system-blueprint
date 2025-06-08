
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Users, Coffee, Wifi, Volume2 } from 'lucide-react';

interface SeatArea {
  id: string;
  name: string;
  type: 'counter' | 'table' | 'lounge' | 'workspace';
  capacity: number;
  occupied: number;
  users: Array<{
    name: string;
    mood: string;
    activity: string;
  }>;
  position: { x: number; y: number; width: number; height: number };
}

interface CoffeeShopFloorPlanProps {
  onSeatSelect: (seatId: string) => void;
  onViewChange: (view: 'interior') => void;
}

export const CoffeeShopFloorPlan = ({ onSeatSelect, onViewChange }: CoffeeShopFloorPlanProps) => {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);

  const seatAreas: SeatArea[] = [
    {
      id: 'counter-1',
      name: 'Coffee Counter',
      type: 'counter',
      capacity: 8,
      occupied: 3,
      users: [
        { name: 'Sarah M.', mood: '😊', activity: 'Ordering espresso' },
        { name: 'Mike R.', mood: '💻', activity: 'Working on laptop' },
        { name: 'Emma L.', mood: '📱', activity: 'Taking photos' }
      ],
      position: { x: 20, y: 15, width: 60, height: 12 }
    },
    {
      id: 'table-1',
      name: 'Window Table',
      type: 'table',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Alex K.', mood: '☕', activity: 'Coffee tasting' },
        { name: 'Jordan P.', mood: '📖', activity: 'Reading novel' }
      ],
      position: { x: 15, y: 35, width: 20, height: 20 }
    },
    {
      id: 'table-2',
      name: 'Center Table',
      type: 'table',
      capacity: 6,
      occupied: 4,
      users: [
        { name: 'Maya S.', mood: '🗣️', activity: 'Group discussion' },
        { name: 'Chris T.', mood: '☕', activity: 'Coffee meeting' },
        { name: 'Zoe W.', mood: '📝', activity: 'Taking notes' },
        { name: 'Ryan H.', mood: '😄', activity: 'Sharing stories' }
      ],
      position: { x: 45, y: 40, width: 25, height: 25 }
    },
    {
      id: 'lounge-1',
      name: 'Cozy Lounge',
      type: 'lounge',
      capacity: 6,
      occupied: 2,
      users: [
        { name: 'Luna D.', mood: '🎵', activity: 'Listening to jazz' },
        { name: 'Noah G.', mood: '🌙', activity: 'Evening chill' }
      ],
      position: { x: 75, y: 30, width: 20, height: 30 }
    },
    {
      id: 'workspace-1',
      name: 'Quiet Workspace',
      type: 'workspace',
      capacity: 4,
      occupied: 1,
      users: [
        { name: 'Ivy C.', mood: '💼', activity: 'Focus work' }
      ],
      position: { x: 15, y: 70, width: 30, height: 20 }
    },
    {
      id: 'workspace-2',
      name: 'Collaborative Space',
      type: 'workspace',
      capacity: 8,
      occupied: 3,
      users: [
        { name: 'Sam B.', mood: '💡', activity: 'Brainstorming' },
        { name: 'Taylor M.', mood: '📊', activity: 'Data analysis' },
        { name: 'Casey L.', mood: '🤝', activity: 'Team meeting' }
      ],
      position: { x: 55, y: 70, width: 35, height: 25 }
    }
  ];

  const getAreaColor = (type: string) => {
    switch (type) {
      case 'counter': return 'bg-[#8B4513]/20 border-[#8B4513]/40';
      case 'table': return 'bg-[#D2B48C]/20 border-[#D2B48C]/40';
      case 'lounge': return 'bg-[#DEB887]/20 border-[#DEB887]/40';
      case 'workspace': return 'bg-[#F5DEB3]/20 border-[#F5DEB3]/40';
      default: return 'bg-gray-200/20 border-gray-400/40';
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
      {/* Floor Plan Title */}
      <div className="absolute top-4 right-4 z-10">
        <Badge className="bg-[#8B4513] text-white">
          <Coffee className="h-4 w-4 mr-2" />
          Raw Smith Floor Plan
        </Badge>
      </div>

      {/* Interactive Floor Plan */}
      <div className="relative w-full h-full">
        {/* Coffee Shop Layout Background */}
        <div className="absolute inset-0 rounded-lg border-2 border-[#8B4513]/30">
          {/* Entrance */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-[#8B4513]/30 rounded-t-lg">
            <div className="text-center text-xs text-[#8B4513] mt-1 font-medium">Entrance</div>
          </div>
          
          {/* Coffee Bar */}
          <div className="absolute top-8 left-4 right-4 h-8 bg-[#8B4513]/40 rounded-lg flex items-center justify-center">
            <Coffee className="h-4 w-4 text-[#8B4513] mr-2" />
            <span className="text-sm font-medium text-[#8B4513]">Coffee Bar</span>
          </div>
        </div>

        {/* Seat Areas */}
        {seatAreas.map((area) => (
          <div
            key={area.id}
            className={`absolute cursor-pointer transition-all duration-300 rounded-lg border-2 ${getAreaColor(area.type)} ${
              hoveredSeat === area.id 
                ? 'scale-105 shadow-lg bg-[#8B4513]/30' 
                : 'hover:scale-102 hover:shadow-md'
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
                <h4 className="font-semibold text-[#8B4513] text-sm mb-1">{area.name}</h4>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`flex items-center gap-1 text-xs ${getOccupancyColor(area.occupied, area.capacity)}`}>
                    <Users className="h-3 w-3" />
                    <span>{area.occupied}/{area.capacity}</span>
                  </div>
                  {area.type === 'workspace' && <Wifi className="h-3 w-3 text-[#8B4513]" />}
                  {area.type === 'lounge' && <Volume2 className="h-3 w-3 text-[#8B4513]" />}
                </div>
              </div>

              {/* User Avatars */}
              <div className="flex flex-wrap gap-1">
                {area.users.slice(0, 3).map((user, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 bg-[#8B4513] text-white rounded-full flex items-center justify-center text-xs font-medium"
                    title={`${user.name} - ${user.activity}`}
                  >
                    {user.mood}
                  </div>
                ))}
                {area.users.length > 3 && (
                  <div className="w-6 h-6 bg-[#95A5A6] text-white rounded-full flex items-center justify-center text-xs">
                    +{area.users.length - 3}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Hovered Area Details */}
        {hoveredSeat && (
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-[#8B4513]/20 max-w-xs">
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
                    Click to join this area
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
