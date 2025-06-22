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

// Clean Coffee Bean Icon Component
const CoffeeBean = ({ isOccupied, isSelected, isHovered, size = 24, seatType }: { 
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
      className={`relative transition-all duration-300 ${!isOccupied ? 'animate-pulse' : ''}`}
      style={{
        width: size,
        height: size,
        filter: `drop-shadow(0 4px 8px rgba(61,39,35,0.3)) ${glowColor !== 'transparent' ? `drop-shadow(0 0 12px ${glowColor})` : ''}`,
        transform: isSelected ? 'scale(1.3)' : isHovered ? 'scale(1.15)' : 'scale(1)',
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
        </defs>
        
        <ellipse
          cx="12"
          cy="12"
          rx="8"
          ry="11"
          fill={`url(#beanGradient-${size})`}
          transform="rotate(-15 12 12)"
        />
        
        <path
          d="M7 8 Q12 12 17 16"
          stroke={seamColor}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
        
        <ellipse
          cx="9"
          cy="9"
          rx="2"
          ry="3"
          fill="rgba(205,133,63,0.3)"
          transform="rotate(-15 9 9)"
        />
        
        {(isSelected || isHovered) && (
          <ellipse
            cx="12"
            cy="12"
            rx="11"
            ry="14"
            fill="none"
            stroke={glowColor}
            strokeWidth="2"
            transform="rotate(-15 12 12)"
            opacity="0.8"
            className="animate-pulse"
          />
        )}
      </svg>
      
      {!isOccupied && (
        <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping opacity-75" />
      )}
    </div>
  );
};

// Realistic L-Shaped Coffee Bar based on reference image
const RealisticLShapedBar = () => {
  return (
    <div className="absolute">
      {/* Main horizontal bar section */}
      <div className="absolute top-[25%] left-[30%] w-[35%] h-[12%]">
        {/* Concrete/stone base structure */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-300 to-gray-400 rounded-lg shadow-2xl border-2 border-gray-500">
          {/* Marbled concrete texture overlay */}
          <div className="absolute inset-0 opacity-30 rounded-lg" 
               style={{
                 background: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)`
               }}>
          </div>
          
          {/* Golden accent strip */}
          <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 rounded-b-lg shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-600/30 to-transparent rounded-b-lg"></div>
          </div>
          
          {/* Dark countertop */}
          <div className="absolute top-0 left-0 right-0 h-[25%] bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-lg shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 rounded-t-lg"></div>
          </div>
        </div>

        {/* Equipment area behind bar */}
        <div className="absolute top-[-60%] left-[10%] right-[10%] h-[50%]">
          {/* Espresso machine */}
          <div className="absolute top-2 left-[20%] w-8 h-6 bg-gradient-to-b from-gray-200 to-gray-500 rounded shadow-2xl">
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-60 rounded-b"></div>
          </div>
          
          {/* Coffee grinder */}
          <div className="absolute top-1 left-[45%] w-5 h-8 bg-gradient-to-b from-gray-700 to-black rounded shadow-xl">
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-600 rounded-full border border-gray-500"></div>
          </div>
          
          {/* Storage shelves with coffee equipment */}
          <div className="absolute top-0 right-[15%] w-12 h-4 bg-gradient-to-b from-gray-600 to-gray-700 rounded shadow-lg">
            <div className="absolute top-1 left-1 w-2 h-1 bg-amber-600 rounded-full opacity-80"></div>
            <div className="absolute top-1 left-4 w-2 h-1 bg-amber-600 rounded-full opacity-80"></div>
            <div className="absolute top-1 left-7 w-2 h-1 bg-amber-600 rounded-full opacity-80"></div>
          </div>
        </div>
      </div>

      {/* Vertical L-section of the bar */}
      <div className="absolute top-[25%] left-[62%] w-[12%] h-[18%]">
        {/* Same concrete/stone structure */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-300 to-gray-400 rounded-lg shadow-2xl border-2 border-gray-500">
          {/* Marbled texture */}
          <div className="absolute inset-0 opacity-30 rounded-lg" 
               style={{
                 background: `repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.1) 8px, rgba(0,0,0,0.1) 16px)`
               }}>
          </div>
          
          {/* Golden accent strip */}
          <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 rounded-b-lg shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-600/30 to-transparent rounded-b-lg"></div>
          </div>
          
          {/* Dark countertop */}
          <div className="absolute top-0 left-0 right-0 h-[25%] bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-lg shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 rounded-t-lg"></div>
          </div>
        </div>

        {/* Additional equipment for vertical section */}
        <div className="absolute top-[-45%] left-[10%] right-[10%] h-[40%]">
          {/* Coffee bean dispensers */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-4 h-5 bg-gradient-to-b from-amber-800 to-amber-900 rounded shadow-lg">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2  w-2 h-1 bg-amber-600 rounded-t opacity-90"></div>
          </div>
          
          {/* Cash register area */}
          <div className="absolute top-0 right-0 w-3 h-3 bg-gradient-to-b from-gray-800 to-black rounded shadow-md">
            <div className="absolute top-0 left-0 w-1 h-1 bg-green-400 rounded opacity-80"></div>
          </div>
        </div>
      </div>

      {/* Brand logo on the bar (like AIZAN in reference) */}
      <div className="absolute top-[32%] left-[45%] bg-gray-700 text-white px-2 py-1 rounded shadow-xl text-xs font-bold tracking-wider">
        <div className="flex items-center gap-1">
          <Coffee className="h-3 w-3" />
          COFFEE
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-[20%] left-[32%] w-1 h-3 bg-gradient-to-b from-amber-500 to-amber-700 rounded-full opacity-80 animate-pulse"></div>
      <div className="absolute top-[20%] left-[64%] w-1 h-3 bg-gradient-to-b from-amber-500 to-amber-700 rounded-full opacity-80 animate-pulse"></div>
    </div>
  );
};

// Window Structure
const WindowWithSeating = () => {
  return (
    <div className="absolute top-[20%] left-[8%] w-[12%] h-[22%]">
      {/* Window Frame */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg shadow-2xl">
        {/* Window Glass */}
        <div className="absolute inset-2 bg-gradient-to-b from-sky-200 via-sky-100 to-green-100 rounded-md overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2/3 bg-gradient-to-b from-sky-300 to-sky-200">
            <div className="absolute top-2 left-3 w-4 h-2 bg-white rounded-full opacity-80"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-green-300 to-green-200">
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-400"></div>
          </div>
        </div>
        
        <div className="absolute top-1/2 left-1 right-1 h-0.5 bg-gray-600"></div>
        <div className="absolute left-1/2 top-1 bottom-1 w-0.5 bg-gray-600"></div>
      </div>

      {/* Window Counter */}
      <div className="absolute bottom-[-8%] left-0 w-full h-[15%] bg-gradient-to-r from-stone-200 to-stone-300 rounded shadow-lg border border-stone-400">
        <div className="absolute inset-1 bg-gradient-to-r from-white/40 to-transparent rounded"></div>
      </div>
    </div>
  );
};

// Professional Barista Avatars positioned behind the realistic bar
const BaristaAvatar = ({ name, position }: { name: string; position: { x: number; y: number } }) => {
  const getAvatarImage = (name: string) => {
    switch (name) {
      case 'Ahmed':
        return '/lovable-uploads/85f66148-4e37-4572-8c7a-a4ce6e45514b.png';
      case 'Joy':
        return '/lovable-uploads/a93d552c-0790-4bbc-a949-d1d361213eba.png';
      case 'Muneeb':
        return '/lovable-uploads/2cdb199c-75e8-4600-8900-dfbd96092a79.png';
      default:
        return '';
    }
  };

  return (
    <div
      className="absolute z-40 cursor-pointer group"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      title={`${name} - Expert Barista`}
    >
      <div className="relative">
        <div className="relative w-10 h-10 rounded-full border-3 border-amber-600 shadow-2xl overflow-hidden group-hover:scale-110 transition-all duration-300"
             style={{
               background: 'linear-gradient(135deg, #8B4513, #A0522D)',
               boxShadow: '0 0 20px rgba(139, 69, 19, 0.6), inset 0 0 10px rgba(255,255,255,0.2)'
             }}>
          <img 
            src={getAvatarImage(name)} 
            alt={name}
            className="w-full h-full object-cover rounded-full"
          />
          
          <div className="absolute inset-0 rounded-full border-2 border-amber-400 animate-pulse opacity-60" />
        </div>
        
        <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-800 to-orange-800 text-white px-2 py-1 rounded-full text-xs font-bold shadow-xl whitespace-nowrap">
          ☕ {name}
        </div>
        
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 border-2 border-white rounded-full animate-pulse shadow-lg">
          <div className="w-1 h-1 bg-white rounded-full m-0.5" />
        </div>
      </div>
    </div>
  );
};

// Organized Seating Layout with better spacing
const CAFE_SEATS = [
  // Window Bar Seats - Better aligned
  { 
    id: 'window-seat-1', x: 12, y: 48, w: 3.5, h: 3.5, type: 'window-bar', zone: 'window',
    ambientSound: 'street-ambience', musicZone: 'ambient', vibe: 'peaceful'
  },
  { 
    id: 'window-seat-2', x: 16.5, y: 48, w: 3.5, h: 3.5, type: 'window-bar', zone: 'window',
    ambientSound: 'street-ambience', musicZone: 'ambient', vibe: 'contemplative'
  },

  // Main L-Shaped Bar Counter Seats - Properly spaced around the realistic bar
  { 
    id: 'main-bar-1', x: 32, y: 44, w: 3, h: 3, type: 'bar', zone: 'counter',
    ambientSound: 'espresso-machine', musicZone: 'energetic', vibe: 'social'
  },
  { 
    id: 'main-bar-2', x: 38, y: 44, w: 3, h: 3, type: 'bar', zone: 'counter',
    ambientSound: 'espresso-machine', musicZone: 'energetic', vibe: 'social'
  },
  { 
    id: 'main-bar-3', x: 44, y: 44, w: 3, h: 3, type: 'bar', zone: 'counter',
    ambientSound: 'espresso-machine', musicZone: 'energetic', vibe: 'social'
  },
  { 
    id: 'main-bar-4', x: 50, y: 44, w: 3, h: 3, type: 'bar', zone: 'counter',
    ambientSound: 'espresso-machine', musicZone: 'energetic', vibe: 'social'
  },
  { 
    id: 'main-bar-5', x: 56, y: 44, w: 3, h: 3, type: 'bar', zone: 'counter',
    ambientSound: 'espresso-machine', musicZone: 'energetic', vibe: 'social'
  },

  // L-Shaped Bar Vertical Section Seats
  { 
    id: 'side-bar-1', x: 68, y: 28, w: 3, h: 3, type: 'bar', zone: 'counter',
    ambientSound: 'espresso-machine', musicZone: 'energetic', vibe: 'social'
  },
  { 
    id: 'side-bar-2', x: 68, y: 34, w: 3, h: 3, type: 'bar', zone: 'counter',
    ambientSound: 'espresso-machine', musicZone: 'energetic', vibe: 'social'
  },
  { 
    id: 'side-bar-3', x: 68, y: 40, w: 3, h: 3, type: 'bar', zone: 'counter',
    ambientSound: 'espresso-machine', musicZone: 'energetic', vibe: 'social'
  },

  // Organized Dining Tables - Grid Layout with better spacing
  { 
    id: 'table-1', x: 26, y: 62, w: 4, h: 4, type: 'table', zone: 'dining',
    ambientSound: 'gentle-chatter', musicZone: 'focus', vibe: 'collaborative'
  },
  { 
    id: 'table-2', x: 36, y: 62, w: 4, h: 4, type: 'table', zone: 'dining',
    ambientSound: 'gentle-chatter', musicZone: 'focus', vibe: 'productive'
  },
  { 
    id: 'table-3', x: 46, y: 62, w: 4, h: 4, type: 'table', zone: 'dining',
    ambientSound: 'gentle-chatter', musicZone: 'focus', vibe: 'social'
  },
  { 
    id: 'table-4', x: 56, y: 62, w: 4, h: 4, type: 'table', zone: 'dining',
    ambientSound: 'gentle-chatter', musicZone: 'focus', vibe: 'collaborative'
  },

  // Back Row Tables - Well spaced
  { 
    id: 'table-5', x: 26, y: 74, w: 4, h: 4, type: 'table', zone: 'dining',
    ambientSound: 'gentle-chatter', musicZone: 'focus', vibe: 'quiet'
  },
  { 
    id: 'table-6', x: 36, y: 74, w: 4, h: 4, type: 'table', zone: 'dining',
    ambientSound: 'gentle-chatter', musicZone: 'focus', vibe: 'study'
  },
  { 
    id: 'table-7', x: 46, y: 74, w: 4, h: 4, type: 'table', zone: 'dining',
    ambientSound: 'gentle-chatter', musicZone: 'focus', vibe: 'work'
  },
  { 
    id: 'table-8', x: 56, y: 74, w: 4, h: 4, type: 'table', zone: 'dining',
    ambientSound: 'gentle-chatter', musicZone: 'focus', vibe: 'meeting'
  },

  // Corner Lounge Area - Better organized
  { 
    id: 'lounge-1', x: 78, y: 64, w: 4.5, h: 4.5, type: 'lounge', zone: 'lounge',
    ambientSound: 'nature', musicZone: 'chill', vibe: 'relaxed'
  },
  { 
    id: 'lounge-2', x: 78, y: 76, w: 4.5, h: 4.5, type: 'lounge', zone: 'lounge',
    ambientSound: 'nature', musicZone: 'chill', vibe: 'comfortable'
  },

  // Quiet Corner Spots - Better positioned
  { 
    id: 'corner-1', x: 15, y: 78, w: 3.5, h: 3.5, type: 'corner', zone: 'quiet',
    ambientSound: 'minimal', musicZone: 'focus', vibe: 'solitude'
  },
  { 
    id: 'corner-2', x: 68, y: 84, w: 3.5, h: 3.5, type: 'corner', zone: 'quiet',
    ambientSound: 'minimal', musicZone: 'focus', vibe: 'solitude'
  }
];

// Baristas positioned behind the realistic L-shaped bar
const BARISTAS = [
  { name: 'Ahmed', position: { x: 47, y: 18 } },    // Behind main bar center
  { name: 'Muneeb', position: { x: 38, y: 18 } },   // Behind main bar left
  { name: 'Joy', position: { x: 68, y: 15 } }       // Behind vertical bar section
];

// Clean Zone Colors
const ZONE_COLORS = {
  counter: { 
    bg: 'rgba(139, 69, 19, 0.12)', 
    border: '#8B4513', 
    name: '☕ Coffee Counter',
    accent: 'rgba(139, 69, 19, 0.6)'
  },
  window: { 
    bg: 'rgba(34, 139, 34, 0.12)', 
    border: '#228B22', 
    name: '🪟 Window Seating',
    accent: 'rgba(34, 139, 34, 0.6)'
  },
  dining: { 
    bg: 'rgba(218, 165, 32, 0.12)', 
    border: '#DAA520', 
    name: '🍽️ Dining Tables',
    accent: 'rgba(218, 165, 32, 0.6)'
  },
  lounge: { 
    bg: 'rgba(70, 130, 180, 0.12)', 
    border: '#4682B4', 
    name: '🛋️ Lounge Area',
    accent: 'rgba(70, 130, 180, 0.6)'
  },
  quiet: { 
    bg: 'rgba(138, 43, 226, 0.12)', 
    border: '#8A2BE2', 
    name: '🤫 Quiet Corner',
    accent: 'rgba(138, 43, 226, 0.6)'
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleSeatClick = (seatId: string) => {
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
    const zoneSeats = CAFE_SEATS.filter(seat => seat.zone === zone);
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
  };

  const handleProximityInteraction = (targetUserId: string, interactionType: string) => {
    console.log(`Interaction: ${interactionType} with ${targetUserId}`);
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
      {/* Header */}
      {!hideHeader && !isFullscreen && (
        <div className="text-center py-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-lg border-b-2 border-amber-300">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Crown className="h-6 w-6 text-amber-800" />
            <h2 className="text-2xl font-bold text-amber-900">A Matter of Coffee</h2>
            <Coffee className="h-6 w-6 text-amber-800" />
          </div>
          <p className="text-amber-800 mb-3">Realistic L-shaped bar • Professional baristas • Premium coffee experience!</p>
          
          {/* Controls */}
          <div className="flex justify-center items-center gap-2 mb-3">
            <GamificationElements 
              userPoints={1250}
              streak={7}
              achievements={[]}
            />
            <CoffeeShopAmbientAudio />
            <AdvancedSocialFeatures />
          </div>
          
          {/* Zone Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 px-6">
            {Object.entries(ZONE_COLORS).map(([zone, config]) => {
              const stats = getZoneStats(zone);
              const occupancyRate = (stats.occupied / stats.total) * 100;
              
              return (
                <Card key={zone} className="bg-white/90 border shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-2">
                    <div className="text-xs font-bold mb-1" style={{ color: config.border }}>
                      {config.name}
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      {stats.occupied}/{stats.total} seats
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                      <div 
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${occupancyRate}%`,
                          backgroundColor: config.border
                        }}
                      />
                    </div>
                    <div className="text-xs font-medium text-center" style={{ color: config.border }}>
                      {occupancyRate > 80 ? '🔥 Busy' : occupancyRate > 50 ? '☕ Active' : '✨ Available'}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Dynamic Environment */}
      <DynamicEnvironment 
        currentOccupancy={onlineUsers.length}
        userPreferences={{}}
      />

      {/* Fullscreen Toggle */}
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
              Exit
            </>
          ) : (
            <>
              <Maximize2 className="h-4 w-4 mr-2" />
              Fullscreen
            </>
          )}
        </Button>
      </div>

      {/* Smart Recommendations */}
      {!isFullscreen && (
        <div className="absolute top-4 right-24 z-30">
          <SmartSeatRecommendations
            userProfile={userProfile}
            availableSeats={CAFE_SEATS.map(s => s.id)}
            onSeatRecommend={(seatId, reason) => {
              console.log(`Recommended seat: ${seatId} - ${reason}`);
              handleSeatClick(seatId);
            }}
          />
        </div>
      )}

      {/* Side Panels */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 space-y-2">
        <Button
          onClick={() => setActivePanel(activePanel === 'coffee' ? null : 'coffee')}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm"
        >
          <Coffee className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => setActivePanel(activePanel === 'workspace' ? null : 'workspace')}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm"
        >
          <Zap className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => setActivePanel(activePanel === 'community' ? null : 'community')}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm"
        >
          <Users className="h-4 w-4" />
        </Button>
      </div>

      {/* Panel Content */}
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

      {/* Main Canvas */}
      <div
        className={`relative w-full mx-auto overflow-hidden ${
          isFullscreen ? 'h-screen' : hideHeader ? 'h-full' : 'h-[calc(100vh-200px)]'
        }`}
        style={{
          background: 'linear-gradient(135deg, #F5F5DC, #F0E68C, #DDD8B0)',
          backgroundSize: '200% 200%',
          animation: 'gradient 15s ease infinite'
        }}
      >
        <style>
          {`
            @keyframes gradient {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
          `}
        </style>

        {/* Particle Effects */}
        <EnhancedSeatingEffects particles={particles} />

        {/* Window with Seating */}
        <WindowWithSeating />

        {/* Realistic L-Shaped Coffee Bar */}
        <RealisticLShapedBar />

        {/* Professional Baristas - Behind the Bar */}
        {BARISTAS.map((barista) => (
          <BaristaAvatar
            key={barista.name}
            name={barista.name}
            position={barista.position}
          />
        ))}

        {/* Zone Overlays - Clean Organization */}
        {Object.entries(ZONE_COLORS).map(([zone, config]) => {
          const zoneSeats = CAFE_SEATS.filter(seat => seat.zone === zone);
          if (zoneSeats.length === 0) return null;
          
          const minX = Math.min(...zoneSeats.map(s => s.x));
          const maxX = Math.max(...zoneSeats.map(s => s.x + s.w));
          const minY = Math.min(...zoneSeats.map(s => s.y));
          const maxY = Math.max(...zoneSeats.map(s => s.y + s.h));
          
          return (
            <div
              key={`zone-${zone}`}
              className="absolute rounded-xl border transition-all duration-300 hover:shadow-lg"
              style={{
                left: `${minX - 1}%`,
                top: `${minY - 1}%`,
                width: `${maxX - minX + 2}%`,
                height: `${maxY - minY + 2}%`,
                backgroundColor: config.bg,
                borderColor: config.border,
                zIndex: 10
              }}
            >
              <div className="absolute -top-5 left-2 bg-white/95 px-2 py-1 rounded-full shadow-md border text-xs font-bold" 
                   style={{ borderColor: config.border, color: config.border }}>
                {config.name}
              </div>
            </div>
          );
        })}

        {/* Coffee Bean Seats - Perfectly Organized */}
        {CAFE_SEATS.map((seat) => {
          const occupants = getSeatOccupancy(seat.id);
          const isOccupied = occupants.length > 0;
          const isSelected = selectedSeat === seat.id;
          const isHovered = hoveredSeat === seat.id;
          
          return (
            <div
              key={seat.id}
              className="absolute cursor-pointer transition-all duration-300 rounded-xl flex items-center justify-center"
              style={{
                left: `${seat.x}%`,
                top: `${seat.y}%`,
                width: `${seat.w}%`,
                height: `${seat.h}%`,
                zIndex: isHovered || isSelected ? 40 : 30,
                backgroundColor: isSelected 
                  ? 'rgba(139, 69, 19, 0.25)' 
                  : isHovered 
                    ? 'rgba(160, 82, 45, 0.15)' 
                    : 'rgba(245, 222, 179, 0.08)',
                borderRadius: '12px',
                border: isSelected || isHovered 
                  ? `2px solid ${ZONE_COLORS[seat.zone as keyof typeof ZONE_COLORS]?.border}` 
                  : '1px solid rgba(139, 69, 19, 0.2)'
              }}
              onClick={() => handleSeatClick(seat.id)}
              onMouseEnter={() => setHoveredSeat(seat.id)}
              onMouseLeave={() => setHoveredSeat(null)}
            >
              {/* Coffee Bean */}
              <div className="absolute inset-0 flex items-center justify-center">
                <CoffeeBean
                  isOccupied={isOccupied}
                  isSelected={isSelected}
                  isHovered={isHovered}
                  size={isFullscreen ? 28 : 22}
                  seatType={seat.type}
                />
              </div>

              {/* Occupancy Indicators */}
              {isOccupied && (
                <div className="absolute -top-3 -right-3 z-20">
                  <EnhancedUserAvatars
                    users={occupants}
                    seatId={seat.id}
                    onUserHover={(user) => console.log('User hovered:', user)}
                  />
                </div>
              )}

              {/* Click hint */}
              {isHovered && !isSelected && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="bg-amber-600 text-white px-2 py-1 rounded text-xs font-bold animate-bounce shadow-lg whitespace-nowrap">
                    Click to sit!
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Status Indicators */}
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

        {/* Seat Info Panel */}
        {hoveredSeat && (
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl text-sm max-w-xs border-l-4 border-amber-500">
            {(() => {
              const seat = CAFE_SEATS.find(s => s.id === hoveredSeat);
              const occupants = getSeatOccupancy(hoveredSeat);
              if (!seat) return null;
              
              return (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                      <Coffee className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">{hoveredSeat.replace(/-/g, ' ').toUpperCase()}</div>
                      <div className="text-xs text-gray-600 capitalize">{seat.vibe} • {seat.zone}</div>
                    </div>
                  </div>
                  
                  {occupants.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs font-medium text-gray-700 mb-1">Currently Here:</div>
                      <div className="space-y-1">
                        {occupants.map((user, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            <span className="text-sm">{user.mood}</span>
                            <span className="font-medium">{user.name}</span>
                            <Badge variant="outline" className="text-xs">{user.status}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    size="sm" 
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs"
                    onClick={() => handleSeatClick(seat.id)}
                  >
                    <Coffee className="h-3 w-3 mr-1" />
                    Sit Here
                  </Button>
                </>
              );
            })()}
          </div>
        )}

        {/* Instructions */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg text-xs max-w-xs">
          <div className="font-bold mb-2 text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-600" />
            Realistic Coffee Bar Experience
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <CoffeeBean isOccupied={false} isSelected={false} isHovered={false} size={12} />
              <span>Professional L-shaped bar with concrete structure</span>
            </div>
            <div className="flex items-center gap-2">
              <CoffeeBean isOccupied={true} isSelected={false} isHovered={false} size={12} />
              <span>Golden accents and premium coffee equipment</span>
            </div>
            <div className="text-gray-600 mt-1 pt-1 border-t text-xs">
              Expert baristas: Ahmed, Muneeb & Joy behind the professional bar! ☕
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
