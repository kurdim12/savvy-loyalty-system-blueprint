
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, SkipForward, Volume2, Users, Music, Search, Plus, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useSpotify } from '@/hooks/useSpotify';

interface Song {
  id: string;
  title: string;
  artist: string;
  votes: number;
  added_by: string;
  seat_area: string;
  created_at: string;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  uri: string;
  duration_ms: number;
  preview_url?: string;
}

interface RealCafeMusicSystemProps {
  seatArea?: string;
}

export const RealCafeMusicSystem = ({ seatArea = 'global' }: RealCafeMusicSystemProps) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [spotifyResults, setSpotifyResults] = useState<SpotifyTrack[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const queryClient = useQueryClient();

  const { isAuthenticated, searchTracks, playTrack } = useSpotify();

  // Fetch songs from database
  const { data: songs = [], isLoading, error } = useQuery({
    queryKey: ['songs', seatArea],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('seat_area', seatArea)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching songs:', error);
        throw error;
      }

      return data as Song[];
    },
    refetchInterval: 5000,
  });

  // Search Spotify tracks
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      if (isAuthenticated) {
        const results = await searchTracks(searchQuery);
        setSpotifyResults(results);
      } else {
        // Fallback to filtering existing songs if Spotify not connected
        const filteredSongs = songs.filter(song =>
          song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.artist.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSpotifyResults([]);
        toast.info('Connect Spotify for better search results!');
      }
    } catch (error) {
      toast.error('Failed to search tracks');
    } finally {
      setIsSearching(false);
    }
  };

  // Add song mutation
  const addSongMutation = useMutation({
    mutationFn: async (newSong: { title: string; artist: string }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('songs')
        .insert([{ 
          ...newSong, 
          added_by: user.id, 
          seat_area: seatArea,
          votes: 0
        }]);

      if (error) {
        console.error('Error adding song:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs', seatArea] });
      toast.success('Song added!', { duration: 2000 });
    },
    onError: (error: any) => {
      toast.error(`Failed to add song: ${error.message}`, { duration: 2000 });
    },
  });

  // Vote song mutation
  const voteSongMutation = useMutation({
    mutationFn: async (songId: string) => {
      const { data, error } = await supabase.rpc('vote_for_song', { song_id: songId });

      if (error) {
        console.error('Error voting for song:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs', seatArea] });
    },
    onError: (error: any) => {
      toast.error(`Failed to vote: ${error.message}`, { duration: 2000 });
    },
  });

  // Play song from Spotify
  const handlePlaySpotifyTrack = async (track: SpotifyTrack) => {
    if (isAuthenticated) {
      try {
        await playTrack(track.uri);
        toast.success(`Now playing: ${track.name} by ${track.artists.map(a => a.name).join(', ')}`);
      } catch (error) {
        toast.error('Failed to play track. Make sure Spotify is open on a device.');
      }
    } else {
      toast.error('Please connect to Spotify to play tracks');
    }
  };

  // Add Spotify track to community playlist
  const handleAddSpotifyTrack = async (track: SpotifyTrack) => {
    try {
      await addSongMutation.mutateAsync({ 
        title: track.name, 
        artist: track.artists.map(a => a.name).join(', ')
      });
    } catch (error) {
      console.error('Failed to add track:', error);
    }
  };

  // Placeholder functions for music control
  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    toast.success(`Now playing: ${song.title} by ${song.artist}`, { duration: 3000 });
  };

  const pauseSong = () => {
    setIsPlaying(false);
    toast.info('Music paused', { duration: 2000 });
  };

  const skipSong = () => {
    toast.info('Skipping to the next song...', { duration: 2000 });
  };

  const handleAddSong = async () => {
    const title = prompt('Enter song title:');
    const artist = prompt('Enter song artist:');

    if (title && artist) {
      try {
        await addSongMutation.mutateAsync({ title, artist });
      } catch (error) {
        console.error('Failed to add song:', error);
      }
    } else {
      toast.error('Title and artist are required.', { duration: 2000 });
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-[#8B4513]/20">
      <CardHeader className="pb-3 border-b border-[#8B4513]/10">
        <CardTitle className="text-[#8B4513] flex items-center gap-2">
          <Music className="h-5 w-5" />
          Community Music
          {!isAuthenticated && (
            <Badge variant="outline" className="text-xs">Connect Spotify for full features</Badge>
          )}
        </CardTitle>
        <p className="text-sm text-gray-600">Search for songs and add them to the community playlist!</p>
      </CardHeader>

      <CardContent className="p-4">
        {/* Search Input */}
        <div className="mb-4 flex items-center gap-2">
          <Input
            type="search"
            placeholder="Search for a song or artist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 border-[#8B4513]/20 focus:border-[#8B4513] focus:ring-[#8B4513]/20"
          />
          <Button
            onClick={handleSearch}
            disabled={!searchQuery.trim() || isSearching}
            className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white"
          >
            {isSearching ? '...' : <Search className="h-4 w-4" />}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleAddSong}
            className="bg-[#8B4513]/10 hover:bg-[#8B4513]/20 text-[#8B4513]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Manual Add
          </Button>
        </div>

        {/* Search Results */}
        {spotifyResults.length > 0 && (
          <div className="mb-4 space-y-2">
            <h4 className="font-medium text-[#8B4513]">Search Results:</h4>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {spotifyResults.map((track) => (
                <div key={track.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      {track.album.images[0] ? (
                        <img 
                          src={track.album.images[0].url} 
                          alt={track.album.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <Music className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-[#8B4513]">{track.name}</h5>
                      <p className="text-sm text-gray-600">
                        {track.artists.map(a => a.name).join(', ')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {track.album.name} • {formatDuration(track.duration_ms)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handlePlaySpotifyTrack(track)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                      disabled={!isAuthenticated}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleAddSpotifyTrack(track)}
                      variant="outline"
                      size="sm"
                      className="text-[#8B4513] border-[#8B4513]/20 hover:bg-[#8B4513]/10 hover:border-[#8B4513]"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Community Playlist */}
        <div className="space-y-2">
          <h4 className="font-medium text-[#8B4513]">Community Playlist:</h4>
          <div className="max-h-64 overflow-y-auto space-y-3">
            {isLoading ? (
              <div className="text-center text-gray-500 py-4">
                <Music className="h-6 w-6 mx-auto mb-2 animate-pulse" />
                Loading songs...
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-4">
                <Music className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p className="font-medium">Failed to load songs</p>
                <p className="text-sm">Please try again later</p>
              </div>
            ) : songs.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Music className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium mb-2">No songs yet</p>
                <p className="text-sm">Search and add the first song!</p>
              </div>
            ) : (
              songs.map((song) => (
                <div key={song.id} className="flex items-center justify-between p-3 rounded-lg shadow-sm border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-800">{song.title}</p>
                    <p className="text-sm text-gray-600">{song.artist}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => voteSongMutation.mutate(song.id)}
                    className="text-[#8B4513] border-[#8B4513]/20 hover:bg-[#8B4513]/10 hover:border-[#8B4513]"
                  >
                    Vote ({song.votes || 0})
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>

      {/* Music Controls */}
      {currentSong && (
        <CardFooter className="flex items-center justify-between border-t border-[#8B4513]/10">
          <div>
            <p className="font-medium text-gray-800">{currentSong.title}</p>
            <p className="text-sm text-gray-600">{currentSong.artist}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={skipSong}>
              <SkipForward className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={isPlaying ? pauseSong : () => playSong(currentSong)}>
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Volume2 className="h-5 w-5" />
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
