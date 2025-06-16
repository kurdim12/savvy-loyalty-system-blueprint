
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sun, Moon, Cloud, CloudRain, Snowflake, Calendar, Volume2 } from 'lucide-react';

interface EnvironmentState {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  weather: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  ambientVolume: number;
  lighting: string;
  mood: string;
}

interface DynamicEnvironmentProps {
  currentOccupancy: number;
  userPreferences?: {
    preferredTime?: string;
    preferredWeather?: string;
  };
}

export const DynamicEnvironment: React.FC<DynamicEnvironmentProps> = ({
  currentOccupancy,
  userPreferences
}) => {
  const [environment, setEnvironment] = useState<EnvironmentState>({
    timeOfDay: 'morning',
    weather: 'sunny',
    season: 'spring',
    ambientVolume: 0.5,
    lighting: 'warm',
    mood: 'energetic'
  });

  useEffect(() => {
    const updateEnvironment = () => {
      const now = new Date();
      const hour = now.getHours();
      const month = now.getMonth();
      
      // Determine time of day
      let timeOfDay: EnvironmentState['timeOfDay'] = 'morning';
      if (hour >= 6 && hour < 12) timeOfDay = 'morning';
      else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
      else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
      else timeOfDay = 'night';

      // Determine season
      let season: EnvironmentState['season'] = 'spring';
      if (month >= 2 && month <= 4) season = 'spring';
      else if (month >= 5 && month <= 7) season = 'summer';
      else if (month >= 8 && month <= 10) season = 'autumn';
      else season = 'winter';

      // Adjust ambient volume based on occupancy
      const ambientVolume = Math.min(0.8, 0.3 + (currentOccupancy * 0.02));

      // Set weather based on season and randomness
      const weatherOptions = {
        spring: ['sunny', 'cloudy', 'rainy'],
        summer: ['sunny', 'sunny', 'cloudy'],
        autumn: ['cloudy', 'rainy', 'sunny'],
        winter: ['cloudy', 'snowy', 'sunny']
      };
      const weather = weatherOptions[season][Math.floor(Math.random() * 3)] as EnvironmentState['weather'];

      // Determine lighting and mood
      const lighting = timeOfDay === 'night' ? 'dim' : timeOfDay === 'evening' ? 'cozy' : 'bright';
      const mood = currentOccupancy > 15 ? 'social' : currentOccupancy > 8 ? 'moderate' : 'peaceful';

      setEnvironment({
        timeOfDay,
        weather,
        season,
        ambientVolume,
        lighting,
        mood
      });
    };

    updateEnvironment();
    const interval = setInterval(updateEnvironment, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [currentOccupancy]);

  const getTimeIcon = () => {
    switch (environment.timeOfDay) {
      case 'morning': return <Sun className="h-4 w-4 text-yellow-500" />;
      case 'afternoon': return <Sun className="h-4 w-4 text-orange-500" />;
      case 'evening': return <Moon className="h-4 w-4 text-purple-500" />;
      case 'night': return <Moon className="h-4 w-4 text-blue-500" />;
    }
  };

  const getWeatherIcon = () => {
    switch (environment.weather) {
      case 'sunny': return <Sun className="h-4 w-4 text-yellow-500" />;
      case 'cloudy': return <Cloud className="h-4 w-4 text-gray-500" />;
      case 'rainy': return <CloudRain className="h-4 w-4 text-blue-500" />;
      case 'snowy': return <Snowflake className="h-4 w-4 text-blue-300" />;
    }
  };

  const getEnvironmentStyle = () => {
    const baseStyle = "absolute inset-0 pointer-events-none transition-all duration-1000";
    
    switch (environment.timeOfDay) {
      case 'morning':
        return `${baseStyle} bg-gradient-to-br from-yellow-100/30 to-orange-100/30`;
      case 'afternoon':
        return `${baseStyle} bg-gradient-to-br from-blue-100/20 to-white/10`;
      case 'evening':
        return `${baseStyle} bg-gradient-to-br from-purple-200/40 to-pink-200/30`;
      case 'night':
        return `${baseStyle} bg-gradient-to-br from-blue-900/50 to-purple-900/40`;
    }
  };

  const getWeatherEffect = () => {
    if (environment.weather === 'rainy') {
      return (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-8 bg-blue-400/30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      );
    }
    
    if (environment.weather === 'snowy') {
      return (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/60 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      );
    }
    
    return null;
  };

  return (
    <>
      {/* Environment Overlay */}
      <div className={getEnvironmentStyle()} />
      {getWeatherEffect()}

      {/* Environment Status Card */}
      <Card className="absolute top-20 right-4 bg-white/90 backdrop-blur-sm border-white/50 shadow-lg">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium">Café Atmosphere</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getTimeIcon()}
                <span className="text-xs capitalize">{environment.timeOfDay}</span>
              </div>
              <div className="flex items-center gap-2">
                {getWeatherIcon()}
                <span className="text-xs capitalize">{environment.weather}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Volume2 className="h-3 w-3 text-gray-500" />
              <div className="flex-1 bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${environment.ambientVolume * 100}%` }}
                />
              </div>
            </div>
            
            <div className="flex gap-1">
              <Badge variant="outline" className="text-xs">
                {environment.lighting}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {environment.mood}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {environment.season}
              </Badge>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 text-center mt-2">
            🌟 Live atmosphere changes throughout the day
          </div>
        </CardContent>
      </Card>
    </>
  );
};
