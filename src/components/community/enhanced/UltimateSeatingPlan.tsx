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

// Modern Coffee Bar Structure - Based on Reference Image
const ModernCoffeeBar = () => {
  return (
    <div className="absolute">
      {/* Main L-Shaped Bar Structure */}
      <div className="absolute top-[25%] left-[25%] w-[50%] h-[20%]">
        {/* Horizontal Bar Section */}
        <div className="absolute top-0 left-0 w-[80%] h-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-2xl">
          {/* Bar Counter Top */}
          <div className="absolute top-0 left-0 w-full h-[25%] bg-gradient-to-r from-stone-200 to-stone-300 rounded-t-lg border-b border-stone-400">
            <div className="w-full h-full bg-gradient-to-b from-white/40 to-transparent rounded-t-lg"></div>
          </div>
          
          {/* Coffee Equipment Area */}
          <div className="absolute top-[25%] left-0 w-full h-[75%] bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-lg">
            {/* Espresso Machine */}
            <div className="absolute top-2 left-[20%] w-8 h-6 bg-gradient-to-b from-gray-200 to-gray-400 rounded shadow-xl">
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            
            {/* Coffee Grinder */}
            <div className="absolute top-2 left-[40%] w-6 h-8 bg-gradient-to-b from-gray-700 to-black rounded shadow-lg">
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-600 rounded-full"></div>
            </div>
            
            {/* Coffee Storage */}
            <div className="absolute top-2 left-[60%] w-4 h-5 bg-gradient-to-b from-amber-700 to-amber-900 rounded shadow-lg"></div>
            <div className="absolute top-2 left-[70%] w-4 h-5 bg-gradient-to-b from-amber-700 to-amber-900 rounded shadow-lg"></div>
          </div>
          
          {/* Under-Counter Lighting */}
          <div className="absolute bottom-0 left-2 right-2 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80 rounded-full"></div>
        </div>

        {/* Vertical L-Section */}
        <div className="absolute top-0 right-0 w-[25%] h-[120%] bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-2xl">
          {/* Counter Top */}
          <div className="absolute top-0 left-0 w-full h-[20%] bg-gradient-to-r from-stone-200 to-stone-300 rounded-t-lg border-b border-stone-400">
            <div className="w-full h-full bg-gradient-to-b from-white/40 to-transparent rounded-t-lg"></div>
          </div>
          
          {/* Equipment Storage */}
          <div className="absolute top-[20%] left-0 w-full h-[80%] bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-lg">
            {/* Point of Sale System */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-gradient-to-b from-gray-300 to-gray-600 rounded shadow-lg">
              <div className="absolute top-0.5 left-0.5 right-0.5 h-2 bg-blue-400 rounded opacity-80"></div>
            </div>
          </div>
          
          {/* Under-Counter Lighting */}
          <div className="absolute bottom-0 left-1 right-1 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80 rounded-full"></div>
        </div>
      </div>

      {/* Coffee Sign */}
      <div className="absolute top-[15%] left-[35%] bg-gray-800 text-white px-4 py-2 rounded shadow-2xl">
        <div className="text-xl font-bold tracking-widest">COFFEE</div>
      </div>
    </div>
  );
};

// Window Structure with Seating
const WindowWithSeating = () => {
  return (
    <div className="absolute top-[20%] left-[5%] w-[15%] h-[35%]">
      {/* Window Frame */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg shadow-2xl">
        {/* Window Glass - Open View */}
        <div className="absolute inset-2 bg-gradient-to-b from-sky-200 via-sky-100 to-green-100 rounded-md overflow-hidden">
          {/* Sky */}
          <div className="absolute top-0 left-0 right-0 h-2/3 bg-gradient-to-b from-sky-300 to-sky-200">
            <div className="absolute top-2 left-3 w-6 h-2 bg-white rounded-full opacity-80"></div>
            <div className="absolute top-3 right-4 w-4 h-1.5 bg-white rounded-full opacity-70"></div>
          </div>
          
          {/* Street Level */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-green-300 to-green-200">
            <div className="absolute bottom-1 left-1 w-2 h-6 bg-green-700 rounded-full"></div>
            <div className="absolute bottom-1 right-2 w-1.5 h-4 bg-green-800 rounded-full"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-400"></div>
          </div>
        </div>
        
        {/* Window Frame Details */}
        <div className="absolute top-1/2 left-1 right-1 h-0.5 bg-gray-600"></div>
        <div className="absolute left-1/2 top-1 bottom-1 w-0.5 bg-gray-600"></div>
      </div>

      {/* Window Counter */}
      <div className="absolute bottom-[-8%] left-0 w-full h-[15%] bg-gradient-to-r from-stone-200 to-stone-300 rounded shadow-lg border border-stone-400">
        <div className="absolute inset-1 bg-gradient-to-r from-white/40 to-transparent rounded"></div>
        {/* Under-Counter Lighting */}
        <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60 rounded-full"></div>
      </div>
    </div>
  );
};

// Professional Barista Avatars - Behind the Bar
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
      className="absolute z-30 cursor-pointer group"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      title={`${name} - Expert Barista`}
    >
      <div className="relative">
        <div className="relative w-10 h-10 rounded-full border-2 border-amber-600 shadow-xl overflow-hidden group-hover:scale-110 transition-all duration-300"
             style={{
               background: 'linear-gradient(135deg, #8B4513, #A0522D)',
               boxShadow: '0 0 15px rgba(139, 69, 19, 0.4)'
             }}>
          <img 
            src={getAvatarImage(name)} 
            alt={name}
            className="w-full h-full object-cover rounded-full"
          />
          
          <div className="absolute inset-0 rounded-full border border-amber-500 animate-pulse opacity-50" />
        </div>
        
        <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-700 to-orange-700 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-lg whitespace-nowrap">
          ☕ {name}
        </div>
        
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gradient-to-r from-green-500 to-emerald-500 border border-white rounded-full animate-pulse shadow-md">
          <div className="w-0.5 h-0.5 bg-white rounded-full m-0.5" />
        </div>
      </div>
    </div>
  );
};

// Modern Bar Stool - Minimalist Black Design
const ModernBarStool = ({ x, y }: { x: number; y: number }) => (
  <div className="absolute" style={{ left: `${x}%`, top: `${y}%`, width: '3%', height: '4%' }}>
    {/* Stool Seat */}
    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-gray-800 to-black rounded-lg shadow-xl border border-gray-700">
      <div className="absolute inset-0.5 bg-gradient-to-b from-gray-700/30 to-transparent rounded-lg"></div>
    </div>
    
    {/* Stool Legs - Modern thin frame */}
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
      {/* Four legs in modern style */}
      <div className="absolute bottom-0 w-0.5 h-5 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full transform -translate-x-1 -translate-y-0"></div>
      <div className="absolute bottom-0 w-0.5 h-5 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full transform translate-x-1 -translate-y-0"></div>
      <div className="absolute bottom-0 w-0.5 h-3 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full transform -translate-x-0.5 translate-y-1"></div>
      <div className="absolute bottom-0 w-0.5 h-3 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full transform translate-x-0.5 translate-y-1"></div>
    </div>
  </div>
);

// Modern Round Dining Table
const ModernDiningTable = ({ x, y }: { x: number; y: number }) => (
  <div className="absolute" style={{ left: `${x}%`, top: `${y}%`, width: '8%', height: '8%' }}>
    {/* Table Base */}
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-gradient-to-b from-gray-700 to-gray-900 rounded-sm shadow-lg"></div>
    {/* Table Top */}
    <div className="absolute inset-0 bg-gradient-to-br from-stone-100 to-stone-300 rounded-full shadow-2xl border-2 border-stone-400">
      <div className="absolute inset-2 bg-gradient-to-br from-white/40 to-transparent rounded-full"></div>
    </div>
  </div>
);

// Modern Dining Chair - Minimalist Design
const ModernDiningChair = ({ x, y, rotation = 0 }: { x: number; y: number; rotation?: number }) => (
  <div 
    className="absolute" 
    style={{ 
      left: `${x}%`, 
      top: `${y}%`, 
      width: '3.5%', 
      height: '3.5%',
      transform: `rotate(${rotation}deg)`
    }}
  >
    {/* Chair Seat */}
    <div className="absolute bottom-2 left-0 right-0 h-1 bg-gradient-to-b from-gray-700 to-gray-900 rounded shadow-md">
      <div className="absolute inset-x-0.5 top-0 h-0.5 bg-gradient-to-b from-gray-600/40 to-transparent rounded"></div>
    </div>
    
    {/* Chair Back */}
    <div className="absolute top-0 left-1/4 right-1/4 h-3 bg-gradient-to-b from-gray-700 to-gray-900 rounded-t shadow-md">
      <div className="absolute inset-x-0.5 top-0 h-1 bg-gradient-to-b from-gray-600/30 to-transparent rounded-t"></div>
    </div>
    
    {/* Chair Legs */}
    <div className="absolute bottom-0 left-1 w-0.5 h-2 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full"></div>
    <div className="absolute bottom-0 right-1 w-0.5 h-2 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full"></div>
    <div className="absolute bottom-0 left-1 w-0.5 h-2 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full transform translate-x-2"></div>
    <div className="absolute bottom-0 right-1 w-0.5 h-2 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full transform -translate-x-2"></div>
  </div>
);

// Seating Layout - Better Organized
const CAFE_SEATS = [
  // Window Bar Seats - Two seats at the window counter
  { 
    id: 'window-seat-1', x: 8, y: 47, w: 3, h: 3, type: 'window-bar', zone: 'window',
    ambientSound: 'street-ambience', musicZone: 'ambient', vibe: 'peaceful'
  },
  { 
    id: 'window-seat-2', x: 14, y: 47, w: 3, h: 3, type: 'window-bar', zone: 'window',
    ambientSound: 'street-ambience', musicZone: 'ambient', vibe: 'contemplative'
  },

  // Main L-Shaped Bar Counter Seats - Horizontal Section
  { 
    id: 'main-bar-1', x: 28, y: 52, w: 3, h: 3, type: 'bar', zone: 'counter',
    ambientSound: 'espresso-machine', musicZone: 'energetic', vibe: 'social'
  },
  { 
    id: 'main-bar-2', x: 35, y: 52, w: 3, h: 3, type: 'bar', zone: 'counter',
    ambientSound: 'espresso-machine', musicZone: 'energetic', vibe: 'social'
  },
  { 
    id: 'main-bar-3', x: 42, y: 52, w: 3, h: 3, type: 'bar', zone: 'counter',
    ambientSound: 'espresso-machine', musicZone: 'energetic', vibe: 'social'
  },
  { 
    id: 'main-bar-4', x: 49, y: 52, w: 3, h: 3, type: 'bar', zone: 'counter',
    ambientSound: 'espresso-machine', musicZone: 'energetic', vibe: 'social'
  },
  { 
    id: 'main-bar-5', x: 56, y: 52, w: 3, h: 3, type: 'bar', zone: 'counter',
    ambientSound: 'espresso-machine', musicZone: 'energetic', vibe: 'social'
  },

  // L-Shaped Bar Vertical Section Seats
  { 
    id: 'side-bar-1', x: 70, y: 28, w: 3, h: 3, type: 'bar', zone: 'counter',
    ambientSound: 'espresso-machine', musicZone: 'energetic', vibe: 'social'
  },
  { 
    id: 'side-bar-2', x: 70, y: 35, w: 3, h: 3, type: 'bar', zone: 'counter',
    ambientSound: 'espresso-machine', musicZone: 'energetic', vibe: 'social'
  },

  // Organized Dining Tables - Front Row
  { 
    id: 'table-1', x: 25, y: 70, w: 4, h: 4, type: 'table', zone: 'dining',
    ambientSound: 'gentle-chatter', musicZone: 'focus', vibe: 'collaborative'
  },
  { 
    id: 'table-2', x: 37, y: 70, w: 4, h: 4, type: 'table', zone: 'dining',
    ambientSound: 'gentle-chatter', musicZone: 'focus', vibe: 'productive'
  },
  { 
    id: 'table-3', x: 49, y: 70, w: 4, h: 4, type: 'table', zone: 'dining',
    ambientSound: 'gentle-chatter', musicZone: 'focus', vibe: 'social'
  },
  { 
    id: 'table-4', x: 61, y: 70, w: 4, h: 4, type: 'table', zone: 'dining',
    ambientSound: 'gentle-chatter', musicZone: 'focus', vibe: 'collaborative'
  },

  // Back Row Tables
  { 
    id: 'table-5', x: 25, y: 85, w: 4, h: 4, type: 'table', zone: 'dining',
    ambientSound: 'gentle-chatter', musicZone: 'focus', vibe: 'quiet'
  },
  { 
    id: 'table-6', x: 37, y: 85, w: 4, h: 4, type: 'table', zone: 'dining',
    ambientSound: 'gentle-chatter', musicZone: 'focus', vibe: 'study'
  },
  { 
    id: 'table-7', x: 49, y: 85, w: 4, h: 4, type: 'table', zone: 'dining',
    ambientSound: 'gentle-chatter', musicZone: 'focus', vibe: 'work'
  },
  { 
    id: 'table-8', x: 61, y: 85, w: 4, h: 4, type: 'table', zone: 'dining',
    ambientSound: 'gentle-chatter', musicZone: 'focus', vibe: 'meeting'
  },

  // Corner Lounge Area
  { 
    id: 'lounge-1', x: 80, y: 70, w: 4, h: 4, type: 'lounge', zone: 'lounge',
    ambientSound: 'nature', musicZone: 'chill', vibe: 'relaxed'
  },
  { 
    id: 'lounge-2', x: 80, y: 85, w: 4, h: 4, type: 'lounge', zone: 'lounge',
    ambientSound: 'nature', musicZone: 'chill', vibe: 'comfortable'
  }
];

// Baristas positioned behind the L-shaped bar
const BARISTAS = [
  { name: 'Ahmed', position: { x: 45, y: 35 } },   // Behind main bar center
  { name: 'Muneeb', position: { x: 35, y: 35 } },  // Behind main bar left
  { name: 'Joy', position: { x: 65, y: 32 } }      // Behind vertical bar section
];

// Zone Colors
const ZONE_COLORS = {
  counter: { 
    bg: 'rgba(139, 69, 19, 0.15)', 
    border: '#8B4513', 
    name: '☕ Coffee Counter',
    accent: 'rgba(139, 69, 19, 0.6)'
  },
  window: { 
    bg: 'rgba(34, 139, 34, 0.15)', 
    border: '#228B22', 
    name: '🪟 Window Seating',
    accent: 'rgba(34, 139, 34, 0.6)'
  },
  dining: { 
    bg: 'rgba(218, 165, 32, 0.15)', 
    border: '#DAA520', 
    name: '🍽️ Dining Tables',
    accent: 'rgba(218, 165, 32, 0.6)'
  },
  lounge: { 
    bg: 'rgba(70, 130, 180, 0.15)', 
    border: '#4682B4', 
    name: '🛋️ Lounge Area',
    accent: 'rgba(70, 130, 180, 0.6)'
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
          <p className="text-amber-800 mb-3">Modern L-shaped bar • Window seating • Expert baristas behind the counter!</p>
          
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-6">
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
          isFullscreen ? 'h-screen' : hideHeader ? 'h-full' : 'h-[calc(100vh-220px)]'
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

        {/* Modern L-Shaped Coffee Bar */}
        <ModernCoffeeBar />

        {/* Modern Furniture - Better Organized Layout */}
        
        {/* Window Bar Stools */}
        <ModernBarStool x={8} y={55} />
        <ModernBarStool x={14} y={55} />

        {/* Main L-Shaped Bar Stools - Horizontal Section */}
        <ModernBarStool x={28} y={60} />
        <ModernBarStool x={35} y={60} />
        <ModernBarStool x={42} y={60} />
        <ModernBarStool x={49} y={60} />
        <ModernBarStool x={56} y={60} />

        {/* L-Shaped Bar Stools - Vertical Section */}
        <ModernBarStool x={78} y={28} />
        <ModernBarStool x={78} y={35} />

        {/* Organized Dining Tables - Front Row */}
        <ModernDiningTable x={25} y={70} />
        <ModernDiningTable x={37} y={70} />
        <ModernDiningTable x={49} y={70} />
        <ModernDiningTable x={61} y={70} />

        {/* Back Row Tables */}
        <ModernDiningTable x={25} y={85} />
        <ModernDiningTable x={37} y={85} />
        <ModernDiningTable x={49} y={85} />
        <ModernDiningTable x={61} y={85} />

        {/* Dining Chairs - Front Row Tables */}
        <ModernDiningChair x={22} y={67} rotation={45} />
        <ModernDiningChair x={28} y={73} rotation={225} />
        <ModernDiningChair x={25} y={66} rotation={0} />
        <ModernDiningChair x={25} y={74} rotation={180} />

        <ModernDiningChair x={34} y={67} rotation={45} />
        <ModernDiningChair x={40} y={73} rotation={225} />
        <ModernDiningChair x={37} y={66} rotation={0} />
        <ModernDiningChair x={37} y={74} rotation={180} />

        <ModernDiningChair x={46} y={67} rotation={45} />
        <ModernDiningChair x={52} y={73} rotation={225} />
        <ModernDiningChair x={49} y={66} rotation={0} />
        <ModernDiningChair x={49} y={74} rotation={180} />

        <ModernDiningChair x={58} y={67} rotation={45} />
        <ModernDiningChair x={64} y={73} rotation={225} />
        <ModernDiningChair x={61} y={66} rotation={0} />
        <ModernDiningChair x={61} y={74} rotation={180} />

        {/* Professional Baristas - Behind the Bar */}
        {BARISTAS.map((barista) => (
          <BaristaAvatar
            key={barista.name}
            name={barista.name}
            position={barista.position}
          />
        ))}

        {/* Zone Overlays */}
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

        {/* Coffee Bean Seats */}
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
                    : 'rgba(245, 222, 179, 0.1)',
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
                  size={isFullscreen ? 24 : 18}
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
            Modern Coffee Experience
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <CoffeeBean isOccupied={false} isSelected={false} isHovered={false} size={12} />
              <span>Window seating with street views</span>
            </div>
            <div className="flex items-center gap-2">
              <CoffeeBean isOccupied={true} isSelected={false} isHovered={false} size={12} />
              <span>L-shaped bar with modern furniture</span>
            </div>
            <div className="text-gray-600 mt-1 pt-1 border-t text-xs">
              Expert baristas: Ahmed, Muneeb & Joy working behind the bar! ☕
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
