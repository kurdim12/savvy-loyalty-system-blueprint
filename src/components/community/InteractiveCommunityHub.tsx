
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, MapPin, MessageCircle, Users, Clock, Star, Zap, Camera, Trophy, Calendar, BarChart3, UserPlus, Gift, Settings } from 'lucide-react';
import { PhysicalCafeFloorPlan } from './PhysicalCafeFloorPlan';
import { RealTimeChat } from './RealTimeChat';
import { CoffeeActivities } from './CoffeeActivities';
import { FriendsSystem } from './social/FriendsSystem';
import { PhotoSharing } from './social/PhotoSharing';
import { Leaderboard } from './gamification/Leaderboard';
import { DailyChallenges } from './gamification/DailyChallenges';
import { EventCalendar } from './practical/EventCalendar';
import { TableReservations } from './practical/TableReservations';
import { CoffeeReviews } from './content/CoffeeReviews';
import { CommunityPolls } from './content/CommunityPolls';
import { CommunityFeatureTest } from './CommunityFeatureTest';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';

export const InteractiveCommunityHub = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [activeTab, setActiveTab] = useState('floor-plan');

  // Mock online users data - in a real app, this would come from Supabase presence
  const mockOnlineUsers = [
    { name: 'Alex', mood: 'focused', activity: 'working' },
    { name: 'Sarah', mood: 'relaxed', activity: 'reading' },
    { name: 'Mike', mood: 'social', activity: 'chatting' },
  ];

  const tabs = [
    // Physical Space
    {
      id: 'floor-plan',
      label: 'Café Floor',
      icon: <MapPin className="h-4 w-4" />,
      category: 'space',
      component: <PhysicalCafeFloorPlan />
    },
    {
      id: 'reservations',
      label: 'Reservations',
      icon: <Calendar className="h-4 w-4" />,
      category: 'space',
      component: <TableReservations />
    },
    
    // Social Features
    {
      id: 'friends',
      label: 'Friends',
      icon: <UserPlus className="h-4 w-4" />,
      category: 'social',
      component: <FriendsSystem />
    },
    {
      id: 'chat',
      label: 'Community Chat',
      icon: <MessageCircle className="h-4 w-4" />,
      category: 'social',
      component: <RealTimeChat seatArea="community-hub" onlineUsers={mockOnlineUsers} />,
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    {
      id: 'photos',
      label: 'Photo Feed',
      icon: <Camera className="h-4 w-4" />,
      category: 'social',
      component: <PhotoSharing />
    },
    
    // Gamification
    {
      id: 'challenges',
      label: 'Daily Challenges',
      icon: <Gift className="h-4 w-4" />,
      category: 'gamification',
      component: <DailyChallenges />
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      icon: <Trophy className="h-4 w-4" />,
      category: 'gamification',
      component: <Leaderboard />
    },
    
    // Events & Activities
    {
      id: 'events',
      label: 'Events',
      icon: <Calendar className="h-4 w-4" />,
      category: 'events',
      component: <EventCalendar />
    },
    {
      id: 'activities',
      label: 'Activities',
      icon: <Coffee className="h-4 w-4" />,
      category: 'events',
      component: <CoffeeActivities />
    },
    
    // Content & Reviews
    {
      id: 'reviews',
      label: 'Coffee Reviews',
      icon: <Star className="h-4 w-4" />,
      category: 'content',
      component: <CoffeeReviews />
    },
    {
      id: 'polls',
      label: 'Community Polls',
      icon: <BarChart3 className="h-4 w-4" />,
      category: 'content',
      component: <CommunityPolls />
    },
    
    // Debug/Admin
    {
      id: 'system-test',
      label: 'System Status',
      icon: <Settings className="h-4 w-4" />,
      category: 'debug',
      component: <CommunityFeatureTest />
    }
  ];

  const categoryColors = {
    space: 'bg-blue-100 text-blue-800',
    social: 'bg-green-100 text-green-800',
    gamification: 'bg-purple-100 text-purple-800',
    events: 'bg-orange-100 text-orange-800',
    content: 'bg-amber-100 text-amber-800',
    debug: 'bg-gray-100 text-gray-800'
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'space': return 'Physical Space';
      case 'social': return 'Social';
      case 'gamification': return 'Gamification';
      case 'events': return 'Events & Activities';
      case 'content': return 'Content & Reviews';
      case 'debug': return 'System & Debug';
      default: return category;
    }
  };

  // Group tabs by category
  const tabsByCategory = tabs.reduce((acc, tab) => {
    if (!acc[tab.category]) acc[tab.category] = [];
    acc[tab.category].push(tab);
    return acc;
  }, {} as Record<string, typeof tabs>);

  return (
    <div className="space-y-6">
      {/* Main Community Card */}
      <Card className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-amber-800">
            <div className="flex items-center gap-3">
              <Coffee className="h-6 w-6" />
              Interactive Community Hub
            </div>
            <Badge className="bg-amber-600 text-white">
              <Users className="h-3 w-3 mr-1" />
              {mockOnlineUsers.length + 21} coffee lovers online
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Category Navigation */}
          <div className="space-y-4">
            {Object.entries(tabsByCategory).map(([category, categoryTabs]) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-amber-800">
                    {getCategoryLabel(category)}
                  </h3>
                  <Badge className={categoryColors[category as keyof typeof categoryColors]}>
                    {categoryTabs.length}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {categoryTabs.map(tab => (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? "default" : "outline"}
                      onClick={() => setActiveTab(tab.id)}
                      className={`gap-2 relative ${
                        activeTab === tab.id 
                          ? 'bg-amber-700 text-white hover:bg-amber-600' 
                          : 'text-amber-700 hover:border-amber-400 hover:bg-amber-50'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                      {tab.badge && (
                        <Badge className="ml-1 bg-red-500 text-white text-xs">
                          {tab.badge}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Active Tab Content */}
          <div className="min-h-[500px] bg-white rounded-lg p-6 border border-amber-200">
            {tabs.find(tab => tab.id === activeTab)?.component}
          </div>
        </CardContent>
      </Card>

      {/* Quick Info Bar */}
      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-orange-500" />
            <div>
              <p className="font-medium text-orange-800">Open Hours</p>
              <p className="text-sm text-gray-600">7:00 AM - 8:00 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-orange-500" />
            <div>
              <p className="font-medium text-orange-800">Today's Special</p>
              <p className="text-sm text-gray-600">Ethiopian Single Origin</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-orange-500" />
            <div>
              <p className="font-medium text-orange-800">WiFi Status</p>
              <p className="text-sm text-gray-600">High-speed • Password: CoffeeTime2024</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Welcome Message for New Users */}
      {user && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 bg-green-600 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-green-800 mb-1">
                  Welcome to the Community, {user?.user_metadata?.first_name || 'Coffee Lover'}! ☕
                </h3>
                <p className="text-sm text-green-700">
                  Explore our interactive features: connect with friends, join challenges, book tables, 
                  share photos, and discover new coffee experiences. Start by checking out today's challenges 
                  or browse the café floor plan to see who's here!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
