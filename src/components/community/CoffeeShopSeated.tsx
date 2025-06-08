
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coffee, MessageCircle, Users, Star } from 'lucide-react';
import { CommunityChat } from './CommunityChat';
import { SitChillTimer } from './SitChillTimer';

interface CoffeeShopSeatedProps {
  seatId: string;
  onEarnPoints?: (points: number) => void;
  onLeave: () => void;
}

export const CoffeeShopSeated = ({ seatId, onEarnPoints, onLeave }: CoffeeShopSeatedProps) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'chill' | 'barista'>('chill');

  const seatViews = {
    'seat-1': {
      name: 'Window Seat',
      view: 'Street View',
      background: 'linear-gradient(135deg, #F5DEB3 0%, #DEB887 50%, #D2B48C 100%)',
      description: 'Watch the world go by while enjoying your coffee'
    },
    'seat-2': {
      name: 'Corner Table', 
      view: 'Garden View',
      background: 'linear-gradient(135deg, #E6D7C7 0%, #D2B48C 50%, #C1A882 100%)',
      description: 'Peaceful garden views for quiet contemplation'
    },
    'seat-3': {
      name: 'Counter Stool',
      view: 'Barista View', 
      background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #CD853F 100%)',
      description: 'Front row seat to the coffee-making magic'
    },
    'seat-4': {
      name: 'Lounge Chair',
      view: 'Fireplace View',
      background: 'linear-gradient(135deg, #DEB887 0%, #D2B48C 50%, #BC9A6A 100%)',
      description: 'Cozy warmth by the fireplace'
    }
  };

  const currentSeat = seatViews[seatId as keyof typeof seatViews] || seatViews['seat-1'];

  const dailySpecial = {
    name: 'Ethiopian Yirgacheffe',
    origin: 'Yirgacheffe, Ethiopia',
    notes: 'Bright citrus, floral, honey sweetness',
    rating: 4.8,
    price: '$4.50'
  };

  return (
    <div 
      className="relative w-full h-full"
      style={{ background: currentSeat.background }}
    >
      {/* Atmospheric Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
      
      {/* Main Content */}
      <div className="relative z-10 p-6 h-full flex flex-col">
        {/* Seat Info Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{currentSeat.name}</h2>
            <p className="text-white/80">{currentSeat.description}</p>
            <Badge className="mt-2 bg-white/20 text-white border-white/30">
              {currentSeat.view}
            </Badge>
          </div>
          
          <Button
            onClick={onLeave}
            variant="outline"
            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
          >
            Stand Up
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'chill', label: 'Chill & Earn', icon: Coffee },
            { key: 'chat', label: 'Community Chat', icon: MessageCircle },
            { key: 'barista', label: 'Daily Special', icon: Star }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              onClick={() => setActiveTab(key as any)}
              variant={activeTab === key ? 'default' : 'outline'}
              className={
                activeTab === key
                  ? 'bg-white text-[#8B4513]'
                  : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
              }
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'chill' && (
            <div className="h-full flex items-center justify-center">
              <SitChillTimer onPointsEarned={onEarnPoints} />
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="h-full">
              <CommunityChat />
            </div>
          )}

          {activeTab === 'barista' && (
            <div className="h-full flex items-center justify-center">
              <Card className="w-full max-w-lg bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#8B4513]">
                    <Star className="h-5 w-5" />
                    Today's Special
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-[#8B4513] to-[#D2B48C] rounded-full flex items-center justify-center">
                      <Coffee className="h-12 w-12 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-[#8B4513] mb-2">{dailySpecial.name}</h3>
                    <p className="text-[#95A5A6] mb-3">{dailySpecial.origin}</p>
                    <p className="text-sm text-[#8B4513] mb-4">{dailySpecial.notes}</p>
                    
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{dailySpecial.rating}</span>
                      </div>
                      <div className="text-lg font-bold text-[#8B4513]">{dailySpecial.price}</div>
                    </div>
                    
                    <div className="space-y-2">
                      <Button className="w-full bg-[#8B4513] hover:bg-[#8B4513]/90 text-white">
                        <Coffee className="h-4 w-4 mr-2" />
                        Order Now (+3 XP)
                      </Button>
                      <Button variant="outline" className="w-full border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513]/10">
                        Learn About Origin
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Ambient Elements */}
      <div className="absolute bottom-6 left-6">
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <Users className="h-4 w-4" />
          <span>3 others nearby</span>
        </div>
      </div>
    </div>
  );
};
