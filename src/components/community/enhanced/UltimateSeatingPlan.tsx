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

// Enhanced seating zones with more detailed data
const ENHANCED_SEATING_ZONES = [
  // Bar Counter Stools with enhanced features
  { 
    id: 'bar-stool-1', x: 15, y: 20, w: 4, h: 4, type: 'bar', zone: 'indoor',
    ambientSound: 'coffee-machine', musicZone: 'energetic', vibe: 'social'
  },
  { 
    id: 'bar-stool-2', x: 20, y: 20, w: 4, h: 4, type: 'bar', zone: 'indoor',
    ambientSound: 'coffee-machine', musicZone: 'energetic', vibe: 'social'
  },
  { 
    id: 'bar-stool-3', x: 25, y: 20, w: 4, h: 4, type: 'bar', zone: 'indoor',
    ambientSound: 'coffee-machine', musicZone: 'energetic', vibe: 'social'
  },
  { 
    id: 'bar-stool-4', x: 30, y: 20, w: 4, h: 4, type: 'bar', zone: 'indoor',
    ambientSound: 'coffee-machine', musicZone: 'energetic', vibe: 'social'
  },
  { 
    id: 'bar-stool-5', x: 35, y: 20, w: 4, h: 4, type: 'bar', zone: 'indoor',
    ambientSound: 'coffee-machine', musicZone: 'energetic', vibe: 'social'
  },
  
  // Indoor Tables with enhanced features
  { 
    id: 'table-1', x: 10, y: 35, w: 8, h: 6, type: 'table', zone: 'indoor', capacity: 4,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'table-2', x: 25, y: 35, w: 8, h: 6, type: 'table', zone: 'indoor', capacity: 4,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'table-3', x: 40, y: 35, w: 8, h: 6, type: 'table', zone: 'indoor', capacity: 4,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'table-4', x: 10, y: 50, w: 8, h: 6, type: 'table', zone: 'indoor', capacity: 4,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'table-5', x: 25, y: 50, w: 8, h: 6, type: 'table', zone: 'indoor', capacity: 4,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'table-6', x: 40, y: 50, w: 8, h: 6, type: 'table', zone: 'indoor', capacity: 4,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  
  // Outdoor Terrace Tables
  { 
    id: 'outdoor-1', x: 12, y: 70, w: 6, h: 5, type: 'table', zone: 'outdoor', capacity: 2,
    ambientSound: 'nature', musicZone: 'chill', vibe: 'relaxed'
  },
  { 
    id: 'outdoor-2', x: 22, y: 70, w: 6, h: 5, type: 'table', zone: 'outdoor', capacity: 2,
    ambientSound: 'nature', musicZone: 'chill', vibe: 'relaxed'
  },
  { 
    id: 'outdoor-3', x: 32, y: 70, w: 6, h: 5, type: 'table', zone: 'outdoor', capacity: 2,
    ambientSound: 'nature', musicZone: 'chill', vibe: 'relaxed'
  },
  { 
    id: 'outdoor-4', x: 42, y: 70, w: 6, h: 5, type: 'table', zone: 'outdoor', capacity: 2,
    ambientSound: 'nature', musicZone: 'chill', vibe: 'relaxed'
  },
  
  // Premium Lounge Area
  { 
    id: 'lounge-chair-1', x: 60, y: 35, w: 5, h: 5, type: 'lounge', zone: 'lounge',
    ambientSound: 'soft-jazz', musicZone: 'premium', vibe: 'luxurious'
  },
  { 
    id: 'lounge-chair-2', x: 68, y: 35, w: 5, h: 5, type: 'lounge', zone: 'lounge',
    ambientSound: 'soft-jazz', musicZone: 'premium', vibe: 'luxurious'
  },
  { 
    id: 'lounge-chair-3', x: 60, y: 45, w: 5, h: 5, type: 'lounge', zone: 'lounge',
    ambientSound: 'soft-jazz', musicZone: 'premium', vibe: 'luxurious'
  },
  { 
    id: 'lounge-chair-4', x: 68, y: 45, w: 5, h: 5, type: 'lounge', zone: 'lounge',
    ambientSound: 'soft-jazz', musicZone: 'premium', vibe: 'luxurious'
  },
  
  // Corner Booth
  { 
    id: 'corner-booth', x: 60, y: 60, w: 12, h: 8, type: 'booth', zone: 'lounge', capacity: 6,
    ambientSound: 'intimate', musicZone: 'premium', vibe: 'private'
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
    status: string; 
    drinkType?: string; 
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
  const [showSmartRecommendations, setShowSmartRecommendations] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherEffect, setWeatherEffect] = useState('sunny');

  // Update time every minute for dynamic lighting
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Simulate weather changes
  useEffect(() => {
    const weatherTimer = setInterval(() => {
      const weathers = ['sunny', 'cloudy', 'rainy', 'golden-hour'];
      setWeatherEffect(weathers[Math.floor(Math.random() * weathers.length)]);
    }, 300000); // Change every 5 minutes
    return () => clearInterval(weatherTimer);
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
    const zoneSeats = ENHANCED_SEATING_ZONES.filter(seat => seat.zone === zone);
    const occupiedSeats = zoneSeats.filter(seat => getSeatOccupancy(seat.id).length > 0);
    return {
      total: zoneSeats.length,
      occupied: occupiedSeats.length,
      available: zoneSeats.length - occupiedSeats.length
    };
  };

  const getDynamicLighting = () => {
    const hour = currentTime.getHours();
    if (hour < 6) return 'brightness-75 sepia-10'; // Night
    if (hour < 12) return 'brightness-110 saturate-110'; // Morning
    if (hour < 17) return 'brightness-100'; // Afternoon
    if (hour < 20) return 'brightness-90 sepia-20'; // Evening
    return 'brightness-80 sepia-30'; // Night
  };

  const getWeatherOverlay = () => {
    switch (weatherEffect) {
      case 'rainy': return 'bg-blue-900/10';
      case 'cloudy': return 'bg-gray-500/10';
      case 'golden-hour': return 'bg-amber-300/20';
      default: return 'bg-yellow-100/10';
    }
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
          <p className="text-stone-600 mb-4">Ultimate Interactive Seating Experience</p>
          
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
          
          {/* Zone Statistics with enhanced styling */}
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
          availableSeats={ENHANCED_SEATING_ZONES.map(s => s.id)}
          onSeatRecommend={(seatId, reason) => {
            console.log(`Recommended seat: ${seatId} - ${reason}`);
            handleSeatClick(seatId);
          }}
        />
      </div>

      {/* Main Interactive Canvas with Enhanced Features */}
      <div
        className={`relative w-full mx-auto border-2 border-stone-400 rounded-lg shadow-2xl overflow-hidden bg-cover bg-center bg-no-repeat transition-all duration-1000 ${getDynamicLighting()}`}
        style={{
          aspectRatio: "4/3",
          maxWidth: "95vw",
          height: hideHeader ? "70vh" : "calc(100vh - 300px)",
          backgroundImage: "url('/lovable-uploads/7ddcf203-b9d9-4773-bf53-d70372417ee7.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {/* Weather Effects Overlay */}
        <div className={`absolute inset-0 ${getWeatherOverlay()} transition-all duration-2000`} />
        
        {/* Particle Effects */}
        <EnhancedSeatingEffects particles={particles} />

        {/* Enhanced Zone Labels with Animations */}
        {Object.entries(ZONE_COLORS).map(([zone, config]) => {
          const zoneSeats = ENHANCED_SEATING_ZONES.filter(seat => seat.zone === zone);
          if (zoneSeats.length === 0) return null;
          
          const avgX = zoneSeats.reduce((sum, seat) => sum + seat.x, 0) / zoneSeats.length;
          const avgY = zoneSeats.reduce((sum, seat) => sum + seat.y, 0) / zoneSeats.length;
          
          return (
            <div
              key={zone}
              className="absolute bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg text-sm font-semibold pointer-events-none animate-pulse"
              style={{
                left: `${avgX}%`,
                top: `${avgY - 8}%`,
                transform: 'translate(-50%, -50%)',
                color: config.border,
                border: `2px solid ${config.border}`,
                zIndex: 10
              }}
            >
              {config.name}
            </div>
          );
        })}

        {/* Enhanced Interactive Seating Zones */}
        {ENHANCED_SEATING_ZONES.map((seat) => {
          const occupants = getSeatOccupancy(seat.id);
          const isOccupied = occupants.length > 0;
          const isSelected = selectedSeat === seat.id;
          const isHovered = hoveredSeat === seat.id;
          
          return (
            <div
              key={seat.id}
              className={`absolute cursor-pointer transition-all duration-300 hover:scale-105 ${
                isSelected 
                  ? 'animate-pulse ring-4 ring-amber-400' 
                  : isHovered 
                    ? 'scale-110 ring-2 ring-amber-300' 
                    : ''
              }`}
              style={{
                left: `${seat.x}%`,
                top: `${seat.y}%`,
                width: `${seat.w}%`,
                height: `${seat.h}%`,
                backgroundColor: isSelected 
                  ? 'rgba(245, 158, 11, 0.6)' 
                  : isHovered 
                    ? 'rgba(245, 158, 11, 0.4)' 
                    : 'rgba(139, 69, 19, 0.2)',
                border: isSelected 
                  ? '3px solid #f59e0b' 
                  : isHovered 
                    ? '2px solid #f59e0b' 
                    : '1px solid rgba(139, 69, 19, 0.4)',
                borderRadius: '12px',
                zIndex: isHovered || isSelected ? 25 : 15,
                backdropFilter: 'blur(2px)',
                boxShadow: isHovered ? '0 8px 32px rgba(245, 158, 11, 0.3)' : 'none'
              }}
              onClick={() => handleSeatClick(seat.id)}
              onMouseEnter={() => setHoveredSeat(seat.id)}
              onMouseLeave={() => setHoveredSeat(null)}
            >
              {/* Enhanced Occupancy Indicators with Status */}
              {isOccupied && (
                <div className="absolute -top-3 -right-3 z-10">
                  <EnhancedUserAvatars
                    users={occupants}
                    seatId={seat.id}
                    onUserHover={(user) => console.log('User hovered:', user)}
                  />
                </div>
              )}
              
              {/* Ambient Sound Indicator */}
              {(seat as any).ambientSound && isHovered && (
                <div className="absolute top-1 left-1">
                  <Volume2 className="h-3 w-3 text-blue-600 animate-pulse" />
                </div>
              )}
              
              {/* Vibe Indicator */}
              {(seat as any).vibe && isHovered && (
                <div className="absolute bottom-1 right-1">
                  <Sparkles className="h-3 w-3 text-purple-600 animate-spin" />
                </div>
              )}
              
              {/* Selection Pulse Effect */}
              {isSelected && (
                <div className="absolute inset-0 border-4 border-amber-400 rounded-lg animate-pulse" />
              )}
            </div>
          );
        })}

        {/* Enhanced Live Status with More Features */}
        <div className="absolute top-4 left-4 space-y-2">
          <Badge className="bg-green-600/90 text-white px-4 py-2 text-sm font-semibold animate-pulse flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            Ultimate Experience Active
          </Badge>
          
          <Badge className="bg-blue-600/90 text-white px-3 py-1 text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Badge>
          
          <Badge className="bg-purple-600/90 text-white px-3 py-1 text-xs">
            🌤️ {weatherEffect}
          </Badge>
        </div>

        {/* Enhanced Seat Info Panel with More Details */}
        {hoveredSeat && (
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-2xl text-base max-w-md border-l-4 border-amber-500">
            {(() => {
              const seat = ENHANCED_SEATING_ZONES.find(s => s.id === hoveredSeat);
              const occupants = getSeatOccupancy(hoveredSeat);
              if (!seat) return null;
              
              return (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                      <Coffee className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-800 text-lg">{hoveredSeat}</div>
                      <div className="text-sm text-stone-600 capitalize">{(seat as any).vibe} atmosphere</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <div className="text-xs text-blue-600 font-medium">Music Zone</div>
                      <div className="text-sm capitalize">{(seat as any).musicZone}</div>
                    </div>
                    <div className="bg-green-50 p-2 rounded-lg">
                      <div className="text-xs text-green-600 font-medium">Audio</div>
                      <div className="text-sm capitalize">{(seat as any).ambientSound}</div>
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
                      Join This Spot
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-amber-600 text-amber-600 hover:bg-amber-50"
                    >
                      <Zap className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Enhanced Legend with More Information */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg text-sm max-w-xs">
          <div className="font-bold mb-3 text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-600" />
            Ultimate Features
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-200 border-2 border-amber-500 rounded animate-pulse"></div>
              <span>Smart seat recommendations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>Real-time presence & status</span>
            </div>
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-blue-600" />
              <span>Immersive audio zones</span>
            </div>
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-purple-600" />
              <span>Gamification & achievements</span>
            </div>
            <div className="text-gray-600 mt-2 pt-2 border-t">
              Dynamic lighting • Weather effects • Mobile optimized
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
