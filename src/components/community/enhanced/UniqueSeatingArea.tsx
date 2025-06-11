
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
  type: 'entrance-chair' | 'dining-table' | 'counter-seat' | 'outdoor-table';
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
  ambiance: string;
  features: string[];
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

  // Accurate café layout based on your photos
  const seatingZones: SeatZone[] = [
    // Stone Archway Entrance - Green Leather Chairs
    {
      id: 'entrance-chair-left',
      name: 'Stone Arch Chair',
      type: 'entrance-chair',
      capacity: 1,
      occupied: 1,
      users: [{ name: 'Luna', mood: '📖', activity: 'Reading by the archway', status: 'focused' }],
      position: { x: 5, y: 45, width: 8, height: 12 },
      isAvailable: false,
      ambiance: 'Historic & Intimate',
      features: ['Stone archway view', 'Green leather armchair', 'Quiet corner']
    },
    {
      id: 'entrance-chair-right',
      name: 'Stone Arch Chair',
      type: 'entrance-chair',
      capacity: 1,
      occupied: 0,
      users: [],
      position: { x: 5, y: 60, width: 8, height: 12 },
      isAvailable: true,
      ambiance: 'Historic & Intimate',
      features: ['Stone archway view', 'Green leather armchair', 'Perfect for solo work']
    },

    // Main Interior Dining Tables (Industrial Modern)
    {
      id: 'main-table-1',
      name: 'Window Table',
      type: 'dining-table',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Alex', mood: '💻', activity: 'Morning work session', status: 'active' },
        { name: 'Maya', mood: '☕', activity: 'Coffee meeting', status: 'active' }
      ],
      position: { x: 20, y: 25, width: 16, height: 14 },
      isAvailable: true,
      ambiance: 'Bright & Social',
      features: ['Street view', 'Natural light', 'Wood & metal table', 'Power outlets']
    },
    {
      id: 'main-table-2',
      name: 'Center Table',
      type: 'dining-table',
      capacity: 4,
      occupied: 3,
      users: [
        { name: 'Emma', mood: '🗣️', activity: 'Team discussion', status: 'active' },
        { name: 'James', mood: '📝', activity: 'Taking notes', status: 'focused' },
        { name: 'Sage', mood: '☕', activity: 'Coffee break', status: 'active' }
      ],
      position: { x: 20, y: 42, width: 16, height: 14 },
      isAvailable: true,
      ambiance: 'Collaborative Hub',
      features: ['Central location', 'Great for meetings', 'Industrial design']
    },
    {
      id: 'main-table-3',
      name: 'Corner Table',
      type: 'dining-table',
      capacity: 4,
      occupied: 1,
      users: [
        { name: 'River', mood: '🤔', activity: 'Deep thinking', status: 'focused' }
      ],
      position: { x: 39, y: 42, width: 16, height: 14 },
      isAvailable: true,
      ambiance: 'Quiet & Focused',
      features: ['Corner privacy', 'Less foot traffic', 'Perfect for concentration']
    },
    {
      id: 'main-table-4',
      name: 'Back Table',
      type: 'dining-table',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Cedar', mood: '📚', activity: 'Studying', status: 'focused' },
        { name: 'Oak', mood: '✍️', activity: 'Writing', status: 'focused' }
      ],
      position: { x: 20, y: 60, width: 16, height: 14 },
      isAvailable: true,
      ambiance: 'Study Zone',
      features: ['Quiet back area', 'Less distractions', 'Study-friendly']
    },
    {
      id: 'main-table-5',
      name: 'Side Table',
      type: 'dining-table',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Willow', mood: '😊', activity: 'Casual chat', status: 'active' },
        { name: 'Pine', mood: '☕', activity: 'Coffee tasting', status: 'active' }
      ],
      position: { x: 39, y: 60, width: 16, height: 14 },
      isAvailable: true,
      ambiance: 'Relaxed & Cozy',
      features: ['Intimate setting', 'Great for pairs', 'Comfortable seating']
    },

    // Coffee Counter Bar Seating
    {
      id: 'counter-left',
      name: 'Coffee Bar Left',
      type: 'counter-seat',
      capacity: 3,
      occupied: 2,
      users: [
        { name: 'Marco', mood: '👨‍🍳', activity: 'Watching coffee craft', status: 'active' },
        { name: 'Sofia', mood: '😊', activity: 'Barista chat', status: 'active' }
      ],
      position: { x: 58, y: 25, width: 18, height: 10 },
      isAvailable: true,
      ambiance: 'Interactive & Energetic',
      features: ['Front row brewing view', 'Barista interaction', 'Coffee education']
    },
    {
      id: 'counter-right',
      name: 'Coffee Bar Right',
      type: 'counter-seat',
      capacity: 3,
      occupied: 1,
      users: [
        { name: 'Chris', mood: '☕', activity: 'Quick espresso', status: 'active' }
      ],
      position: { x: 58, y: 38, width: 18, height: 10 },
      isAvailable: true,
      ambiance: 'Interactive & Energetic',
      features: ['Coffee cupping area', 'Specialty tastings', 'Educational experience']
    },

    // Outdoor Terrace Tables
    {
      id: 'outdoor-table-1',
      name: 'Terrace Front',
      type: 'outdoor-table',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Sunny', mood: '☀️', activity: 'Morning sunshine', status: 'active' },
        { name: 'Breeze', mood: '🌱', activity: 'Fresh air coffee', status: 'active' }
      ],
      position: { x: 79, y: 20, width: 18, height: 15 },
      isAvailable: true,
      ambiance: 'Fresh & Outdoor',
      features: ['Street view', 'Fresh air', 'People watching', 'Teak furniture']
    },
    {
      id: 'outdoor-table-2',
      name: 'Terrace Center',
      type: 'outdoor-table',
      capacity: 4,
      occupied: 3,
      users: [
        { name: 'Storm', mood: '🗣️', activity: 'Outdoor meeting', status: 'active' },
        { name: 'Rain', mood: '📞', activity: 'Phone call', status: 'active' },
        { name: 'Cloud', mood: '☕', activity: 'Coffee break', status: 'active' }
      ],
      position: { x: 79, y: 38, width: 18, height: 15 },
      isAvailable: true,
      ambiance: 'Social & Vibrant',
      features: ['Prime location', 'Great for groups', 'Outdoor atmosphere']
    },
    {
      id: 'outdoor-table-3',
      name: 'Terrace Back',
      type: 'outdoor-table',
      capacity: 4,
      occupied: 1,
      users: [
        { name: 'Dawn', mood: '🧘', activity: 'Peaceful reflection', status: 'focused' }
      ],
      position: { x: 79, y: 56, width: 18, height: 15 },
      isAvailable: true,
      ambiance: 'Peaceful & Serene',
      features: ['Quieter spot', 'Good for calls', 'Relaxing environment']
    },
    {
      id: 'outdoor-table-4',
      name: 'Intimate Terrace',
      type: 'outdoor-table',
      capacity: 2,
      occupied: 0,
      users: [],
      position: { x: 79, y: 74, width: 18, height: 12 },
      isAvailable: true,
      ambiance: 'Romantic & Quiet',
      features: ['Perfect for couples', 'Most private outdoor spot', 'Cozy setting']
    }
  ];

  const getZoneStyle = (zone: SeatZone) => {
    const baseClasses = "absolute cursor-pointer transition-all duration-300 border-2 shadow-lg rounded-lg backdrop-blur-sm";
    const hoverClasses = hoveredZone === zone.id 
      ? 'scale-105 shadow-2xl z-30 ring-2 ring-white/60' 
      : selectedZone === zone.id
      ? 'ring-2 ring-blue-400/60 z-20'
      : 'hover:scale-[1.02] hover:shadow-xl z-10';
    
    const typeStyles = {
      'entrance-chair': zone.isAvailable 
        ? 'border-emerald-600 bg-emerald-500/70 text-white' 
        : 'border-emerald-800 bg-emerald-700/70 text-white',
      'dining-table': zone.isAvailable 
        ? 'border-amber-600 bg-amber-500/70 text-white' 
        : 'border-amber-800 bg-amber-700/70 text-white',
      'counter-seat': zone.isAvailable 
        ? 'border-orange-600 bg-orange-500/70 text-white' 
        : 'border-orange-800 bg-orange-700/70 text-white',
      'outdoor-table': zone.isAvailable 
        ? 'border-green-600 bg-green-500/70 text-white' 
        : 'border-green-800 bg-green-700/70 text-white'
    };

    return `${baseClasses} ${hoverClasses} ${typeStyles[zone.type]}`;
  };

  const getZoneIcon = (type: string) => {
    const iconClass = `h-${isMobile ? '4' : '5'} w-${isMobile ? '4' : '5'} text-white drop-shadow-lg`;
    switch(type) {
      case 'entrance-chair': return <Armchair className={iconClass} />;
      case 'dining-table': return <Coffee className={iconClass} />;
      case 'counter-seat': return <ChefHat className={iconClass} />;
      case 'outdoor-table': return <Trees className={iconClass} />;
      default: return <Coffee className={iconClass} />;
    }
  };

  const getOccupancyColor = (occupied: number, capacity: number) => {
    const ratio = occupied / capacity;
    if (ratio === 0) return 'text-green-200 font-bold';
    if (ratio < 0.7) return 'text-yellow-200 font-semibold';
    return 'text-red-200 font-bold';
  };

  const handleZoneClick = (zoneId: string) => {
    setSelectedZone(zoneId);
    onSeatSelect(zoneId);
  };

  const getTimeGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '🌅 Good Morning';
    if (hour < 17) return '☕ Good Afternoon';
    return '🌆 Good Evening';
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-stone-100 via-neutral-50 to-stone-200 overflow-hidden">
      {/* Responsive Header */}
      <div className={`absolute top-4 left-4 right-4 z-40 ${isMobile ? 'flex-col space-y-2' : 'flex justify-between items-center'}`}>
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-stone-200">
          <h1 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-stone-800 mb-1`}>
            {getTimeGreeting()} - Stone Archway Café
          </h1>
          <p className={`text-stone-600 ${isMobile ? 'text-sm' : ''}`}>
            Industrial Modern Coffee Experience
          </p>
          <p className="text-stone-500 text-xs">{currentTime.toLocaleTimeString()}</p>
        </div>
        
        <div className={`flex gap-2 ${isMobile ? 'flex-wrap' : ''}`}>
          <Badge className="bg-stone-700 text-white">
            <Coffee className="h-3 w-3 mr-1" />
            Specialty Coffee
          </Badge>
          <Badge className="bg-green-700 text-white">
            <Wifi className="h-3 w-3 mr-1" />
            Free WiFi
          </Badge>
          <Badge className="bg-blue-700 text-white">
            <Users className="h-3 w-3 mr-1" />
            Live Seating
          </Badge>
        </div>
      </div>

      {/* Main Café Structure - Responsive Layout */}
      
      {/* Stone Archway Entrance */}
      <div 
        className="absolute bg-gradient-to-b from-stone-600 to-stone-800 border-4 border-stone-500 shadow-2xl rounded-t-full"
        style={{ 
          left: '2%', 
          top: '30%', 
          width: isMobile ? '12%' : '13%', 
          height: '50%'
        }}
      >
        <div className="text-center pt-6 text-white">
          <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} mb-2`}>🏛️</div>
          <div className={`${isMobile ? 'text-sm' : 'text-lg'} font-bold`}>STONE</div>
          <div className={`${isMobile ? 'text-sm' : 'text-lg'} font-bold`}>ARCH</div>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} mt-2 opacity-80`}>Historic</div>
        </div>
      </div>

      {/* Main Interior Dining Hall */}
      <div 
        className="absolute bg-gradient-to-br from-neutral-100 to-stone-200 border-4 border-stone-400 shadow-xl rounded-lg"
        style={{ 
          left: isMobile ? '15%' : '16%', 
          top: '15%', 
          width: isMobile ? '40%' : '42%', 
          height: '70%' 
        }}
      >
        <div className="text-center pt-4 text-stone-700">
          <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold mb-2`}>MAIN DINING</div>
          <div className={`${isMobile ? 'text-sm' : 'text-lg'}`}>Industrial Modern</div>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} mt-1`}>Wood • Steel • Light</div>
        </div>
      </div>

      {/* Coffee Counter Area */}
      <div 
        className="absolute bg-gradient-to-br from-amber-100 to-orange-200 border-4 border-amber-500 shadow-xl rounded-lg"
        style={{ 
          left: isMobile ? '55%' : '56%', 
          top: '15%', 
          width: isMobile ? '22%' : '22%', 
          height: '40%' 
        }}
      >
        <div className="text-center pt-3 text-amber-800">
          <ChefHat className={`h-${isMobile ? '6' : '8'} w-${isMobile ? '6' : '8'} mx-auto mb-2`} />
          <div className={`${isMobile ? 'text-sm' : 'text-lg'} font-bold`}>COFFEE</div>
          <div className={`${isMobile ? 'text-sm' : 'text-lg'} font-bold`}>COUNTER</div>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} mt-1`}>Brewing Bar</div>
        </div>
      </div>

      {/* Outdoor Terrace */}
      <div 
        className="absolute bg-gradient-to-br from-green-100 to-emerald-200 border-4 border-green-500 shadow-xl rounded-lg"
        style={{ 
          left: isMobile ? '78%' : '78%', 
          top: '15%', 
          width: isMobile ? '21%' : '21%', 
          height: '80%' 
        }}
      >
        <div className="text-center pt-4 text-green-800">
          <Trees className={`h-${isMobile ? '8' : '10'} w-${isMobile ? '8' : '10'} mx-auto mb-3`} />
          <div className={`${isMobile ? 'text-sm' : 'text-xl'} font-bold`}>OUTDOOR</div>
          <div className={`${isMobile ? 'text-sm' : 'text-xl'} font-bold`}>TERRACE</div>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} mt-2`}>Fresh Air Dining</div>
        </div>
      </div>

      {/* Interactive Seating Zones */}
      <div className="relative w-full h-full">
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
            <div className={`p-${isMobile ? '2' : '3'} h-full flex flex-col justify-between`}>
              {/* Zone Header */}
              <div className="flex items-center justify-between mb-1">
                {getZoneIcon(zone.type)}
                <div className={`flex items-center gap-1 ${getOccupancyColor(zone.occupied, zone.capacity)}`}>
                  <Users className={`h-${isMobile ? '3' : '4'} w-${isMobile ? '3' : '4'}`} />
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold`}>
                    {zone.occupied}/{zone.capacity}
                  </span>
                </div>
              </div>

              {/* Zone Name */}
              <div className="text-center flex-1 flex items-center justify-center">
                <h4 className={`font-bold text-white drop-shadow-lg text-center ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {zone.name}
                </h4>
              </div>

              {/* Availability Indicator */}
              <div className="text-center">
                {zone.isAvailable ? (
                  <div className={`bg-green-500/80 text-white rounded-full px-2 py-1 ${isMobile ? 'text-xs' : 'text-sm'} font-semibold`}>
                    Available
                  </div>
                ) : (
                  <div className={`bg-red-500/80 text-white rounded-full px-2 py-1 ${isMobile ? 'text-xs' : 'text-sm'} font-semibold`}>
                    Full
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Zone Details Popup - Responsive */}
      {hoveredZone && (
        <div className={`absolute ${isMobile ? 'bottom-4 left-2 right-2' : 'bottom-4 left-4 right-4'} z-50 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl border border-stone-200`}>
          {(() => {
            const zone = seatingZones.find(z => z.id === hoveredZone);
            if (!zone) return null;
            
            return (
              <>
                <div className={`flex items-center justify-between mb-3 ${isMobile ? 'flex-col space-y-2' : ''}`}>
                  <div className="flex items-center gap-3">
                    {getZoneIcon(zone.type)}
                    <div>
                      <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-stone-800`}>
                        {zone.name}
                      </h3>
                      <p className={`text-stone-600 ${isMobile ? 'text-sm' : ''}`}>
                        {zone.ambiance} • Capacity: {zone.capacity}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${zone.isAvailable ? 'bg-green-700' : 'bg-red-700'} text-white`}>
                    <MapPin className="h-3 w-3 mr-1" />
                    {zone.isAvailable ? 'Available' : 'Full'}
                  </Badge>
                </div>
                
                <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
                  <div>
                    <h4 className={`font-semibold text-stone-700 mb-2 ${isMobile ? 'text-sm' : ''}`}>
                      Features:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {zone.features.map((feature, index) => (
                        <Badge key={index} className="bg-stone-100 text-stone-700 text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {zone.users.length > 0 && (
                    <div>
                      <h4 className={`font-semibold text-stone-700 mb-2 ${isMobile ? 'text-sm' : ''}`}>
                        Current Users:
                      </h4>
                      <div className="space-y-1">
                        {zone.users.map((user, index) => (
                          <div key={index} className={`flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-sm'} text-stone-600`}>
                            <span className="text-lg">{user.mood}</span>
                            <span className="font-medium">{user.name}</span>
                            <span className="text-xs opacity-75">• {user.activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={() => handleZoneClick(zone.id)}
                  className={`w-full mt-4 bg-stone-700 hover:bg-stone-800 text-white ${isMobile ? 'text-sm py-2' : 'py-3'}`}
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

      {/* Mobile-Optimized Status Bar */}
      <div className={`absolute ${isMobile ? 'bottom-20 left-2 right-2' : 'top-20 left-1/2 transform -translate-x-1/2'} z-30`}>
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/50">
          <div className={`flex items-center justify-center gap-${isMobile ? '3' : '6'} text-stone-700 font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>{seatingZones.reduce((acc, zone) => acc + zone.occupied, 0)} online</span>
            </div>
            <div className="flex items-center gap-1">
              <Coffee className="h-3 w-3 text-amber-600" />
              <span>{seatingZones.filter(z => z.isAvailable).length} available</span>
            </div>
            {!isMobile && (
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 text-blue-600" />
                <span>Live Updates</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
