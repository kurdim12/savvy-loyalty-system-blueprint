import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Coffee, Music, MessageCircle, MapPin, Volume2, Wifi, Star, Headphones, Play, Heart, Crown, Gamepad2 } from 'lucide-react';

interface SeatArea {
  id: string;
  name: string;
  type: 'counter' | 'table' | 'lounge' | 'workspace';
  capacity: number;
  occupied: number;
  users: Array<{
    name: string;
    mood: string;
    activity: string;
    musicPreference?: string;
    isPlaying?: boolean;
    isDJ?: boolean;
  }>;
  position: { x: number; y: number; width: number; height: number };
  musicZone?: string;
  currentTrack?: string;
  premiumFeatures?: string[];
  activeGames?: string[];
  weatherEffect?: string;
}

interface EnhancedFloorPlanProps {
  onSeatSelect: (seatId: string) => void;
  onStartPrivateChat: (userId: string) => void;
}

export const EnhancedFloorPlan = ({ onSeatSelect, onStartPrivateChat }: EnhancedFloorPlanProps) => {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);
  const [showMusicRequest, setShowMusicRequest] = useState(false);
  const [currentTrack] = useState({
    name: 'Café Jazz Collective',
    artist: 'Live DJ Mix',
    isPlaying: true,
    currentDJ: 'Maya S.'
  });

  const seatAreas: SeatArea[] = [
    {
      id: 'counter-1',
      name: 'Coffee Counter',
      type: 'counter',
      capacity: 6,
      occupied: 4,
      users: [
        { name: 'Sarah M.', mood: '😊', activity: 'Ordering espresso', musicPreference: 'Jazz', isPlaying: true },
        { name: 'Mike R.', mood: '💻', activity: 'Working on laptop', musicPreference: 'Lo-Fi' },
        { name: 'Emma L.', mood: '📱', activity: 'Live streaming', musicPreference: 'Acoustic', isDJ: true },
        { name: 'Chris K.', mood: '🎮', activity: 'Playing trivia', musicPreference: 'Upbeat' }
      ],
      position: { x: 15, y: 20, width: 25, height: 8 },
      musicZone: 'Upbeat Coffee Vibes',
      currentTrack: 'Energetic Morning Mix',
      premiumFeatures: ['Live Barista Chat', 'Premium Coffee Menu', 'DJ Controls'],
      activeGames: ['Coffee Trivia', 'Word Game'],
      weatherEffect: 'Bright morning light'
    },
    {
      id: 'window-table-1',
      name: 'Window Table',
      type: 'table',
      capacity: 4,
      occupied: 3,
      users: [
        { name: 'Alex K.', mood: '☕', activity: 'Coffee tasting', musicPreference: 'Classical' },
        { name: 'Jordan P.', mood: '📖', activity: 'Reading novel', musicPreference: 'Ambient' },
        { name: 'Riley T.', mood: '🧘', activity: 'Meditation', musicPreference: 'Nature Sounds' }
      ],
      position: { x: 10, y: 40, width: 18, height: 15 },
      musicZone: 'Peaceful Reading Zone',
      currentTrack: 'Soft Piano Melodies',
      premiumFeatures: ['Street View', 'Natural Light', 'Book Club Access', 'Sound Isolation'],
      activeGames: ['Silent Reading Challenge'],
      weatherEffect: 'Golden hour glow'
    },
    {
      id: 'center-table-1',
      name: 'Social Hub',
      type: 'table',
      capacity: 6,
      occupied: 5,
      users: [
        { name: 'Maya S.', mood: '🗣️', activity: 'Group discussion', musicPreference: 'Collaborative Playlist', isDJ: true },
        { name: 'Casey T.', mood: '☕', activity: 'Coffee meeting', musicPreference: 'Background Jazz' },
        { name: 'Zoe W.', mood: '📝', activity: 'Taking notes', musicPreference: 'Focus Beats' },
        { name: 'Ryan H.', mood: '😄', activity: 'Sharing stories', musicPreference: 'Feel Good' },
        { name: 'Taylor L.', mood: '🎵', activity: 'DJ queuing', musicPreference: 'Electronic', isPlaying: true }
      ],
      position: { x: 35, y: 35, width: 20, height: 20 },
      musicZone: 'Collaborative DJ Zone',
      currentTrack: 'Community Voted Mix',
      premiumFeatures: ['Group Spotify Control', 'Collaborative Playlists', 'Voice Chat', 'Live DJ Mode'],
      activeGames: ['Group Trivia', 'Music Battle', 'Collaborative Stories'],
      weatherEffect: 'Dynamic party lighting'
    },
    {
      id: 'lounge-1',
      name: 'Premium Lounge',
      type: 'lounge',
      capacity: 6,
      occupied: 3,
      users: [
        { name: 'Luna D.', mood: '🎵', activity: 'Curating playlist', musicPreference: 'Smooth Jazz', isDJ: true },
        { name: 'Noah G.', mood: '🌙', activity: 'Evening chill', musicPreference: 'Chill Lounge' },
        { name: 'Avery M.', mood: '✨', activity: 'Virtual ordering', musicPreference: 'Ethereal' }
      ],
      position: { x: 65, y: 25, width: 25, height: 25 },
      musicZone: 'Hi-Fi Audio Experience',
      currentTrack: 'Audiophile Jazz Collection',
      premiumFeatures: ['Hi-Fi Audio', 'Personalized Playlists', 'Mood Lighting', 'Premium Drinks Menu'],
      activeGames: ['Music Discovery', 'Mood Matching'],
      weatherEffect: 'Warm fireplace ambiance'
    },
    {
      id: 'workspace-1',
      name: 'Focus Zone',
      type: 'workspace',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Ivy C.', mood: '💼', activity: 'Deep work', musicPreference: 'Focus/Study' },
        { name: 'Blake R.', mood: '🧠', activity: 'Problem solving', musicPreference: 'Instrumental' }
      ],
      position: { x: 15, y: 65, width: 25, height: 15 },
      musicZone: 'Concentration Station',
      currentTrack: 'Deep Focus Instrumentals',
      premiumFeatures: ['Noise Canceling', 'Study Playlists', 'Productivity Tools', 'Pomodoro Timer'],
      activeGames: ['Focus Challenge', 'Brain Training'],
      weatherEffect: 'Soft focused lighting'
    },
    {
      id: 'workspace-2',
      name: 'Innovation Hub',
      type: 'workspace',
      capacity: 8,
      occupied: 4,
      users: [
        { name: 'Sam B.', mood: '💡', activity: 'Brainstorming', musicPreference: 'Creative Flow' },
        { name: 'Parker M.', mood: '📊', activity: 'Data analysis', musicPreference: 'Instrumental' },
        { name: 'River L.', mood: '🤝', activity: 'Team meeting', musicPreference: 'Background' },
        { name: 'Quinn D.', mood: '🎨', activity: 'Creative work', musicPreference: 'Inspiring', isPlaying: true }
      ],
      position: { x: 60, y: 60, width: 30, height: 20 },
      musicZone: 'Creative Collaboration',
      currentTrack: 'Innovation Soundscape',
      premiumFeatures: ['Team Playlists', 'Screen Sharing', 'Whiteboard Access', 'Creative Tools'],
      activeGames: ['Innovation Challenge', 'Team Building', 'Idea Generation'],
      weatherEffect: 'Energizing bright lights'
    }
  ];

  const getAreaColor = (type: string) => {
    switch (type) {
      case 'counter': return 'bg-amber-500/40 border-amber-500/80 hover:bg-amber-500/60';
      case 'table': return 'bg-blue-500/40 border-blue-500/80 hover:bg-blue-500/60';
      case 'lounge': return 'bg-purple-500/40 border-purple-500/80 hover:bg-purple-500/60';
      case 'workspace': return 'bg-green-500/40 border-green-500/80 hover:bg-green-500/60';
      default: return 'bg-gray-500/40 border-gray-500/80 hover:bg-gray-500/60';
    }
  };

  const getOccupancyColor = (occupied: number, capacity: number) => {
    const ratio = occupied / capacity;
    if (ratio < 0.5) return 'text-green-200';
    if (ratio < 0.8) return 'text-yellow-200';
    return 'text-red-200';
  };

  const handleRequestTrack = () => {
    console.log('Opening enhanced Spotify integration');
    setShowMusicRequest(!showMusicRequest);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-amber-900/20 to-orange-900/30">
      {/* Background Café Interior */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lovable-uploads/1cb7e4f9-a55e-4a48-aa05-f7e259a8657b.png')`
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Enhanced Top Controls */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <div className="flex justify-between items-center">
          <Badge className="bg-white/90 text-[#8B4513] border-white/50 backdrop-blur-sm text-lg px-4 py-2">
            <Coffee className="h-5 w-5 mr-2" />
            Raw Smith Virtual Café - Enhanced Edition
          </Badge>
          
          <div className="flex gap-3">
            <Button
              onClick={handleRequestTrack}
              className="bg-white/90 text-[#8B4513] border-white/50 hover:bg-white/80 backdrop-blur-sm px-4 py-2"
            >
              <Music className="h-5 w-5 mr-2" />
              DJ Controls
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Spotify Control Panel */}
      {showMusicRequest && (
        <div className="absolute top-20 right-4 z-30">
          <Card className="w-96 bg-white/95 backdrop-blur-sm border-white/50 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="h-6 w-6 text-purple-600" />
                <h3 className="font-bold text-[#8B4513] text-lg">Enhanced DJ Controls</h3>
              </div>
              
              {/* Live DJ Status */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-4 border-l-4 border-purple-500">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-purple-700">Live DJ: {currentTrack.currentDJ}</p>
                    <p className="text-sm text-purple-600">{currentTrack.name}</p>
                  </div>
                  <Button size="sm" className="bg-purple-600 text-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Play className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 h-2 bg-purple-200 rounded-full">
                    <div className="w-2/3 h-full bg-purple-600 rounded-full"></div>
                  </div>
                  <span className="text-xs text-purple-600">2:34</span>
                </div>
              </div>
              
              {/* Enhanced Music Zones */}
              <div className="space-y-3 mb-4">
                <h4 className="text-sm font-semibold text-[#8B4513]">Active Music Zones & DJs</h4>
                <div className="text-sm space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <Crown className="h-3 w-3 text-purple-600" />
                      <span className="text-[#8B4513]">Social Hub</span>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">Live DJ Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-[#8B4513]">Premium Lounge</span>
                    <Badge className="bg-blue-100 text-blue-800">Hi-Fi Jazz</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-[#8B4513]">Focus Zone</span>
                    <Badge className="bg-green-100 text-green-800">Study Mode</Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={handleRequestTrack}
                  size="sm" 
                  className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white"
                >
                  <Music className="h-4 w-4 mr-1" />
                  Request Track
                </Button>
                <Button 
                  size="sm" 
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Crown className="h-4 w-4 mr-1" />
                  Become DJ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Interactive Seating Areas with Enhanced Features */}
      {seatAreas.map((area) => (
        <div
          key={area.id}
          className={`absolute cursor-pointer transition-all duration-300 rounded-xl border-3 backdrop-blur-sm shadow-lg ${getAreaColor(area.type)} ${
            hoveredSeat === area.id 
              ? 'scale-110 shadow-2xl ring-4 ring-white/50 z-30' 
              : 'hover:scale-105 hover:shadow-xl z-20'
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
          <div className="p-4 h-full flex flex-col justify-between text-white">
            <div>
              <h4 className="font-bold text-lg mb-2 drop-shadow-lg text-white">{area.name}</h4>
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <div className={`flex items-center gap-2 text-sm font-semibold ${getOccupancyColor(area.occupied, area.capacity)}`}>
                  <Users className="h-4 w-4" />
                  <span>{area.occupied}/{area.capacity}</span>
                </div>
                {area.type === 'workspace' && <Wifi className="h-4 w-4 text-white" />}
                {area.type === 'lounge' && <Volume2 className="h-4 w-4 text-white" />}
                {area.type === 'counter' && <Coffee className="h-4 w-4 text-white" />}
                {area.musicZone && <Music className="h-4 w-4 text-white" />}
                {area.activeGames && area.activeGames.length > 0 && <Gamepad2 className="h-4 w-4 text-white" />}
                {area.users.some(u => u.isDJ) && <Crown className="h-4 w-4 text-yellow-300" />}
              </div>
              
              {/* Enhanced Zone Indicators */}
              <div className="space-y-1">
                {area.musicZone && (
                  <Badge className="bg-black/50 text-white text-xs border-white/30">
                    🎵 {area.musicZone}
                  </Badge>
                )}
                {area.currentTrack && (
                  <Badge className="bg-black/50 text-white text-xs border-white/30">
                    ♪ {area.currentTrack}
                  </Badge>
                )}
                {area.activeGames && area.activeGames.length > 0 && (
                  <Badge className="bg-black/50 text-white text-xs border-white/30">
                    🎮 {area.activeGames[0]}
                  </Badge>
                )}
              </div>
            </div>

            {/* Enhanced User Avatars */}
            <div className="flex flex-wrap gap-2">
              {area.users.slice(0, 6).map((user, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 backdrop-blur-sm text-white rounded-full flex items-center justify-center text-sm border-2 shadow-lg relative ${
                    user.isDJ ? 'bg-purple-600/80 border-yellow-300' : 
                    user.isPlaying ? 'bg-green-600/80 border-green-300' : 
                    'bg-black/50 border-white/40'
                  }`}
                  title={`${user.name} - ${user.activity}${user.musicPreference ? ` | Music: ${user.musicPreference}` : ''}${user.isDJ ? ' | DJ' : ''}`}
                >
                  {user.mood}
                  {user.isDJ && <Crown className="absolute -top-1 -right-1 h-3 w-3 text-yellow-300" />}
                  {user.isPlaying && !user.isDJ && <Play className="absolute -top-1 -right-1 h-3 w-3 text-green-300" />}
                </div>
              ))}
              {area.users.length > 6 && (
                <div className="w-8 h-8 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center text-xs border-2 border-white/40">
                  +{area.users.length - 6}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Enhanced Feature Icons */}
      <div className="absolute bottom-6 left-4 right-4 z-20">
        <div className="flex justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 border border-white/50 shadow-lg">
            <Crown className="h-5 w-5 text-purple-600" />
            <span className="text-[#8B4513] font-semibold">Live DJ Mode</span>
          </div>
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 border border-white/50 shadow-lg">
            <Gamepad2 className="h-5 w-5 text-green-600" />
            <span className="text-[#8B4513] font-semibold">Interactive Games</span>
          </div>
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 border border-white/50 shadow-lg">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            <span className="text-[#8B4513] font-semibold">Real-time Chat</span>
          </div>
        </div>
      </div>

      {/* Enhanced Hovered Area Details with New Features */}
      {hoveredSeat && (
        <div className="absolute bottom-32 left-6 z-40">
          <Card className="bg-white/95 backdrop-blur-sm border-white/50 max-w-sm shadow-2xl">
            <CardContent className="p-6">
              {(() => {
                const area = seatAreas.find(a => a.id === hoveredSeat);
                if (!area) return null;
                
                return (
                  <>
                    <h3 className="font-bold text-[#8B4513] mb-3 text-lg">{area.name}</h3>
                    
                    {/* Current Track & DJ Info */}
                    {area.currentTrack && (
                      <div className="mb-3 p-2 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                        <div className="flex items-center gap-2">
                          <Music className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-semibold text-purple-600">{area.currentTrack}</span>
                        </div>
                        {area.users.find(u => u.isDJ) && (
                          <div className="flex items-center gap-1 mt-1">
                            <Crown className="h-3 w-3 text-purple-600" />
                            <span className="text-xs text-purple-600">
                              DJ: {area.users.find(u => u.isDJ)?.name}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Active Games */}
                    {area.activeGames && area.activeGames.length > 0 && (
                      <div className="mb-3 p-2 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <div className="flex items-center gap-2 mb-1">
                          <Gamepad2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-600">Active Games</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {area.activeGames.map((game, idx) => (
                            <Badge key={idx} className="bg-green-100 text-green-800 text-xs">
                              {game}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Premium Features */}
                    {area.premiumFeatures && (
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-[#8B4513] mb-1">Enhanced Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {area.premiumFeatures.map((feature, idx) => (
                            <Badge key={idx} className="bg-amber-100 text-amber-800 text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Weather Effect */}
                    {area.weatherEffect && (
                      <div className="mb-3">
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          ⛅ {area.weatherEffect}
                        </Badge>
                      </div>
                    )}
                    
                    {/* Enhanced User List */}
                    <div className="space-y-2 mb-4">
                      {area.users.map((user, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm">
                          <span className="text-lg relative">
                            {user.mood}
                            {user.isDJ && <Crown className="absolute -top-1 -right-1 h-3 w-3 text-purple-600" />}
                            {user.isPlaying && !user.isDJ && <Play className="absolute -top-1 -right-1 h-3 w-3 text-green-600" />}
                          </span>
                          <div className="flex-1">
                            <span className="font-semibold text-[#8B4513]">{user.name}</span>
                            {user.isDJ && <Badge className="ml-1 bg-purple-100 text-purple-800 text-xs">DJ</Badge>}
                            <span className="text-xs text-gray-600 block">
                              {user.activity}
                              {user.musicPreference && ` • ${user.musicPreference}`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-[#8B4513] hover:bg-[#8B4513]/90 text-white py-2"
                        onClick={() => onSeatSelect(area.id)}
                      >
                        <Coffee className="h-4 w-4 mr-2" />
                        Join Area
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513]/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartPrivateChat('nearby-users');
                        }}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Status Bar with Live Activity */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 border border-white/50 shadow-lg">
          <div className="flex items-center gap-6 text-[#8B4513] font-semibold">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span>47 people online</span>
            </div>
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-purple-600" />
              <span>3 DJs active</span>
            </div>
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-4 w-4 text-green-600" />
              <span>8 games playing</span>
            </div>
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 text-blue-600" />
              <span>Spotify Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
