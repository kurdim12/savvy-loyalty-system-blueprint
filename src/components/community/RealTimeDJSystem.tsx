
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipForward, Heart, Users, Music, Crown, Plus, Vote } from 'lucide-react';
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
  dj_name: string;
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
    dj_name: 'Community DJ'
  });
  const [isPlaying, setIsPlaying] = useState(true);
  const queryClient = useQueryClient();

  // Fetch song requests for this area
  const { data: songRequests = [], isLoading } = useQuery({
    queryKey: ['song-requests', seatArea],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('song_requests')
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
        .eq('area_id', seatArea)
        .order('votes', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(10);
      
      if (error) {
        console.error('Error fetching song requests:', error);
        return [];
      }
      
      return (data || []).map(request => ({
        id: request.id,
        song_name: request.song_name,
        artist_name: request.artist_name,
        votes: request.votes,
        area_id: request.area_id,
        created_at: request.created_at,
        requested_by: request.profiles ? 
          `${request.profiles.first_name} ${request.profiles.last_name}`.trim() : 
          'Anonymous',
        user_has_voted: false // We'll implement vote tracking later
      }));
    },
    refetchInterval: 5000,
  });

  // Real-time subscription for song requests
  useEffect(() => {
    const channel = supabase
      .channel(`dj-system-${seatArea}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'song_requests',
          filter: `area_id=eq.${seatArea}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['song-requests', seatArea] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [seatArea, queryClient]);

  // Simulate currently playing progress
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentlyPlaying(prev => {
        if (prev.current_time >= prev.duration) {
          // Auto-play next song when current finishes
          const topSong = songRequests[0];
          if (topSong) {
            return {
              song_name: topSong.song_name,
              artist_name: topSong.artist_name,
              duration: 180 + Math.random() * 120, // Random duration between 3-5 minutes
              current_time: 0,
              dj_name: 'Community DJ'
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
        .from('song_requests')
        .insert({
          song_name: songName,
          artist_name: artistName,
          requested_by: user.id,
          area_id: seatArea,
          votes: 1 // Self-vote
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      setNewSongName('');
      setNewArtistName('');
      toast.success('🎵 Song requested! Others can now vote for it!');
      queryClient.invalidateQueries({ queryKey: ['song-requests', seatArea] });
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
        .from('song_votes')
        .select('id')
        .eq('request_id', requestId)
        .eq('user_id', user.id)
        .single();
      
      if (existingVote) {
        throw new Error('You have already voted for this song!');
      }
      
      // Add vote
      const { error: voteError } = await supabase
        .from('song_votes')
        .insert({
          request_id: requestId,
          user_id: user.id
        });
      
      if (voteError) throw voteError;
      
      // Update vote count
      const { error: updateError } = await supabase.rpc('increment_song_votes', {
        request_id: requestId
      });
      
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      toast.success('🗳️ Vote cast! Thanks for participating!');
      queryClient.invalidateQueries({ queryKey: ['song-requests', seatArea] });
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

  return (
    <div className="space-y-4">
      {/* Now Playing Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-purple-700">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Now Playing
            </div>
            <Badge className="bg-purple-100 text-purple-800">
              Community DJ
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#8B4513] to-[#D2B48C] rounded-lg flex items-center justify-center">
              <Music className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-[#8B4513]">{currentlyPlaying.song_name}</h4>
              <p className="text-gray-600 text-sm">{currentlyPlaying.artist_name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">{formatTime(currentlyPlaying.current_time)}</span>
                <Progress value={(currentlyPlaying.current_time / currentlyPlaying.duration) * 100} className="h-1 flex-1" />
                <span className="text-xs text-gray-500">{formatTime(currentlyPlaying.duration)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button variant="outline" size="sm">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <Badge className="bg-green-100 text-green-800">
              <Users className="h-3 w-3 mr-1" />
              Community Choice
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Request New Song */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#8B4513]">Request a Song</CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleRequestSong} className="space-y-3">
            <Input
              value={newSongName}
              onChange={(e) => setNewSongName(e.target.value)}
              placeholder="Song name..."
              className="border-[#8B4513]/20 focus:border-[#8B4513]"
              disabled={requestSongMutation.isPending}
            />
            <Input
              value={newArtistName}
              onChange={(e) => setNewArtistName(e.target.value)}
              placeholder="Artist name..."
              className="border-[#8B4513]/20 focus:border-[#8B4513]"
              disabled={requestSongMutation.isPending}
            />
            <Button
              type="submit"
              disabled={!newSongName.trim() || !newArtistName.trim() || requestSongMutation.isPending}
              className="w-full bg-[#8B4513] hover:bg-[#8B4513]/90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Request Song
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Song Queue with Voting */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#8B4513]">Community Song Queue</CardTitle>
          <p className="text-sm text-gray-600">Vote for songs you want to hear next!</p>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="text-center text-gray-500 py-4">Loading song requests...</div>
          ) : songRequests.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No songs in queue. Be the first to request one!
            </div>
          ) : (
            songRequests.map((request, index) => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h5 className="font-semibold text-[#8B4513] text-sm">{request.song_name}</h5>
                  <p className="text-xs text-gray-600">{request.artist_name}</p>
                  <p className="text-xs text-purple-600">Requested by {request.requested_by}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={index === 0 ? "bg-gold-500 text-white" : "bg-[#8B4513]/10 text-[#8B4513]"}>
                    {index === 0 ? "Next" : `#${index + 1}`}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Vote className="h-4 w-4 text-[#8B4513]" />
                    <span className="text-sm font-bold text-[#8B4513]">{request.votes}</span>
                  </div>
                  <Button
                    onClick={() => handleVote(request.id)}
                    size="sm"
                    variant="outline"
                    className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513]/10"
                    disabled={voteSongMutation.isPending || request.user_has_voted}
                  >
                    {request.user_has_voted ? "Voted" : "Vote"}
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
