import { useState } from 'react';
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

const CommunityHub = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('challenges');
  const queryClient = useQueryClient();

  // Optimized challenges query - only fetch when tab is active
  const { data: challenges = [], isLoading: challengesLoading } = useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select('id, title, description, type, target, reward, expires_at, active')
        .eq('active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: activeTab === 'challenges',
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Optimized photo contests query - only fetch when tab is active
  const { data: photoContests = [], isLoading: contestsLoading } = useQuery({
    queryKey: ['photo_contests'],
    queryFn: async () => {
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
      
      if (error) throw error;
      return data || [];
    },
    enabled: activeTab === 'photos',
    staleTime: 5 * 60 * 1000,
  });

  // Updated leaderboard query to use the new secure function
  const { data: leaderboard = [] } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_referral_stats');
      
      if (error) throw error;
      return data?.map((profile: any, index: number) => ({
        id: profile.referrer_id,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous',
        referrals: profile.total_referrals,
        pointsEarned: profile.total_bonus_points,
        rank: index + 1,
        badge: profile.total_bonus_points >= 500 ? 'Champion' : 
               profile.total_bonus_points >= 200 ? 'Elite' : undefined
      })) || [];
    },
    enabled: activeTab === 'social',
    staleTime: 5 * 60 * 1000,
  });

  // Join challenge mutation
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
      if (error.message?.includes('duplicate')) {
        toast.error('You have already joined this challenge!');
      } else {
        toast.error('Failed to join challenge. Please try again.');
      }
    }
  });

  // Submit photo mutation
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
      toast.success('📸 Photo submitted successfully! Good luck in the contest!');
      queryClient.invalidateQueries({ queryKey: ['photo_contests'] });
    },
    onError: () => {
      toast.error('Failed to submit photo. Please try again.');
    }
  });

  // Vote photo mutation
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
      if (error.message?.includes('duplicate')) {
        toast.error('You have already voted for this submission!');
      } else {
        toast.error('Failed to vote. Please try again.');
      }
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

  // Format challenges for the component
  const formattedChallenges = challenges.map(challenge => ({
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    type: challenge.type as 'daily' | 'weekly' | 'monthly',
    target: challenge.target,
    current: 0,
    reward: challenge.reward,
    expiresAt: new Date(challenge.expires_at),
    participants: 0
  }));

  // Format photo contests for the component
  const currentContest = photoContests[0] ? {
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
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#95A5A6] border-t-transparent"></div>
                </div>
              ) : (
                <CommunityChallenge 
                  challenges={formattedChallenges}
                  onJoinChallenge={handleJoinChallenge}
                />
              )}
            </TabsContent>

            <TabsContent value="photos" className="space-y-6">
              {contestsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#95A5A6] border-t-transparent"></div>
                </div>
              ) : currentContest ? (
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
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default CommunityHub;
