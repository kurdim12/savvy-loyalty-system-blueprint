
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Music, Play, Pause, SkipForward, ThumbsUp, Search, Volume2, Users, Radio } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SongRequest {
  id: string;
  song_name: string;
  artist_name: string;
  album_name?: string;
  duration: number;
  spotify_uri?: string;
  requested_by: string;
  votes: number;
  created_at: string;
  user_has_voted: boolean;
}

interface CurrentlyPlaying {
  song_name: string;
  artist_name: string;
  album_name: string;
  duration: number;
  current_time: number;
  total_votes: number;
  spotify_uri?: string;
}

export const RealCafeMusicSystem = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlaying>({
    song_name: 'Café Jazz Vibes',
    artist_name: 'Coffee House Collective',
    album_name: 'Morning Brew',
    duration: 240,
    current_time: 67,
    total_votes: 15
  });
  const [isPlaying, setIsPlaying] = useState(true);
  const queryClient = useQueryClient();

  // Mock song requests data - in real implementation this would come from Supabase
  const [songRequests, setSongRequests] = useState<SongRequest[]>([
    {
      id: '1',
      song_name: 'Lo-Fi Study Beats',
      artist_name: 'Chill Vibes',
      album_name: 'Focus Flow',
      duration: 180,
      votes: 12,
      requested_by: 'Jordan P.',
      created_at: new Date().toISOString(),
      user_has_voted: false
    },
    {
      id: '2',
      song_name: 'Acoustic Morning',
      artist_name: 'Sunrise Sessions',
      album_name: 'Dawn Melodies',
      duration: 200,
      votes: 8,
      requested_by: 'Sarah M.',
      created_at: new Date().toISOString(),
      user_has_voted: false
    },
    {
      id: '3',
      song_name: 'Smooth Jazz Café',
      artist_name: 'Urban Coffee',
      album_name: 'City Mornings',
      duration: 195,
      votes: 6,
      requested_by: 'Alex K.',
      created_at: new Date().toISOString(),
      user_has_voted: false
    }
  ]);

  // Simulate currently playing progress
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentlyPlaying(prev => {
        if (prev.current_time >= prev.duration) {
          // Auto-play the top voted song when current finishes
          const topSong = songRequests[0];
          if (topSong) {
            toast.success(`🎵 Now playing in the café: ${topSong.song_name} by ${topSong.artist_name}`);
            // Remove the song from queue after it starts playing
            setSongRequests(prev => prev.filter(song => song.id !== topSong.id));
            return {
              song_name: topSong.song_name,
              artist_name: topSong.artist_name,
              album_name: topSong.album_name || 'Unknown Album',
              duration: topSong.duration,
              current_time: 0,
              total_votes: topSong.votes,
              spotify_uri: topSong.spotify_uri
            };
          }
          return { ...prev, current_time: 0 };
        }
        return { ...prev, current_time: prev.current_time + 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, songRequests]);

  // Mock Spotify search - in real implementation this would use Spotify Web API
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockResults = [
        {
          id: 'spotify_1',
          name: searchQuery,
          artist: 'Various Artists',
          album: 'Popular Songs',
          duration: 180,
          uri: 'spotify:track:example1'
        },
        {
          id: 'spotify_2',
          name: `${searchQuery} (Acoustic Version)`,
          artist: 'Indie Artist',
          album: 'Acoustic Sessions',
          duration: 195,
          uri: 'spotify:track:example2'
        }
      ];
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleVote = (requestId: string) => {
    if (!user) {
      toast.error('Please sign in to vote');
      return;
    }

    setSongRequests(prev => 
      prev.map(song => 
        song.id === requestId 
          ? { ...song, votes: song.votes + 1, user_has_voted: true }
          : song
      ).sort((a, b) => b.votes - a.votes)
    );
    
    toast.success('🗳️ Vote cast! This song moved up in the café queue!');
  };

  const handleRequestSong = (song: any) => {
    if (!user) {
      toast.error('Please sign in to request songs');
      return;
    }

    const newRequest: SongRequest = {
      id: `req_${Date.now()}`,
      song_name: song.name,
      artist_name: song.artist,
      album_name: song.album,
      duration: song.duration,
      spotify_uri: song.uri,
      votes: 1,
      requested_by: user.email?.split('@')[0] || 'Anonymous',
      created_at: new Date().toISOString(),
      user_has_voted: true
    };

    setSongRequests(prev => [...prev, newRequest].sort((a, b) => b.votes - a.votes));
    setSearchResults([]);
    setSearchQuery('');
    
    toast.success('🎵 Song requested! It will play in the café when it gets enough votes!');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Live Café Audio Status */}
      <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-300/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <Radio className="h-6 w-6 text-green-400 animate-pulse" />
              <div>
                <span className="text-lg">Live on Café Speakers</span>
                <div className="text-xs text-green-200 font-normal">Playing throughout the café</div>
              </div>
            </div>
            <Badge className="bg-red-500/20 text-red-200 border-red-400/30 animate-pulse">
              <Volume2 className="h-3 w-3 mr-1" />
              LIVE
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-[#8B4513] to-[#D2B48C] rounded-xl flex items-center justify-center shadow-lg">
              <Music className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white text-lg">{currentlyPlaying.song_name}</h4>
              <p className="text-green-200 text-sm mb-1">{currentlyPlaying.artist_name}</p>
              <p className="text-xs text-green-300 mb-2">{currentlyPlaying.album_name} • {currentlyPlaying.total_votes} votes</p>
              <div className="flex items-center gap-3">
                <span className="text-xs text-green-300 min-w-[2.5rem]">{formatTime(currentlyPlaying.current_time)}</span>
                <Progress 
                  value={(currentlyPlaying.current_time / currentlyPlaying.duration) * 100} 
                  className="h-2 flex-1 bg-green-900/30" 
                />
                <span className="text-xs text-green-300 min-w-[2.5rem]">{formatTime(currentlyPlaying.duration)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                size="sm"
                disabled
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                disabled
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-white border-white/30">
                <Users className="h-3 w-3 mr-1" />
                Café Audio System
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spotify Search & Request */}
      <Card className="bg-white/95 backdrop-blur-sm border-[#8B4513]/20">
        <CardHeader>
          <CardTitle className="text-[#8B4513] flex items-center gap-2">
            <Search className="h-5 w-5" />
            Request Songs via Spotify
          </CardTitle>
          <p className="text-sm text-gray-600">Search and request songs to play on the café speakers!</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for songs on Spotify..."
              className="flex-1 border-[#8B4513]/20 focus:border-[#8B4513] focus:ring-[#8B4513]/20"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSearching ? '...' : <Search className="h-4 w-4" />}
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-[#8B4513]">Search Results:</h4>
              {searchResults.map((song) => (
                <div key={song.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h5 className="font-semibold text-[#8B4513]">{song.name}</h5>
                    <p className="text-sm text-gray-600">{song.artist} • {song.album}</p>
                    <span className="text-xs text-gray-500">{formatTime(song.duration)}</span>
                  </div>
                  <Button
                    onClick={() => handleRequestSong(song)}
                    className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white"
                    size="sm"
                  >
                    Request
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Café Song Queue with Voting */}
      <Card className="bg-white/95 backdrop-blur-sm border-[#8B4513]/20">
        <CardHeader>
          <CardTitle className="text-[#8B4513] flex items-center gap-2">
            <ThumbsUp className="h-5 w-5" />
            Café Music Queue - Vote for Next!
          </CardTitle>
          <p className="text-sm text-gray-600">Vote for songs to play next on the café speakers. Most voted plays first!</p>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {songRequests.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Music className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-2">No songs in queue</p>
              <p className="text-sm">Be the first to request a song for the café!</p>
            </div>
          ) : (
            songRequests.map((request, index) => (
              <div key={request.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-[#8B4513]/5 rounded-lg border border-[#8B4513]/10 hover:shadow-md transition-all duration-200">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <Badge className={index === 0 ? "bg-yellow-500 text-white" : "bg-[#8B4513]/10 text-[#8B4513]"}>
                      {index === 0 ? "🎵 Next Up" : `#${index + 1}`}
                    </Badge>
                    <h5 className="font-semibold text-[#8B4513]">{request.song_name}</h5>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{request.artist_name}</p>
                  <p className="text-xs text-purple-600">
                    Requested by {request.requested_by} • {formatTime(request.duration)} • Will play on café speakers
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-[#8B4513]/10 px-3 py-1 rounded-full">
                    <ThumbsUp className="h-4 w-4 text-[#8B4513]" />
                    <span className="font-bold text-[#8B4513]">{request.votes}</span>
                  </div>
                  <Button
                    onClick={() => handleVote(request.id)}
                    size="sm"
                    variant="outline"
                    className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white transition-colors"
                    disabled={request.user_has_voted || !user}
                  >
                    {request.user_has_voted ? "Voted ✓" : "Vote"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Spotify Integration Notice */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Music className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">
                Connected to Café Spotify System
              </p>
              <p className="text-xs text-green-600">
                Songs will automatically play on the café speakers when they reach the top of the queue
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
