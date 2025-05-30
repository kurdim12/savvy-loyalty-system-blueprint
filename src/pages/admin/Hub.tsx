
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community Hub</h1>
            <p className="text-gray-500">Manage all community features from one central location</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="contests" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Photo Contests
            </TabsTrigger>
            <TabsTrigger value="referrals" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Referrals
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Community Goals
            </TabsTrigger>
          </TabsList>

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
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Hub;
