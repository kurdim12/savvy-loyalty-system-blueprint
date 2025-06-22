
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, Users, MapPin, Wifi, Volume2, ArrowLeft } from 'lucide-react';

interface SeatArea {
  id: string;
  name: string;
  type: 'window-counter' | 'booth' | 'square-table' | 'espresso-bar' | 'outdoor';
  capacity: number;
  occupied: number;
  users: Array<{
    name: string;
    mood: string;
    activity: string;
  }>;
  position: { x: number; y: number; width: number; height: number };
  features: string[];
}

interface RawSmithFloorPlanProps {
  onSeatSelect: (seatId: string) => void;
  onBack?: () => void;
}

export const RawSmithFloorPlan = ({ onSeatSelect, onBack }: RawSmithFloorPlanProps) => {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);

  const seatAreas: SeatArea[] = [
    // Zone 1: Window Counter Seating
    {
      id: 'window-counter-1',
      name: 'Window Counter Left',
      type: 'window-counter',
      capacity: 3,
      occupied: 2,
      users: [
        { name: 'Alex M.', mood: '☕', activity: 'Morning espresso' },
        { name: 'Jordan K.', mood: '💻', activity: 'Remote work' }
      ],
      position: { x: 5, y: 15, width: 25, height: 8 },
      features: ['Street View', 'Natural Light', 'USB Charging']
    },
    {
      id: 'window-counter-2',
      name: 'Window Counter Right',
      type: 'window-counter',
      capacity: 3,
      occupied: 1,
      users: [
        { name: 'Sam L.', mood: '📱', activity: 'Social media' }
      ],
      position: { x: 35, y: 15, width: 25, height: 8 },
      features: ['Street View', 'Natural Light', 'Power Outlets']
    },

    // Zone 2: Intimate Booth Corner
    {
      id: 'corner-booth',
      name: 'Forest Green Banquette',
      type: 'booth',
      capacity: 4,
      occupied: 3,
      users: [
        { name: 'Maya R.', mood: '📚', activity: 'Reading design book' },
        { name: 'Chris D.', mood: '🤝', activity: 'Client meeting' },
        { name: 'Taylor S.', mood: '✍️', activity: 'Journal writing' }
      ],
      position: { x: 75, y: 25, width: 20, height: 20 },
      features: ['Private Alcove', 'Pendant Lighting', 'Cozy Seating']
    },

    // Zone 3: Flexible Square Tables
    {
      id: 'table-sq-1',
      name: 'Square Table 1',
      type: 'square-table',
      capacity: 2,
      occupied: 2,
      users: [
        { name: 'River P.', mood: '🎵', activity: 'Music curation' },
        { name: 'Quinn A.', mood: '☕', activity: 'Coffee tasting' }
      ],
      position: { x: 15, y: 45, width: 12, height: 12 },
      features: ['Oak Top', 'Steel Legs', 'Table Power']
    },
    {
      id: 'table-sq-2',
      name: 'Square Table 2',
      type: 'square-table',
      capacity: 4,
      occupied: 1,
      users: [
        { name: 'Casey M.', mood: '💼', activity: 'Business planning' }
      ],
      position: { x: 35, y: 45, width: 15, height: 15 },
      features: ['Oak Top', 'Steel Legs', 'Laptop Friendly']
    },
    {
      id: 'table-sq-3',
      name: 'Square Table 3',
      type: 'square-table',
      capacity: 2,
      occupied: 0,
      users: [],
      position: { x: 55, y: 45, width: 12, height: 12 },
      features: ['Available', 'Window Adjacent', 'Quiet Zone']
    },
    {
      id: 'table-sq-4',
      name: 'Square Table 4',
      type: 'square-table',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Avery L.', mood: '🎨', activity: 'Sketching ideas' },
        { name: 'Riley K.', mood: '📖', activity: 'Study session' }
      ],
      position: { x: 20, y: 65, width: 15, height: 15 },
      features: ['Central Location', 'Good Lighting', 'Collaborative']
    },

    // Coffee Preparation Theater (Espresso Bar)
    {
      id: 'espresso-bar',
      name: 'Espresso Theater',
      type: 'espresso-bar',
      capacity: 2,
      occupied: 1,
      users: [
        { name: 'Phoenix R.', mood: '👀', activity: 'Watching pour-over' }
      ],
      position: { x: 45, y: 75, width: 20, height: 10 },
      features: ['Barista View', 'Coffee Education', 'Standing Counter']
    },

    // Outdoor Patio Extension
    {
      id: 'outdoor-patio-1',
      name: 'Sidewalk Table 1',
      type: 'outdoor',
      capacity: 2,
      occupied: 2,
      users: [
        { name: 'Sky D.', mood: '🌤️', activity: 'Fresh air break' },
        { name: 'Cloud S.', mood: '🚶', activity: 'People watching' }
      ],
      position: { x: 5, y: 5, width: 10, height: 8 },
      features: ['Outdoor', 'Street View', 'Weather Dependent']
    },
    {
      id: 'outdoor-patio-2',
      name: 'Sidewalk Table 2',
      type: 'outdoor',
      capacity: 2,
      occupied: 0,
      users: [],
      position: { x: 18, y: 5, width: 10, height: 8 },
      features: ['Outdoor', 'Available', 'Morning Sun']
    }
  ];

  const getAreaColor = (type: string, occupied: number, capacity: number) => {
    const baseColors = {
      'window-counter': 'bg-blue-100/60 border-blue-300/80',
      'booth': 'bg-green-100/60 border-green-400/80',
      'square-table': 'bg-amber-100/60 border-amber-300/80',
      'espresso-bar': 'bg-purple-100/60 border-purple-300/80',
      'outdoor': 'bg-emerald-100/60 border-emerald-300/80'
    };
    
    // Add red tint if fully occupied
    if (occupied >= capacity) {
      return baseColors[type as keyof typeof baseColors].replace('100/60', '200/80').replace('300/80', '400/90');
    }
    
    return baseColors[type as keyof typeof baseColors] || 'bg-gray-100/60 border-gray-300/80';
  };

  const getOccupancyColor = (occupied: number, capacity: number) => {
    const ratio = occupied / capacity;
    if (ratio === 0) return 'text-green-600';
    if (ratio < 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full h-full min-h-[700px] bg-gradient-to-br from-stone-50 to-zinc-100 border-stone-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-stone-800">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button onClick={onBack} variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <MapPin className="h-6 w-6 text-stone-600" />
            <div>
              <span className="text-xl">RawSmith Coffee Floor Plan</span>
              <div className="text-sm text-stone-600 font-normal">Industrial-Modern Specialty Coffee Experience</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-stone-800 text-white">
              <Coffee className="h-3 w-3 mr-1" />
              Live Seating
            </Badge>
            <Badge className="bg-amber-600 text-white">
              <Users className="h-3 w-3 mr-1" />
              {seatAreas.reduce((sum, area) => sum + area.occupied, 0)} Present
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 h-full">
        <div className="relative w-full h-[600px] bg-gradient-to-br from-stone-100 to-zinc-50 border-t border-stone-200">
          
          {/* Stone Archway Entrance */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-stone-600 rounded-t-lg opacity-80">
            <div className="text-center text-xs text-white font-bold pt-1">ENTRANCE</div>
          </div>
          
          {/* Host/Ordering Counter */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-stone-800 rounded-sm">
            <div className="text-center text-xs text-white font-medium pt-1">ORDER HERE</div>
          </div>

          {/* Coffee Sample Wall */}
          <div className="absolute left-2 top-20 w-8 h-20 bg-amber-200 border border-amber-400 rounded opacity-70">
            <div className="text-center text-xs text-amber-800 font-bold pt-1 transform -rotate-90 origin-center">SAMPLES</div>
          </div>

          {/* La Marzocco Espresso Station */}
          <div className="absolute left-1/2 bottom-20 transform -translate-x-1/2 w-12 h-8 bg-gray-700 rounded border-2 border-gray-800">
            <div className="text-center text-xs text-white font-bold pt-1">ESPRESSO</div>
          </div>

          {/* Seat Areas */}
          {seatAreas.map((area) => (
            <div
              key={area.id}
              className={`absolute cursor-pointer transition-all duration-300 border-2 rounded-lg ${getAreaColor(area.type, area.occupied, area.capacity)} ${
                hoveredSeat === area.id 
                  ? 'scale-105 shadow-lg ring-2 ring-stone-400 z-10' 
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
              <div className="p-2 h-full flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-stone-800 text-xs mb-1 leading-tight">{area.name}</h4>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`flex items-center gap-1 text-xs ${getOccupancyColor(area.occupied, area.capacity)}`}>
                      <Users className="h-3 w-3" />
                      <span className="font-semibold">{area.occupied}/{area.capacity}</span>
                    </div>
                    {area.features.includes('USB Charging') && <Wifi className="h-3 w-3 text-blue-600" />}
                    {area.features.includes('Natural Light') && <span className="text-xs">☀️</span>}
                    {area.type === 'outdoor' && <span className="text-xs">🌿</span>}
                  </div>
                </div>

                {/* User Avatars */}
                <div className="flex flex-wrap gap-1">
                  {area.users.slice(0, 3).map((user, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 bg-stone-700 text-white rounded-full flex items-center justify-center text-xs border border-white"
                      title={`${user.name} - ${user.activity}`}
                    >
                      {user.mood}
                    </div>
                  ))}
                  {area.users.length > 3 && (
                    <div className="w-4 h-4 bg-stone-500 text-white rounded-full flex items-center justify-center text-xs border border-white">
                      +{area.users.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Zone Labels */}
          <div className="absolute top-4 left-4 text-sm font-bold text-stone-600 opacity-70">WINDOW COUNTER</div>
          <div className="absolute top-4 right-4 text-sm font-bold text-stone-600 opacity-70">BOOTH CORNER</div>
          <div className="absolute bottom-1/3 left-1/4 text-sm font-bold text-stone-600 opacity-70">FLEXIBLE SEATING</div>
          <div className="absolute top-2 left-1/4 text-sm font-bold text-stone-600 opacity-70">OUTDOOR PATIO</div>

          {/* Material Palette Legend */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs">
            <div className="font-bold text-stone-800 mb-1">MATERIALS</div>
            <div className="flex gap-3">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-stone-600 rounded-sm"></div>
                <span>Concrete</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-amber-600 rounded-sm"></div>
                <span>Oak</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-stone-800 rounded-sm"></div>
                <span>Steel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hovered Area Details */}
        {hoveredSeat && (
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-stone-200 max-w-sm z-20">
            {(() => {
              const area = seatAreas.find(a => a.id === hoveredSeat);
              if (!area) return null;
              
              return (
                <>
                  <h3 className="font-bold text-stone-800 mb-2">{area.name}</h3>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {area.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    {area.users.length > 0 ? (
                      area.users.map((user, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-stone-600">
                          <span className="text-base">{user.mood}</span>
                          <span className="font-medium">{user.name}</span>
                          <span className="text-xs">- {user.activity}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-green-600 font-medium">Available for seating</div>
                    )}
                  </div>
                  <div className="mt-3 text-xs text-stone-600 font-medium">
                    Click to join this {area.type.replace('-', ' ')} area
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Coffee Preparation Theater Status */}
        <div className="absolute bottom-4 right-4 bg-purple-50/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-amber-600 rounded-full flex items-center justify-center">
              <Coffee className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-stone-800 text-sm">☕ Barista Theater</h3>
              <p className="text-xs text-stone-600">Currently brewing: Ethiopian pour-over</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
