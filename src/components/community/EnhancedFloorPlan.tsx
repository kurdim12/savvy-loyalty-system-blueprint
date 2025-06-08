
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Coffee, Wifi, Volume2, Music, Heart, Play } from 'lucide-react';

interface Track {
  id: string;
  name: string;
  artist: string;
  votes: number;
  duration: string;
  isPlaying: boolean;
}

interface SeatArea {
  id: string;
  name: string;
  type: 'premium' | 'window' | 'cozy' | 'workspace' | 'bar';
  capacity: number;
  occupied: number;
  users: Array<{
    id: string;
    name: string;
    mood: string;
    activity: string;
    isOnline: boolean;
  }>;
  position: { x: number; y: number; width: number; height: number };
  features: string[];
  musicZone: boolean;
}

interface EnhancedFloorPlanProps {
  onSeatSelect: (seatId: string) => void;
  onStartPrivateChat: (userId: string) => void;
}

export const EnhancedFloorPlan = ({ onSeatSelect, onStartPrivateChat }: EnhancedFloorPlanProps) => {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [showMusicPanel, setShowMusicPanel] = useState(false);

  const seatAreas: SeatArea[] = [
    {
      id: 'premium-1',
      name: 'VIP Lounge',
      type: 'premium',
      capacity: 4,
      occupied: 2,
      users: [
        { id: '1', name: 'Sarah M.', mood: '😌', activity: 'Enjoying premium coffee', isOnline: true },
        { id: '2', name: 'Mike R.', mood: '💼', activity: 'Business meeting', isOnline: true }
      ],
      position: { x: 70, y: 20, width: 25, height: 25 },
      features: ['Premium Service', 'Quiet Zone', 'Luxury Seating'],
      musicZone: true
    },
    {
      id: 'window-1',
      name: 'Panoramic Window Seats',
      type: 'window',
      capacity: 8,
      occupied: 5,
      users: [
        { id: '3', name: 'Emma L.', mood: '📸', activity: 'Photography', isOnline: true },
        { id: '4', name: 'Alex K.', mood: '☕', activity: 'Coffee tasting', isOnline: true },
        { id: '5', name: 'Jordan P.', mood: '📖', activity: 'Reading', isOnline: false },
        { id: '6', name: 'Taylor M.', mood: '💭', activity: 'Contemplating', isOnline: true },
        { id: '7', name: 'Casey L.', mood: '🎵', activity: 'Listening to music', isOnline: true }
      ],
      position: { x: 5, y: 30, width: 40, height: 20 },
      features: ['Natural Light', 'City View', 'Photo Opportunities'],
      musicZone: true
    },
    {
      id: 'cozy-1',
      name: 'Fireplace Nook',
      type: 'cozy',
      capacity: 6,
      occupied: 3,
      users: [
        { id: '8', name: 'Luna D.', mood: '🔥', activity: 'Warming by fire', isOnline: true },
        { id: '9', name: 'Noah G.', mood: '📚', activity: 'Reading novels', isOnline: true },
        { id: '10', name: 'Zoe W.', mood: '☕', activity: 'Hot chocolate', isOnline: false }
      ],
      position: { x: 50, y: 55, width: 30, height: 25 },
      features: ['Fireplace', 'Soft Lighting', 'Comfortable Armchairs'],
      musicZone: false
    },
    {
      id: 'workspace-1',
      name: 'Productivity Hub',
      type: 'workspace',
      capacity: 10,
      occupied: 7,
      users: [
        { id: '11', name: 'Sam B.', mood: '💻', activity: 'Coding', isOnline: true },
        { id: '12', name: 'Riley K.', mood: '📊', activity: 'Data analysis', isOnline: true },
        { id: '13', name: 'Morgan F.', mood: '✍️', activity: 'Writing', isOnline: true },
        { id: '14', name: 'Quinn H.', mood: '🎯', activity: 'Project planning', isOnline: true },
        { id: '15', name: 'Avery P.', mood: '📱', activity: 'Mobile design', isOnline: false },
        { id: '16', name: 'Blake S.', mood: '🤝', activity: 'Team call', isOnline: true },
        { id: '17', name: 'River T.', mood: '📝', activity: 'Note-taking', isOnline: true }
      ],
      position: { x: 5, y: 55, width: 40, height: 30 },
      features: ['High-Speed WiFi', 'Power Outlets', 'Quiet Environment'],
      musicZone: false
    },
    {
      id: 'bar-1',
      name: 'Coffee Bar Counter',
      type: 'bar',
      capacity: 12,
      occupied: 8,
      users: [
        { id: '18', name: 'Phoenix L.', mood: '☕', activity: 'Barista chat', isOnline: true },
        { id: '19', name: 'Sage M.', mood: '🎵', activity: 'Music discovery', isOnline: true },
        { id: '20', name: 'Rowan B.', mood: '😄', activity: 'Socializing', isOnline: true },
        { id: '21', name: 'Drew C.', mood: '📱', activity: 'Social media', isOnline: false },
        { id: '22', name: 'Kai N.', mood: '🎧', activity: 'DJ session', isOnline: true },
        { id: '23', name: 'Finley R.', mood: '☕', activity: 'Espresso tasting', isOnline: true },
        { id: '24', name: 'Emery S.', mood: '🗣️', activity: 'Group discussion', isOnline: true },
        { id: '25', name: 'Skylar V.', mood: '🎤', activity: 'Music voting', isOnline: true }
      ],
      position: { x: 20, y: 10, width: 45, height: 15 },
      features: ['Live Barista Action', 'Music Voting Station', 'Social Hub'],
      musicZone: true
    }
  ];

  // Mock Spotify integration
  useEffect(() => {
    const mockTracks: Track[] = [
      { id: '1', name: 'Café del Mar', artist: 'Energy 52', votes: 23, duration: '4:32', isPlaying: false },
      { id: '2', name: 'Sunday Morning', artist: 'Maroon 5', votes: 18, duration: '4:06', isPlaying: false },
      { id: '3', name: 'Coffee Shop Vibes', artist: 'Lo-Fi Collective', votes: 31, duration: '3:45', isPlaying: true },
      { id: '4', name: 'Autumn Leaves', artist: 'Bill Evans', votes: 15, duration: '5:21', isPlaying: false },
      { id: '5', name: 'Bossa Nova Café', artist: 'Various Artists', votes: 27, duration: '3:58', isPlaying: false }
    ];
    
    setPlaylist(mockTracks.sort((a, b) => b.votes - a.votes));
    setCurrentTrack(mockTracks.find(t => t.isPlaying) || mockTracks[0]);
  }, []);

  const getAreaColor = (type: string) => {
    switch (type) {
      case 'premium': return 'bg-gradient-to-br from-amber-100 to-amber-200 border-amber-400';
      case 'window': return 'bg-gradient-to-br from-blue-50 to-sky-100 border-sky-300';
      case 'cozy': return 'bg-gradient-to-br from-orange-100 to-red-100 border-orange-300';
      case 'workspace': return 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-300';
      case 'bar': return 'bg-gradient-to-br from-[#8B4513]/20 to-[#D2B48C]/30 border-[#8B4513]/40';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getOccupancyColor = (occupied: number, capacity: number) => {
    const ratio = occupied / capacity;
    if (ratio < 0.6) return 'text-green-600';
    if (ratio < 0.9) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleVoteTrack = (trackId: string) => {
    setPlaylist(prev => 
      prev.map(track => 
        track.id === trackId 
          ? { ...track, votes: track.votes + 1 }
          : track
      ).sort((a, b) => b.votes - a.votes)
    );
  };

  const handleSeatClick = (seatId: string) => {
    setSelectedSeat(seatId);
    onSeatSelect(seatId);
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#F5E6D3] to-[#E6D7C7] p-6">
      {/* Header with Music Panel Toggle */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <Button
          onClick={() => setShowMusicPanel(!showMusicPanel)}
          className="bg-[#8B4513] text-white hover:bg-[#8B4513]/90"
        >
          <Music className="h-4 w-4 mr-2" />
          Music Panel
        </Button>
        <Badge className="bg-[#8B4513] text-white">
          <Coffee className="h-4 w-4 mr-2" />
          Raw Smith Enhanced Floor Plan
        </Badge>
      </div>

      {/* Music Control Panel */}
      {showMusicPanel && (
        <Card className="absolute top-16 right-4 z-30 w-80 bg-white/95 backdrop-blur-sm border-[#8B4513]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#8B4513]">
              <Music className="h-5 w-5" />
              Café Music Station
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Now Playing */}
            {currentTrack && (
              <div className="p-3 bg-[#8B4513]/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Play className="h-4 w-4 text-[#8B4513]" />
                  <span className="text-sm font-medium text-[#8B4513]">Now Playing</span>
                </div>
                <div className="text-sm font-semibold">{currentTrack.name}</div>
                <div className="text-xs text-[#95A5A6]">{currentTrack.artist}</div>
              </div>
            )}

            {/* Playlist with Voting */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#8B4513]">Vote for Next Track</h4>
              {playlist.slice(0, 4).map((track) => (
                <div key={track.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{track.name}</div>
                    <div className="text-xs text-[#95A5A6]">{track.artist}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{track.votes}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleVoteTrack(track.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Floor Plan */}
      <div className="relative w-full h-full mt-16">
        {/* Coffee Shop Layout Background */}
        <div className="absolute inset-0 rounded-xl border-3 border-[#8B4513]/40 bg-gradient-to-br from-white/50 to-[#F5E6D3]/50">
          {/* Entrance */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-gradient-to-t from-[#8B4513]/60 to-[#8B4513]/30 rounded-t-xl border-2 border-[#8B4513]/40">
            <div className="text-center text-sm text-[#8B4513] mt-1 font-bold">Main Entrance</div>
          </div>
        </div>

        {/* Enhanced Seat Areas */}
        {seatAreas.map((area) => (
          <div
            key={area.id}
            className={`absolute cursor-pointer transition-all duration-500 rounded-xl border-2 ${getAreaColor(area.type)} ${
              hoveredSeat === area.id 
                ? 'scale-105 shadow-2xl z-10 ring-4 ring-[#8B4513]/30' 
                : selectedSeat === area.id
                ? 'ring-2 ring-[#8B4513]/50'
                : 'hover:scale-102 hover:shadow-lg'
            }`}
            style={{
              left: `${area.position.x}%`,
              top: `${area.position.y}%`,
              width: `${area.position.width}%`,
              height: `${area.position.height}%`
            }}
            onMouseEnter={() => setHoveredSeat(area.id)}
            onMouseLeave={() => setHoveredSeat(null)}
            onClick={() => handleSeatClick(area.id)}
          >
            {/* Area Content */}
            <div className="p-3 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-[#8B4513] text-sm">{area.name}</h4>
                  {area.musicZone && <Volume2 className="h-3 w-3 text-[#8B4513]" />}
                </div>
                
                <div className="flex items-center gap-3 mb-2">
                  <div className={`flex items-center gap-1 text-xs font-medium ${getOccupancyColor(area.occupied, area.capacity)}`}>
                    <Users className="h-3 w-3" />
                    <span>{area.occupied}/{area.capacity}</span>
                  </div>
                  <Wifi className="h-3 w-3 text-[#8B4513]" />
                </div>

                {/* Features */}
                <div className="mb-2">
                  {area.features.slice(0, 2).map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs mr-1 mb-1 border-[#8B4513]/30">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Online Users */}
              <div className="flex flex-wrap gap-1">
                {area.users.filter(user => user.isOnline).slice(0, 4).map((user, index) => (
                  <div
                    key={index}
                    className="relative cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartPrivateChat(user.id);
                    }}
                  >
                    <div className="w-7 h-7 bg-[#8B4513] text-white rounded-full flex items-center justify-center text-sm font-medium hover:ring-2 hover:ring-white transition-all">
                      {user.mood}
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                ))}
                {area.users.filter(user => user.isOnline).length > 4 && (
                  <div className="w-7 h-7 bg-[#95A5A6] text-white rounded-full flex items-center justify-center text-xs">
                    +{area.users.filter(user => user.isOnline).length - 4}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Enhanced Hover Details */}
        {hoveredSeat && (
          <Card className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-[#8B4513]/20 max-w-sm z-20">
            <CardContent className="p-4">
              {(() => {
                const area = seatAreas.find(a => a.id === hoveredSeat);
                if (!area) return null;
                
                return (
                  <>
                    <h3 className="font-bold text-[#8B4513] mb-3 text-lg">{area.name}</h3>
                    
                    {/* Online Users */}
                    <div className="space-y-2 mb-4">
                      <h4 className="text-sm font-medium text-[#8B4513]">Online Now:</h4>
                      {area.users.filter(user => user.isOnline).map((user, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm">
                          <span className="text-lg">{user.mood}</span>
                          <div className="flex-1">
                            <div className="font-medium text-[#8B4513]">{user.name}</div>
                            <div className="text-xs text-[#95A5A6]">{user.activity}</div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStartPrivateChat(user.id);
                            }}
                          >
                            Chat
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Features */}
                    <div className="space-y-1 mb-3">
                      {area.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-[#95A5A6]">
                          <div className="w-1.5 h-1.5 bg-[#8B4513] rounded-full" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="text-center">
                      <Button className="w-full bg-[#8B4513] hover:bg-[#8B4513]/90 text-white">
                        Join This Area
                      </Button>
                    </div>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
