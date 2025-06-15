
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Cloud, Sun, Moon, CloudRain, Wind, Thermometer } from 'lucide-react';

export const AIAtmosphereController = () => {
  const [currentWeather, setCurrentWeather] = useState({
    condition: 'sunny',
    temperature: 72,
    windSpeed: 5,
    humidity: 45,
    timeOfDay: 'afternoon'
  });
  
  const [atmosphereData, setAtmosphereData] = useState({
    crowdEnergy: 75,
    conversationVolume: 60,
    musicMood: 'upbeat',
    lightingWarmth: 80
  });

  const [ambientSounds, setAmbientSounds] = useState([
    { name: 'Coffee Machine', intensity: 40, active: true },
    { name: 'Gentle Chatter', intensity: 30, active: true },
    { name: 'Rain Outside', intensity: 20, active: false },
    { name: 'Jazz Piano', intensity: 25, active: true }
  ]);

  useEffect(() => {
    // Simulate AI-driven atmosphere changes
    const atmosphereInterval = setInterval(() => {
      // Dynamic weather simulation
      const weatherConditions = ['sunny', 'cloudy', 'rainy', 'windy'];
      const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
      
      setCurrentWeather(prev => ({
        ...prev,
        condition: randomWeather,
        temperature: 65 + Math.random() * 20,
        windSpeed: Math.random() * 15,
        humidity: 30 + Math.random() * 40
      }));

      // Crowd energy simulation (affects lighting and sound)
      setAtmosphereData(prev => ({
        ...prev,
        crowdEnergy: 40 + Math.random() * 60,
        conversationVolume: 20 + Math.random() * 80,
        lightingWarmth: 60 + Math.random() * 40
      }));

      // Update ambient sounds based on conditions
      setAmbientSounds(prev => prev.map(sound => ({
        ...sound,
        intensity: Math.max(10, sound.intensity + (Math.random() - 0.5) * 20),
        active: Math.random() > 0.2 // 80% chance to stay active
      })));
    }, 8000);

    return () => clearInterval(atmosphereInterval);
  }, []);

  const getWeatherIcon = () => {
    switch (currentWeather.condition) {
      case 'sunny': return <Sun className="h-4 w-4 text-yellow-400" />;
      case 'cloudy': return <Cloud className="h-4 w-4 text-gray-400" />;
      case 'rainy': return <CloudRain className="h-4 w-4 text-blue-400" />;
      case 'windy': return <Wind className="h-4 w-4 text-gray-300" />;
      default: return <Sun className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getEnergyColor = (energy: number) => {
    if (energy > 70) return 'text-red-400';
    if (energy > 40) return 'text-yellow-400';
    return 'text-blue-400';
  };

  return (
    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30">
      <Card className="bg-black/30 backdrop-blur-xl border border-cyan-400/20">
        <CardContent className="p-4">
          <div className="text-center mb-3">
            <h3 className="text-white font-bold text-sm mb-1">🤖 AI Atmosphere</h3>
            <p className="text-cyan-300 text-xs">Dynamic environment control</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            {/* Weather Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white">
                {getWeatherIcon()}
                <span className="capitalize">{currentWeather.condition}</span>
              </div>
              
              <div className="flex items-center gap-2 text-white">
                <Thermometer className="h-3 w-3" />
                <span>{Math.round(currentWeather.temperature)}°F</span>
              </div>
            </div>
            
            {/* Atmosphere Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-white">
                <span>Energy</span>
                <span className={getEnergyColor(atmosphereData.crowdEnergy)}>
                  {Math.round(atmosphereData.crowdEnergy)}%
                </span>
              </div>
              
              <div className="flex items-center justify-between text-white">
                <span>Warmth</span>
                <span className="text-orange-400">
                  {Math.round(atmosphereData.lightingWarmth)}%
                </span>
              </div>
            </div>
          </div>
          
          {/* Ambient Sounds */}
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="text-white text-xs mb-2">🎵 Active Sounds</div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {ambientSounds.filter(sound => sound.active).map((sound, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300 truncate">{sound.name}</span>
                  <div className="flex items-center gap-1">
                    <div className="w-6 bg-gray-600 rounded-full h-1">
                      <div 
                        className="bg-green-400 h-1 rounded-full transition-all"
                        style={{ width: `${(sound.intensity / 100) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* AI Status */}
          <div className="mt-3 pt-3 border-t border-white/10 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-xs">AI Learning Active</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
