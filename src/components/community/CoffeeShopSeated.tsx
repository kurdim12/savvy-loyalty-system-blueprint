
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coffee, MessageCircle, Users, Music, Settings, Gamepad2 } from 'lucide-react';
import { AtmosphericBackground } from './AtmosphericBackground';
import { RealTimeChat } from './RealTimeChat';
import { AvatarCustomizer } from './AvatarCustomizer';
import { AmbientSounds } from './AmbientSounds';
import { CafeMinigames } from './CafeMinigames';
import { WeatherSystem } from './WeatherSystem';
import { RealTimeDJSystem } from './RealTimeDJSystem';

interface CoffeeShopSeatedProps {
  seatId: string;
  onLeave: () => void;
}

export const CoffeeShopSeated = ({ seatId, onLeave }: CoffeeShopSeatedProps) => {
  const [activeTab, setActiveTab] = useState<'chill' | 'music' | 'chat' | 'customize' | 'games'>('chill');
  const [userMood, setUserMood] = useState('😊');
  const [userActivity, setUserActivity] = useState('Enjoying coffee');
  const [weather, setWeather] = useState<'sunny' | 'cloudy' | 'rainy' | 'evening' | 'snowy'>('sunny');

  const seatViews = {
    'seat-1': {
      name: 'Window Seat',
      view: 'Street View',
      background: 'linear-gradient(135deg, #F5DEB3 0%, #DEB887 50%, #D2B48C 100%)',
      description: 'Watch the world go by while enjoying your coffee',
      weather: 'sunny' as 'sunny' | 'cloudy' | 'rainy' | 'evening' | 'snowy',
      occupancy: 12
    },
    'seat-2': {
      name: 'Corner Table', 
      view: 'Garden View',
      background: 'linear-gradient(135deg, #E6D7C7 0%, #D2B48C 50%, #C1A882 100%)',
      description: 'Peaceful garden views for quiet contemplation',
      weather: 'cloudy' as 'sunny' | 'cloudy' | 'rainy' | 'evening' | 'snowy',
      occupancy: 8
    },
    'seat-3': {
      name: 'Counter Stool',
      view: 'Barista View', 
      background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #CD853F 100%)',
      description: 'Front row seat to the coffee-making magic',
      weather: 'evening' as 'sunny' | 'cloudy' | 'rainy' | 'evening' | 'snowy',
      occupancy: 15
    },
    'seat-4': {
      name: 'Lounge Chair',
      view: 'Fireplace View',
      background: 'linear-gradient(135deg, #DEB887 0%, #D2B48C 50%, #BC9A6A 100%)',
      description: 'Cozy warmth by the fireplace',
      weather: 'rainy' as 'sunny' | 'cloudy' | 'rainy' | 'evening' | 'snowy',
      occupancy: 6
    }
  };

  const currentSeat = seatViews[seatId as keyof typeof seatViews] || seatViews['seat-1'];

  const nearbyUsers = [
    { name: 'Sarah M.', mood: '😊', activity: 'Reading a novel' },
    { name: 'Mike R.', mood: userMood, activity: userActivity },
    { name: 'Emma L.', mood: '📸', activity: 'Photography' },
    { name: 'Alex K.', mood: '☕', activity: 'Coffee tasting' }
  ];

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AtmosphericBackground 
        currentSeat={seatId}
        weather={weather}
      />
      
      <div className="relative z-10 p-6 h-full flex flex-col">
        {/* Enhanced Header with Weather */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">{currentSeat.name}</h2>
            <p className="text-white/90 drop-shadow">{currentSeat.description}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                {currentSeat.view}
              </Badge>
              <Badge className="bg-[#8B4513]/80 text-white border-[#8B4513]/50 backdrop-blur-sm">
                <Users className="h-3 w-3 mr-1" />
                {currentSeat.occupancy} people
              </Badge>
              <WeatherSystem currentWeather={weather} onWeatherChange={setWeather} />
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
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: 'chill', label: 'Chill', icon: Coffee },
            { key: 'music', label: 'DJ & Music', icon: Music },
            { key: 'chat', label: 'Chat', icon: MessageCircle },
            { key: 'customize', label: 'Avatar', icon: Settings },
            { key: 'games', label: 'Games', icon: Gamepad2 }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              onClick={() => setActiveTab(key as any)}
              variant={activeTab === key ? 'default' : 'outline'}
              size="sm"
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
              <AmbientSounds weather={weather} occupancy={currentSeat.occupancy} />
              <Card className="bg-white/95 backdrop-blur-sm border-white/50">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-[#8B4513] to-[#D2B48C] rounded-full flex items-center justify-center">
                      <Coffee className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#8B4513] mb-2">Peaceful Moments</h3>
                    <p className="text-[#95A5A6] mb-4">
                      Relax and soak in the café atmosphere. Your current mood: {userMood}
                    </p>
                    <Badge className="bg-[#8B4513]/10 text-[#8B4513]">
                      Activity: {userActivity}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'music' && (
            <div className="h-full overflow-y-auto">
              <RealTimeDJSystem seatArea={seatId} />
            </div>
          )}

          {activeTab === 'chat' && (
            <RealTimeChat seatArea={seatId} onlineUsers={nearbyUsers} />
          )}

          {activeTab === 'customize' && (
            <AvatarCustomizer
              currentMood={userMood}
              currentActivity={userActivity}
              onMoodChange={setUserMood}
              onActivityChange={setUserActivity}
            />
          )}

          {activeTab === 'games' && (
            <CafeMinigames />
          )}
        </div>
      </div>
    </div>
  );
};
