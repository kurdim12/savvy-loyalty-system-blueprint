
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX, Coffee, Music, CloudRain, Users } from 'lucide-react';

interface AmbientSoundsProps {
  weather: 'sunny' | 'cloudy' | 'rainy' | 'evening' | 'snowy';
  occupancy: number;
}

export const AmbientSounds = ({ weather, occupancy }: AmbientSoundsProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [masterVolume, setMasterVolume] = useState([50]);
  const [coffeeVolume, setCoffeeVolume] = useState([30]);
  const [chatterVolume, setChatterVolume] = useState([20]);
  const [musicVolume, setMusicVolume] = useState([40]);
  const [rainVolume, setRainVolume] = useState([weather === 'rainy' ? 25 : 0]);

  // Audio context refs (in a real implementation, these would be actual audio files)
  const audioContextRef = useRef<AudioContext | null>(null);

  const soundLayers = [
    {
      name: 'Coffee Brewing',
      icon: Coffee,
      volume: coffeeVolume,
      setVolume: setCoffeeVolume,
      color: 'text-amber-600'
    },
    {
      name: 'Gentle Chatter',
      icon: Users,
      volume: chatterVolume,
      setVolume: setChatterVolume,
      color: 'text-blue-600'
    },
    {
      name: 'Background Music',
      icon: Music,
      volume: musicVolume,
      setVolume: setMusicVolume,
      color: 'text-purple-600'
    },
    {
      name: 'Rain Outside',
      icon: CloudRain,
      volume: rainVolume,
      setVolume: setRainVolume,
      color: 'text-gray-600'
    }
  ];

  useEffect(() => {
    // Automatically adjust ambient sounds based on occupancy and weather
    const baseChatter = Math.min(occupancy * 5, 40);
    setChatterVolume([baseChatter]);
    
    if (weather === 'rainy') {
      setRainVolume([25]);
    } else {
      setRainVolume([0]);
    }
  }, [occupancy, weather]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would start/stop actual audio playback
    console.log(isPlaying ? 'Stopping ambient sounds' : 'Starting ambient sounds');
  };

  const getWeatherDescription = () => {
    switch (weather) {
      case 'rainy': return 'Cozy rain sounds';
      case 'evening': return 'Evening atmosphere';
      case 'cloudy': return 'Soft cloudy day';
      case 'snowy': return 'Peaceful snowy day';
      default: return 'Bright sunny day';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-[#8B4513]">
          <div className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Ambient Sounds
          </div>
          <Button
            onClick={togglePlayback}
            variant="outline"
            size="sm"
            className="border-[#8B4513] text-[#8B4513]"
          >
            {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </CardTitle>
        <p className="text-sm text-gray-600">{getWeatherDescription()}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#8B4513]">Master Volume</span>
            <span className="text-sm text-gray-500">{masterVolume[0]}%</span>
          </div>
          <Slider
            value={masterVolume}
            onValueChange={setMasterVolume}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          {soundLayers.map((layer) => (
            <div key={layer.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <layer.icon className={`h-4 w-4 ${layer.color}`} />
                  <span className="text-sm font-medium">{layer.name}</span>
                </div>
                <span className="text-sm text-gray-500">{layer.volume[0]}%</span>
              </div>
              <Slider
                value={layer.volume}
                onValueChange={layer.setVolume}
                max={100}
                step={1}
                className="w-full"
                disabled={!isPlaying}
              />
            </div>
          ))}
        </div>

        <div className="pt-2 border-t text-xs text-gray-500">
          Café occupancy: {occupancy} people • Affects ambient chatter level
        </div>
      </CardContent>
    </Card>
  );
};
