
import { useState } from 'react';
import { CinematicCommunityHub } from './CinematicCommunityHub';
import { CommunityChat } from './CommunityChat';
import { CommunityEvents } from './CommunityEvents';
import { CommunityMembers } from './CommunityMembers';
import { CommunitySpaces } from './CommunitySpaces';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coffee, Users, MessageSquare, MapPin, Calendar, Sparkles, Zap } from 'lucide-react';

export const InteractiveCommunityHub = () => {
  const [viewMode, setViewMode] = useState<'cinematic' | 'classic'>('cinematic');

  if (viewMode === 'cinematic') {
    return (
      <div className="min-h-screen">
        <CinematicCommunityHub />
        
        {/* Mode Toggle */}
        <div className="fixed bottom-4 left-4 z-50">
          <Button
            onClick={() => setViewMode('classic')}
            variant="outline"
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
          >
            Switch to Classic View
          </Button>
        </div>
      </div>
    );
  }

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
          
          {/* Mode Toggle */}
          <div className="mt-4">
            <Button
              onClick={() => setViewMode('cinematic')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Try Cinematic Experience
              <Zap className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
              <Sparkles className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">98%</div>
              <div className="text-sm opacity-90">Satisfaction</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="spaces" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg">
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
      </Tabs>
    </div>
  );
};
