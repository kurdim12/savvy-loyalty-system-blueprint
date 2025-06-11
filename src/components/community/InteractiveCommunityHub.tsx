
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CoffeeShopExperience } from './CoffeeShopExperience';
import { RealTimeChat } from './RealTimeChat';
import { FriendsSystem } from './social/FriendsSystem';
import { Leaderboard } from './gamification/Leaderboard';
import { DailyChallenges } from './gamification/DailyChallenges';
import { EventCalendar } from './practical/EventCalendar';
import { LivePointsDisplay } from './LivePointsDisplay';
import { RealTimeUserPresence } from './RealTimeUserPresence';
import { RealTimeActivityFeed } from './RealTimeActivityFeed';
import { 
  Coffee, 
  MessageCircle, 
  Users, 
  Trophy, 
  Calendar,
  Target,
  Activity
} from 'lucide-react';

export const InteractiveCommunityHub = () => {
  const [currentSeatId] = useState('window-seat-1');

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#8B4513] mb-2">
            ☕ Community Hub
          </h1>
          <p className="text-gray-600">
            Connect, chat, and enjoy your coffee experience with real-time updates
          </p>
        </div>

        {/* Live Points Display */}
        <LivePointsDisplay />

        {/* Real-time Components Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RealTimeUserPresence />
          <RealTimeActivityFeed />
        </div>

        {/* Main Hub */}
        <Tabs defaultValue="sitting-plan" className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-6">
            <TabsTrigger value="sitting-plan" className="flex items-center gap-2">
              <Coffee className="h-4 w-4" />
              <span className="hidden sm:inline">Sitting Plan</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Social</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Challenges</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Leaderboard</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Events</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
          </TabsList>

          {/* Sitting Plan - Main Feature */}
          <TabsContent value="sitting-plan" className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#8B4513] mb-4">Interactive Café Floor Plan</h2>
              <p className="text-gray-600 mb-6">Choose your seat and connect with other coffee lovers in real-time</p>
              <CoffeeShopExperience />
            </div>
          </TabsContent>

          {/* Real-Time Chat */}
          <TabsContent value="chat" className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#8B4513] mb-4">Real-Time Community Chat</h2>
              <RealTimeChat 
                seatArea={currentSeatId} 
                onlineUsers={[
                  { name: 'Sarah M.', mood: '😊', activity: 'Enjoying espresso' },
                  { name: 'Mike R.', mood: '💻', activity: 'Working remotely' },
                  { name: 'Emma L.', mood: '📱', activity: 'Taking photos' }
                ]} 
              />
            </div>
          </TabsContent>

          {/* Social Features */}
          <TabsContent value="social" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <FriendsSystem />
            </div>
          </TabsContent>

          {/* Daily Challenges */}
          <TabsContent value="challenges" className="space-y-6">
            <DailyChallenges />
          </TabsContent>

          {/* Leaderboard */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Leaderboard />
          </TabsContent>

          {/* Events Calendar */}
          <TabsContent value="events" className="space-y-6">
            <EventCalendar />
          </TabsContent>

          {/* Activity Feed */}
          <TabsContent value="activity" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RealTimeUserPresence />
              <RealTimeActivityFeed />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
