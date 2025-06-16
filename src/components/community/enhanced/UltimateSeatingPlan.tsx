import React, { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Coffee, Volume2, Sparkles, Users, Zap, Crown, Calendar, Maximize2, Minimize2 } from 'lucide-react';
import { EnhancedSeatingEffects } from './EnhancedSeatingEffects';
import { SmartSeatRecommendations } from './SmartSeatRecommendations';
import { EnhancedUserAvatars } from './EnhancedUserAvatars';
import { CoffeeShopAmbientAudio } from './CoffeeShopAmbientAudio';
import { GamificationElements } from './GamificationElements';
import { AdvancedSocialFeatures } from './AdvancedSocialFeatures';
import { VirtualCoffeeOrdering } from './VirtualCoffeeOrdering';
import { ProximityInteractions } from './ProximityInteractions';
import { DynamicEnvironment } from './DynamicEnvironment';
import { PersonalWorkspace } from './PersonalWorkspace';
import { CommunityFeatures } from './CommunityFeatures';

// Coffee Bean Icon Component
const CoffeeBean = ({ isOccupied, isSelected, isHovered, size = 28 }: { 
  isOccupied: boolean; 
  isSelected: boolean; 
  isHovered: boolean; 
  size?: number; 
}) => {
  const beanColor = isOccupied ? '#B0B0B0' : '#6F4E37';
  const seamColor = isOccupied ? '#808080' : '#3E2C19';
  
  return (
    <div 
      className={`relative transition-all duration-300 ${
        !isOccupied ? 'animate-pulse' : ''
      }`}
      style={{
        width: size,
        height: size,
        filter: isSelected || isHovered ? 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
        transform: isSelected ? 'scale(1.4)' : isHovered ? 'scale(1.3)' : 'scale(1)',
        animation: !isOccupied ? 'beanPulse 2s ease-in-out infinite' : 'none'
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Coffee bean body */}
        <ellipse
          cx="12"
          cy="12"
          rx="8"
          ry="11"
          fill={beanColor}
          transform="rotate(-15 12 12)"
        />
        {/* Coffee bean seam */}
        <path
          d="M7 8 Q12 12 17 16"
          stroke={seamColor}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Selection ring */}
        {(isSelected || isHovered) && (
          <ellipse
            cx="12"
            cy="12"
            rx="10"
            ry="13"
            fill="none"
            stroke={isSelected ? '#3b82f6' : '#60a5fa'}
            strokeWidth="2"
            transform="rotate(-15 12 12)"
            opacity="0.8"
          />
        )}
      </svg>
    </div>
  );
};

// Ultra-precise seat coordinates exactly matching chair positions in the photo
const ULTRA_PRECISE_CAFE_SEATS = [
  // Bar stools at the counter (positioned exactly on chair seats)
  { 
    id: 'bar-stool-1', x: 76.5, y: 18.2, w: 1.8, h: 1.8, type: 'bar', zone: 'indoor',
    ambientSound: 'coffee-machine', musicZone: 'energetic', vibe: 'social'
  },
  { 
    id: 'bar-stool-2', x: 80.0, y: 18.2, w: 1.8, h: 1.8, type: 'bar', zone: 'indoor',
    ambientSound: 'coffee-machine', musicZone: 'energetic', vibe: 'social'
  },
  { 
    id: 'bar-stool-3', x: 83.5, y: 18.2, w: 1.8, h: 1.8, type: 'bar', zone: 'indoor',
    ambientSound: 'coffee-machine', musicZone: 'energetic', vibe: 'social'
  },
  { 
    id: 'bar-stool-4', x: 87.0, y: 18.2, w: 1.8, h: 1.8, type: 'bar', zone: 'indoor',
    ambientSound: 'coffee-machine', musicZone: 'energetic', vibe: 'social'
  },
  
  // Left side green armchair (exactly on the chair seat)
  { 
    id: 'green-armchair-1', x: 15.5, y: 45.8, w: 2.2, h: 2.2, type: 'armchair', zone: 'indoor', capacity: 1,
    ambientSound: 'intimate', musicZone: 'ambient', vibe: 'relaxed'
  },
  
  // Left side table chairs (positioned exactly on chair seats)
  { 
    id: 'left-table-chair-1', x: 12.2, y: 60.2, w: 1.8, h: 1.8, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'left-table-chair-2', x: 22.5, y: 60.2, w: 1.8, h: 1.8, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'left-table-chair-3', x: 12.2, y: 66.8, w: 1.8, h: 1.8, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'left-table-chair-4', x: 22.5, y: 66.8, w: 1.8, h: 1.8, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  
  // Center area tables - first table (exactly on chair seats)
  { 
    id: 'center-table-1-chair-1', x: 34.8, y: 58.5, w: 1.8, h: 1.8, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'center-table-1-chair-2', x: 44.8, y: 58.5, w: 1.8, h: 1.8, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'center-table-1-chair-3', x: 34.8, y: 69.2, w: 1.8, h: 1.8, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'center-table-1-chair-4', x: 44.8, y: 69.2, w: 1.8, h: 1.8, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  
  // Second center table (exactly on chair seats)
  { 
    id: 'center-table-2-chair-1', x: 54.2, y: 58.5, w: 1.8, h: 1.8, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'center-table-2-chair-2', x: 64.2, y: 58.5, w: 1.8, h: 1.8, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'center-table-2-chair-3', x: 54.2, y: 69.2, w: 1.8, h: 1.8, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'center-table-2-chair-4', x: 64.2, y: 69.2, w: 1.8, h: 1.8, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  
  // Third center table (exactly on chair seats)
  { 
    id: 'center-table-3-chair-1', x: 73.5, y: 58.5, w: 1.8, h: 1.8, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'center-table-3-chair-2', x: 83.5, y: 58.5, w: 1.8, h: 1.8, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'center-table-3-chair-3', x: 73.5, y: 69.2, w: 1.8, h: 1.8, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'center-table-3-chair-4', x: 83.5, y: 69.2, w: 1.8, h: 1.8, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  
  // Back row tables - first table (exactly on chair seats)
  { 
    id: 'back-table-1-chair-1', x: 34.8, y: 35.5, w: 1.8, h: 1.8, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'back-table-1-chair-2', x: 44.8, y: 35.5, w: 1.8, h: 1.8, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'back-table-1-chair-3', x: 34.8, y: 46.2, w: 1.8, h: 1.8, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'back-table-1-chair-4', x: 44.8, y: 46.2, w: 1.8, h: 1.8, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  
  // Second back table (exactly on chair seats)
  { 
    id: 'back-table-2-chair-1', x: 54.2, y: 35.5, w: 1.8, h: 1.8, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'back-table-2-chair-2', x: 64.2, y: 35.5, w: 1.8, h: 1.8, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'back-table-2-chair-3', x: 54.2, y: 46.2, w: 1.8, h: 1.8, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'back-table-2-chair-4', x: 64.2, y: 46.2, w: 1.8, h: 1.8, type: 'chair', zone: 'indoor', capacity: 1,
    ambientSound: 'gentle-chatter', musicZone: 'ambient', vibe: 'collaborative'
  }
];

// Ultra-precise zone colors
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePanel, setActivePanel] = useState<'coffee' | 'workspace' | 'community' | null>(null);
  const [deliveredOrders, setDeliveredOrders] = useState<any[]>([]);

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
    const zoneSeats = ULTRA_PRECISE_CAFE_SEATS.filter(seat => seat.zone === zone);
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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleOrderComplete = (order: any) => {
    setDeliveredOrders(prev => [...prev, order]);
    // Add visual delivery animation
    const newParticle = {
      id: Date.now().toString(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      type: 'delivery',
      timestamp: Date.now()
    };
    setParticles(prev => [...prev, newParticle]);
  };

  const handleProximityInteraction = (targetUserId: string, interactionType: string) => {
    console.log(`Interaction: ${interactionType} with ${targetUserId}`);
    // Add interaction animation
    const newParticle = {
      id: Date.now().toString(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      type: interactionType,
      timestamp: Date.now()
    };
    setParticles(prev => [...prev, newParticle]);
  };

  const nearbyUsers = onlineUsers
    .filter(user => user.seatId !== selectedSeat)
    .map(user => ({
      ...user,
      distance: Math.floor(Math.random() * 5) + 1,
      isInteractive: true
    }))
    .slice(0, 5);

  return (
    <div className={`w-full h-full relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'max-h-screen overflow-hidden'}`}>
      {/* CSS for bean pulse animation */}
      <style>
        {`
          @keyframes beanPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
        `}
      </style>

      {/* Enhanced Header - Compact */}
      {!hideHeader && !isFullscreen && (
        <div className="text-center py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-lg">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Crown className="h-6 w-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-stone-800">RAW SMITH CAFÉ</h2>
            <Sparkles className="h-6 w-6 text-amber-600" />
          </div>
          <p className="text-stone-600 text-sm mb-2">Click on any coffee bean to sit there!</p>
          
          {/* Compact Controls */}
          <div className="flex justify-center items-center gap-2 flex-wrap">
            <GamificationElements 
              userPoints={1250}
              streak={7}
              achievements={[]}
            />
            <CoffeeShopAmbientAudio />
            <AdvancedSocialFeatures />
          </div>
          
          {/* Compact Zone Statistics */}
          <div className="flex justify-center gap-4 mt-2">
            {Object.entries(ZONE_COLORS).map(([zone, config]) => {
              const stats = getZoneStats(zone);
              return (
                <Card key={zone} className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                  <CardContent className="p-2">
                    <div className="text-sm font-semibold" style={{ color: config.border }}>
                      {config.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {stats.occupied}/{stats.total} occupied
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                      <div 
                        className="h-1 rounded-full transition-all duration-500"
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

      {/* Dynamic Environment Overlay */}
      <DynamicEnvironment 
        currentOccupancy={onlineUsers.length}
        userPreferences={{}}
      />

      {/* Fullscreen Toggle Button */}
      <div className="absolute top-4 right-4 z-40">
        <Button
          onClick={toggleFullscreen}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm border-white/50 hover:bg-white"
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="h-4 w-4 mr-2" />
              Exit Fullscreen
            </>
          ) : (
            <>
              <Maximize2 className="h-4 w-4 mr-2" />
              Fullscreen
            </>
          )}
        </Button>
      </div>

      {/* Smart Recommendations Panel */}
      {!isFullscreen && (
        <div className="absolute top-4 right-32 z-30">
          <SmartSeatRecommendations
            userProfile={userProfile}
            availableSeats={ULTRA_PRECISE_CAFE_SEATS.map(s => s.id)}
            onSeatRecommend={(seatId, reason) => {
              console.log(`Recommended seat: ${seatId} - ${reason}`);
              handleSeatClick(seatId);
            }}
          />
        </div>
      )}

      {/* Enhanced Side Panels */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 space-y-2">
        <Button
          onClick={() => setActivePanel(activePanel === 'coffee' ? null : 'coffee')}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm border-amber-300 hover:bg-amber-50"
        >
          <Coffee className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => setActivePanel(activePanel === 'workspace' ? null : 'workspace')}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm border-purple-300 hover:bg-purple-50"
        >
          <Zap className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => setActivePanel(activePanel === 'community' ? null : 'community')}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm border-emerald-300 hover:bg-emerald-50"
        >
          <Users className="h-4 w-4" />
        </Button>
      </div>

      {/* Active Panel Content */}
      {activePanel && (
        <div className="absolute left-16 top-1/2 transform -translate-y-1/2 z-30 w-80">
          {activePanel === 'coffee' && selectedSeat && (
            <VirtualCoffeeOrdering
              seatId={selectedSeat}
              onOrderComplete={handleOrderComplete}
            />
          )}
          {activePanel === 'workspace' && selectedSeat && (
            <PersonalWorkspace
              seatId={selectedSeat}
              userLevel={7}
              userAchievements={['coffee-lover', 'social-butterfly']}
              onItemPlace={(itemId, position) => console.log('Item placed:', itemId, position)}
            />
          )}
          {activePanel === 'community' && (
            <CommunityFeatures
              currentUser={{
                id: 'current-user',
                name: 'You',
                skills: ['JavaScript', 'Coffee'],
                interests: ['Tech', 'Music']
              }}
            />
          )}
        </div>
      )}

      {/* Proximity Interactions */}
      {selectedSeat && nearbyUsers.length > 0 && (
        <div className="absolute bottom-24 left-4 z-30">
          <ProximityInteractions
            currentSeatId={selectedSeat}
            nearbyUsers={nearbyUsers}
            onInteraction={handleProximityInteraction}
          />
        </div>
      )}

      {/* Main Interactive Canvas - Fit to container */}
      <div
        className={`relative w-full mx-auto overflow-hidden ${
          isFullscreen ? 'h-screen' : hideHeader ? 'h-full' : 'h-[calc(100vh-200px)]'
        }`}
        style={{
          backgroundImage: "url('/lovable-uploads/7ddcf203-b9d9-4773-bf53-d70372417ee7.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Enhanced Particle Effects */}
        <EnhancedSeatingEffects particles={particles} />

        {/* Coffee Bean Seat Markers */}
        {ULTRA_PRECISE_CAFE_SEATS.map((seat) => {
          const occupants = getSeatOccupancy(seat.id);
          const isOccupied = occupants.length > 0;
          const isSelected = selectedSeat === seat.id;
          const isHovered = hoveredSeat === seat.id;
          const hasDelivery = deliveredOrders.some(order => order.seatId === seat.id);
          
          return (
            <div
              key={seat.id}
              className="absolute cursor-pointer transition-all duration-300 rounded-full flex items-center justify-center"
              style={{
                left: `${seat.x}%`,
                top: `${seat.y}%`,
                width: `${seat.w}%`,
                height: `${seat.h}%`,
                zIndex: isHovered || isSelected ? 35 : 25,
                transform: isSelected 
                  ? 'scale(1.1)' 
                  : isHovered 
                    ? 'scale(1.05)' 
                    : 'scale(1)'
              }}
              onClick={() => handleSeatClick(seat.id)}
              onMouseEnter={() => setHoveredSeat(seat.id)}
              onMouseLeave={() => setHoveredSeat(null)}
            >
              <CoffeeBean
                isOccupied={isOccupied}
                isSelected={isSelected}
                isHovered={isHovered}
                size={isFullscreen ? 36 : 24}
              />

              {/* Delivery Animation */}
              {hasDelivery && (
                <div className="absolute -top-6 -right-6 z-20 animate-bounce">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <Coffee className="h-2 w-2 text-white" />
                  </div>
                </div>
              )}

              {/* Enhanced Occupancy Indicators */}
              {isOccupied && (
                <div className="absolute -top-4 -right-4 z-20">
                  <EnhancedUserAvatars
                    users={occupants}
                    seatId={seat.id}
                    onUserHover={(user) => console.log('User hovered:', user)}
                  />
                </div>
              )}

              {/* Enhanced Click hint when hovered */}
              {isHovered && !isSelected && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce shadow-xl whitespace-nowrap">
                    Click to sit!
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Compact Live Status */}
        <div className="absolute top-4 left-4 space-y-2">
          <Badge className="bg-green-600/90 text-white px-3 py-1 text-xs font-semibold animate-pulse flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            Live Café Active
          </Badge>
          
          <Badge className="bg-blue-600/90 text-white px-2 py-1 text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Badge>
        </div>

        {/* Compact Seat Info Panel */}
        {hoveredSeat && (
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl text-sm max-w-xs border-l-4 border-amber-500">
            {(() => {
              const seat = ULTRA_PRECISE_CAFE_SEATS.find(s => s.id === hoveredSeat);
              const occupants = getSeatOccupancy(hoveredSeat);
              if (!seat) return null;
              
              return (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                      <Coffee className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-800">{hoveredSeat.replace(/-/g, ' ').toUpperCase()}</div>
                      <div className="text-xs text-stone-600 capitalize">{seat.vibe} atmosphere</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <div className="text-xs text-blue-600 font-medium">Music Zone</div>
                      <div className="text-xs capitalize">{seat.musicZone}</div>
                    </div>
                    <div className="bg-green-50 p-2 rounded-lg">
                      <div className="text-xs text-green-600 font-medium">Audio</div>
                      <div className="text-xs capitalize">{seat.ambientSound}</div>
                    </div>
                  </div>
                  
                  {occupants.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs font-medium text-stone-700 mb-1">Currently Here:</div>
                      <div className="space-y-1">
                        {occupants.map((user, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            <span className="text-sm">{user.mood}</span>
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
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs"
                      onClick={() => handleSeatClick(seat.id)}
                    >
                      <Coffee className="h-3 w-3 mr-1" />
                      Sit Here
                    </Button>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Compact Instructions */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg text-xs max-w-xs">
          <div className="font-bold mb-2 text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-600" />
            How to Use
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <CoffeeBean isOccupied={false} isSelected={false} isHovered={false} size={12} />
              <span>Click any coffee bean to sit there</span>
            </div>
            <div className="flex items-center gap-2">
              <CoffeeBean isOccupied={true} isSelected={false} isHovered={false} size={12} />
              <span>See who's sitting where in real-time</span>
            </div>
            <div className="text-gray-600 mt-1 pt-1 border-t text-xs">
              Hover over beans to see details • Click to join conversations
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
