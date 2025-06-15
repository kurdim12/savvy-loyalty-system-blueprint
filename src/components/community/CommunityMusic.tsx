
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipForward, Volume2, Heart, Search, Users, Music } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  requestedBy: string;
  votes: number;
  isPlaying?: boolean;
}

const SAMPLE_PLAYLIST: Track[] = [
  {
    id: '1',
    title: 'Autumn Leaves',
    artist: 'Miles Davis',
    duration: 240,
    requestedBy: 'Emma T.',
    votes: 12,
    isPlaying: true
  },
  {
    id: '2',
    title: 'Blue in Green',
    artist: 'Bill Evans',
    duration: 180,
    requestedBy: 'Alex C.',
    votes: 8
  },
  {
    id: '3',
    title: 'Take Five',
    artist: 'Dave Brubeck',
    duration: 324,
    requestedBy: 'Sarah M.',
    votes: 15
  }
];

export const CommunityMusic = () => {
  const [playlist, setPlaylist] = useState<Track[]>(SAMPLE_PLAYLIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(45);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(75);

  const currentTrack = playlist.find(track => track.isPlaying);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVote = (trackId: string) => {
    setPlaylist(prev => prev.map(track => 
      track.id === trackId 
        ? { ...track, votes: track.votes + 1 }
        : track
    ));
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    const currentIndex = playlist.findIndex(track => track.isPlaying);
    const nextIndex = (currentIndex + 1) % playlist.length;
    
    setPlaylist(prev => prev.map((track, index) => ({
      ...track,
      isPlaying: index === nextIndex
    })));
    setCurrentTime(0);
  };

  const progressPercentage = currentTrack 
    ? (currentTime / currentTrack.duration) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#8B4513] mb-2">Community Music</h2>
        <p className="text-gray-600">Collaborative playlist curated by our community</p>
      </div>

      {/* Now Playing */}
      <Card className="bg-gradient-to-r from-[#8B4513]/10 to-[#D2B48C]/10 border-[#8B4513]/20">
        <CardHeader>
          <CardTitle className="text-[#8B4513] flex items-center gap-2">
            <Music className="h-5 w-5" />
            Now Playing
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {currentTrack ? (
            <>
              <div className="text-center">
                <h3 className="text-xl font-bold text-[#8B4513] mb-1">
                  {currentTrack.title}
                </h3>
                <p className="text-gray-600 mb-2">{currentTrack.artist}</p>
                <Badge variant="outline" className="text-xs">
                  Requested by {currentTrack.requestedBy}
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <Progress value={progressPercentage} className="h-2" />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(currentTrack.duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVote(currentTrack.id)}
                  className="flex items-center gap-1"
                >
                  <Heart className="h-4 w-4" />
                  {currentTrack.votes}
                </Button>
                
                <Button
                  onClick={handlePlayPause}
                  className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleNextTrack}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-3">
                <Volume2 className="h-4 w-4 text-gray-500" />
                <Progress value={volume} className="flex-1 h-2" />
                <span className="text-sm text-gray-500 w-8">{volume}%</span>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Music className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No music playing</p>
            </div>
          )}
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
        
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for songs, artists, or albums..."
              className="flex-1 border-[#8B4513]/20"
            />
            <Button className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Search and request songs for the community playlist
          </p>
        </CardContent>
      </Card>

      {/* Upcoming Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#8B4513] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Community Queue
            </div>
            <Badge className="bg-[#8B4513]/10 text-[#8B4513]">
              {playlist.length - 1} songs
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {playlist
              .filter(track => !track.isPlaying)
              .sort((a, b) => b.votes - a.votes)
              .map((track, index) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-bold text-gray-400 w-6">
                      #{index + 2}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-[#8B4513]">{track.title}</h4>
                      <p className="text-sm text-gray-600">{track.artist}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {track.requestedBy}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatTime(track.duration)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVote(track.id)}
                    className="flex items-center gap-1"
                  >
                    <Heart className="h-3 w-3" />
                    {track.votes}
                  </Button>
                </div>
              ))}
          </div>
          
          {playlist.length <= 1 && (
            <div className="text-center text-gray-500 py-8">
              <Music className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p>Queue is empty</p>
              <p className="text-sm">Request songs to build the community playlist!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
