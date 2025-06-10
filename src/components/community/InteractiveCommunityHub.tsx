import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, MapPin, MessageCircle, Music, Users, Clock, Star, Zap } from 'lucide-react';
import { PhysicalCafeFloorPlan } from './PhysicalCafeFloorPlan';
import { EnhancedRealCafeMusicSystem } from './EnhancedRealCafeMusicSystem';
import { RealTimeChat } from './RealTimeChat';
import { CoffeeActivities } from './CoffeeActivities';
import { useAuth } from '@/contexts/AuthContext';

export const InteractiveCommunityHub = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('floor-plan');

  const tabs = [
    {
      id: 'floor-plan',
      label: 'Café Floor',
      icon: <MapPin className="h-4 w-4" />,
      component: <PhysicalCafeFloorPlan />
    },
    {
      id: 'music',
      label: 'Music Hub',
      icon: <Music className="h-4 w-4" />,
      component: <EnhancedRealCafeMusicSystem />
    },
    {
      id: 'chat',
      label: 'Community Chat',
      icon: <MessageCircle className="h-4 w-4" />,
      component: <RealTimeChat />
    },
    {
      id: 'activities',
      label: 'Activities',
      icon: <Coffee className="h-4 w-4" />,
      component: <CoffeeActivities />
    }
  ];

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
              {/* Implement dynamic user count here */}
              24 coffee lovers
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Tab Navigation */}
          <div className="flex space-x-4 overflow-x-auto">
            {tabs.map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id)}
                className={`gap-2 ${activeTab === tab.id ? 'bg-amber-700 text-white hover:bg-amber-600' : 'text-amber-700 hover:border-amber-400'}`}
              >
                {tab.icon}
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Active Tab Content */}
          <div className="min-h-[400px]">
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
              <p className="font-medium text-orange-800">Community Events</p>
              <p className="text-sm text-gray-600">Check the activities tab</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-orange-500" />
            <div>
              <p className="font-medium text-orange-800">Fast WiFi</p>
              <p className="text-sm text-gray-600">Enjoy our free high-speed WiFi</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
