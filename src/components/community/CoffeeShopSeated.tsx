
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coffee, MessageCircle, Users, Music, Sparkles, Play, Pause, SkipForward, Volume2, Heart } from 'lucide-react';
import { AtmosphericBackground } from './AtmosphericBackground';

interface CoffeeShopSeatedProps {
  seatId: string;
  onLeave: () => void;
}

export const CoffeeShopSeated = ({ seatId, onLeave }: CoffeeShopSeatedProps) => {
  const [activeTab, setActiveTab] = useState<'chill' | 'music' | 'chat'>('chill');
  const [currentTrack, setCurrentTrack] = useState({
    name: 'Smooth Jazz Café Mix',
    artist: 'Coffee House Collective',
    isPlaying: true,
    duration: '3:42',
    currentTime: '1:23'
  });
  const [isLiked, setIsLiked] = useState(false);

  const seatViews = {
    'seat-1': {
      name: 'Window Seat',
      view: 'Street View',
      background: 'linear-gradient(135deg, #F5DEB3 0%, #DEB887 50%, #D2B48C 100%)',
      description: 'Watch the world go by while enjoying your coffee',
      weather: 'sunny' as const
    },
    'seat-2': {
      name: 'Corner Table', 
      view: 'Garden View',
      background: 'linear-gradient(135deg, #E6D7C7 0%, #D2B48C 50%, #C1A882 100%)',
      description: 'Peaceful garden views for quiet contemplation',
      weather: 'cloudy' as const
    },
    'seat-3': {
      name: 'Counter Stool',
      view: 'Barista View', 
      background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #CD853F 100%)',
      description: 'Front row seat to the coffee-making magic',
      weather: 'evening' as const
    },
    'seat-4': {
      name: 'Lounge Chair',
      view: 'Fireplace View',
      background: 'linear-gradient(135deg, #DEB887 0%, #D2B48C 50%, #BC9A6A 100%)',
      description: 'Cozy warmth by the fireplace',
      weather: 'rainy' as const
    }
  };

  const currentSeat = seatViews[seatId as keyof typeof seatViews] || seatViews['seat-1'];

  const requestedTracks = [
    { name: 'Lo-Fi Hip Hop Beats', artist: 'Study Music', votes: 12, requestedBy: 'Maya S.' },
    { name: 'Acoustic Coffee Vibes', artist: 'Café Acoustics', votes: 8, requestedBy: 'Alex K.' },
    { name: 'Smooth Jazz Collection', artist: 'Jazz Café', votes: 6, requestedBy: 'Luna D.' },
    { name: 'Ambient Study Music', artist: 'Focus Sounds', votes: 4, requestedBy: 'Ivy C.' }
  ];

  const handlePlayPause = () => {
    setCurrentTrack(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying
    }));
  };

  const handleLikeTrack = () => {
    setIsLiked(!isLiked);
  };

  const handleVoteTrack = (trackIndex: number) => {
    console.log(`Voted for track: ${requestedTracks[trackIndex].name}`);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Atmospheric Background */}
      <AtmosphericBackground 
        currentSeat={seatId}
        weather={currentSeat.weather}
      />
      
      {/* Main Content */}
      <div className="relative z-10 p-6 h-full flex flex-col">
        {/* Enhanced Seat Info Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">{currentSeat.name}</h2>
            <p className="text-white/90 drop-shadow">{currentSeat.description}</p>
            <div className="flex gap-2 mt-2">
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                {currentSeat.view}
              </Badge>
              <Badge className="bg-[#8B4513]/80 text-white border-[#8B4513]/50 backdrop-blur-sm">
                <Users className="h-3 w-3 mr-1" />
                3 others nearby
              </Badge>
              <Badge className="bg-green-500/80 text-white border-green-500/50 backdrop-blur-sm">
                <Music className="h-3 w-3 mr-1" />
                Premium Audio
              </Badge>
            </div>
          </div>
          
          <Button
            onClick={onLeave}
            variant="outline"
            className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
          >
            Stand Up
          </Button>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'chill', label: 'Chill', icon: Coffee },
            { key: 'music', label: 'Spotify Controls', icon: Music },
            { key: 'chat', label: 'Chat', icon: MessageCircle }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              onClick={() => setActiveTab(key as any)}
              variant={activeTab === key ? 'default' : 'outline'}
              className={
                activeTab === key
                  ? 'bg-white text-[#8B4513] hover:bg-white/90'
                  : 'bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm'
              }
            >
              <Icon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{label}</span>
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'chill' && (
            <div className="h-full flex items-center justify-center">
              <Card className="bg-white/95 backdrop-blur-sm border-white/50 max-w-lg w-full">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-[#8B4513] to-[#D2B48C] rounded-full flex items-center justify-center">
                      <Sparkles className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#8B4513] mb-2">Peaceful Moments</h3>
                    <p className="text-[#95A5A6] mb-4">
                      Relax and soak in the café atmosphere. Let time slow down as you enjoy this moment.
                    </p>
                    
                    {/* Enhanced Ambient Controls */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-[#8B4513]">Ambient Volume</span>
                        <div className="flex items-center gap-2">
                          <Volume2 className="h-4 w-4 text-[#8B4513]" />
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div className="w-3/4 h-full bg-[#8B4513] rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-[#8B4513]">Coffee Aroma</span>
                        <Badge className="bg-[#8B4513] text-white">Ethiopian Blend</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'music' && (
            <div className="h-full space-y-4">
              {/* Now Playing Card */}
              <Card className="bg-white/95 backdrop-blur-sm border-white/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#8B4513]">
                    <Music className="h-5 w-5" />
                    Now Playing - Spotify
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#8B4513] to-[#D2B48C] rounded-lg flex items-center justify-center">
                      <Music className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#8B4513]">{currentTrack.name}</h4>
                      <p className="text-[#95A5A6] text-sm">{currentTrack.artist}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[#95A5A6]">{currentTrack.currentTime}</span>
                        <div className="flex-1 h-1 bg-gray-200 rounded-full">
                          <div className="w-1/3 h-full bg-[#8B4513] rounded-full"></div>
                        </div>
                        <span className="text-xs text-[#95A5A6]">{currentTrack.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Spotify Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      onClick={handleLikeTrack}
                      variant="outline"
                      size="sm"
                      className={`border-[#8B4513] ${isLiked ? 'bg-[#8B4513] text-white' : 'text-[#8B4513] hover:bg-[#8B4513]/10'}`}
                    >
                      <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                    </Button>
                    
                    <Button
                      onClick={handlePlayPause}
                      className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white w-12 h-12 rounded-full"
                    >
                      {currentTrack.isPlaying ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6" />
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513]/10"
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Track Requests */}
              <Card className="bg-white/95 backdrop-blur-sm border-white/50 flex-1">
                <CardHeader>
                  <CardTitle className="text-[#8B4513]">Community Track Requests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {requestedTracks.map((track, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <h5 className="font-semibold text-[#8B4513] text-sm">{track.name}</h5>
                        <p className="text-xs text-[#95A5A6]">{track.artist} • Requested by {track.requestedBy}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#8B4513]">{track.votes}</span>
                        <Button
                          onClick={() => handleVoteTrack(index)}
                          size="sm"
                          variant="outline"
                          className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513]/10 h-8 px-3"
                        >
                          Vote
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button className="w-full bg-[#8B4513] hover:bg-[#8B4513]/90 text-white mt-4">
                    <Music className="h-4 w-4 mr-2" />
                    Request New Track
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="h-full">
              <Card className="bg-white/95 backdrop-blur-sm border-white/50 h-full">
                <CardContent className="p-6 h-full flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-[#8B4513]" />
                    <h3 className="text-lg font-medium text-[#8B4513] mb-2">Connect with Nearby Coffee Lovers</h3>
                    <p className="text-[#95A5A6] mb-4">Chat with people in your seating area</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-[#8B4513] rounded-full flex items-center justify-center text-white text-sm">
                          😊
                        </div>
                        <span className="text-sm font-medium text-[#8B4513]">Sarah M. is available to chat</span>
                        <Button size="sm" className="ml-auto bg-[#8B4513] hover:bg-[#8B4513]/90 text-white">
                          Say Hi
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
