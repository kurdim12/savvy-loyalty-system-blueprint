
import { useState } from 'react';
import { PhysicalCafeFloorPlan } from './PhysicalCafeFloorPlan';
import { RealCafeMusicSystem } from './RealCafeMusicSystem';
import { PhysicalCafeChat } from './PhysicalCafeChat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Music, MessageSquare, Wifi, Coffee, Clock, Users } from 'lucide-react';

interface RealPhysicalCafeExperienceProps {
  onBack?: () => void;
}

export const RealPhysicalCafeExperience = ({ onBack }: RealPhysicalCafeExperienceProps) => {
  const [activeTab, setActiveTab] = useState('floorplan');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF6F0] to-[#F5E6D3] p-4">
      {/* Café Status Header */}
      <Card className="mb-6 bg-white/95 backdrop-blur-sm border-[#8B4513]/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-[#8B4513]">
            <div className="flex items-center gap-3">
              <Coffee className="h-6 w-6" />
              <div>
                <span className="text-xl">Your Coffee Shop</span>
                <div className="text-sm text-gray-600 font-normal">Real-time café companion</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-500 text-white">
                <Users className="h-3 w-3 mr-1" />
                12 people here
              </Badge>
              <Badge className="bg-blue-500 text-white">
                <Clock className="h-3 w-3 mr-1" />
                Open until 9 PM
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Wifi className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-sm font-medium text-green-700">WiFi Available</div>
              <div className="text-xs text-green-600">Password: coffee123</div>
            </div>
            
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Music className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-sm font-medium text-blue-700">Live Music</div>
              <div className="text-xs text-blue-600">Request songs</div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <MessageSquare className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <div className="text-sm font-medium text-purple-700">Community Chat</div>
              <div className="text-xs text-purple-600">6 active conversations</div>
            </div>
            
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <Coffee className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <div className="text-sm font-medium text-orange-700">Fresh Coffee</div>
              <div className="text-xs text-orange-600">Order from your seat</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/80 backdrop-blur-sm">
          <TabsTrigger 
            value="floorplan" 
            className="flex items-center gap-2 data-[state=active]:bg-[#8B4513] data-[state=active]:text-white"
          >
            <MapPin className="h-4 w-4" />
            Floor Plan
          </TabsTrigger>
          <TabsTrigger 
            value="music" 
            className="flex items-center gap-2 data-[state=active]:bg-[#8B4513] data-[state=active]:text-white"
          >
            <Music className="h-4 w-4" />
            Music
          </TabsTrigger>
          <TabsTrigger 
            value="chat" 
            className="flex items-center gap-2 data-[state=active]:bg-[#8B4513] data-[state=active]:text-white"
          >
            <MessageSquare className="h-4 w-4" />
            Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="floorplan" className="mt-0">
          <PhysicalCafeFloorPlan />
        </TabsContent>

        <TabsContent value="music" className="mt-0">
          <RealCafeMusicSystem />
        </TabsContent>

        <TabsContent value="chat" className="mt-0">
          <PhysicalCafeChat />
        </TabsContent>
      </Tabs>
    </div>
  );
};
