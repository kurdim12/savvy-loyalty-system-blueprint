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

// Enhanced Coffee Bean Icon Component with woody theme
const CoffeeBean = ({ isOccupied, isSelected, isHovered, size = 32, seatType }: { 
  isOccupied: boolean; 
  isSelected: boolean; 
  isHovered: boolean; 
  size?: number;
  seatType?: string;
}) => {
  const beanColor = isOccupied ? '#8B7355' : '#5D4037';
  const seamColor = isOccupied ? '#6D4C2A' : '#3E2723';
  const glowColor = isSelected ? '#D2691E' : isHovered ? '#CD853F' : 'transparent';
  
  return (
    <div 
      className={`relative transition-all duration-500 ${
        !isOccupied ? 'animate-pulse' : ''
      }`}
      style={{
        width: size,
        height: size,
        filter: `drop-shadow(0 8px 16px rgba(61,39,35,0.4)) drop-shadow(0 0 20px ${glowColor})`,
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
        <defs>
          <radialGradient id={`beanGradient-${size}`} cx="0.3" cy="0.3" r="0.7">
            <stop offset="0%" stopColor={isOccupied ? '#A0826D' : '#8D6E63'} />
            <stop offset="50%" stopColor={beanColor} />
            <stop offset="100%" stopColor={seamColor} />
          </radialGradient>
          <filter id={`woodTexture-${size}`}>
            <feTurbulence baseFrequency="0.9" numOctaves="4" result="noise" />
            <feColorMatrix in="noise" type="saturate" values="0"/>
            <feComponentTransfer>
              <feFuncA type="discrete" tableValues="0.5 0.8 0.3 0.9"/>
            </feComponentTransfer>
            <feComposite operator="multiply" in2="SourceGraphic"/>
          </filter>
        </defs>
        
        {/* Coffee bean body with wood texture */}
        <ellipse
          cx="12"
          cy="12"
          rx="8"
          ry="11"
          fill={`url(#beanGradient-${size})`}
          filter={`url(#woodTexture-${size})`}
          transform="rotate(-15 12 12)"
        />
        
        {/* Enhanced coffee bean seam */}
        <path
          d="M7 8 Q12 12 17 16"
          stroke={seamColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
        
        {/* Wood grain highlight */}
        <ellipse
          cx="9"
          cy="9"
          rx="2"
          ry="3"
          fill="rgba(205,133,63,0.4)"
          transform="rotate(-15 9 9)"
        />
        
        {/* Selection ring with woody glow */}
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
        
        {/* Seat type indicator with wood styling */}
        {seatType && (
          <text
            x="12"
            y="20"
            textAnchor="middle"
            fontSize="6"
            fill="#F5DEB3"
            fontWeight="bold"
            stroke="#8B4513"
            strokeWidth="0.5"
          >
            {seatType.charAt(0).toUpperCase()}
          </text>
        )}
      </svg>
      
      {/* Floating particles for available seats */}
      {!isOccupied && (
        <>
          <div className="absolute -top-2 -right-2 w-2 h-2 bg-amber-600 rounded-full animate-ping opacity-75" />
          <div className="absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
        </>
      )}
    </div>
  );
};

// Enhanced Barista Avatar Component with woody cafe styling
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
      title={`${name} - Expert Barista`}
    >
      <div className="relative">
        {/* Enhanced avatar container with wooden frame styling */}
        <div className="relative w-20 h-20 rounded-full border-4 border-gradient-to-r from-amber-700 via-orange-700 to-amber-800 shadow-2xl overflow-hidden group-hover:scale-110 transition-all duration-500"
             style={{
               background: 'linear-gradient(135deg, #8B4513, #A0522D, #CD853F)',
               boxShadow: '0 0 25px rgba(139, 69, 19, 0.6), inset 0 0 10px rgba(205, 133, 63, 0.3)'
             }}>
          <img 
            src={getAvatarImage(name)} 
            alt={name}
            className="w-full h-full object-cover rounded-full transform group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Wooden frame effect */}
          <div className="absolute inset-0 rounded-full border-2 border-amber-600 animate-pulse opacity-70" />
          <div className="absolute inset-0 rounded-full border border-orange-400 animate-ping opacity-40" style={{ animationDelay: '0.5s' }} />
          
          {/* Enhanced coffee steam animation */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div className="w-1.5 h-8 bg-gradient-to-t from-white/70 to-transparent rounded-full animate-pulse opacity-90" />
            <div className="w-1 h-6 bg-gradient-to-t from-white/50 to-transparent rounded-full animate-pulse opacity-70 ml-2 -mt-6" style={{ animationDelay: '0.3s' }} />
            <div className="w-1.5 h-7 bg-gradient-to-t from-white/60 to-transparent rounded-full animate-pulse opacity-80 -ml-1 -mt-5" style={{ animationDelay: '0.8s' }} />
          </div>
        </div>
        
        {/* Enhanced name tag with wooden styling */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-800 via-orange-800 to-amber-900 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-2xl whitespace-nowrap group-hover:scale-105 transition-all duration-300 border-2 border-amber-600"
             style={{
               background: 'linear-gradient(135deg, #8B4513, #A0522D)',
               boxShadow: '0 8px 25px rgba(139, 69, 19, 0.8)'
             }}>
          <div className="flex items-center gap-2">
            ☕ {name}
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
        </div>
        
        {/* Enhanced status indicator */}
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-600 border-3 border-white rounded-full animate-pulse shadow-lg flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
        
        {/* Floating skill indicators */}
        <div className="absolute -top-8 -left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
        
        {/* Coffee expertise indicator */}
        <div className="absolute top-1 right-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs px-1.5 py-0.5 rounded-full font-bold shadow-md opacity-90">
          ⭐
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

// Enhanced Zone colors with woody theme
const ZONE_COLORS = {
  counter: { 
    bg: 'linear-gradient(135deg, rgba(139, 69, 19, 0.3) 0%, rgba(160, 82, 45, 0.2) 100%)', 
    border: '#8B4513', 
    name: '☕ Coffee Counter',
    accent: 'rgba(139, 69, 19, 0.8)'
  },
  window: { 
    bg: 'linear-gradient(135deg, rgba(34, 139, 34, 0.25) 0%, rgba(107, 142, 35, 0.2) 100%)', 
    border: '#228B22', 
    name: '🪟 Window Seating',
    accent: 'rgba(34, 139, 34, 0.8)'
  },
  interior: { 
    bg: 'linear-gradient(135deg, rgba(70, 130, 180, 0.25) 0%, rgba(100, 149, 237, 0.2) 100%)', 
    border: '#4682B4', 
    name: '🎨 Interior Design',
    accent: 'rgba(70, 130, 180, 0.8)'
  },
  corner: { 
    bg: 'linear-gradient(135deg, rgba(147, 112, 219, 0.25) 0%, rgba(138, 43, 226, 0.2) 100%)', 
    border: '#9370DB', 
    name: '🛋️ Cozy Corner',
    accent: 'rgba(147, 112, 219, 0.8)'
  },
  central: { 
    bg: 'linear-gradient(135deg, rgba(218, 165, 32, 0.25) 0%, rgba(184, 134, 11, 0.2) 100%)', 
    border: '#DAA520', 
    name: '💼 Work Zone',
    accent: 'rgba(218, 165, 32, 0.8)'
  },
  back: { 
    bg: 'linear-gradient(135deg, rgba(119, 136, 153, 0.25) 0%, rgba(112, 128, 144, 0.2) 100%)', 
    border: '#778899', 
    name: '🧘 Quiet Zone',
    accent: 'rgba(119, 136, 153, 0.8)'
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
      {/* Enhanced CSS animations with woody theme */}
      <style>
        {`
          @keyframes beanFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
          }
          
          @keyframes woodGrain {
            0%, 100% { 
              background-position: 0% 50%;
              box-shadow: 0 0 15px rgba(139, 69, 19, 0.4);
            }
            50% { 
              background-position: 100% 50%;
              box-shadow: 0 0 25px rgba(139, 69, 19, 0.6);
            }
          }
          
          @keyframes cafeAmbience {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          .woody-background {
            background: linear-gradient(-45deg, 
              #F5DEB3, #DEB887, #D2B48C, #BC9A6A, #8B7355, #A0826D);
            background-size: 400% 400%;
            animation: cafeAmbience 25s ease infinite;
          }
          
          .wood-texture {
            background-image: 
              radial-gradient(circle at 25% 25%, rgba(139, 69, 19, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(160, 82, 45, 0.1) 0%, transparent 50%),
              linear-gradient(45deg, rgba(245, 222, 179, 0.05) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(205, 133, 63, 0.05) 25%, transparent 25%);
          }
        `}
      </style>

      {/* Enhanced Header with woody styling */}
      {!hideHeader && !isFullscreen && (
        <div className="text-center py-4 bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 rounded-t-lg border-b-4 border-amber-600 wood-texture"
             style={{
               background: 'linear-gradient(135deg, #F5DEB3, #DEB887, #D2B48C)',
               boxShadow: 'inset 0 2px 10px rgba(139, 69, 19, 0.2)'
             }}>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative">
              <Crown className="h-10 w-10 text-amber-800 animate-pulse" />
              <Sparkles className="h-5 w-5 text-orange-600 absolute -top-1 -right-1 animate-spin" />
            </div>
            <h2 className="text-4xl font-bold text-amber-900 bg-gradient-to-r from-amber-800 to-orange-800 bg-clip-text text-transparent"
                style={{ textShadow: '2px 2px 4px rgba(139, 69, 19, 0.3)' }}>
              A MATTER OF COFFEE
            </h2>
            <div className="relative">
              <Sparkles className="h-10 w-10 text-amber-800 animate-pulse" />
              <Coffee className="h-5 w-5 text-amber-600 absolute -bottom-1 -left-1 animate-bounce" />
            </div>
          </div>
          <p className="text-amber-800 text-base mb-4 font-semibold">
            ✨ Click on any coffee bean to claim your perfect woody retreat! ✨
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
          
          {/* Enhanced Zone Statistics with woody styling */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 px-6">
            {Object.entries(ZONE_COLORS).map(([zone, config]) => {
              const stats = getZoneStats(zone);
              const occupancyRate = (stats.occupied / stats.total) * 100;
              
              return (
                <Card key={zone} className="bg-white/95 backdrop-blur-sm border-2 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                      style={{ 
                        borderColor: config.border,
                        background: 'linear-gradient(135deg, rgba(245, 222, 179, 0.9), rgba(222, 184, 135, 0.8))'
                      }}>
                  <CardContent className="p-4">
                    <div className="text-sm font-bold mb-2" style={{ color: config.border }}>
                      {config.name}
                    </div>
                    <div className="text-sm text-amber-800 mb-3 font-medium">
                      {stats.occupied}/{stats.total} seats
                    </div>
                    <div className="w-full bg-amber-200 rounded-full h-3 mb-2 overflow-hidden border border-amber-400">
                      <div 
                        className="h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${occupancyRate}%`,
                          background: `linear-gradient(90deg, ${config.border}, ${config.accent})`,
                          boxShadow: `0 0 12px ${config.accent}`
                        }}
                      />
                    </div>
                    <div className="text-sm font-bold text-center text-amber-800">
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

      {/* Main Interactive Canvas - Enhanced Woody Café Layout */}
      <div
        className={`relative w-full mx-auto overflow-hidden woody-background wood-texture ${
          isFullscreen ? 'h-screen' : hideHeader ? 'h-full' : 'h-[calc(100vh-320px)]'
        }`}
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(139, 69, 19, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(160, 82, 45, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(222, 184, 135, 0.1) 0%, transparent 50%),
            linear-gradient(45deg, rgba(245, 222, 179, 0.05) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(205, 133, 63, 0.05) 25%, transparent 25%)
          `,
          boxShadow: 'inset 0 0 50px rgba(139, 69, 19, 0.1)'
        }}
      >
        {/* Enhanced Particle Effects */}
        <EnhancedSeatingEffects particles={particles} />

        {/* Enhanced Coffee Bar Area with rich wooden 3D effect */}
        <div className="absolute top-[5%] left-[18%] w-[54%] h-[20%] rounded-3xl shadow-2xl overflow-hidden transform perspective-1000 hover:scale-105 transition-all duration-500">
          <div className="w-full h-full bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900 rounded-3xl relative"
               style={{
                 background: 'linear-gradient(135deg, #8B4513, #A0522D, #CD853F, #D2691E)',
                 boxShadow: '0 20px 60px rgba(139, 69, 19, 0.8), inset 0 5px 20px rgba(245, 222, 179, 0.3)'
               }}>
            {/* Rich wood texture overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-900/40 to-orange-900/40 rounded-3xl wood-texture" />
            
            {/* Enhanced coffee machine area */}
            <div className="absolute left-[10%] top-[15%] w-[80%] h-[70%] bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-inner"
                 style={{ boxShadow: 'inset 0 5px 15px rgba(0,0,0,0.6)' }}>
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center">
                <div className="text-amber-200 font-bold text-xl flex items-center gap-4"
                     style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                  <Coffee className="h-8 w-8 animate-pulse" />
                  ☕ ARTISAN ESPRESSO BAR ☕
                  <Coffee className="h-8 w-8 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
            </div>
            
            {/* Enhanced steam effects */}
            <div className="absolute top-0 left-[25%] w-3 h-12 bg-gradient-to-t from-white/70 to-transparent rounded-full animate-pulse opacity-90" />
            <div className="absolute top-0 left-[45%] w-2 h-10 bg-gradient-to-t from-white/50 to-transparent rounded-full animate-pulse opacity-70" style={{ animationDelay: '1s' }} />
            <div className="absolute top-0 left-[65%] w-3 h-11 bg-gradient-to-t from-white/60 to-transparent rounded-full animate-pulse opacity-80" style={{ animationDelay: '0.5s' }} />
            
            {/* Wood grain details */}
            <div className="absolute top-2 left-4 w-16 h-1 bg-amber-600 rounded-full opacity-60" />
            <div className="absolute bottom-2 right-4 w-20 h-1 bg-orange-600 rounded-full opacity-60" />
          </div>
        </div>

        {/* Enhanced Baristas with improved woody avatars */}
        {BARISTAS.map((barista) => (
          <BaristaAvatar
            key={barista.name}
            name={barista.name}
            position={barista.position}
          />
        ))}

        {/* Zone Background Overlays with enhanced woody styling */}
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
              className="absolute rounded-3xl border-3 transition-all duration-500 hover:shadow-2xl wood-texture"
              style={{
                left: `${minX - 3}%`,
                top: `${minY - 3}%`,
                width: `${maxX - minX + 6}%`,
                height: `${maxY - minY + 6}%`,
                background: config.bg,
                borderColor: config.border,
                backdropFilter: 'blur(2px)',
                boxShadow: `0 0 20px ${config.accent}, inset 0 2px 10px rgba(245, 222, 179, 0.2)`,
                zIndex: 10
              }}
            >
              <div className="absolute -top-8 left-3 bg-white/98 backdrop-blur-sm px-4 py-2 rounded-full shadow-xl border-3 wood-texture" 
                   style={{ 
                     borderColor: config.border,
                     background: 'linear-gradient(135deg, rgba(245, 222, 179, 0.95), rgba(222, 184, 135, 0.9))'
                   }}>
                <span className="text-sm font-bold" style={{ color: config.border }}>
                  {config.name}
                </span>
              </div>
            </div>
          );
        })}

        {/* Enhanced Coffee Bean Seat Markers with woody theme */}
        {REAL_CAFE_SEATS.map((seat) => {
          const occupants = getSeatOccupancy(seat.id);
          const isOccupied = occupants.length > 0;
          const isSelected = selectedSeat === seat.id;
          const isHovered = hoveredSeat === seat.id;
          const hasDelivery = deliveredOrders.some(order => order.seatId === seat.id);
          
          return (
            <div
              key={seat.id}
              className="absolute cursor-pointer transition-all duration-500 rounded-3xl flex items-center justify-center group wood-texture"
              style={{
                left: `${seat.x}%`,
                top: `${seat.y}%`,
                width: `${seat.w}%`,
                height: `${seat.h}%`,
                zIndex: isHovered || isSelected ? 40 : 30,
                transform: isSelected 
                  ? 'scale(1.25) rotate(3deg)' 
                  : isHovered 
                    ? 'scale(1.15) rotate(2deg)' 
                    : 'scale(1)',
                filter: isSelected || isHovered ? 'drop-shadow(0 15px 35px rgba(139,69,19,0.5))' : 'none'
              }}
              onClick={() => handleSeatClick(seat.id)}
              onMouseEnter={() => setHoveredSeat(seat.id)}
              onMouseLeave={() => setHoveredSeat(null)}
            >
              {/* Enhanced seat base with woody styling */}
              <div 
                className="w-full h-full rounded-3xl border-4 transition-all duration-300 wood-texture"
                style={{
                  backgroundColor: isSelected 
                    ? 'rgba(139, 69, 19, 0.4)' 
                    : isHovered 
                      ? 'rgba(160, 82, 45, 0.3)' 
                      : 'rgba(245, 222, 179, 0.2)',
                  borderColor: isSelected 
                    ? '#8B4513' 
                    : ZONE_COLORS[seat.zone as keyof typeof ZONE_COLORS]?.border || '#D2691E',
                  borderWidth: isSelected ? '5px' : '3px',
                  boxShadow: isSelected || isHovered 
                    ? `0 0 30px ${ZONE_COLORS[seat.zone as keyof typeof ZONE_COLORS]?.accent}, inset 0 2px 10px rgba(245, 222, 179, 0.3)` 
                    : 'inset 0 1px 5px rgba(245, 222, 179, 0.2)'
                }}
              />

              {/* Enhanced Coffee Bean with woody theme */}
              <div className="absolute inset-0 flex items-center justify-center">
                <CoffeeBean
                  isOccupied={isOccupied}
                  isSelected={isSelected}
                  isHovered={isHovered}
                  size={isFullscreen ? 32 : 24}
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
              Our expert baristas Ahmed, Joy & Muneef are here to serve you! ☕
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
