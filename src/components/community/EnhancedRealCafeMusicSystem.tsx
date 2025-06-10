
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Radio, Users, Volume2, Headphones } from 'lucide-react';
import { SpotifyIntegration } from './SpotifyIntegration';
import { RealCafeMusicSystem } from './RealCafeMusicSystem';

export const EnhancedRealCafeMusicSystem = () => {
  return (
    <div className="space-y-6">
      {/* System Overview */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-300/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <Radio className="h-6 w-6 text-purple-400 animate-pulse" />
              <div>
                <span className="text-lg">Café Music Hub</span>
                <div className="text-xs text-purple-200 font-normal">Complete audio experience</div>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-200 border-green-400/30 animate-pulse">
              <Volume2 className="h-3 w-3 mr-1" />
              LIVE SYSTEM
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
              <Radio className="h-8 w-8 text-orange-400" />
              <div>
                <p className="font-semibold text-white">Café Speakers</p>
                <p className="text-xs text-purple-200">Community queue • Everyone hears</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
              <Headphones className="h-8 w-8 text-green-400" />
              <div>
                <p className="font-semibold text-white">Personal Spotify</p>
                <p className="text-xs text-purple-200">Your device • Private listening</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Music System Tabs */}
      <Tabs defaultValue="cafe-speakers" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/90 backdrop-blur-sm">
          <TabsTrigger 
            value="cafe-speakers" 
            className="flex items-center gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800"
          >
            <Radio className="h-4 w-4" />
            Café Speakers
          </TabsTrigger>
          <TabsTrigger 
            value="personal-spotify" 
            className="flex items-center gap-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-800"
          >
            <Headphones className="h-4 w-4" />
            Personal Spotify
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cafe-speakers" className="space-y-6 mt-6">
          <Card className="bg-orange-50 border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center gap-2">
                <Radio className="h-5 w-5" />
                Community Music System
              </CardTitle>
              <p className="text-sm text-orange-600">
                Vote for songs to play on the café speakers for everyone to enjoy!
              </p>
            </CardHeader>
          </Card>
          
          <RealCafeMusicSystem seatArea="global" />
        </TabsContent>

        <TabsContent value="personal-spotify" className="space-y-6 mt-6">
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Headphones className="h-5 w-5" />
                Your Personal Spotify
              </CardTitle>
              <p className="text-sm text-green-600">
                Control your own Spotify playback and discover new music privately.
              </p>
            </CardHeader>
          </Card>
          
          <SpotifyIntegration />
        </TabsContent>
      </Tabs>

      {/* Integration Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Music className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-800">
                Dual Music Experience
              </p>
              <p className="text-xs text-blue-600">
                Enjoy community music on café speakers while having personal control through your Spotify account
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
