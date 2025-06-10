
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, Users, Music, Star, Zap, Heart, Crown } from 'lucide-react';
import { UniqueSeatingArea } from '@/components/community/enhanced/UniqueSeatingArea';
import { SeatedPerspectiveView } from '@/components/community/enhanced/SeatedPerspectiveView';

const CommunityHome = () => {
  const [currentView, setCurrentView] = useState<'overview' | 'seating' | 'seated'>('overview');
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeat(seatId);
    setCurrentView('seated');
  };

  const handleStandUp = () => {
    setSelectedSeat(null);
    setCurrentView('seating');
  };

  if (currentView === 'seated' && selectedSeat) {
    return (
      <SeatedPerspectiveView
        seatId={selectedSeat}
        tableId={selectedSeat}
        onStandUp={handleStandUp}
      />
    );
  }

  if (currentView === 'seating') {
    return (
      <div className="min-h-screen">
        <UniqueSeatingArea
          onSeatSelect={handleSeatSelect}
          onViewChange={() => setCurrentView('overview')}
        />
      </div>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Hero Section */}
        <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-400/30 overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  Welcome to the Community Hub
                </h1>
                <p className="text-lg text-gray-300">
                  Discover unique seating experiences, connect with fellow coffee lovers, and immerse yourself in our musical atmosphere
                </p>
              </div>
              <div className="text-6xl animate-pulse">☕</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <Users className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">30+</div>
                <div className="text-purple-200 text-sm">Active Members</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">7</div>
                <div className="text-yellow-200 text-sm">Unique Zones</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <Music className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">Live</div>
                <div className="text-cyan-200 text-sm">DJ Sessions</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <Heart className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">4.9</div>
                <div className="text-red-200 text-sm">Community Rating</div>
              </div>
            </div>

            <Button 
              onClick={() => setCurrentView('seating')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-3"
            >
              <Zap className="h-5 w-5 mr-2" />
              Explore Seating Adventures
            </Button>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-cyan-400/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-200">
                <Music className="h-6 w-6" />
                Immersive Music Zones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-cyan-100 mb-4">
                Each seating area has its own curated musical atmosphere. From cosmic ambient to vintage vinyl vibes.
              </p>
              <div className="space-y-2">
                <Badge className="bg-cyan-600/20 text-cyan-200 border-cyan-400/30">🎵 7 Music Genres</Badge>
                <Badge className="bg-cyan-600/20 text-cyan-200 border-cyan-400/30">🎧 Community DJ Mode</Badge>
                <Badge className="bg-cyan-600/20 text-cyan-200 border-cyan-400/30">🗳️ Song Voting System</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-emerald-400/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-200">
                <Star className="h-6 w-6" />
                Themed Experiences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-emerald-100 mb-4">
                Step into different worlds - from cosmic corners to zen gardens, each zone offers a unique atmosphere.
              </p>
              <div className="space-y-2">
                <Badge className="bg-emerald-600/20 text-emerald-200 border-emerald-400/30">🌌 Cosmic Corner</Badge>
                <Badge className="bg-emerald-600/20 text-emerald-200 border-emerald-400/30">🎵 Vinyl Lounge</Badge>
                <Badge className="bg-emerald-600/20 text-emerald-200 border-emerald-400/30">🧘 Zen Garden</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border-orange-400/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-200">
                <Users className="h-6 w-6" />
                Social Connections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-100 mb-4">
                Meet like-minded coffee enthusiasts, share experiences, and build lasting connections in our community.
              </p>
              <div className="space-y-2">
                <Badge className="bg-orange-600/20 text-orange-200 border-orange-400/30">💬 Real-time Chat</Badge>
                <Badge className="bg-orange-600/20 text-orange-200 border-orange-400/30">👥 Zone Communities</Badge>
                <Badge className="bg-orange-600/20 text-orange-200 border-orange-400/30">🎉 Events & Meetups</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Community Activity */}
        <Card className="bg-gradient-to-r from-violet-900/30 to-purple-900/30 border-violet-400/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-violet-200">
              <Crown className="h-6 w-6 text-yellow-400" />
              Live Community Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  🌙
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Luna is now DJ in Cosmic Corner</p>
                  <p className="text-violet-300 text-sm">Playing "Ethereal Dreams" • 23 votes</p>
                </div>
                <Badge className="bg-purple-600 text-white">Live</Badge>
              </div>

              <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  🧘
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Zen meditation session starting in Zen Garden</p>
                  <p className="text-emerald-300 text-sm">Join Sage for mindful coffee moments</p>
                </div>
                <Badge className="bg-emerald-600 text-white">Join Now</Badge>
              </div>

              <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                  🎵
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Vinyl discovery session in Retro Lounge</p>
                  <p className="text-amber-300 text-sm">Jazz is sharing rare album finds</p>
                </div>
                <Badge className="bg-amber-600 text-white">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CommunityHome;
