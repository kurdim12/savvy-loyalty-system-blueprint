
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CoffeeShopSeated } from './CoffeeShopSeated';
import { EnhancedCommunityChat } from './EnhancedCommunityChat';
import { CommunityChat } from './CommunityChat';
import { RealTimeChat } from './RealTimeChat';
import { PhysicalCafeChat } from './PhysicalCafeChat';
import { PrivateChatSystem } from './PrivateChatSystem';
import { CommunityFeatureTest } from './CommunityFeatureTest';
import { ProductCatalog } from './commerce/ProductCatalog';
import { OrderHistory } from './commerce/OrderHistory';
import { CommerceChat } from './commerce/CommerceChat';
import { FriendsSystem } from './social/FriendsSystem';
import { PhotoSharing } from './social/PhotoSharing';
import { Leaderboard } from './gamification/Leaderboard';
import { DailyChallenges } from './gamification/DailyChallenges';
import { EventCalendar } from './practical/EventCalendar';
import { LivePointsDisplay } from './LivePointsDisplay';
import { CoffeeActivities } from './CoffeeActivities';
import { 
  Coffee, 
  MessageCircle, 
  Users, 
  ShoppingCart, 
  Trophy, 
  Calendar,
  Settings,
  Star,
  Camera,
  History
} from 'lucide-react';

export const InteractiveCommunityHub = () => {
  const [showPrivateChat, setShowPrivateChat] = useState(false);
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
            Connect, chat, order, and enjoy your coffee experience
          </p>
        </div>

        {/* Live Points Display */}
        <LivePointsDisplay />

        {/* Main Hub */}
        <Tabs defaultValue="cafe" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-6">
            <TabsTrigger value="cafe" className="flex items-center gap-2">
              <Coffee className="h-4 w-4" />
              <span className="hidden sm:inline">Café</span>
            </TabsTrigger>
            <TabsTrigger value="shop" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Shop</span>
            </TabsTrigger>
            <TabsTrigger value="commerce-chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Commerce</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Social</span>
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">Photos</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Ranks</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Events</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">System</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cafe" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CoffeeShopSeated />
              <div className="space-y-4">
                <PhysicalCafeChat />
                <CoffeeActivities />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shop" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ProductCatalog />
              </div>
              <div>
                <OrderHistory />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="commerce-chat">
            <CommerceChat />
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FriendsSystem />
              <div className="space-y-4">
                <EnhancedCommunityChat title="Social Chat" />
                <DailyChallenges />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="photos">
            <PhotoSharing />
          </TabsContent>

          <TabsContent value="leaderboard">
            <Leaderboard />
          </TabsContent>

          <TabsContent value="events">
            <EventCalendar />
          </TabsContent>

          <TabsContent value="system">
            <CommunityFeatureTest />
          </TabsContent>
        </Tabs>

        {/* Private Chat Overlay */}
        {showPrivateChat && (
          <PrivateChatSystem
            currentSeatId={currentSeatId}
            onClose={() => setShowPrivateChat(false)}
          />
        )}
      </div>
    </div>
  );
};
