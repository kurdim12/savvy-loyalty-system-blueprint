
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
      <div className="space-y-8 max-w-7xl mx-auto p-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community Hub</h1>
            <p className="text-gray-500 mt-2">Manage all community features from one central location</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 text-xs sm:text-sm py-2 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="challenges" 
              className="flex items-center gap-2 text-xs sm:text-sm py-2 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
            >
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Challenges</span>
            </TabsTrigger>
            <TabsTrigger 
              value="contests" 
              className="flex items-center gap-2 text-xs sm:text-sm py-2 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
            >
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">Contests</span>
            </TabsTrigger>
            <TabsTrigger 
              value="referrals" 
              className="flex items-center gap-2 text-xs sm:text-sm py-2 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Referrals</span>
            </TabsTrigger>
            <TabsTrigger 
              value="goals" 
              className="flex items-center gap-2 text-xs sm:text-sm py-2 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
            >
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Goals</span>
            </TabsTrigger>
          </TabsList>

          <div className="min-h-[600px] bg-white rounded-lg border shadow-sm">
            <TabsContent value="overview" className="p-6 space-y-6 m-0">
              <HubOverview />
            </TabsContent>

            <TabsContent value="challenges" className="p-6 space-y-6 m-0">
              <ChallengesSection />
            </TabsContent>

            <TabsContent value="contests" className="p-6 space-y-6 m-0">
              <PhotoContestsSection />
            </TabsContent>

            <TabsContent value="referrals" className="p-6 space-y-6 m-0">
              <ReferralsSection />
            </TabsContent>

            <TabsContent value="goals" className="p-6 space-y-6 m-0">
              <CommunityGoalsSection />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Hub;
