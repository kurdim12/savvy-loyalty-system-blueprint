
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coffee, MessageCircle, Users, Star, Music, Sparkles } from 'lucide-react';
import { AtmosphericBackground } from './AtmosphericBackground';

interface CoffeeShopSeatedProps {
  seatId: string;
  onLeave: () => void;
}

export const CoffeeShopSeated = ({ seatId, onLeave }: CoffeeShopSeatedProps) => {
  const [activeTab, setActiveTab] = useState<'chill' | 'music' | 'chat' | 'order'>('chill');

  const seatViews = {
    'seat-1': {
      name: 'Window Seat',
      view: 'Street View',
      background: 'linear-gradient(135deg, #F5DEB3 0%, #DEB887 50%, #D2B48C 100%)',
      description: 'Watch the world go by while enjoying your coffee',
      weather: 'sunny' as const
    },
    'seat-2': {
      name: 'Corner Table', 
      view: 'Garden View',
      background: 'linear-gradient(135deg, #E6D7C7 0%, #D2B48C 50%, #C1A882 100%)',
      description: 'Peaceful garden views for quiet contemplation',
      weather: 'cloudy' as const
    },
    'seat-3': {
      name: 'Counter Stool',
      view: 'Barista View', 
      background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #CD853F 100%)',
      description: 'Front row seat to the coffee-making magic',
      weather: 'evening' as const
    },
    'seat-4': {
      name: 'Lounge Chair',
      view: 'Fireplace View',
      background: 'linear-gradient(135deg, #DEB887 0%, #D2B48C 50%, #BC9A6A 100%)',
      description: 'Cozy warmth by the fireplace',
      weather: 'rainy' as const
    }
  };

  const currentSeat = seatViews[seatId as keyof typeof seatViews] || seatViews['seat-1'];

  const handleOrderCoffee = () => {
    console.log('Coffee ordered!');
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Atmospheric Background */}
      <AtmosphericBackground 
        currentSeat={seatId}
        weather={currentSeat.weather}
      />
      
      {/* Main Content */}
      <div className="relative z-10 p-6 h-full flex flex-col">
        {/* Seat Info Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">{currentSeat.name}</h2>
            <p className="text-white/90 drop-shadow">{currentSeat.description}</p>
            <div className="flex gap-2 mt-2">
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                {currentSeat.view}
              </Badge>
              <Badge className="bg-[#8B4513]/80 text-white border-[#8B4513]/50 backdrop-blur-sm">
                <Users className="h-3 w-3 mr-1" />
                3 others nearby
              </Badge>
            </div>
          </div>
          
          <Button
            onClick={onLeave}
            variant="outline"
            className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
          >
            Stand Up
          </Button>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'chill', label: 'Chill', icon: Coffee },
            { key: 'music', label: 'Music Requests', icon: Music },
            { key: 'chat', label: 'Chat', icon: MessageCircle },
            { key: 'order', label: 'Order', icon: Star }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              onClick={() => setActiveTab(key as any)}
              variant={activeTab === key ? 'default' : 'outline'}
              className={
                activeTab === key
                  ? 'bg-white text-[#8B4513] hover:bg-white/90'
                  : 'bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm'
              }
            >
              <Icon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{label}</span>
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'chill' && (
            <div className="h-full flex items-center justify-center">
              <Card className="bg-white/95 backdrop-blur-sm border-white/50 max-w-lg w-full">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-[#8B4513] to-[#D2B48C] rounded-full flex items-center justify-center">
                      <Sparkles className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#8B4513] mb-2">Peaceful Moments</h3>
                    <p className="text-[#95A5A6]">
                      Relax and soak in the café atmosphere. Let time slow down as you enjoy this moment.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'music' && (
            <div className="h-full max-w-4xl mx-auto">
              <Card className="bg-white/95 backdrop-blur-sm border-white/50 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#8B4513]">
                    <Music className="h-5 w-5" />
                    Music Request Station
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-[#95A5A6]">Request your favorite songs and vote for tracks. Most voted songs will play automatically!</p>
                  
                  {/* Song Request Interface would go here */}
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Music className="h-8 w-8 mx-auto mb-2 text-[#8B4513]" />
                    <p className="text-[#8B4513] font-medium">Song Request Feature</p>
                    <p className="text-sm text-[#95A5A6]">Coming Soon - Spotify Integration</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="h-full max-w-4xl mx-auto">
              <Card className="bg-white/95 backdrop-blur-sm border-white/50 h-full">
                <CardContent className="p-6 h-full flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-[#8B4513]" />
                    <h3 className="text-lg font-medium text-[#8B4513] mb-2">Private Chat Available</h3>
                    <p className="text-[#95A5A6]">Chat with people in your seating area through the floor plan</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'order' && (
            <div className="h-full overflow-y-auto max-w-4xl mx-auto">
              <Card className="bg-white/95 backdrop-blur-sm border-white/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#8B4513]">
                    <Star className="h-5 w-5" />
                    Today's Special
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#8B4513] to-[#D2B48C] rounded-full flex items-center justify-center">
                      <Coffee className="h-10 w-10 text-white" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-[#8B4513] mb-2">Ethiopian Yirgacheffe</h3>
                    <p className="text-[#95A5A6] mb-3">Yirgacheffe, Ethiopia</p>
                    <p className="text-sm text-[#8B4513] mb-4">Bright citrus, floral, honey sweetness</p>
                    
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">4.8</span>
                      </div>
                      <div className="text-lg font-bold text-[#8B4513]">$4.50</div>
                    </div>
                    
                    <Button 
                      onClick={handleOrderCoffee}
                      className="w-full bg-[#8B4513] hover:bg-[#8B4513]/90 text-white"
                    >
                      <Coffee className="h-4 w-4 mr-2" />
                      Order Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
