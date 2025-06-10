
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipForward, Heart, Users, Music, Crown, Shuffle, Volume2, Radio } from 'lucide-react';
import { useSpotify } from '@/hooks/useSpotify';
import { toast } from 'sonner';

export const CommunityMusicPlayer = () => {
  const { isAuthenticated, authenticate, isLoading } = useSpotify();
  const [currentTrack, setCurrentTrack] = useState({
    name: 'Café Jazz Vibes',
    artist: 'Coffee House Collective',
    votes: 15,
    requestedBy: 'Maya S.',
    duration: 240,
    currentTime: 67
  });

  const [djMode, setDjMode] = useState({
    currentDJ: 'Alex K.',
    timeRemaining: 180,
    isActive: true
  });

  const [communityQueue, setCommunityQueue] = useState([
    { id: '1', name: 'Lo-Fi Study Beats', artist: 'Chill Vibes', votes: 12, requestedBy: 'Jordan P.' },
    { id: '2', name: 'Acoustic Morning', artist: 'Sunrise Sessions', votes: 8, requestedBy: 'Sarah M.' },
    { id: '3', name: 'Rainy Day Jazz', artist: 'Blue Note Café', votes: 6, requestedBy: 'Emma L.' }
  ]);

  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const djTimer = setInterval(() => {
      setDjMode(prev => ({
        ...prev,
        timeRemaining: Math.max(0, prev.timeRemaining - 1)
      }));
    }, 1000);

    return () => clearInterval(djTimer);
  }, []);

  const handleSpotifyConnect = async () => {
    try {
      await authenticate();
    } catch (error) {
      toast.error('Failed to connect to Spotify. Please try again.');
    }
  };

  const handleVote = (trackId: string) => {
    setCommunityQueue(prev => 
      prev.map(track => 
        track.id === trackId 
          ? { ...track, votes: track.votes + 1 }
          : track
      ).sort((a, b) => b.votes - a.votes)
    );
    toast.success('Vote added! 🎵');
  };

  const becomeDJ = () => {
    setDjMode(prev => ({
      ...prev,
      currentDJ: 'You',
      timeRemaining: 300
    }));
    toast.success('You are now the DJ! 🎧');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isAuthenticated) {
    return (
      <Card className="bg-gradient-to-br from-green-900/20 to-purple-900/20 border-green-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Music className="h-6 w-6 text-green-400" />
            Community Music Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-purple-600 rounded-full flex items-center justify-center">
              <Radio className="h-10 w-10 text-white animate-pulse" />
            </div>
            <p className="text-green-200">
              Connect your Spotify account to join the community music experience! 
              Control the café's atmosphere and vote on the next tracks.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-2">
              <h4 className="text-white font-semibold">🎵 Currently Playing in Café</h4>
              <p className="text-green-200 text-sm">"{currentTrack.name}" by {currentTrack.artist}</p>
              <p className="text-xs text-green-300">Requested by {currentTrack.requestedBy} • {currentTrack.votes} votes</p>
            </div>
          </div>
          
          <Button 
            onClick={handleSpotifyConnect}
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-6 text-lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Connecting...
              </>
            ) : (
              <>
                <Music className="h-5 w-5 mr-2" />
                Connect with Spotify
              </>
            )}
          </Button>
          
          <p className="text-xs text-green-300 text-center">
            Once connected, you can vote on songs, become a DJ, and control the café's music!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* DJ Mode Card */}
      <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-400/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-purple-200">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-400" />
              DJ Mode Active
            </div>
            <Badge className="bg-purple-600/50 text-white">
              {formatTime(djMode.timeRemaining)} left
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-purple-200">
              Current DJ: <strong className="text-white">{djMode.currentDJ}</strong>
            </span>
            {djMode.currentDJ !== 'You' && (
              <Button
                onClick={becomeDJ}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Crown className="h-3 w-3 mr-1" />
                Take DJ Turn
              </Button>
            )}
          </div>
          <Progress value={(djMode.timeRemaining / 300) * 100} className="h-2" />
          <p className="text-xs text-purple-300">
            As DJ, you control the music for everyone in this seating area!
          </p>
        </CardContent>
      </Card>

      {/* Now Playing */}
      <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-400/30">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Music className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-orange-200">{currentTrack.name}</h4>
              <p className="text-orange-300 text-sm">{currentTrack.artist}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-orange-400">{formatTime(currentTrack.currentTime)}</span>
                <Progress value={(currentTrack.currentTime / currentTrack.duration) * 100} className="h-1 flex-1" />
                <span className="text-xs text-orange-400">{formatTime(currentTrack.duration)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-orange-400/50 text-orange-200 hover:bg-orange-400/10"
              >
                <Heart className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button variant="outline" size="sm" className="border-orange-400/50 text-orange-200 hover:bg-orange-400/10">
                <SkipForward className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="sm" className="border-orange-400/50 text-orange-200 hover:bg-orange-400/10">
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-green-600/20 text-green-200 border-green-400/30">
                <Users className="h-3 w-3 mr-1" />
                {currentTrack.votes} votes
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community Queue */}
      <Card className="bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-[#8B4513] flex items-center gap-2">
            <Music className="h-5 w-5" />
            Community Queue
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3 max-h-64 overflow-y-auto">
          {communityQueue.map((track, index) => (
            <div key={track.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-1">
                <h5 className="font-semibold text-[#8B4513] text-sm">{track.name}</h5>
                <p className="text-xs text-gray-600">{track.artist} • by {track.requestedBy}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-[#8B4513]/10 text-[#8B4513]">
                  #{index + 1}
                </Badge>
                <span className="text-sm font-bold text-[#8B4513]">{track.votes}</span>
                <Button
                  onClick={() => handleVote(track.id)}
                  size="sm"
                  variant="outline"
                  className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513]/10"
                >
                  Vote
                </Button>
              </div>
            </div>
          ))}
          
          <Button className="w-full bg-[#8B4513] hover:bg-[#8B4513]/90 text-white">
            <Music className="h-4 w-4 mr-2" />
            Add Track to Queue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
