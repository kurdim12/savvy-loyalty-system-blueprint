
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import { CommunityChallenge } from '@/components/community/CommunityChallenge';
import { PhotoContest } from '@/components/community/PhotoContest';
import { SocialShare } from '@/components/community/SocialShare';
import CommunityGoalsList from '@/components/community/CommunityGoalsList';
import { LoadingState } from '@/components/community/LoadingState';
import { ErrorState } from '@/components/community/ErrorState';
import { EmptyState } from '@/components/community/EmptyState';
import { Trophy, Camera, Share2, Target } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const CommunityHub = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('challenges');
  const queryClient = useQueryClient();

  // Fetch challenges with participant counts
  const { data: challenges = [], isLoading: challengesLoading, error: challengesError } = useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      console.log('🔍 Fetching challenges...');
      
      try {
        const { data, error } = await supabase
          .from('challenges')
          .select(`
            id, 
            title, 
            description, 
            type, 
            target, 
            reward, 
            expires_at, 
            active,
            challenge_participants (id)
          `)
          .eq('active', true)
          .order('created_at', { ascending: false });
        
        console.log('📊 Challenges query result:', { data, error });
        console.log('📈 Number of challenges found:', data?.length || 0);
        
        if (error) {
          console.error('❌ Error fetching challenges:', error);
          throw error;
        }
        
        return data || [];
      } catch (err) {
        console.error('🚨 Challenge fetch failed:', err);
        throw err;
      }
    },
    enabled: activeTab === 'challenges',
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Fetch photo contests with better error handling
  const { data: photoContests = [], isLoading: contestsLoading, error: contestsError } = useQuery({
    queryKey: ['photo_contests'],
    queryFn: async () => {
      console.log('📸 Fetching photo contests...');
      
      try {
        const { data, error } = await supabase
          .from('photo_contests')
          .select(`
            id, title, description, theme, prize, ends_at, max_submissions, active,
            photo_contest_submissions(
              id, image_url, title, description, votes, created_at,
              profiles(first_name, last_name)
            )
          `)
          .eq('active', true)
          .order('created_at', { ascending: false })
          .limit(1);
        
        console.log('📊 Photo contests query result:', { data, error });
        
        if (error) {
          console.error('❌ Error fetching photo contests:', error);
          throw error;
        }
        return data || [];
      } catch (err) {
        console.error('🚨 Photo contest fetch failed:', err);
        throw err;
      }
    },
    enabled: activeTab === 'photos',
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });

  // Safer leaderboard query with better error handling
  const { data: leaderboard = [], error: leaderboardError } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      console.log('🏆 Fetching leaderboard...');
      
      try {
        // Try the secure function first
        const { data, error } = await supabase.rpc('get_referral_stats');
        
        if (error) {
          console.warn('⚠️ Secure leaderboard failed, trying basic query:', error);
          
          // Fallback to basic query for non-admin users
          const { data: basicData, error: basicError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, current_points, membership_tier, visits')
            .eq('role', 'customer')
            .order('current_points', { ascending: false })
            .limit(10);
          
          if (basicError) throw basicError;
          
          return basicData?.map((profile: any, index: number) => ({
            id: profile.id,
            name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous',
            referrals: 0,
            pointsEarned: profile.current_points,
            rank: index + 1,
            badge: profile.current_points >= 500 ? 'Champion' : 
                   profile.current_points >= 200 ? 'Elite' : undefined
          })) || [];
        }
        
        return data?.map((profile: any, index: number) => ({
          id: profile.referrer_id,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous',
          referrals: profile.total_referrals,
          pointsEarned: profile.total_bonus_points,
          rank: index + 1,
          badge: profile.total_bonus_points >= 500 ? 'Champion' : 
                 profile.total_bonus_points >= 200 ? 'Elite' : undefined
        })) || [];
      } catch (err) {
        console.error('🚨 Leaderboard fetch failed:', err);
        return [];
      }
    },
    enabled: activeTab === 'social',
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // Join challenge mutation with better error handling
  const joinChallengeMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      console.log('🎯 Joining challenge:', challengeId);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('challenge_participants')
        .insert({
          challenge_id: challengeId,
          user_id: user.id
        });
      
      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('You have already joined this challenge!');
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('🎯 Challenge joined! Start earning points now!');
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
    onError: (error: any) => {
      console.error('❌ Challenge join failed:', error);
      toast.error(error.message || 'Failed to join challenge. Please try again.');
    }
  });

  // Submit photo mutation with validation
  const submitPhotoMutation = useMutation({
    mutationFn: async ({ contestId, photo, title, description }: {
      contestId: string;
      photo: File;
      title: string;
      description: string;
    }) => {
      console.log('📸 Submitting photo to contest:', contestId);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Validate file type and size
      if (!photo.type.startsWith('image/')) {
        throw new Error('Please upload a valid image file');
      }
      
      if (photo.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('Image file must be less than 5MB');
      }

      const imageUrl = URL.createObjectURL(photo);

      const { error } = await supabase
        .from('photo_contest_submissions')
        .insert({
          contest_id: contestId,
          user_id: user.id,
          image_url: imageUrl,
          title: title.trim(),
          description: description.trim()
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('📸 Photo submitted successfully! Good luck in the contest!');
      queryClient.invalidateQueries({ queryKey: ['photo_contests'] });
    },
    onError: (error: any) => {
      console.error('❌ Photo submission failed:', error);
      toast.error(error.message || 'Failed to submit photo. Please try again.');
    }
  });

  // Vote photo mutation with validation
  const votePhotoMutation = useMutation({
    mutationFn: async (submissionId: string) => {
      console.log('❤️ Voting for submission:', submissionId);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('photo_contest_votes')
        .insert({
          submission_id: submissionId,
          user_id: user.id
        });
      
      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('You have already voted for this submission!');
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('❤️ Vote cast! Thanks for supporting fellow coffee lovers!');
      queryClient.invalidateQueries({ queryKey: ['photo_contests'] });
    },
    onError: (error: any) => {
      console.error('❌ Vote failed:', error);
      toast.error(error.message || 'Failed to vote. Please try again.');
    }
  });

  const handleJoinChallenge = (challengeId: string) => {
    joinChallengeMutation.mutate(challengeId);
  };

  const handleSubmitPhoto = (contestId: string, photo: File, title: string, description: string) => {
    submitPhotoMutation.mutate({ contestId, photo, title, description });
  };

  const handleVotePhoto = (submissionId: string) => {
    votePhotoMutation.mutate(submissionId);
  };

  // Format challenges with safer date handling
  const formattedChallenges = challenges.map(challenge => {
    console.log('🔧 Formatting challenge:', challenge);
    
    let expiresAt: Date;
    try {
      expiresAt = new Date(challenge.expires_at);
      if (isNaN(expiresAt.getTime())) {
        console.warn('⚠️ Invalid expires_at date for challenge:', challenge.id);
        expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Default to 1 week from now
      }
    } catch (err) {
      console.warn('⚠️ Date parsing error for challenge:', challenge.id, err);
      expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
    
    return {
      id: challenge.id,
      title: challenge.title || 'Untitled Challenge',
      description: challenge.description || 'No description available',
      type: (challenge.type as 'daily' | 'weekly' | 'monthly') || 'weekly',
      target: challenge.target || 1,
      current: 0,
      reward: challenge.reward || 'No reward specified',
      expiresAt,
      participants: challenge.challenge_participants?.length || 0
    };
  });

  console.log('✅ Final formatted challenges:', formattedChallenges);

  // Format photo contests with safer handling
  const currentContest = photoContests[0] ? {
    id: photoContests[0].id,
    title: photoContests[0].title || 'Untitled Contest',
    description: photoContests[0].description || '',
    theme: photoContests[0].theme || '',
    prize: photoContests[0].prize || '',
    endsAt: new Date(photoContests[0].ends_at),
    maxSubmissions: photoContests[0].max_submissions || 100,
    submissions: (photoContests[0].photo_contest_submissions || []).map((sub: any) => ({
      id: sub.id,
      imageUrl: sub.image_url,
      title: sub.title || 'Untitled',
      description: sub.description || '',
      author: sub.profiles ? 
        `${sub.profiles.first_name || ''} ${sub.profiles.last_name || ''}`.trim() : 
        'Anonymous',
      votes: sub.votes || 0,
      submittedAt: new Date(sub.created_at)
    }))
  } : null;

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
                className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-white"
              >
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Challenges</span>
              </TabsTrigger>
              <TabsTrigger 
                value="photos" 
                className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-white"
              >
                <Camera className="h-4 w-4" />
                <span className="hidden sm:inline">Photo Contest</span>
              </TabsTrigger>
              <TabsTrigger 
                value="social" 
                className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-white"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Social & Referrals</span>
              </TabsTrigger>
              <TabsTrigger 
                value="goals" 
                className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-white"
              >
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Community Goals</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="challenges" className="space-y-6">
              {challengesLoading ? (
                <LoadingState message="Loading challenges..." />
              ) : challengesError ? (
                <ErrorState
                  title="Failed to Load Challenges"
                  message={challengesError.message}
                  onRetry={() => queryClient.invalidateQueries({ queryKey: ['challenges'] })}
                />
              ) : (
                <>
                  {console.log('🎯 Rendering challenges tab with:', { challengesLoading, challengesCount: formattedChallenges.length })}
                  <CommunityChallenge 
                    challenges={formattedChallenges}
                    onJoinChallenge={handleJoinChallenge}
                  />
                </>
              )}
            </TabsContent>

            <TabsContent value="photos" className="space-y-6">
              {contestsLoading ? (
                <LoadingState message="Loading photo contests..." />
              ) : contestsError ? (
                <ErrorState
                  title="Failed to Load Photo Contest"
                  message={contestsError.message}
                  onRetry={() => queryClient.invalidateQueries({ queryKey: ['photo_contests'] })}
                />
              ) : currentContest ? (
                <PhotoContest
                  contest={currentContest}
                  onSubmitPhoto={handleSubmitPhoto}
                  onVotePhoto={handleVotePhoto}
                />
              ) : (
                <EmptyState
                  icon={Camera}
                  title="No Active Photo Contest"
                  description="Check back soon for exciting photo contests where you can showcase your coffee moments!"
                />
              )}
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              {leaderboardError ? (
                <ErrorState
                  title="Failed to Load Social Features"
                  message={leaderboardError.message}
                  onRetry={() => queryClient.invalidateQueries({ queryKey: ['leaderboard'] })}
                />
              ) : (
                <SocialShare
                  referralCode="COFFEE2024"
                  totalReferrals={5}
                  pointsFromReferrals={250}
                  leaderboard={leaderboard}
                  userRank={12}
                />
              )}
            </TabsContent>

            <TabsContent value="goals" className="space-y-6">
              <CommunityGoalsList />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default CommunityHub;
