
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
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
      <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Community Hub</h1>
            <p className="text-gray-500 mt-2">Manage all community features from one central location</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* FIXED: Better responsive tab layout */}
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 mb-8 bg-gray-100 p-1 rounded-lg gap-1">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-2 sm:px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
            >
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="challenges" 
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-2 sm:px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
            >
              <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Challenges</span>
            </TabsTrigger>
            <TabsTrigger 
              value="contests" 
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-2 sm:px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
            >
              <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Contests</span>
            </TabsTrigger>
            <TabsTrigger 
              value="referrals" 
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-2 sm:px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
            >
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Referrals</span>
            </TabsTrigger>
            <TabsTrigger 
              value="goals" 
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-2 sm:px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all col-span-2 sm:col-span-1"
            >
              <Target className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Goals</span>
            </TabsTrigger>
          </TabsList>

          {/* FIXED: Better container spacing and mobile handling */}
          <div className="min-h-[600px] bg-white rounded-lg border shadow-sm">
            <TabsContent value="overview" className="p-4 sm:p-6 space-y-6 m-0">
              <HubOverview />
            </TabsContent>

            <TabsContent value="challenges" className="p-4 sm:p-6 space-y-6 m-0">
              <ChallengesSection />
            </TabsContent>

            <TabsContent value="contests" className="p-4 sm:p-6 space-y-6 m-0">
              <PhotoContestsSection />
            </TabsContent>

            <TabsContent value="referrals" className="p-4 sm:p-6 space-y-6 m-0">
              <ReferralsSection />
            </TabsContent>

            <TabsContent value="goals" className="p-4 sm:p-6 space-y-6 m-0">
              <CommunityGoalsSection />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Hub;
