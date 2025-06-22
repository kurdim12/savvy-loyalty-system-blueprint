
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, Users, MapPin, Wifi, Volume2, ArrowLeft } from 'lucide-react';

interface SeatArea {
  id: string;
  name: string;
  type: 'window-counter' | 'table-2' | 'table-4' | 'lounge' | 'outdoor';
  capacity: number;
  occupied: number;
  users: Array<{
    name: string;
    mood: string;
    activity: string;
  }>;
  position: { x: number; y: number; width: number; height: number };
  features: string[];
  furniture: string;
}

interface RawSmithFloorPlanProps {
  onSeatSelect: (seatId: string) => void;
  onBack?: () => void;
}

export const RawSmithFloorPlan = ({ onSeatSelect, onBack }: RawSmithFloorPlanProps) => {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);

  const seatAreas: SeatArea[] = [
    // Window Bar Counter (Floor-to-ceiling windows)
    {
      id: 'window-bar-left',
      name: 'Window Bar - Left',
      type: 'window-counter',
      capacity: 4,
      occupied: 3,
      users: [
        { name: 'Alex M.', mood: '☕', activity: 'Morning espresso ritual' },
        { name: 'Jordan K.', mood: '💻', activity: 'Remote work session' },
        { name: 'Sam L.', mood: '📱', activity: 'Coffee photography' }
      ],
      position: { x: 5, y: 12, width: 22, height: 6 },
      features: ['Floor-to-ceiling Windows', 'Natural Daylight', 'Bar Height Seating'],
      furniture: 'Black metal bar stools, wooden counter'
    },
    {
      id: 'window-bar-right',
      name: 'Window Bar - Right',
      type: 'window-counter',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Maya R.', mood: '📚', activity: 'Reading design magazine' },
        { name: 'Chris D.', mood: '🤝', activity: 'Casual meeting' }
      ],
      position: { x: 35, y: 12, width: 22, height: 6 },
      features: ['Street View', 'Power Outlets', 'Natural Light'],
      furniture: 'Black metal bar stools, natural wood counter'
    },

    // Lounge Area with Teal Upholstery
    {
      id: 'teal-lounge-corner',
      name: 'Teal Lounge Corner',
      type: 'lounge',
      capacity: 6,
      occupied: 4,
      users: [
        { name: 'Taylor S.', mood: '✍️', activity: 'Creative writing' },
        { name: 'River P.', mood: '🎵', activity: 'Playlist curation' },
        { name: 'Quinn A.', mood: '☕', activity: 'Coffee tasting notes' },
        { name: 'Casey M.', mood: '💼', activity: 'Strategy session' }
      ],
      position: { x: 70, y: 22, width: 25, height: 25 },
      features: ['Teal Upholstered Chairs', 'Cozy Atmosphere', 'Soft Lighting'],
      furniture: 'Teal fabric chairs, low wooden tables'
    },

    // Small 2-Seater Tables (Natural Wood)
    {
      id: 'wood-table-1',
      name: 'Natural Wood Table 1',
      type: 'table-2',
      capacity: 2,
      occupied: 2,
      users: [
        { name: 'Avery L.', mood: '🎨', activity: 'Sketching concepts' },
        { name: 'Riley K.', mood: '📖', activity: 'Study session' }
      ],
      position: { x: 15, y: 35, width: 10, height: 8 },
      features: ['Natural Wood Finish', 'Intimate Setting', 'Black Metal Legs'],
      furniture: 'Square wooden table, black metal chairs'
    },
    {
      id: 'wood-table-2',
      name: 'Natural Wood Table 2',
      type: 'table-2',
      capacity: 2,
      occupied: 1,
      users: [
        { name: 'Blake R.', mood: '🧠', activity: 'Deep thinking' }
      ],
      position: { x: 35, y: 35, width: 10, height: 8 },
      features: ['Natural Wood', 'Quiet Zone', 'Minimalist Design'],
      furniture: 'Square wooden table, leather upholstered chairs'
    },
    {
      id: 'wood-table-3',
      name: 'Natural Wood Table 3',
      type: 'table-2',
      capacity: 2,
      occupied: 0,
      users: [],
      position: { x: 50, y: 35, width: 10, height: 8 },
      features: ['Available', 'Natural Wood', 'Strategic Spotlighting'],
      furniture: 'Rectangular wooden table, black metal chairs'
    },

    // Larger 4-Seater Tables
    {
      id: 'group-table-1',
      name: 'Collaborative Table 1',
      type: 'table-4',
      capacity: 4,
      occupied: 3,
      users: [
        { name: 'Ocean D.', mood: '🌊', activity: 'Team brainstorm' },
        { name: 'Sky M.', mood: '☁️', activity: 'Project planning' },
        { name: 'Storm P.', mood: '⚡', activity: 'Creative energy' }
      ],
      position: { x: 20, y: 55, width: 15, height: 12 },
      features: ['Group Collaboration', 'Natural Wood Top', 'Power Access'],
      furniture: 'Large rectangular table, mixed upholstery chairs'
    },
    {
      id: 'group-table-2',
      name: 'Collaborative Table 2',
      type: 'table-4',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Phoenix K.', mood: '🔥', activity: 'Business discussion' },
        { name: 'Sage L.', mood: '🌿', activity: 'Mindful planning' }
      ],
      position: { x: 45, y: 55, width: 15, height: 12 },
      features: ['Natural Wood', 'Black Metal Frame', 'Ambient Lighting'],
      furniture: 'Rectangular table, black metal chairs with cushions'
    },

    // Covered Outdoor Seating
    {
      id: 'outdoor-terrace-1',
      name: 'Covered Outdoor 1',
      type: 'outdoor',
      capacity: 2,
      occupied: 2,
      users: [
        { name: 'Sunny R.', mood: '☀️', activity: 'Fresh air coffee' },
        { name: 'Breeze L.', mood: '🍃', activity: 'Outdoor work' }
      ],
      position: { x: 75, y: 75, width: 10, height: 8 },
      features: ['Covered Outdoor', 'Black Metal Furniture', 'Plant Integration'],
      furniture: 'Black metal table and chairs, outdoor cushions'
    },
    {
      id: 'outdoor-terrace-2',
      name: 'Covered Outdoor 2',
      type: 'outdoor',
      capacity: 2,
      occupied: 1,
      users: [
        { name: 'Cloud S.', mood: '☁️', activity: 'Evening ambiance' }
      ],
      position: { x: 87, y: 75, width: 10, height: 8 },
      features: ['Evening Lighting', 'Indoor-Outdoor Flow', 'Greenery'],
      furniture: 'Black metal bistro set, weatherproof cushions'
    }
  ];

  const getAreaColor = (type: string, occupied: number, capacity: number) => {
    const baseColors = {
      'window-counter': 'bg-blue-50/80 border-blue-300/90',
      'lounge': 'bg-teal-50/80 border-teal-400/90',
      'table-2': 'bg-amber-50/80 border-amber-300/90',
      'table-4': 'bg-orange-50/80 border-orange-300/90',
      'outdoor': 'bg-green-50/80 border-green-400/90'
    };
    
    // Add occupancy indication
    if (occupied >= capacity) {
      return baseColors[type as keyof typeof baseColors].replace('50/80', '100/90').replace('300/90', '500/100');
    }
    
    return baseColors[type as keyof typeof baseColors] || 'bg-gray-50/80 border-gray-300/90';
  };

  const getOccupancyColor = (occupied: number, capacity: number) => {
    const ratio = occupied / capacity;
    if (ratio === 0) return 'text-green-600';
    if (ratio < 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full h-full min-h-[700px] bg-gradient-to-br from-stone-100 via-gray-50 to-zinc-100 border-stone-400/30">
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
              <span className="text-xl">RawSmith Industrial Coffee</span>
              <div className="text-sm text-stone-600 font-normal">Modern Industrial Specialty Experience</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-stone-800 text-white">
              <Coffee className="h-3 w-3 mr-1" />
              Live Floor Plan
            </Badge>
            <Badge className="bg-teal-600 text-white">
              <Users className="h-3 w-3 mr-1" />
              {seatAreas.reduce((sum, area) => sum + area.occupied, 0)} Present
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 h-full">
        <div className="relative w-full h-[600px] bg-gradient-to-br from-stone-100 to-gray-100 border-t border-stone-300/50">
          
          {/* Dramatic Stone Archway Entrance */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-10 border-4 border-stone-600 rounded-t-full bg-stone-200/50 backdrop-blur-sm">
            <div className="text-center text-xs text-stone-700 font-bold pt-2">STONE ARCH</div>
            <div className="text-center text-xs text-stone-600">ENTRANCE</div>
          </div>
          
          {/* Modern Coffee Counter */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-stone-800 rounded-sm border border-stone-700">
            <div className="text-center text-xs text-white font-medium pt-1">COFFEE COUNTER</div>
          </div>

          {/* Color Sample Wall Display */}
          <div className="absolute left-2 top-20 w-8 h-16 bg-gradient-to-b from-amber-200 via-orange-300 to-red-400 border border-stone-400 rounded opacity-80">
            <div className="text-center text-xs text-stone-800 font-bold pt-1 transform -rotate-90 origin-center mt-6">SAMPLES</div>
          </div>

          {/* Glass Display Cases */}
          <div className="absolute right-2 top-20 w-8 h-12 bg-blue-100/60 border-2 border-blue-300 rounded">
            <div className="text-center text-xs text-blue-800 font-bold pt-1 transform -rotate-90 origin-center mt-4">PASTRIES</div>
          </div>

          {/* Modern Coffee Equipment Area */}
          <div className="absolute left-1/2 bottom-20 transform -translate-x-1/2 w-16 h-8 bg-gray-800 rounded border-2 border-gray-700">
            <div className="text-center text-xs text-white font-bold pt-1">ESPRESSO</div>
            <div className="text-center text-xs text-gray-300">STATION</div>
          </div>

          {/* Seat Areas */}
          {seatAreas.map((area) => (
            <div
              key={area.id}
              className={`absolute cursor-pointer transition-all duration-300 border-2 rounded-lg ${getAreaColor(area.type, area.occupied, area.capacity)} backdrop-blur-sm ${
                hoveredSeat === area.id 
                  ? 'scale-110 shadow-xl ring-2 ring-stone-500 z-10' 
                  : 'hover:scale-105 hover:shadow-lg'
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
                    {area.features.includes('Power Outlets') && <Wifi className="h-3 w-3 text-blue-600" />}
                    {area.features.includes('Natural Light') && <span className="text-xs">☀️</span>}
                    {area.type === 'outdoor' && <span className="text-xs">🌿</span>}
                    {area.type === 'lounge' && <span className="text-xs">🛋️</span>}
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
          <div className="absolute top-4 left-4 text-sm font-bold text-stone-600/80">WINDOW BAR</div>
          <div className="absolute top-4 right-4 text-sm font-bold text-teal-600/80">TEAL LOUNGE</div>
          <div className="absolute bottom-1/3 left-1/4 text-sm font-bold text-amber-600/80">NATURAL WOOD TABLES</div>
          <div className="absolute top-2 left-1/3 text-sm font-bold text-green-600/80">COVERED OUTDOOR</div>

          {/* Material Palette Legend */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-lg p-3 text-xs border border-stone-200">
            <div className="font-bold text-stone-800 mb-2">INDUSTRIAL MATERIALS</div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-stone-600 rounded-sm"></div>
                <span>Concrete</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-amber-600 rounded-sm"></div>
                <span>Natural Wood</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-stone-900 rounded-sm"></div>
                <span>Black Metal</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-teal-500 rounded-sm"></div>
                <span>Teal Accent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hovered Area Details */}
        {hoveredSeat && (
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-stone-200 max-w-sm z-20">
            {(() => {
              const area = seatAreas.find(a => a.id === hoveredSeat);
              if (!area) return null;
              
              return (
                <>
                  <h3 className="font-bold text-stone-800 mb-2">{area.name}</h3>
                  <div className="text-xs text-stone-600 mb-2 italic">{area.furniture}</div>
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
                      <div className="text-sm text-green-600 font-medium">Available • Industrial modern seating</div>
                    )}
                  </div>
                  <div className="mt-3 text-xs text-stone-600 font-medium">
                    Click to join this industrial coffee experience
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Ambient Lighting Status */}
        <div className="absolute bottom-4 right-4 bg-amber-50/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
              <Volume2 className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-stone-800 text-sm">💡 Warm Ambient Lighting</h3>
              <p className="text-xs text-stone-600">Pendant lights & strategic spotlighting active</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
