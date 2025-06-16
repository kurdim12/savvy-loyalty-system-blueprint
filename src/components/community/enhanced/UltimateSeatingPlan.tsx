import React, { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Coffee, Volume2, Sparkles, Users, Zap, Crown, Calendar } from 'lucide-react';
import { EnhancedSeatingEffects } from './EnhancedSeatingEffects';
import { SmartSeatRecommendations } from './SmartSeatRecommendations';
import { EnhancedUserAvatars } from './EnhancedUserAvatars';
import { CoffeeShopAmbientAudio } from './CoffeeShopAmbientAudio';
import { GamificationElements } from './GamificationElements';
import { AdvancedSocialFeatures } from './AdvancedSocialFeatures';

// More precisely positioned seats to match the actual chairs in the photo
const REAL_CAFE_SEATS = [
  // Bar stools at the counter (more precise positioning)
  { 
    id: 'bar-stool-1', x: 75.5, y: 17, w: 3.5, h: 5, type: 'bar', zone: 'indoor',
    ambientSound: 'coffee-machine', musicZone: 'energetic', vibe: 'social'
  },
  { 
    id: 'bar-stool-2', x: 80, y: 17, w: 3.5, h: 5, type: 'bar', zone: 'indoor',
    ambientSound: 'coffee-machine', musicZone: 'energetic', vibe: 'social'
  },
  { 
    id: 'bar-stool-3', x: 84.5, y: 17, w: 3.5, h: 5, type: 'bar', zone: 'indoor',
    ambientSound: 'coffee-machine', musicZone: 'energetic', vibe: 'social'
  },
  { 
    id: 'bar-stool-4', x: 89, y: 17, w: 3.5, h: 5, type: 'bar', zone: 'indoor',
    ambientSound: 'coffee-machine', musicZone: 'energetic', vibe: 'social'
  },
  
  // Left side green armchair (more precise)
  { 
    id: 'green-armchair-1', x: 14, y: 44, w: 5, h: 6, type: 'armchair', zone: 'indoor', capacity: 1,
    ambientSound: 'intimate', musicZone: 'ambient', vibe: 'relaxed'
  },
  
  // Left side table chairs (more precise positioning)
  { 
    id: 'left-table-chair-1', x: 11, y: 59, w: 3.5, h: 4, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'left-table-chair-2', x: 23, y: 59, w: 3.5, h: 4, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'left-table-chair-3', x: 11, y: 66, w: 3.5, h: 4, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'left-table-chair-4', x: 23, y: 66, w: 3.5, h: 4, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  
  // Center area tables - first table (more precise)
  { 
    id: 'center-table-1-chair-1', x: 34, y: 57, w: 3.5, h: 4, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'center-table-1-chair-2', x: 46, y: 57, w: 3.5, h: 4, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'center-table-1-chair-3', x: 34, y: 69, w: 3.5, h: 4, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'center-table-1-chair-4', x: 46, y: 69, w: 3.5, h: 4, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  
  // Second center table (more precise)
  { 
    id: 'center-table-2-chair-1', x: 54, y: 57, w: 3.5, h: 4, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'center-table-2-chair-2', x: 66, y: 57, w: 3.5, h: 4, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'center-table-2-chair-3', x: 54, y: 69, w: 3.5, h: 4, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'center-table-2-chair-4', x: 66, y: 69, w: 3.5, h: 4, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  
  // Third center table (more precise)
  { 
    id: 'center-table-3-chair-1', x: 74, y: 57, w: 3.5, h: 4, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'center-table-3-chair-2', x: 86, y: 57, w: 3.5, h: 4, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'center-table-3-chair-3', x: 74, y: 69, w: 3.5, h: 4, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'center-table-3-chair-4', x: 86, y: 69, w: 3.5, h: 4, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  
  // Back row tables - first table (more precise)
  { 
    id: 'back-table-1-chair-1', x: 34, y: 34, w: 3.5, h: 4, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'back-table-1-chair-2', x: 46, y: 34, w: 3.5, h: 4, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'back-table-1-chair-3', x: 34, y: 46, w: 3.5, h: 4, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'back-table-1-chair-4', x: 46, y: 46, w: 3.5, h: 4, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  
  // Second back table (more precise)
  { 
    id: 'back-table-2-chair-1', x: 54, y: 34, w: 3.5, h: 4, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'back-table-2-chair-2', x: 66, y: 34, w: 3.5, h: 4, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'back-table-2-chair-3', x: 54, y: 46, w: 3.5, h: 4, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'back-table-2-chair-4', x: 66, y: 46, w: 3.5, h: 4, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  }
];

const ZONE_COLORS = {
  indoor: { bg: 'rgba(139, 69, 19, 0.15)', border: '#8B4513', name: '🏠 Indoor Café' },
  outdoor: { bg: 'rgba(34, 197, 94, 0.15)', border: '#22C55E', name: '🌿 Outdoor Terrace' },
  lounge: { bg: 'rgba(147, 51, 234, 0.15)', border: '#9333EA', name: '🛋️ Premium Lounge' }
};

interface UltimateSeatingPlanProps {
  onSeatSelect?: (seatId: string) => void;
  selectedSeat?: string | null;
  hideHeader?: boolean;
  onlineUsers?: Array<{ 
    id: string; 
    seatId: string; 
    name: string; 
    mood: string; 
    status: 'working' | 'chatting' | 'available' | 'focused'; 
    drinkType?: 'espresso' | 'latte' | 'cappuccino' | 'americano'; 
    activity: string; 
  }>;
}

export const UltimateSeatingPlan: React.FC<UltimateSeatingPlanProps> = ({ 
  onSeatSelect, 
  selectedSeat, 
  hideHeader, 
  onlineUsers = [] 
}) => {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);
  const [particles, setParticles] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute for dynamic lighting
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleSeatClick = (seatId: string) => {
    // Add particle effect on seat selection
    const newParticle = {
      id: Date.now().toString(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      type: 'join',
      timestamp: Date.now()
    };
    setParticles(prev => [...prev, newParticle]);
    
    if (onSeatSelect) {
      onSeatSelect(seatId);
    }
  };

  const getSeatOccupancy = (seatId: string) => {
    return onlineUsers.filter(user => user.seatId === seatId);
  };

  const getZoneStats = (zone: string) => {
    const zoneSeats = REAL_CAFE_SEATS.filter(seat => seat.zone === zone);
    const occupiedSeats = zoneSeats.filter(seat => getSeatOccupancy(seat.id).length > 0);
    return {
      total: zoneSeats.length,
      occupied: occupiedSeats.length,
      available: zoneSeats.length - occupiedSeats.length
    };
  };

  const userProfile = {
    interests: ['tech', 'coffee', 'music'],
    workStyle: 'collaborative' as const,
    coffeePreference: 'latte',
    mood: 'focused'
  };

  return (
    <div className="w-full relative">
      {/* Enhanced Header */}
      {!hideHeader && (
        <div className="text-center py-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-lg">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Crown className="h-8 w-8 text-amber-600" />
            <h2 className="text-3xl font-bold text-stone-800">RAW SMITH CAFÉ</h2>
            <Sparkles className="h-8 w-8 text-amber-600" />
          </div>
          <p className="text-stone-600 mb-4">Click on any seat in the café to sit there!</p>
          
          {/* Enhanced Controls */}
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <GamificationElements 
              userPoints={1250}
              streak={7}
              achievements={[]}
            />
            <CoffeeShopAmbientAudio />
            <AdvancedSocialFeatures />
          </div>
          
          {/* Zone Statistics */}
          <div className="flex justify-center gap-6 mt-6">
            {Object.entries(ZONE_COLORS).map(([zone, config]) => {
              const stats = getZoneStats(zone);
              return (
                <Card key={zone} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-3">
                    <div className="text-lg font-semibold" style={{ color: config.border }}>
                      {config.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stats.occupied}/{stats.total} occupied
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(stats.occupied / stats.total) * 100}%`,
                          backgroundColor: config.border 
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Smart Recommendations Panel */}
      <div className="absolute top-4 right-4 z-30">
        <SmartSeatRecommendations
          userProfile={userProfile}
          availableSeats={REAL_CAFE_SEATS.map(s => s.id)}
          onSeatRecommend={(seatId, reason) => {
            console.log(`Recommended seat: ${seatId} - ${reason}`);
            handleSeatClick(seatId);
          }}
        />
      </div>

      {/* Main Interactive Canvas */}
      <div
        className="relative w-full mx-auto border-2 border-stone-400 rounded-lg shadow-2xl overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          aspectRatio: "4/3",
          maxWidth: "95vw",
          height: hideHeader ? "70vh" : "calc(100vh - 300px)",
          backgroundImage: "url('/lovable-uploads/7ddcf203-b9d9-4773-bf53-d70372417ee7.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {/* Particle Effects */}
        <EnhancedSeatingEffects particles={particles} />

        {/* Precisely Positioned Individual Chair Clickable Areas */}
        {REAL_CAFE_SEATS.map((seat) => {
          const occupants = getSeatOccupancy(seat.id);
          const isOccupied = occupants.length > 0;
          const isSelected = selectedSeat === seat.id;
          const isHovered = hoveredSeat === seat.id;
          
          return (
            <div
              key={seat.id}
              className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${
                isSelected 
                  ? 'ring-4 ring-blue-500 bg-blue-500/70 shadow-xl shadow-blue-500/60' 
                  : isHovered 
                    ? 'ring-3 ring-blue-400 bg-blue-400/60 shadow-lg shadow-blue-400/50' 
                    : 'hover:bg-blue-300/40 hover:ring-2 hover:ring-blue-300'
              }`}
              style={{
                left: `${seat.x}%`,
                top: `${seat.y}%`,
                width: `${seat.w}%`,
                height: `${seat.h}%`,
                zIndex: isHovered || isSelected ? 25 : 15,
                border: isSelected 
                  ? '3px solid #3b82f6' 
                  : isHovered 
                    ? '2px solid #60a5fa' 
                    : '2px solid transparent',
                backdropFilter: isHovered || isSelected ? 'blur(2px)' : 'none',
                boxShadow: isSelected 
                  ? '0 0 30px rgba(59, 130, 246, 0.8), inset 0 0 20px rgba(59, 130, 246, 0.4)' 
                  : isHovered 
                    ? '0 0 25px rgba(96, 165, 250, 0.6)' 
                    : 'none'
              }}
              onClick={() => handleSeatClick(seat.id)}
              onMouseEnter={() => setHoveredSeat(seat.id)}
              onMouseLeave={() => setHoveredSeat(null)}
            >
              {/* Occupancy Indicators */}
              {isOccupied && (
                <div className="absolute -top-3 -right-3 z-10">
                  <EnhancedUserAvatars
                    users={occupants}
                    seatId={seat.id}
                    onUserHover={(user) => console.log('User hovered:', user)}
                  />
                </div>
              )}
              
              {/* Seat Type Indicator - only show when hovered */}
              {isHovered && (
                <div className="absolute top-1 left-1 bg-black/80 text-white text-xs px-2 py-1 rounded-md font-medium">
                  {seat.type.charAt(0).toUpperCase() + seat.type.slice(1)}
                </div>
              )}
              
              {/* Selection Pulse Effect */}
              {isSelected && (
                <div className="absolute inset-0 border-4 border-blue-400 rounded-lg animate-pulse bg-blue-400/20" />
              )}

              {/* Enhanced Click hint when hovered */}
              {isHovered && !isSelected && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg whitespace-nowrap">
                    Click to sit!
                  </div>
                </div>
              )}
              
              {/* Seat availability indicator */}
              <div className={`absolute top-0 right-0 w-2 h-2 rounded-full ${
                isOccupied ? 'bg-red-500' : 'bg-green-500'
              } ${isHovered ? 'animate-pulse' : ''}`} />
            </div>
          );
        })}

        {/* Live Status */}
        <div className="absolute top-4 left-4 space-y-2">
          <Badge className="bg-green-600/90 text-white px-4 py-2 text-sm font-semibold animate-pulse flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            Real Café Seating Active
          </Badge>
          
          <Badge className="bg-blue-600/90 text-white px-3 py-1 text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Badge>
        </div>

        {/* Seat Info Panel */}
        {hoveredSeat && (
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-2xl text-base max-w-md border-l-4 border-amber-500">
            {(() => {
              const seat = REAL_CAFE_SEATS.find(s => s.id === hoveredSeat);
              const occupants = getSeatOccupancy(hoveredSeat);
              if (!seat) return null;
              
              return (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                      <Coffee className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-800 text-lg">{hoveredSeat.replace(/-/g, ' ').toUpperCase()}</div>
                      <div className="text-sm text-stone-600 capitalize">{seat.vibe} atmosphere</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <div className="text-xs text-blue-600 font-medium">Music Zone</div>
                      <div className="text-sm capitalize">{seat.musicZone}</div>
                    </div>
                    <div className="bg-green-50 p-2 rounded-lg">
                      <div className="text-xs text-green-600 font-medium">Audio</div>
                      <div className="text-sm capitalize">{seat.ambientSound}</div>
                    </div>
                  </div>
                  
                  {occupants.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm font-medium text-stone-700 mb-2">Currently Here:</div>
                      <div className="space-y-2">
                        {occupants.map((user, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <span className="text-lg">{user.mood}</span>
                            <span className="font-medium">{user.name}</span>
                            <Badge variant="outline" className="text-xs">{user.status}</Badge>
                            <span className="text-xs text-gray-600">- {user.activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                      onClick={() => handleSeatClick(seat.id)}
                    >
                      <Coffee className="h-4 w-4 mr-2" />
                      Sit Here
                    </Button>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Instructions */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg text-sm max-w-xs">
          <div className="font-bold mb-3 text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-600" />
            How to Use
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-200 border-2 border-blue-500 rounded-lg animate-pulse"></div>
              <span>Click directly on any chair to sit there</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>See who's sitting where in real-time</span>
            </div>
            <div className="text-gray-600 mt-2 pt-2 border-t">
              Hover over chairs to see details • Click to join conversations
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
