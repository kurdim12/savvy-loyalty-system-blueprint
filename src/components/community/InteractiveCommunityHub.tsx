
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coffee, Users, MessageSquare, Music, MapPin, Calendar } from 'lucide-react';
import { CommunityChat } from './CommunityChat';
import { CommunityEvents } from './CommunityEvents';
import { CommunityMembers } from './CommunityMembers';
import { CommunityMusic } from './CommunityMusic';
import { CommunitySpaces } from './CommunitySpaces';

export const InteractiveCommunityHub = () => {
  const [activeTab, setActiveTab] = useState('spaces');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Community Header */}
      <Card className="bg-gradient-to-r from-[#8B4513] to-[#D2B48C] text-white border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
            <Coffee className="h-8 w-8" />
            Raw Smith Café Community
          </CardTitle>
          <p className="text-white/90 text-lg">
            Connect, collaborate, and create in our virtual coffee space
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">127</div>
              <div className="text-sm opacity-90">Members Online</div>
            </div>
            
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <MessageSquare className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">1.2k</div>
              <div className="text-sm opacity-90">Messages Today</div>
            </div>
            
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Calendar className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">5</div>
              <div className="text-sm opacity-90">Events This Week</div>
            </div>
            
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Music className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">Live</div>
              <div className="text-sm opacity-90">Music Playing</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white shadow-lg">
          <TabsTrigger 
            value="spaces" 
            className="flex items-center gap-2 data-[state=active]:bg-[#8B4513] data-[state=active]:text-white"
          >
            <MapPin className="h-4 w-4" />
            Spaces
          </TabsTrigger>
          <TabsTrigger 
            value="chat" 
            className="flex items-center gap-2 data-[state=active]:bg-[#8B4513] data-[state=active]:text-white"
          >
            <MessageSquare className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger 
            value="members" 
            className="flex items-center gap-2 data-[state=active]:bg-[#8B4513] data-[state=active]:text-white"
          >
            <Users className="h-4 w-4" />
            Members
          </TabsTrigger>
          <TabsTrigger 
            value="events" 
            className="flex items-center gap-2 data-[state=active]:bg-[#8B4513] data-[state=active]:text-white"
          >
            <Calendar className="h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger 
            value="music" 
            className="flex items-center gap-2 data-[state=active]:bg-[#8B4513] data-[state=active]:text-white"
          >
            <Music className="h-4 w-4" />
            Music
          </TabsTrigger>
        </TabsList>

        <TabsContent value="spaces" className="mt-6">
          <CommunitySpaces />
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <CommunityChat />
        </TabsContent>

        <TabsContent value="members" className="mt-6">
          <CommunityMembers />
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <CommunityEvents />
        </TabsContent>

        <TabsContent value="music" className="mt-6">
          <CommunityMusic />
        </TabsContent>
      </Tabs>
    </div>
  );
};
