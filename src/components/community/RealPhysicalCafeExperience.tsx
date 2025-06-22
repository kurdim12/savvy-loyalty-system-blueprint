
import { useState } from 'react';
import { RawSmithFloorPlan } from './RawSmithFloorPlan';
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
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-zinc-100 p-4">
      {/* Café Status Header */}
      <Card className="mb-6 bg-white/95 backdrop-blur-sm border-stone-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-stone-800">
            <div className="flex items-center gap-3">
              <Coffee className="h-6 w-6" />
              <div>
                <span className="text-xl">RawSmith Coffee</span>
                <div className="text-sm text-stone-600 font-normal">Industrial-Modern Specialty Coffee Experience</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-500 text-white">
                <Users className="h-3 w-3 mr-1" />
                18 people here
              </Badge>
              <Badge className="bg-stone-800 text-white">
                <Clock className="h-3 w-3 mr-1" />
                Open until 9 PM
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Wifi className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-sm font-medium text-blue-700">Premium WiFi</div>
              <div className="text-xs text-blue-600">Password: rawsmith2024</div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
              <Music className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <div className="text-sm font-medium text-purple-700">Curated Audio</div>
              <div className="text-xs text-purple-600">Jazz & Ambient</div>
            </div>
            
            <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200">
              <MessageSquare className="h-6 w-6 mx-auto mb-2 text-amber-600" />
              <div className="text-sm font-medium text-amber-700">Community Chat</div>
              <div className="text-xs text-amber-600">8 active conversations</div>
            </div>
            
            <div className="text-center p-3 bg-stone-50 rounded-lg border border-stone-200">
              <Coffee className="h-6 w-6 mx-auto mb-2 text-stone-600" />
              <div className="text-sm font-medium text-stone-700">Specialty Brewing</div>
              <div className="text-xs text-stone-600">Order from your seat</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/80 backdrop-blur-sm border border-stone-200">
          <TabsTrigger 
            value="floorplan" 
            className="flex items-center gap-2 data-[state=active]:bg-stone-800 data-[state=active]:text-white"
          >
            <MapPin className="h-4 w-4" />
            Floor Plan
          </TabsTrigger>
          <TabsTrigger 
            value="music" 
            className="flex items-center gap-2 data-[state=active]:bg-stone-800 data-[state=active]:text-white"
          >
            <Music className="h-4 w-4" />
            Audio System
          </TabsTrigger>
          <TabsTrigger 
            value="chat" 
            className="flex items-center gap-2 data-[state=active]:bg-stone-800 data-[state=active]:text-white"
          >
            <MessageSquare className="h-4 w-4" />
            Community
          </TabsTrigger>
        </TabsList>

        <TabsContent value="floorplan" className="mt-0">
          <RawSmithFloorPlan onSeatSelect={(seatId) => console.log('Selected seat:', seatId)} onBack={onBack} />
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
