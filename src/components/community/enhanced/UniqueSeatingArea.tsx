
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Coffee, Wifi, Volume2, Music, Vote, Star, Heart, Zap, Sun } from 'lucide-react';

interface UniqueSeatingAreaProps {
  onSeatSelect: (seatId: string) => void;
  onViewChange: (view: 'interior') => void;
}

interface SeatZone {
  id: string;
  name: string;
  theme: string;
  atmosphere: string;
  capacity: number;
  occupied: number;
  users: Array<{
    name: string;
    mood: string;
    activity: string;
    vibe: string;
  }>;
  position: { x: number; y: number; width: number; height: number };
  specialFeature: string;
  musicGenre: string;
  ambiance: string;
}

export const UniqueSeatingArea = ({ onSeatSelect, onViewChange }: UniqueSeatingAreaProps) => {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seatingZones: SeatZone[] = [
    {
      id: 'cosmic-corner',
      name: 'Cosmic Corner',
      theme: 'Space Café',
      atmosphere: 'dreamy',
      capacity: 6,
      occupied: 4,
      users: [
        { name: 'Luna', mood: '🌙', activity: 'Stargazing poetry', vibe: 'mystical' },
        { name: 'Cosmos', mood: '✨', activity: 'Astrology reading', vibe: 'ethereal' },
        { name: 'Nebula', mood: '🌌', activity: 'Galaxy sketching', vibe: 'cosmic' },
        { name: 'Orbit', mood: '🚀', activity: 'Space documentary', vibe: 'adventurous' }
      ],
      position: { x: 15, y: 20, width: 25, height: 20 },
      specialFeature: 'Constellation ceiling projector',
      musicGenre: 'Ambient Cosmos',
      ambiance: 'purple-cosmic'
    },
    {
      id: 'retro-vinyl-lounge',
      name: 'Retro Vinyl Lounge',
      theme: 'Vintage Records',
      atmosphere: 'nostalgic',
      capacity: 8,
      occupied: 6,
      users: [
        { name: 'Vinyl', mood: '🎵', activity: 'Record collecting', vibe: 'vintage' },
        { name: 'Jazz', mood: '🎷', activity: 'Album discussions', vibe: 'smooth' },
        { name: 'Blues', mood: '🎸', activity: 'Music history', vibe: 'soulful' },
        { name: 'Melody', mood: '🎼', activity: 'Songwriting', vibe: 'creative' },
        { name: 'Rhythm', mood: '🥁', activity: 'Beat analysis', vibe: 'energetic' },
        { name: 'Harmony', mood: '🎹', activity: 'Chord theory', vibe: 'melodic' }
      ],
      position: { x: 45, y: 15, width: 30, height: 25 },
      specialFeature: 'Authentic turntable setup',
      musicGenre: 'Classic Vinyl',
      ambiance: 'amber-vintage'
    },
    {
      id: 'zen-garden-pods',
      name: 'Zen Garden Pods',
      theme: 'Mindful Serenity',
      atmosphere: 'peaceful',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Zen', mood: '🧘', activity: 'Meditation', vibe: 'tranquil' },
        { name: 'Sage', mood: '🌿', activity: 'Mindful journaling', vibe: 'wise' }
      ],
      position: { x: 80, y: 25, width: 18, height: 20 },
      specialFeature: 'Mini zen rock garden',
      musicGenre: 'Nature Sounds',
      ambiance: 'green-zen'
    },
    {
      id: 'neon-cyber-cafe',
      name: 'Neon Cyber Café',
      theme: 'Digital Future',
      atmosphere: 'energetic',
      capacity: 10,
      occupied: 8,
      users: [
        { name: 'Pixel', mood: '💻', activity: 'Coding session', vibe: 'focused' },
        { name: 'Neon', mood: '🌈', activity: 'Digital art', vibe: 'creative' },
        { name: 'Cyber', mood: '🔮', activity: 'VR exploration', vibe: 'futuristic' },
        { name: 'Matrix', mood: '🤖', activity: 'AI discussions', vibe: 'analytical' },
        { name: 'Quantum', mood: '⚡', activity: 'Tech innovation', vibe: 'inventive' },
        { name: 'Binary', mood: '🎮', activity: 'Game development', vibe: 'playful' },
        { name: 'Neural', mood: '🧠', activity: 'ML research', vibe: 'intellectual' },
        { name: 'Digital', mood: '💫', activity: 'Crypto trading', vibe: 'ambitious' }
      ],
      position: { x: 20, y: 50, width: 35, height: 25 },
      specialFeature: 'RGB LED atmosphere',
      musicGenre: 'Synthwave',
      ambiance: 'cyan-neon'
    },
    {
      id: 'forest-canopy-loft',
      name: 'Forest Canopy Loft',
      theme: 'Elevated Nature',
      atmosphere: 'inspiring',
      capacity: 6,
      occupied: 3,
      users: [
        { name: 'Forest', mood: '🌳', activity: 'Nature writing', vibe: 'grounded' },
        { name: 'Canopy', mood: '🍃', activity: 'Botanical study', vibe: 'curious' },
        { name: 'Branch', mood: '🦋', activity: 'Environmental blog', vibe: 'passionate' }
      ],
      position: { x: 60, y: 50, width: 25, height: 20 },
      specialFeature: 'Living wall installation',
      musicGenre: 'Forest Ambience',
      ambiance: 'emerald-forest'
    },
    {
      id: 'sunset-terrace',
      name: 'Sunset Terrace',
      theme: 'Golden Hour',
      atmosphere: 'romantic',
      capacity: 8,
      occupied: 5,
      users: [
        { name: 'Sunset', mood: '🌅', activity: 'Poetry reading', vibe: 'romantic' },
        { name: 'Golden', mood: '✨', activity: 'Photo editing', vibe: 'artistic' },
        { name: 'Twilight', mood: '🌄', activity: 'Date night', vibe: 'intimate' },
        { name: 'Horizon', mood: '🧡', activity: 'Love letters', vibe: 'tender' },
        { name: 'Glow', mood: '💛', activity: 'Sunset painting', vibe: 'inspired' }
      ],
      position: { x: 25, y: 80, width: 30, height: 15 },
      specialFeature: 'Color-changing sunset lights',
      musicGenre: 'Acoustic Romance',
      ambiance: 'orange-sunset'
    },
    {
      id: 'crystal-cave-booth',
      name: 'Crystal Cave Booth',
      theme: 'Mystical Gems',
      atmosphere: 'mystical',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Crystal', mood: '💎', activity: 'Gem collection', vibe: 'magical' },
        { name: 'Prism', mood: '🔮', activity: 'Tarot reading', vibe: 'intuitive' }
      ],
      position: { x: 70, y: 75, width: 20, height: 18 },
      specialFeature: 'Illuminated crystal display',
      musicGenre: 'Mystical Chimes',
      ambiance: 'violet-crystal'
    }
  ];

  const getZoneStyle = (zone: SeatZone) => {
    const baseStyle = "absolute cursor-pointer transition-all duration-500 rounded-2xl border-2 shadow-xl";
    const hoverStyle = hoveredZone === zone.id ? 'scale-105 shadow-2xl z-20' : 'hover:scale-102 hover:shadow-xl';
    
    const ambianceStyles = {
      'purple-cosmic': 'bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-purple-400/60',
      'amber-vintage': 'bg-gradient-to-br from-amber-900/40 to-orange-900/40 border-amber-400/60',
      'green-zen': 'bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border-emerald-400/60',
      'cyan-neon': 'bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-cyan-400/60',
      'emerald-forest': 'bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-400/60',
      'orange-sunset': 'bg-gradient-to-br from-orange-900/40 to-red-900/40 border-orange-400/60',
      'violet-crystal': 'bg-gradient-to-br from-violet-900/40 to-purple-900/40 border-violet-400/60'
    };

    return `${baseStyle} ${hoverStyle} ${ambianceStyles[zone.ambiance as keyof typeof ambianceStyles]}`;
  };

  const getOccupancyColor = (occupied: number, capacity: number) => {
    const ratio = occupied / capacity;
    if (ratio < 0.5) return 'text-green-300';
    if (ratio < 0.8) return 'text-yellow-300';
    return 'text-red-300';
  };

  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '☀️ Good Morning, Coffee Explorer!';
    if (hour < 17) return '🌤️ Good Afternoon, Café Adventurer!';
    return '🌙 Good Evening, Night Owl!';
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-cyan-500/10 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-emerald-500/10 rounded-full animate-pulse delay-2000"></div>
      </div>

      {/* Enhanced Header */}
      <div className="absolute top-4 left-4 right-4 z-30 space-y-3">
        <div className="flex justify-between items-start">
          <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              {getTimeBasedGreeting()}
            </h1>
            <p className="text-white/80 text-sm">Choose your perfect seating adventure</p>
            <p className="text-white/60 text-xs">{currentTime.toLocaleTimeString()}</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Badge className="bg-purple-600/80 text-white border-purple-400/50">
              <Music className="h-4 w-4 mr-2" />
              7 Unique Zones
            </Badge>
            <Badge className="bg-cyan-600/80 text-white border-cyan-400/50">
              <Users className="h-4 w-4 mr-2" />
              30 Fellow Explorers
            </Badge>
          </div>
        </div>

        {/* Live Music Status */}
        <div className="bg-gradient-to-r from-purple-900/80 to-pink-900/80 backdrop-blur-lg rounded-xl p-3 border border-purple-400/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                <Music className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">🎵 "Ethereal Dreams" - Cosmic Lounge Mix</h3>
                <p className="text-purple-200 text-sm">DJ Luna spinning in Cosmic Corner • 23 votes • All zones synced</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Vote className="h-5 w-5 text-purple-300" />
              <span className="text-purple-200 font-bold">Vote Next</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Seating Zones */}
      <div className="relative w-full h-full pt-32">
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
            onClick={() => onSeatSelect(zone.id)}
          >
            <div className="p-4 h-full flex flex-col justify-between relative overflow-hidden">
              {/* Zone Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-lg">{zone.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-yellow-300 text-sm font-bold">4.9</span>
                  </div>
                </div>
                
                <p className="text-white/80 text-sm italic">"{zone.theme}"</p>
                
                <div className="flex items-center gap-2 text-xs">
                  <Badge className="bg-white/20 text-white border-white/30">
                    {zone.musicGenre}
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30">
                    {zone.specialFeature}
                  </Badge>
                </div>

                <div className={`flex items-center gap-2 text-sm ${getOccupancyColor(zone.occupied, zone.capacity)}`}>
                  <Users className="h-4 w-4" />
                  <span className="font-bold">{zone.occupied}/{zone.capacity}</span>
                  <span className="text-white/60">explorers</span>
                </div>
              </div>

              {/* User Avatars with Enhanced Display */}
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {zone.users.slice(0, 4).map((user, index) => (
                    <div
                      key={index}
                      className="relative group"
                    >
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center text-sm border border-white/30 hover:scale-110 transition-transform">
                        {user.mood}
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                        {user.name}: {user.activity}
                      </div>
                    </div>
                  ))}
                  {zone.users.length > 4 && (
                    <div className="w-8 h-8 bg-white/30 text-white rounded-full flex items-center justify-center text-xs border border-white/30">
                      +{zone.users.length - 4}
                    </div>
                  )}
                </div>

                {/* Zone Stats */}
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>🎵 {zone.atmosphere}</span>
                  <span>💫 {zone.users.length} vibes</span>
                </div>
              </div>

              {/* Hover Effect Glow */}
              {hoveredZone === zone.id && (
                <div className="absolute inset-0 bg-white/10 rounded-2xl animate-pulse pointer-events-none" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Zone Details Popup */}
      {hoveredZone && (
        <div className="absolute bottom-4 left-4 right-4 z-30 bg-black/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 transform transition-all duration-300">
          {(() => {
            const zone = seatingZones.find(z => z.id === hoveredZone);
            if (!zone) return null;
            
            return (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">{zone.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-600 text-white">
                      <Zap className="h-3 w-3 mr-1" />
                      {zone.atmosphere}
                    </Badge>
                    <Badge className="bg-cyan-600 text-white">
                      <Heart className="h-3 w-3 mr-1" />
                      {zone.musicGenre}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">✨ Special Features</h4>
                    <p className="text-white/80 text-sm mb-3">{zone.specialFeature}</p>
                    
                    <h4 className="font-semibold text-white mb-2">🎭 Current Vibe</h4>
                    <p className="text-white/80 text-sm italic">"{zone.theme}" • Perfect for {zone.atmosphere} moments</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">👥 Fellow Explorers</h4>
                    <div className="space-y-1 max-h-20 overflow-y-auto">
                      {zone.users.map((user, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-white/80">
                          <span className="text-base">{user.mood}</span>
                          <span className="font-medium text-white">{user.name}</span>
                          <span className="text-white/60">• {user.activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => onSeatSelect(zone.id)}
                  className="w-full mt-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white py-3 text-lg"
                >
                  <Star className="h-5 w-5 mr-2" />
                  Join {zone.name} Adventure
                </Button>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
