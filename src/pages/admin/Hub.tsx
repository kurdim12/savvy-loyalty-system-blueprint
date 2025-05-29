
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Camera, Users, Target, TrendingUp } from 'lucide-react';
import ChallengesSection from '@/components/admin/hub/ChallengesSection';
import PhotoContestsSection from '@/components/admin/hub/PhotoContestsSection';
import ReferralsSection from '@/components/admin/hub/ReferralsSection';
import CommunityGoalsSection from '@/components/admin/hub/CommunityGoalsSection';
import HubOverview from '@/components/admin/hub/HubOverview';

const Hub = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community Hub</h1>
            <p className="text-gray-500">Manage all community features from one central location</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2 text-xs sm:text-sm">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2 text-xs sm:text-sm">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Challenges</span>
            </TabsTrigger>
            <TabsTrigger value="contests" className="flex items-center gap-2 text-xs sm:text-sm">
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">Contests</span>
            </TabsTrigger>
            <TabsTrigger value="referrals" className="flex items-center gap-2 text-xs sm:text-sm">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Referrals</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2 text-xs sm:text-sm">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Goals</span>
            </TabsTrigger>
          </TabsList>

          <div className="min-h-[600px]">
            <TabsContent value="overview" className="space-y-6">
              <HubOverview />
            </TabsContent>

            <TabsContent value="challenges" className="space-y-6">
              <ChallengesSection />
            </TabsContent>

            <TabsContent value="contests" className="space-y-6">
              <PhotoContestsSection />
            </TabsContent>

            <TabsContent value="referrals" className="space-y-6">
              <ReferralsSection />
            </TabsContent>

            <TabsContent value="goals" className="space-y-6">
              <CommunityGoalsSection />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Hub;
