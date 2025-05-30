
import { useState, Suspense, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import { CommunityChallenge } from '@/components/community/CommunityChallenge';
import { PhotoContest } from '@/components/community/PhotoContest';
import { SocialShare } from '@/components/community/SocialShare';
import CommunityGoalsList from '@/components/community/CommunityGoalsList';
import { Trophy, Camera, Share2, Target } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const CommunityHub = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('challenges');
  const queryClient = useQueryClient();

  // Optimized challenges query with better error handling
  const { data: challenges = [], isLoading: challengesLoading, error: challengesError } = useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('challenges')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (error) {
          console.error('Error fetching challenges:', error);
          throw new Error(`Failed to load challenges: ${error.message}`);
        }
        return data || [];
      } catch (error) {
        console.error('Error in challenges query:', error);
        throw error;
      }
    },
    staleTime: 30000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Optimized photo contests query with better error handling
  const { data: photoContests = [], isLoading: contestsLoading, error: contestsError } = useQuery({
    queryKey: ['photo_contests'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('photo_contests')
          .select(`
            *,
            photo_contest_submissions(
              id,
              image_url,
              title,
              description,
              votes,
              created_at,
              profiles(first_name, last_name)
            )
          `)
          .eq('active', true)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) {
          console.error('Error fetching photo contests:', error);
          throw new Error(`Failed to load photo contests: ${error.message}`);
        }
        return data || [];
      } catch (error) {
        console.error('Error in photo contests query:', error);
        throw error;
      }
    },
    staleTime: 30000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Optimized leaderboard query with better error handling
  const { data: leaderboard = [], isLoading: leaderboardLoading, error: leaderboardError } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, current_points, membership_tier')
          .eq('role', 'customer')
          .order('current_points', { ascending: false })
          .limit(10);
        
        if (error) {
          console.error('Error fetching leaderboard:', error);
          throw new Error(`Failed to load leaderboard: ${error.message}`);
        }
        
        return data?.map((profile, index) => ({
          id: profile.id,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous',
          referrals: 0,
          pointsEarned: profile.current_points,
          rank: index + 1,
          badge: profile.membership_tier === 'gold' ? 'Champion' : 
                 profile.membership_tier === 'silver' ? 'Elite' : undefined
        })) || [];
      } catch (error) {
        console.error('Error in leaderboard query:', error);
        throw error;
      }
    },
    staleTime: 60000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Memoized mutation handlers to prevent recreation on every render
  const joinChallengeMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('challenge_participants')
        .insert({
          challenge_id: challengeId,
          user_id: user.id
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('🎯 Challenge joined! Start earning points now!');
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
    onError: (error: any) => {
      console.error('Error joining challenge:', error);
      toast.error(`Failed to join challenge: ${error.message}`);
    }
  });

  const submitPhotoMutation = useMutation({
    mutationFn: async ({ contestId, photo, title, description }: {
      contestId: string;
      photo: File;
      title: string;
      description: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const imageUrl = URL.createObjectURL(photo);

      const { error } = await supabase
        .from('photo_contest_submissions')
        .insert({
          contest_id: contestId,
          user_id: user.id,
          image_url: imageUrl,
          title,
          description
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('📸 Photo submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['photo_contests'] });
    },
    onError: (error: any) => {
      console.error('Error submitting photo:', error);
      toast.error(`Failed to submit photo: ${error.message}`);
    }
  });

  const votePhotoMutation = useMutation({
    mutationFn: async (submissionId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('photo_contest_votes')
        .insert({
          submission_id: submissionId,
          user_id: user.id
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('❤️ Vote cast! Thanks for supporting fellow coffee lovers!');
      queryClient.invalidateQueries({ queryKey: ['photo_contests'] });
    },
    onError: (error: any) => {
      console.error('Error voting for photo:', error);
      toast.error(`Failed to vote for photo: ${error.message}`);
    }
  });

  // Memoized handlers
  const handleJoinChallenge = useCallback((challengeId: string) => {
    joinChallengeMutation.mutate(challengeId);
  }, [joinChallengeMutation]);

  const handleSubmitPhoto = useCallback((contestId: string, photo: File, title: string, description: string) => {
    submitPhotoMutation.mutate({ contestId, photo, title, description });
  }, [submitPhotoMutation]);

  const handleVotePhoto = useCallback((submissionId: string) => {
    votePhotoMutation.mutate(submissionId);
  }, [votePhotoMutation]);

  // Show error state if any query failed
  const hasErrors = challengesError || contestsError || leaderboardError;
  if (hasErrors) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-[#95A5A6]/5 via-white to-[#95A5A6]/10 flex items-center justify-center">
          <div className="text-center p-6 max-w-md">
            <div className="text-red-600 mb-4">
              <svg className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Community Hub</h3>
            <p className="text-gray-600 mb-4">There was an error loading the community features. Please try again later.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Show loading state
  const isLoading = challengesLoading || contestsLoading || leaderboardLoading;
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-[#95A5A6]/5 via-white to-[#95A5A6]/10 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading community hub..." />
        </div>
      </Layout>
    );
  }

  // Memoized formatted challenges to prevent recreation
  const formattedChallenges = useMemo(() => 
    challenges.map(challenge => ({
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      type: challenge.type as 'daily' | 'weekly' | 'monthly',
      target: challenge.target,
      current: 0,
      reward: challenge.reward,
      expiresAt: new Date(challenge.expires_at),
      participants: 0
    })), [challenges]
  );

  // Memoized current contest to prevent recreation
  const currentContest = useMemo(() => {
    if (!photoContests[0]) return null;
    
    return {
      id: photoContests[0].id,
      title: photoContests[0].title,
      description: photoContests[0].description || '',
      theme: photoContests[0].theme || '',
      prize: photoContests[0].prize || '',
      endsAt: new Date(photoContests[0].ends_at),
      maxSubmissions: photoContests[0].max_submissions || 100,
      submissions: (photoContests[0].photo_contest_submissions || []).map((sub: any) => ({
        id: sub.id,
        imageUrl: sub.image_url,
        title: sub.title,
        description: sub.description || '',
        author: sub.profiles ? 
          `${sub.profiles.first_name || ''} ${sub.profiles.last_name || ''}`.trim() : 
          'Anonymous',
        votes: sub.votes,
        submittedAt: new Date(sub.created_at)
      }))
    };
  }, [photoContests]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#95A5A6]/5 via-white to-[#95A5A6]/10">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Community Hub
            </h1>
            <p className="text-xl text-[#95A5A6] max-w-2xl mx-auto">
              Connect, compete, and celebrate coffee culture with fellow enthusiasts
            </p>
          </div>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-[#95A5A6]/10 p-1 rounded-xl">
              <TabsTrigger 
                value="challenges" 
                className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-white transition-all"
              >
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Challenges</span>
              </TabsTrigger>
              <TabsTrigger 
                value="photos" 
                className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-white transition-all"
              >
                <Camera className="h-4 w-4" />
                <span className="hidden sm:inline">Photo Contest</span>
              </TabsTrigger>
              <TabsTrigger 
                value="social" 
                className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-white transition-all"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Social & Referrals</span>
              </TabsTrigger>
              <TabsTrigger 
                value="goals" 
                className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-white transition-all"
              >
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Community Goals</span>
              </TabsTrigger>
            </TabsList>

            <Suspense fallback={<LoadingSpinner size="lg" text="Loading content..." />}>
              <TabsContent value="challenges" className="space-y-6">
                <CommunityChallenge 
                  challenges={formattedChallenges}
                  onJoinChallenge={handleJoinChallenge}
                />
              </TabsContent>

              <TabsContent value="photos" className="space-y-6">
                {currentContest ? (
                  <PhotoContest
                    contest={currentContest}
                    onSubmitPhoto={handleSubmitPhoto}
                    onVotePhoto={handleVotePhoto}
                  />
                ) : (
                  <div className="text-center py-12">
                    <Camera className="h-12 w-12 text-[#95A5A6] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-black mb-2">No Active Photo Contest</h3>
                    <p className="text-[#95A5A6]">Check back soon for new photo contests!</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="social" className="space-y-6">
                <SocialShare
                  referralCode="COFFEE2024"
                  totalReferrals={5}
                  pointsFromReferrals={250}
                  leaderboard={leaderboard}
                  userRank={12}
                />
              </TabsContent>

              <TabsContent value="goals" className="space-y-6">
                <CommunityGoalsList />
              </TabsContent>
            </Suspense>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default CommunityHub;
