import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, SkipForward, Volume2, Users, Music, Search, Plus, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Song {
  id: string;
  title: string;
  artist: string;
  votes: number;
  added_by: string;
  created_at: string;
}

interface RealCafeMusicSystemProps {
  seatArea?: string;
}

export const RealCafeMusicSystem = ({ seatArea = 'global' }: RealCafeMusicSystemProps) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const queryClient = useQueryClient();

  // Fetch songs
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
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  // Search songs
  const { data: searchResults, isLoading: isSearchLoading } = useQuery({
    queryKey: ['searchSongs', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];

      // Simulate searching (replace with actual search logic)
      const filteredSongs = songs.filter(song =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return filteredSongs;
    },
    enabled: !!searchQuery, // Only run when there is a search query
  });

  // Add song mutation
  const addSongMutation = useMutation({
    mutationFn: async (newSong: Omit<Song, 'id' | 'votes'>) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('songs')
        .insert([{ ...newSong, added_by: user.id, seat_area: seatArea }]);

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
    // Implement skip logic here
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

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-[#8B4513]/20">
      <CardHeader className="pb-3 border-b border-[#8B4513]/10">
        <CardTitle className="text-[#8B4513] flex items-center gap-2">
          <Music className="h-5 w-5" />
          Community Music
        </CardTitle>
        <p className="text-sm text-gray-600">Add and vote for your favorite songs!</p>
      </CardHeader>

      <CardContent className="p-4">
        {/* Search Input */}
        <div className="mb-4 flex items-center gap-2">
          <Input
            type="search"
            placeholder="Search for a song..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-[#8B4513]/20 focus:border-[#8B4513] focus:ring-[#8B4513]/20"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={handleAddSong}
            className="bg-[#8B4513]/10 hover:bg-[#8B4513]/20 text-[#8B4513]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Song
          </Button>
        </div>

        {/* Song List */}
        <div className="max-h-64 overflow-y-auto space-y-3">
          {isSearchLoading ? (
            <div className="text-center text-gray-500 py-4">
              <Search className="h-6 w-6 mx-auto mb-2 animate-pulse" />
              Searching songs...
            </div>
          ) : searchQuery && searchResults && searchResults.length > 0 ? (
            searchResults.map((song) => (
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
          ) : isLoading ? (
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
              <p className="text-sm">Be the first to add a song!</p>
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
