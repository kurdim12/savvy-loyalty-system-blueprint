
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipForward, Search, Heart, Users, Music, Shuffle, Volume2 } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  duration: number;
  currentTime: number;
  votes: { up: number; down: number };
  requestedBy: string;
  isLiked: boolean;
}

const mockTracks: Track[] = [
  {
    id: '1',
    title: 'Café Jazz Vibes',
    artist: 'Coffee House Collective',
    album: 'Morning Brew',
    albumArt: '/lovable-uploads/680bf950-de42-45c2-bcfd-0e9b786df840.png',
    duration: 240,
    currentTime: 67,
    votes: { up: 15, down: 2 },
    requestedBy: 'Maya S.',
    isLiked: false
  },
  {
    id: '2',
    title: 'Lo-Fi Study Beats',
    artist: 'Chill Vibes',
    album: 'Focus Flow',
    albumArt: '/lovable-uploads/e2fc2611-a942-411c-a3e2-676b7cf86455.png',
    duration: 180,
    currentTime: 0,
    votes: { up: 12, down: 1 },
    requestedBy: 'Jordan P.',
    isLiked: true
  },
  {
    id: '3',
    title: 'Acoustic Morning',
    artist: 'Sunrise Sessions',
    album: 'Dawn Melodies',
    albumArt: '/lovable-uploads/9e789f3f-a692-425c-b0fb-fdd4abbe5390.png',
    duration: 200,
    currentTime: 0,
    votes: { up: 8, down: 0 },
    requestedBy: 'Sarah M.',
    isLiked: false
  }
];

export const CommunityMusicPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState<Track>(mockTracks[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [queue, setQueue] = useState<Track[]>(mockTracks.slice(1));
  const [searchQuery, setSearchQuery] = useState('');
  const [volume, setVolume] = useState(75);
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down'>>({});

  useEffect(() => {
    if (isPlaying && currentTrack) {
      const timer = setInterval(() => {
        setCurrentTrack(prev => {
          if (prev.currentTime >= prev.duration) {
            // Auto-play next song
            const nextTrack = queue[0];
            if (nextTrack) {
              setQueue(prev => prev.slice(1));
              return { ...nextTrack, currentTime: 0 };
            }
            return { ...prev, currentTime: 0 };
          }
          return { ...prev, currentTime: prev.currentTime + 1 };
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, queue]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVote = (trackId: string, voteType: 'up' | 'down') => {
    setUserVotes(prev => ({ ...prev, [trackId]: voteType }));
    setQueue(prev => 
      prev.map(track => 
        track.id === trackId 
          ? {
              ...track,
              votes: {
                up: track.votes.up + (voteType === 'up' ? 1 : 0),
                down: track.votes.down + (voteType === 'down' ? 1 : 0)
              }
            }
          : track
      ).sort((a, b) => (b.votes.up - b.votes.down) - (a.votes.up - a.votes.down))
    );
  };

  const toggleLike = () => {
    setCurrentTrack(prev => ({ ...prev, isLiked: !prev.isLiked }));
  };

  return (
    <div className="space-y-4">
      {/* Vinyl Player - Now Playing */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            {/* Vinyl Record */}
            <div className="relative">
              <div className={`w-24 h-24 rounded-full bg-black shadow-lg ${isPlaying ? 'animate-spin' : ''} transition-all duration-300`} style={{ animationDuration: '3s' }}>
                <img 
                  src={currentTrack.albumArt} 
                  alt={currentTrack.title}
                  className="w-20 h-20 rounded-full absolute top-2 left-2 border-4 border-gray-800"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white rounded-full p-1">
                <Music className="h-3 w-3" />
              </div>
            </div>

            {/* Track Info */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-purple-800 mb-1">{currentTrack.title}</h3>
              <p className="text-purple-600 mb-2">{currentTrack.artist} • {currentTrack.album}</p>
              
              {/* Progress Bar */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs text-purple-600 min-w-[2.5rem]">{formatTime(currentTrack.currentTime)}</span>
                <Progress 
                  value={(currentTrack.currentTime / currentTrack.duration) * 100} 
                  className="h-2 flex-1 bg-purple-200" 
                />
                <span className="text-xs text-purple-600 min-w-[2.5rem]">{formatTime(currentTrack.duration)}</span>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button 
                    size="sm"
                    variant="outline"
                    className="border-purple-300 text-purple-600 hover:bg-purple-50"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>

                  <Button 
                    size="sm"
                    variant="outline"
                    className="border-purple-300 text-purple-600 hover:bg-purple-50"
                  >
                    <Shuffle className="h-4 w-4" />
                  </Button>

                  <Button
                    onClick={toggleLike}
                    size="sm"
                    variant="outline"
                    className={`border-purple-300 ${currentTrack.isLiked ? 'bg-red-50 text-red-500' : 'text-purple-600'} hover:bg-purple-50`}
                  >
                    <Heart className={`h-4 w-4 ${currentTrack.isLiked ? 'fill-current' : ''}`} />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-purple-600" />
                  <div className="w-20">
                    <Progress value={volume} className="h-2 bg-purple-200" />
                  </div>
                  <span className="text-xs text-purple-600 min-w-[2rem]">{volume}%</span>
                </div>
              </div>

              {/* Track Stats */}
              <div className="flex items-center gap-4 mt-3">
                <Badge className="bg-green-100 text-green-800">
                  👍 {currentTrack.votes.up}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Requested by {currentTrack.requestedBy}
                </Badge>
                <Badge className="bg-purple-100 text-purple-800">
                  <Users className="h-3 w-3 mr-1" />
                  23 listening
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search & Request */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#8B4513] flex items-center gap-2">
            <Search className="h-5 w-5" />
            Request a Song
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for songs, artists, or albums..."
              className="flex-1"
            />
            <Button className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {searchQuery && (
            <div className="text-sm text-gray-600">
              Search results would appear here for "{searchQuery}"
            </div>
          )}
        </CardContent>
      </Card>

      {/* Voting Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#8B4513]">Community Queue</CardTitle>
          <p className="text-sm text-gray-600">Vote for songs you want to hear next!</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {queue.map((track, index) => (
            <div key={track.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <Badge className={index === 0 ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-700"}>
                {index === 0 ? "Next" : `#${index + 1}`}
              </Badge>
              
              <img 
                src={track.albumArt} 
                alt={track.title}
                className="w-12 h-12 rounded-lg object-cover shadow-sm"
              />
              
              <div className="flex-1">
                <h5 className="font-semibold text-[#8B4513] text-sm">{track.title}</h5>
                <p className="text-xs text-gray-600">{track.artist} • by {track.requestedBy}</p>
                <span className="text-xs text-gray-500">{formatTime(track.duration)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white rounded-full px-2 py-1 shadow-sm">
                  <span className="text-sm font-bold text-green-600">{track.votes.up}</span>
                  <span className="text-xs text-gray-400">-</span>
                  <span className="text-sm font-bold text-red-600">{track.votes.down}</span>
                </div>
                <Button
                  onClick={() => handleVote(track.id, 'up')}
                  size="sm"
                  variant="outline"
                  className={`w-8 h-8 p-0 ${userVotes[track.id] === 'up' ? 'bg-green-50 border-green-300' : 'border-gray-300'}`}
                >
                  👍
                </Button>
                <Button
                  onClick={() => handleVote(track.id, 'down')}
                  size="sm"
                  variant="outline"
                  className={`w-8 h-8 p-0 ${userVotes[track.id] === 'down' ? 'bg-red-50 border-red-300' : 'border-gray-300'}`}
                >
                  👎
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
