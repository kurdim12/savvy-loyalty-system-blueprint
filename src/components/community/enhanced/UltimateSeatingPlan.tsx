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

// Enhanced Coffee Bean Icon Component with animations
const CoffeeBean = ({ isOccupied, isSelected, isHovered, size = 32, seatType }: { 
  isOccupied: boolean; 
  isSelected: boolean; 
  isHovered: boolean; 
  size?: number;
  seatType?: string;
}) => {
  const beanColor = isOccupied ? '#B0B0B0' : '#6F4E37';
  const seamColor = isOccupied ? '#808080' : '#3E2C19';
  const glowColor = isSelected ? '#3b82f6' : isHovered ? '#60a5fa' : 'transparent';
  
  return (
    <div 
      className={`relative transition-all duration-500 ${
        !isOccupied ? 'animate-pulse' : ''
      }`}
      style={{
        width: size,
        height: size,
        filter: `drop-shadow(0 8px 16px rgba(0,0,0,0.3)) drop-shadow(0 0 20px ${glowColor})`,
        transform: isSelected ? 'scale(1.5) rotate(10deg)' : isHovered ? 'scale(1.3) rotate(5deg)' : 'scale(1)',
        animation: !isOccupied ? 'beanFloat 3s ease-in-out infinite' : 'none'
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Coffee bean gradient */}
        <defs>
          <radialGradient id={`beanGradient-${size}`} cx="0.3" cy="0.3" r="0.7">
            <stop offset="0%" stopColor={isOccupied ? '#D0D0D0' : '#8B5A3C'} />
            <stop offset="100%" stopColor={beanColor} />
          </radialGradient>
        </defs>
        
        {/* Coffee bean body with gradient */}
        <ellipse
          cx="12"
          cy="12"
          rx="8"
          ry="11"
          fill={`url(#beanGradient-${size})`}
          transform="rotate(-15 12 12)"
        />
        
        {/* Coffee bean seam with enhanced styling */}
        <path
          d="M7 8 Q12 12 17 16"
          stroke={seamColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Highlight effect */}
        <ellipse
          cx="9"
          cy="9"
          rx="2"
          ry="3"
          fill="rgba(255,255,255,0.3)"
          transform="rotate(-15 9 9)"
        />
        
        {/* Selection ring with animation */}
        {(isSelected || isHovered) && (
          <ellipse
            cx="12"
            cy="12"
            rx="11"
            ry="14"
            fill="none"
            stroke={glowColor}
            strokeWidth="3"
            transform="rotate(-15 12 12)"
            opacity="0.8"
            className="animate-pulse"
          />
        )}
        
        {/* Seat type indicator */}
        {seatType && (
          <text
            x="12"
            y="20"
            textAnchor="middle"
            fontSize="6"
            fill="white"
            fontWeight="bold"
          >
            {seatType.charAt(0).toUpperCase()}
          </text>
        )}
      </svg>
      
      {/* Floating particles for available seats */}
      {!isOccupied && (
        <>
          <div className="absolute -top-2 -right-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-75" />
          <div className="absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
        </>
      )}
    </div>
  );
};

// Enhanced Barista Avatar Component with new images
const BaristaAvatar = ({ name, position }: { name: string; position: { x: number; y: number } }) => {
  const getAvatarImage = (name: string) => {
    switch (name) {
      case 'Ahmed':
        return '/lovable-uploads/85f66148-4e37-4572-8c7a-a4ce6e45514b.png';
      case 'Joy':
        return '/lovable-uploads/a93d552c-0790-4bbc-a949-d1d361213eba.png';
      case 'Muneef':
        return '/lovable-uploads/2cdb199c-75e8-4600-8900-dfbd96092a79.png';
      default:
        return '';
    }
  };

  return (
    <div
      className="absolute z-30 cursor-pointer group"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      title={`${name} - Master Barista`}
    >
      <div className="relative">
        {/* Enhanced avatar container with glow effect */}
        <div className="relative w-16 h-16 rounded-full border-4 border-amber-400 shadow-2xl overflow-hidden group-hover:scale-110 transition-all duration-300 bg-gradient-to-br from-amber-100 to-orange-100">
          <img 
            src={getAvatarImage(name)} 
            alt={name}
            className="w-full h-full object-cover rounded-full"
          />
          
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-full border-2 border-yellow-300 animate-pulse opacity-60" />
          
          {/* Coffee steam animation */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="w-1 h-6 bg-gradient-to-t from-white/60 to-transparent rounded-full animate-pulse opacity-80" />
            <div className="w-1 h-4 bg-gradient-to-t from-white/40 to-transparent rounded-full animate-pulse opacity-60 ml-1 -mt-4" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
        
        {/* Enhanced name tag with styling */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-700 to-orange-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl whitespace-nowrap group-hover:scale-105 transition-all duration-300">
          ☕ {name}
        </div>
        
        {/* Status indicator */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse shadow-lg" />
        
        {/* Skill level indicator */}
        <div className="absolute top-0 left-0 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs px-2 py-1 rounded-full font-bold shadow-md">
          ⭐ Master
        </div>
      </div>
    </div>
  );
};

// Enhanced Real Café Layout with more detailed positioning
const REAL_CAFE_SEATS = [
  // Bar counter seats (from interior photos)
  { 
    id: 'bar-counter-1', x: 25, y: 15, w: 2, h: 2, type: 'bar', zone: 'counter',
    ambientSound: 'espresso-machine', musicZone: 'energetic', vibe: 'social'
  },
  { 
    id: 'bar-counter-2', x: 30, y: 15, w: 2, h: 2, type: 'bar', zone: 'counter',
    ambientSound: 'espresso-machine', musicZone: 'energetic', vibe: 'social'
  },
  { 
    id: 'bar-counter-3', x: 35, y: 15, w: 2, h: 2, type: 'bar', zone: 'counter',
    ambientSound: 'espresso-machine', musicZone: 'energetic', vibe: 'social'
  },
  { 
    id: 'bar-counter-4', x: 40, y: 15, w: 2, h: 2, type: 'bar', zone: 'counter',
    ambientSound: 'espresso-machine', musicZone: 'energetic', vibe: 'social'
  },

  // Window-side seating area (from outdoor/window photos)
  { 
    id: 'window-table-1', x: 75, y: 25, w: 2.5, h: 2.5, type: 'table', zone: 'window',
    ambientSound: 'street-ambience', musicZone: 'ambient', vibe: 'relaxed'
  },
  { 
    id: 'window-table-2', x: 80, y: 25, w: 2.5, h: 2.5, type: 'table', zone: 'window',
    ambientSound: 'street-ambience', musicZone: 'ambient', vibe: 'relaxed'
  },
  { 
    id: 'window-chair-1', x: 85, y: 30, w: 2, h: 2, type: 'chair', zone: 'window',
    ambientSound: 'street-ambience', musicZone: 'ambient', vibe: 'contemplative'
  },
  { 
    id: 'window-chair-2', x: 85, y: 35, w: 2, h: 2, type: 'chair', zone: 'window',
    ambientSound: 'street-ambience', musicZone: 'ambient', vibe: 'contemplative'
  },

  // Interior seating area (green/blue textured wall area)
  { 
    id: 'interior-chair-1', x: 15, y: 45, w: 2, h: 2, type: 'chair', zone: 'interior',
    ambientSound: 'intimate', musicZone: 'ambient', vibe: 'focused'
  },
  { 
    id: 'interior-chair-2', x: 20, y: 45, w: 2, h: 2, type: 'chair', zone: 'interior',
    ambientSound: 'intimate', musicZone: 'ambient', vibe: 'focused'
  },
  { 
    id: 'interior-table-1', x: 25, y: 50, w: 2.5, h: 2.5, type: 'table', zone: 'interior',
    ambientSound: 'intimate', musicZone: 'ambient', vibe: 'collaborative'
  },
  { 
    id: 'interior-table-2', x: 35, y: 50, w: 2.5, h: 2.5, type: 'table', zone: 'interior',
    ambientSound: 'intimate', musicZone: 'ambient', vibe: 'collaborative'
  },

  // Cozy corner seating (from artistic interior photo)
  { 
    id: 'corner-sofa-1', x: 65, y: 55, w: 3, h: 2.5, type: 'sofa', zone: 'corner',
    ambientSound: 'intimate', musicZone: 'chill', vibe: 'relaxed'
  },
  { 
    id: 'corner-sofa-2', x: 70, y: 60, w: 3, h: 2.5, type: 'sofa', zone: 'corner',
    ambientSound: 'intimate', musicZone: 'chill', vibe: 'relaxed'
  },
  { 
    id: 'corner-table-1', x: 65, y: 65, w: 2, h: 2, type: 'table', zone: 'corner',
    ambientSound: 'intimate', musicZone: 'chill', vibe: 'contemplative'
  },

  // Central workspace area
  { 
    id: 'central-table-1', x: 45, y: 35, w: 2.5, h: 2.5, type: 'table', zone: 'central',
    ambientSound: 'gentle-chatter', musicZone: 'focus', vibe: 'productive'
  },
  { 
    id: 'central-table-2', x: 55, y: 35, w: 2.5, h: 2.5, type: 'table', zone: 'central',
    ambientSound: 'gentle-chatter', musicZone: 'focus', vibe: 'productive'
  },
  { 
    id: 'central-chair-1', x: 45, y: 42, w: 2, h: 2, type: 'chair', zone: 'central',
    ambientSound: 'gentle-chatter', musicZone: 'focus', vibe: 'focused'
  },
  { 
    id: 'central-chair-2', x: 55, y: 42, w: 2, h: 2, type: 'chair', zone: 'central',
    ambientSound: 'gentle-chatter', musicZone: 'focus', vibe: 'focused'
  },

  // Back wall seating (concrete/industrial area)
  { 
    id: 'back-wall-1', x: 15, y: 65, w: 2, h: 2, type: 'chair', zone: 'back',
    ambientSound: 'quiet', musicZone: 'ambient', vibe: 'contemplative'
  },
  { 
    id: 'back-wall-2', x: 25, y: 65, w: 2, h: 2, type: 'chair', zone: 'back',
    ambientSound: 'quiet', musicZone: 'ambient', vibe: 'contemplative'
  },
  { 
    id: 'back-wall-3', x: 35, y: 65, w: 2, h: 2, type: 'chair', zone: 'back',
    ambientSound: 'quiet', musicZone: 'ambient', vibe: 'contemplative'
  }
];

// Barista positions with enhanced layout
const BARISTAS = [
  { name: 'Ahmed', position: { x: 25, y: 8 } },
  { name: 'Joy', position: { x: 33, y: 8 } },
  { name: 'Muneef', position: { x: 41, y: 8 } }
];

// Enhanced Zone colors with gradients
const ZONE_COLORS = {
  counter: { 
    bg: 'linear-gradient(135deg, rgba(139, 69, 19, 0.2) 0%, rgba(160, 82, 45, 0.15) 100%)', 
    border: '#8B4513', 
    name: '☕ Coffee Counter',
    accent: 'rgba(139, 69, 19, 0.8)'
  },
  window: { 
    bg: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.15) 100%)', 
    border: '#22C55E', 
    name: '🪟 Window Seating',
    accent: 'rgba(34, 197, 94, 0.8)'
  },
  interior: { 
    bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.15) 100%)', 
    border: '#3B82F6', 
    name: '🎨 Interior Design',
    accent: 'rgba(59, 130, 246, 0.8)'
  },
  corner: { 
    bg: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(126, 34, 206, 0.15) 100%)', 
    border: '#9333EA', 
    name: '🛋️ Cozy Corner',
    accent: 'rgba(147, 51, 234, 0.8)'
  },
  central: { 
    bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.15) 100%)', 
    border: '#F59E0B', 
    name: '💼 Work Zone',
    accent: 'rgba(245, 158, 11, 0.8)'
  },
  back: { 
    bg: 'linear-gradient(135deg, rgba(107, 114, 128, 0.2) 0%, rgba(75, 85, 99, 0.15) 100%)', 
    border: '#6B7280', 
    name: '🧘 Quiet Zone',
    accent: 'rgba(107, 114, 128, 0.8)'
  }
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
  const [animationEnabled, setAnimationEnabled] = useState(true);

  // Update time every minute for dynamic lighting
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleSeatClick = (seatId: string) => {
    // Enhanced particle effect on seat selection
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
      {/* Enhanced CSS animations */}
      <style>
        {`
          @keyframes beanFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
          }
          
          @keyframes zoneGlow {
            0%, 100% { box-shadow: 0 0 10px rgba(139, 69, 19, 0.3); }
            50% { box-shadow: 0 0 20px rgba(139, 69, 19, 0.6); }
          }
          
          @keyframes cafeAmbience {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          .cafe-background {
            background: linear-gradient(-45deg, #f5f1eb, #e8ddd4, #d4c4b0, #c7b299);
            background-size: 400% 400%;
            animation: cafeAmbience 20s ease infinite;
          }
        `}
      </style>

      {/* Enhanced Header with more visual elements */}
      {!hideHeader && !isFullscreen && (
        <div className="text-center py-3 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-t-lg border-b-2 border-amber-200">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="relative">
              <Crown className="h-8 w-8 text-amber-600 animate-pulse" />
              <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1 animate-spin" />
            </div>
            <h2 className="text-3xl font-bold text-stone-800 bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
              A MATTER OF COFFEE
            </h2>
            <div className="relative">
              <Sparkles className="h-8 w-8 text-amber-600 animate-pulse" />
              <Coffee className="h-4 w-4 text-amber-500 absolute -bottom-1 -left-1 animate-bounce" />
            </div>
          </div>
          <p className="text-stone-600 text-sm mb-3 font-medium">
            ✨ Click on any coffee bean to claim your perfect spot! ✨
          </p>
          
          {/* Enhanced Controls */}
          <div className="flex justify-center items-center gap-3 flex-wrap mb-3">
            <GamificationElements 
              userPoints={1250}
              streak={7}
              achievements={[]}
            />
            <CoffeeShopAmbientAudio />
            <AdvancedSocialFeatures />
            <Button
              onClick={() => setAnimationEnabled(!animationEnabled)}
              variant="outline"
              size="sm"
              className="bg-purple-50 border-purple-300 hover:bg-purple-100"
            >
              {animationEnabled ? '🎭 Animations ON' : '🎭 Animations OFF'}
            </Button>
          </div>
          
          {/* Enhanced Zone Statistics with visual improvements */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-2 px-4">
            {Object.entries(ZONE_COLORS).map(([zone, config]) => {
              const stats = getZoneStats(zone);
              const occupancyRate = (stats.occupied / stats.total) * 100;
              
              return (
                <Card key={zone} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <CardContent className="p-3">
                    <div className="text-xs font-bold mb-1" style={{ color: config.border }}>
                      {config.name}
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      {stats.occupied}/{stats.total} seats
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1 overflow-hidden">
                      <div 
                        className="h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${occupancyRate}%`,
                          background: `linear-gradient(90deg, ${config.border}, ${config.accent})`,
                          boxShadow: `0 0 10px ${config.accent}`
                        }}
                      />
                    </div>
                    <div className="text-xs font-medium text-center">
                      {occupancyRate > 80 ? '🔥 Busy' : occupancyRate > 50 ? '☕ Active' : '✨ Available'}
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
            availableSeats={REAL_CAFE_SEATS.map(s => s.id)}
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

      {/* Main Interactive Canvas - Café Layout */}
      <div
        className={`relative w-full mx-auto overflow-hidden cafe-background ${
          isFullscreen ? 'h-screen' : hideHeader ? 'h-full' : 'h-[calc(100vh-280px)]'
        }`}
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(139, 69, 19, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(34, 197, 94, 0.05) 0%, transparent 50%)
          `,
        }}
      >
        {/* Enhanced Particle Effects */}
        <EnhancedSeatingEffects particles={particles} />

        {/* Enhanced Coffee Bar Area with 3D effect */}
        <div className="absolute top-[5%] left-[18%] w-[54%] h-[18%] rounded-2xl shadow-2xl overflow-hidden transform perspective-1000 hover:scale-105 transition-all duration-500">
          <div className="w-full h-full bg-gradient-to-br from-amber-800 via-amber-700 to-orange-800 rounded-2xl relative">
            {/* Wood texture overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-2xl" />
            
            {/* Coffee machine area */}
            <div className="absolute left-[10%] top-[20%] w-[80%] h-[60%] bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-inner">
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
                <div className="text-amber-200 font-bold text-lg flex items-center gap-3">
                  <Coffee className="h-6 w-6 animate-pulse" />
                  ☕ ESPRESSO BAR ☕
                  <Coffee className="h-6 w-6 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
            </div>
            
            {/* Steam effects */}
            <div className="absolute top-0 left-[30%] w-2 h-8 bg-gradient-to-t from-white/60 to-transparent rounded-full animate-pulse opacity-80" />
            <div className="absolute top-0 left-[50%] w-2 h-6 bg-gradient-to-t from-white/40 to-transparent rounded-full animate-pulse opacity-60" style={{ animationDelay: '1s' }} />
            <div className="absolute top-0 left-[70%] w-2 h-7 bg-gradient-to-t from-white/50 to-transparent rounded-full animate-pulse opacity-70" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>

        {/* Enhanced Baristas with new avatars */}
        {BARISTAS.map((barista) => (
          <BaristaAvatar
            key={barista.name}
            name={barista.name}
            position={barista.position}
          />
        ))}

        {/* Zone Background Overlays with enhanced styling */}
        {Object.entries(ZONE_COLORS).map(([zone, config]) => {
          const zoneSeats = REAL_CAFE_SEATS.filter(seat => seat.zone === zone);
          if (zoneSeats.length === 0) return null;
          
          const minX = Math.min(...zoneSeats.map(s => s.x));
          const maxX = Math.max(...zoneSeats.map(s => s.x + s.w));
          const minY = Math.min(...zoneSeats.map(s => s.y));
          const maxY = Math.max(...zoneSeats.map(s => s.y + s.h));
          
          return (
            <div
              key={`zone-${zone}`}
              className="absolute rounded-2xl border-2 transition-all duration-500 hover:shadow-2xl"
              style={{
                left: `${minX - 2}%`,
                top: `${minY - 2}%`,
                width: `${maxX - minX + 4}%`,
                height: `${maxY - minY + 4}%`,
                background: config.bg,
                borderColor: config.border,
                backdropFilter: 'blur(1px)',
                zIndex: 10
              }}
            >
              <div className="absolute -top-6 left-2 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg border-2" style={{ borderColor: config.border }}>
                <span className="text-xs font-bold" style={{ color: config.border }}>
                  {config.name}
                </span>
              </div>
            </div>
          );
        })}

        {/* Enhanced Coffee Bean Seat Markers */}
        {REAL_CAFE_SEATS.map((seat) => {
          const occupants = getSeatOccupancy(seat.id);
          const isOccupied = occupants.length > 0;
          const isSelected = selectedSeat === seat.id;
          const isHovered = hoveredSeat === seat.id;
          const hasDelivery = deliveredOrders.some(order => order.seatId === seat.id);
          
          return (
            <div
              key={seat.id}
              className="absolute cursor-pointer transition-all duration-500 rounded-2xl flex items-center justify-center group"
              style={{
                left: `${seat.x}%`,
                top: `${seat.y}%`,
                width: `${seat.w}%`,
                height: `${seat.h}%`,
                zIndex: isHovered || isSelected ? 40 : 30,
                transform: isSelected 
                  ? 'scale(1.2) rotate(2deg)' 
                  : isHovered 
                    ? 'scale(1.1) rotate(1deg)' 
                    : 'scale(1)',
                filter: isSelected || isHovered ? 'drop-shadow(0 10px 25px rgba(0,0,0,0.3))' : 'none'
              }}
              onClick={() => handleSeatClick(seat.id)}
              onMouseEnter={() => setHoveredSeat(seat.id)}
              onMouseLeave={() => setHoveredSeat(null)}
            >
              {/* Seat base with enhanced styling */}
              <div 
                className="w-full h-full rounded-2xl border-3 transition-all duration-300"
                style={{
                  backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.3)' : isHovered ? 'rgba(139, 69, 19, 0.2)' : 'rgba(139, 69, 19, 0.1)',
                  borderColor: isSelected ? '#3B82F6' : ZONE_COLORS[seat.zone as keyof typeof ZONE_COLORS]?.border || '#8B4513',
                  borderWidth: isSelected ? '4px' : '2px',
                  boxShadow: isSelected || isHovered ? `0 0 25px ${ZONE_COLORS[seat.zone as keyof typeof ZONE_COLORS]?.accent}` : 'none'
                }}
              />

              {/* Enhanced Coffee Bean */}
              <div className="absolute inset-0 flex items-center justify-center">
                <CoffeeBean
                  isOccupied={isOccupied}
                  isSelected={isSelected}
                  isHovered={isHovered}
                  size={isFullscreen ? 28 : 20}
                  seatType={seat.type}
                />
              </div>

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
            A Matter of Coffee - Live
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
              const seat = REAL_CAFE_SEATS.find(s => s.id === hoveredSeat);
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
                      <div className="text-xs text-stone-600 capitalize">{seat.vibe} atmosphere • {seat.zone}</div>
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
            Welcome to A Matter of Coffee!
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
              Our baristas Ahmed, Joy & Muneef are here to serve you! ☕
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
