
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipForward, Users, Music, Plus, Vote, Heart, Volume2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SongRequest {
  id: string;
  song_name: string;
  artist_name: string;
  requested_by: string;
  votes: number;
  area_id: string;
  created_at: string;
  user_has_voted: boolean;
}

interface CurrentlyPlaying {
  song_name: string;
  artist_name: string;
  duration: number;
  current_time: number;
  requested_by: string;
  total_votes: number;
}

interface RealTimeDJSystemProps {
  seatArea: string;
}

export const RealTimeDJSystem = ({ seatArea }: RealTimeDJSystemProps) => {
  const { user } = useAuth();
  const [newSongName, setNewSongName] = useState('');
  const [newArtistName, setNewArtistName] = useState('');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlaying>({
    song_name: 'Café Jazz Vibes',
    artist_name: 'Coffee House Collective',
    duration: 240,
    current_time: 67,
    requested_by: 'Maya S.',
    total_votes: 15
  });
  const [isPlaying, setIsPlaying] = useState(true);
  const queryClient = useQueryClient();

  // Fetch song requests (global queue, not area-specific)
  const { data: songRequests = [], isLoading, error } = useQuery({
    queryKey: ['song-requests-global'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('song_requests' as any)
          .select(`
            id,
            song_name,
            artist_name,
            votes,
            area_id,
            created_at,
            profiles:requested_by (
              first_name,
              last_name
            )
          `)
          .order('votes', { ascending: false })
          .order('created_at', { ascending: true })
          .limit(10);
        
        if (error) {
          console.error('Error fetching song requests:', error);
          return [];
        }
        
        return (data || []).map((request: any) => ({
          id: request.id,
          song_name: request.song_name,
          artist_name: request.artist_name,
          votes: request.votes,
          area_id: request.area_id,
          created_at: request.created_at,
          requested_by: request.profiles ? 
            `${request.profiles.first_name} ${request.profiles.last_name}`.trim() : 
            'Anonymous',
          user_has_voted: false
        })) as SongRequest[];
      } catch (err) {
        console.error('Failed to fetch song requests:', err);
        return [];
      }
    },
    refetchInterval: 3000,
    retry: 3,
  });

  // Real-time subscription for song requests
  useEffect(() => {
    const channel = supabase
      .channel('global-dj-system')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'song_requests'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['song-requests-global'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Simulate currently playing progress and auto-play next song
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentlyPlaying(prev => {
        if (prev.current_time >= prev.duration) {
          // Auto-play the top voted song when current finishes
          const topSong = songRequests[0];
          if (topSong) {
            toast.success(`🎵 Now playing across all areas: ${topSong.song_name} by ${topSong.artist_name}`);
            return {
              song_name: topSong.song_name,
              artist_name: topSong.artist_name,
              duration: 180 + Math.random() * 120,
              current_time: 0,
              requested_by: topSong.requested_by,
              total_votes: topSong.votes
            };
          }
          return { ...prev, current_time: 0 };
        }
        return { ...prev, current_time: prev.current_time + 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, songRequests]);

  // Request song mutation
  const requestSongMutation = useMutation({
    mutationFn: async ({ songName, artistName }: { songName: string; artistName: string }) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('song_requests' as any)
        .insert({
          song_name: songName,
          artist_name: artistName,
          requested_by: user.id,
          area_id: 'global', // All requests go to global queue
          votes: 1
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      setNewSongName('');
      setNewArtistName('');
      toast.success('🎵 Song requested! Others can vote for it to play across all areas!');
      queryClient.invalidateQueries({ queryKey: ['song-requests-global'] });
    },
    onError: (error: any) => {
      console.error('Failed to request song:', error);
      toast.error('Failed to request song. Please try again.');
    }
  });

  // Vote song mutation
  const voteSongMutation = useMutation({
    mutationFn: async (requestId: string) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      // First check if user already voted
      const { data: existingVote } = await supabase
        .from('song_votes' as any)
        .select('id')
        .eq('request_id', requestId)
        .eq('user_id', user.id)
        .single();
      
      if (existingVote) {
        throw new Error('You have already voted for this song!');
      }
      
      // Add vote
      const { error: voteError } = await supabase
        .from('song_votes' as any)
        .insert({
          request_id: requestId,
          user_id: user.id
        });
      
      if (voteError) throw voteError;
      
      // Update vote count using the function
      const { error: updateError } = await supabase.rpc('increment_song_votes', {
        request_id: requestId
      });
      
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      toast.success('🗳️ Vote cast! When this song gets enough votes, it will play across all areas!');
      queryClient.invalidateQueries({ queryKey: ['song-requests-global'] });
    },
    onError: (error: any) => {
      console.error('Failed to vote:', error);
      toast.error(error.message || 'Failed to vote. Please try again.');
    }
  });

  const handleRequestSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSongName.trim() || !newArtistName.trim()) return;
    
    requestSongMutation.mutate({
      songName: newSongName.trim(),
      artistName: newArtistName.trim()
    });
  };

  const handleVote = (requestId: string) => {
    voteSongMutation.mutate(requestId);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-red-500">
            <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Failed to load music system. Please try refreshing.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Now Playing Across All Areas */}
      <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-300/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <Volume2 className="h-6 w-6 text-purple-400" />
              <div>
                <span className="text-lg">Playing in All Areas</span>
                <div className="text-xs text-purple-200 font-normal">Everyone hears this</div>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-200 border-green-400/30">
              <Users className="h-3 w-3 mr-1" />
              Live Everywhere
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
              <p className="text-purple-200 text-sm mb-1">{currentlyPlaying.artist_name}</p>
              <p className="text-xs text-purple-300 mb-2">Requested by {currentlyPlaying.requested_by} • {currentlyPlaying.total_votes} votes</p>
              <div className="flex items-center gap-3">
                <span className="text-xs text-purple-300 min-w-[2.5rem]">{formatTime(currentlyPlaying.current_time)}</span>
                <Progress 
                  value={(currentlyPlaying.current_time / currentlyPlaying.duration) * 100} 
                  className="h-2 flex-1 bg-purple-900/30" 
                />
                <span className="text-xs text-purple-300 min-w-[2.5rem]">{formatTime(currentlyPlaying.duration)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                size="sm"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-400" />
              <span className="text-sm text-white">Playing everywhere in the café</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Request New Song */}
      <Card className="bg-white/95 backdrop-blur-sm border-[#8B4513]/20">
        <CardHeader>
          <CardTitle className="text-[#8B4513] flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Request a Song for Everyone
          </CardTitle>
          <p className="text-sm text-gray-600">Your song will play across all areas when it gets enough votes!</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleRequestSong} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                value={newSongName}
                onChange={(e) => setNewSongName(e.target.value)}
                placeholder="Song name..."
                className="border-[#8B4513]/20 focus:border-[#8B4513] focus:ring-[#8B4513]/20"
                disabled={requestSongMutation.isPending || !user}
              />
              <Input
                value={newArtistName}
                onChange={(e) => setNewArtistName(e.target.value)}
                placeholder="Artist name..."
                className="border-[#8B4513]/20 focus:border-[#8B4513] focus:ring-[#8B4513]/20"
                disabled={requestSongMutation.isPending || !user}
              />
            </div>
            <Button
              type="submit"
              disabled={!newSongName.trim() || !newArtistName.trim() || requestSongMutation.isPending || !user}
              className="w-full bg-[#8B4513] hover:bg-[#8B4513]/90 text-white shadow-lg"
            >
              {requestSongMutation.isPending ? (
                <>Adding to global queue...</>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Request Song for All Areas
                </>
              )}
            </Button>
            {!user && (
              <p className="text-center text-sm text-gray-500">
                Please sign in to request songs
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Global Song Queue with Voting */}
      <Card className="bg-white/95 backdrop-blur-sm border-[#8B4513]/20">
        <CardHeader>
          <CardTitle className="text-[#8B4513] flex items-center gap-2">
            <Vote className="h-5 w-5" />
            Global Song Queue - Vote for Next!
          </CardTitle>
          <p className="text-sm text-gray-600">The most voted song plays next across all areas! Vote to make your favorite play everywhere.</p>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="text-center text-gray-500 py-8">
              <Music className="h-8 w-8 mx-auto mb-2 animate-pulse" />
              Loading song requests...
            </div>
          ) : songRequests.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Music className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-2">No songs in global queue</p>
              <p className="text-sm">Be the first to request a song for everyone!</p>
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
                  <p className="text-xs text-purple-600">Requested by {request.requested_by} • Will play everywhere</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-[#8B4513]/10 px-3 py-1 rounded-full">
                    <Vote className="h-4 w-4 text-[#8B4513]" />
                    <span className="font-bold text-[#8B4513]">{request.votes}</span>
                  </div>
                  <Button
                    onClick={() => handleVote(request.id)}
                    size="sm"
                    variant="outline"
                    className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white transition-colors"
                    disabled={voteSongMutation.isPending || request.user_has_voted || !user}
                  >
                    {request.user_has_voted ? "Voted ✓" : "Vote"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
