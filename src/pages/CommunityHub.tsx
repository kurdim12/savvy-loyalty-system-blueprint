
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import { CommunityChallenge } from '@/components/community/CommunityChallenge';
import { PhotoContest } from '@/components/community/PhotoContest';
import { SocialShare } from '@/components/community/SocialShare';
import CommunityGoalsList from '@/components/community/CommunityGoalsList';
import { Trophy, Camera, Share2, Target } from 'lucide-react';
import { toast } from 'sonner';

// Mock data - in real app, this would come from API
const mockChallenges = [
  {
    id: '1',
    title: 'Morning Coffee Streak',
    description: 'Visit us 7 days in a row for your morning coffee',
    type: 'weekly' as const,
    target: 7,
    current: 3,
    reward: '50 Bonus Points',
    expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    participants: 127
  },
  {
    id: '2',
    title: 'Social Media Share',
    description: 'Share your coffee experience on social media',
    type: 'daily' as const,
    target: 1,
    current: 0,
    reward: '15 Points',
    expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    participants: 89
  },
  {
    id: '3',
    title: 'Coffee Connoisseur',
    description: 'Try 5 different coffee varieties this month',
    type: 'monthly' as const,
    target: 5,
    current: 2,
    reward: 'Free Premium Blend',
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    participants: 203
  }
];

const mockPhotoContest = {
  id: '1',
  title: 'Perfect Coffee Moment',
  description: 'Capture your perfect coffee moment and win amazing prizes!',
  theme: 'Perfect Coffee Moment',
  prize: 'Free Coffee for a Month + Premium Merchandise',
  endsAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
  maxSubmissions: 100,
  submissions: [
    {
      id: '1',
      imageUrl: '/lovable-uploads/e2fc2611-a942-411c-a3e2-676b7cf86455.png',
      title: 'Morning Bliss',
      description: 'Perfect start to my day with Raw Smith coffee',
      author: 'Sarah J.',
      votes: 45,
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      imageUrl: '/lovable-uploads/5404e14c-b49d-4de3-b6c1-4d58b8ec620f.png',
      title: 'Cozy Corner',
      description: 'My favorite spot for afternoon coffee',
      author: 'Mike R.',
      votes: 38,
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      imageUrl: '/lovable-uploads/e14bae4b-002f-43c3-afc6-604e5d3976a7.png',
      title: 'Latte Art Love',
      description: 'Beautiful latte art that made my day',
      author: 'Emma K.',
      votes: 52,
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    }
  ]
};

const mockLeaderboard = [
  { id: '1', name: 'Coffee King Alex', referrals: 23, pointsEarned: 1150, rank: 1, badge: 'Champion' },
  { id: '2', name: 'Brew Master Sarah', referrals: 19, pointsEarned: 950, rank: 2, badge: 'Elite' },
  { id: '3', name: 'Latte Legend Mike', referrals: 16, pointsEarned: 800, rank: 3, badge: 'Pro' },
  { id: '4', name: 'Emma Coffee', referrals: 12, pointsEarned: 600, rank: 4 },
  { id: '5', name: 'David Espresso', referrals: 10, pointsEarned: 500, rank: 5 },
  { id: '6', name: 'Lisa Mocha', referrals: 8, pointsEarned: 400, rank: 6 },
  { id: '7', name: 'John Cappuccino', referrals: 6, pointsEarned: 300, rank: 7 },
  { id: '8', name: 'Amy Americano', referrals: 4, pointsEarned: 200, rank: 8 }
];

const CommunityHub = () => {
  const [activeTab, setActiveTab] = useState('challenges');

  const handleJoinChallenge = (challengeId: string) => {
    toast.success('🎯 Challenge joined! Start earning points now!');
  };

  const handleSubmitPhoto = (contestId: string, photo: File, title: string, description: string) => {
    toast.success('📸 Photo submitted successfully! Good luck in the contest!');
  };

  const handleVotePhoto = (submissionId: string) => {
    toast.success('❤️ Vote cast! Thanks for supporting fellow coffee lovers!');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-concrete/5 via-white to-concrete/10">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Community Hub
            </h1>
            <p className="text-xl text-concrete max-w-2xl mx-auto">
              Connect, compete, and celebrate coffee culture with fellow enthusiasts
            </p>
          </div>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-concrete/10 p-1 rounded-xl">
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
              <CommunityChallenge 
                challenges={mockChallenges}
                onJoinChallenge={handleJoinChallenge}
              />
            </TabsContent>

            <TabsContent value="photos" className="space-y-6">
              <PhotoContest
                contest={mockPhotoContest}
                onSubmitPhoto={handleSubmitPhoto}
                onVotePhoto={handleVotePhoto}
              />
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              <SocialShare
                referralCode="COFFEE2024"
                totalReferrals={5}
                pointsFromReferrals={250}
                leaderboard={mockLeaderboard}
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
