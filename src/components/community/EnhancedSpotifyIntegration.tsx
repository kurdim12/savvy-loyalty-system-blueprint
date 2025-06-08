
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipForward, Heart, Users, Music, Crown, Shuffle } from 'lucide-react';

interface Track {
  id: string;
  name: string;
  artist: string;
  votes: number;
  requestedBy: string;
  isLiked: boolean;
  duration: number;
  currentTime: number;
}

interface SpotifyDJMode {
  currentDJ: string;
  timeRemaining: number;
  queue: Track[];
}

export const EnhancedSpotifyIntegration = () => {
  const [currentTrack, setCurrentTrack] = useState<Track>({
    id: '1',
    name: 'Café Jazz Vibes',
    artist: 'Coffee House Collective',
    votes: 15,
    requestedBy: 'Maya S.',
    isLiked: false,
    duration: 240,
    currentTime: 67
  });

  const [djMode, setDjMode] = useState<SpotifyDJMode>({
    currentDJ: 'Alex K.',
    timeRemaining: 180,
    queue: []
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const [communityQueue, setCommunityQueue] = useState<Track[]>([
    {
      id: '2',
      name: 'Lo-Fi Study Beats',
      artist: 'Chill Vibes',
      votes: 12,
      requestedBy: 'Jordan P.',
      isLiked: false,
      duration: 180,
      currentTime: 0
    },
    {
      id: '3',
      name: 'Acoustic Morning',
      artist: 'Sunrise Sessions',
      votes: 8,
      requestedBy: 'Sarah M.',
      isLiked: true,
      duration: 200,
      currentTime: 0
    }
  ]);

  const [discoveryTracks, setDiscoveryTracks] = useState([
    { name: 'Rainy Day Jazz', artist: 'Blue Note Café', listeners: ['Emma L.', 'Chris T.'] },
    { name: 'Evening Chill', artist: 'Sunset Lounge', listeners: ['Luna D.', 'Noah G.'] }
  ]);

  useEffect(() => {
    // Simulate DJ mode countdown
    const djTimer = setInterval(() => {
      setDjMode(prev => ({
        ...prev,
        timeRemaining: Math.max(0, prev.timeRemaining - 1)
      }));
    }, 1000);

    return () => clearInterval(djTimer);
  }, []);

  const handleVote = (trackId: string) => {
    setCommunityQueue(prev => 
      prev.map(track => 
        track.id === trackId 
          ? { ...track, votes: track.votes + 1 }
          : track
      ).sort((a, b) => b.votes - a.votes)
    );
  };

  const handleLike = () => {
    setCurrentTrack(prev => ({ ...prev, isLiked: !prev.isLiked }));
  };

  const becomeDJ = () => {
    setDjMode(prev => ({
      ...prev,
      currentDJ: 'You',
      timeRemaining: 300 // 5 minutes
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* DJ Mode Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-purple-700">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              DJ Mode Active
            </div>
            <Badge className="bg-purple-100 text-purple-800">
              {formatTime(djMode.timeRemaining)} left
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Current DJ: <strong>{djMode.currentDJ}</strong></span>
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
          <p className="text-xs text-purple-600">
            As DJ, you control the music for everyone in this area!
          </p>
        </CardContent>
      </Card>

      {/* Now Playing Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#8B4513]">
            <Music className="h-5 w-5" />
            Now Playing
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#8B4513] to-[#D2B48C] rounded-lg flex items-center justify-center">
              <Music className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-[#8B4513]">{currentTrack.name}</h4>
              <p className="text-gray-600 text-sm">{currentTrack.artist}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">{formatTime(currentTrack.currentTime)}</span>
                <Progress value={(currentTrack.currentTime / currentTrack.duration) * 100} className="h-1 flex-1" />
                <span className="text-xs text-gray-500">{formatTime(currentTrack.duration)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleLike}
                variant="outline"
                size="sm"
                className={currentTrack.isLiked ? 'bg-red-50 border-red-300' : ''}
              >
                <Heart className={`h-4 w-4 ${currentTrack.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button variant="outline" size="sm">
                <SkipForward className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="sm">
                <Shuffle className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">
                <Users className="h-3 w-3 mr-1" />
                {currentTrack.votes} votes
              </Badge>
              <Badge variant="outline" className="text-xs">
                by {currentTrack.requestedBy}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#8B4513]">Community Queue</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {communityQueue.map((track, index) => (
            <div key={track.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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

      {/* Music Discovery */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#8B4513]">What Others Are Listening To</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {discoveryTracks.map((track, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h5 className="font-semibold text-[#8B4513] text-sm">{track.name}</h5>
                <p className="text-xs text-gray-600">{track.artist}</p>
                <p className="text-xs text-purple-600">
                  Listening: {track.listeners.join(', ')}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-purple-300 text-purple-600 hover:bg-purple-50"
              >
                Listen Too
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
