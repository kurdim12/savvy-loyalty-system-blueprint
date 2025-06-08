
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Sun, Cloud, CloudRain, Moon, Snowflake } from 'lucide-react';

interface WeatherSystemProps {
  currentWeather: 'sunny' | 'cloudy' | 'rainy' | 'evening' | 'snowy';
  onWeatherChange: (weather: 'sunny' | 'cloudy' | 'rainy' | 'evening' | 'snowy') => void;
}

export const WeatherSystem = ({ currentWeather, onWeatherChange }: WeatherSystemProps) => {
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('afternoon');

  const weatherTypes = [
    { type: 'sunny', icon: Sun, name: 'Sunny', color: 'bg-yellow-100 text-yellow-800' },
    { type: 'cloudy', icon: Cloud, name: 'Cloudy', color: 'bg-gray-100 text-gray-800' },
    { type: 'rainy', icon: CloudRain, name: 'Rainy', color: 'bg-blue-100 text-blue-800' },
    { type: 'evening', icon: Moon, name: 'Evening', color: 'bg-purple-100 text-purple-800' },
    { type: 'snowy', icon: Snowflake, name: 'Snowy', color: 'bg-blue-50 text-blue-900' }
  ] as const;

  useEffect(() => {
    // Simulate dynamic weather changes every 2 minutes
    const weatherCycle = setInterval(() => {
      const weathers: ('sunny' | 'cloudy' | 'rainy' | 'evening' | 'snowy')[] = 
        ['sunny', 'cloudy', 'rainy', 'evening', 'snowy'];
      const randomWeather = weathers[Math.floor(Math.random() * weathers.length)];
      onWeatherChange(randomWeather);
    }, 120000); // 2 minutes

    return () => clearInterval(weatherCycle);
  }, [onWeatherChange]);

  useEffect(() => {
    // Update time of day based on actual time
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 12) setTimeOfDay('morning');
      else if (hour >= 12 && hour < 18) setTimeOfDay('afternoon');
      else if (hour >= 18 && hour < 22) setTimeOfDay('evening');
      else setTimeOfDay('night');
    };

    updateTimeOfDay();
    const timeInterval = setInterval(updateTimeOfDay, 60000); // Update every minute

    return () => clearInterval(timeInterval);
  }, []);

  const currentWeatherInfo = weatherTypes.find(w => w.type === currentWeather);
  const CurrentIcon = currentWeatherInfo?.icon || Sun;

  const getAtmosphereDescription = () => {
    const base = `${timeOfDay} ${currentWeather}`;
    switch (currentWeather) {
      case 'rainy':
        return `Cozy ${timeOfDay} with gentle rain outside`;
      case 'sunny':
        return `Bright and cheerful ${timeOfDay}`;
      case 'cloudy':
        return `Soft, overcast ${timeOfDay}`;
      case 'evening':
        return `Warm evening glow`;
      case 'snowy':
        return `Peaceful snowy ${timeOfDay}`;
      default:
        return base;
    }
  };

  return (
    <div className="space-y-2">
      <Badge className={currentWeatherInfo?.color || 'bg-gray-100'}>
        <CurrentIcon className="h-3 w-3 mr-1" />
        {getAtmosphereDescription()}
      </Badge>
      
      {/* Weather effects overlay would be applied to the main café view */}
      <div className="text-xs text-gray-500">
        Weather affects lighting, sounds, and café mood
      </div>
    </div>
  );
};
