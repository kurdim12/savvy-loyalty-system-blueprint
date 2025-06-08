
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Cloud, Sun, Moon, CloudRain } from 'lucide-react';

interface AtmosphericBackgroundProps {
  currentSeat?: string;
  weather?: 'sunny' | 'cloudy' | 'rainy' | 'evening';
}

export const AtmosphericBackground = ({ currentSeat, weather: propWeather }: AtmosphericBackgroundProps) => {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string>('cafe');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const [weather, setWeather] = useState<'sunny' | 'cloudy' | 'rainy' | 'evening'>(propWeather || 'sunny');

  const audioOptions = [
    { id: 'cafe', name: 'Café Ambience', icon: '☕' },
    { id: 'jazz', name: 'Soft Jazz', icon: '🎷' },
    { id: 'rain', name: 'Rain Sounds', icon: '🌧️' },
    { id: 'nature', name: 'Nature Sounds', icon: '🌿' },
    { id: 'silence', name: 'Peaceful Silence', icon: '🤫' }
  ];

  // Determine time of day based on current time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon');
    else if (hour >= 17 && hour < 21) setTimeOfDay('evening');
    else setTimeOfDay('night');
  }, []);

  // Update weather periodically for realism
  useEffect(() => {
    const weatherOptions: Array<'sunny' | 'cloudy' | 'rainy' | 'evening'> = ['sunny', 'cloudy', 'rainy'];
    const interval = setInterval(() => {
      if (!propWeather) {
        const randomWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
        setWeather(randomWeather);
      }
    }, 300000); // Change every 5 minutes

    return () => clearInterval(interval);
  }, [propWeather]);

  const getBackgroundGradient = () => {
    const base = timeOfDay === 'morning' 
      ? 'from-orange-100 via-yellow-50 to-blue-100'
      : timeOfDay === 'afternoon'
      ? 'from-blue-100 via-white to-yellow-100'
      : timeOfDay === 'evening'
      ? 'from-orange-200 via-pink-100 to-purple-200'
      : 'from-indigo-900 via-purple-900 to-blue-900';

    const weatherOverlay = weather === 'rainy' 
      ? ' overlay-gray-300/30'
      : weather === 'cloudy'
      ? ' overlay-gray-200/20'
      : '';

    return `bg-gradient-to-br ${base}${weatherOverlay}`;
  };

  const getSeatSpecificView = () => {
    if (!currentSeat) return null;

    const seatViews = {
      'counter-1': {
        view: 'Coffee Bar View',
        description: 'Watch our skilled baristas craft each cup with precision',
        elements: ['Steam rising from espresso machine', 'Barista latte art', 'Fresh pastries display']
      },
      'table-1': {
        view: 'Street Window View',
        description: 'People watching through large café windows',
        elements: ['Pedestrians walking by', 'Cars passing', 'Street trees swaying']
      },
      'lounge-1': {
        view: 'Cozy Fireplace',
        description: 'Warm fireplace crackling nearby',
        elements: ['Flickering flames', 'Comfortable armchairs', 'Soft reading light']
      },
      'workspace-1': {
        view: 'Quiet Study Corner',
        description: 'Peaceful workspace with natural light',
        elements: ['Focused workers', 'Natural lighting', 'Soft keyboard sounds']
      }
    };

    return seatViews[currentSeat as keyof typeof seatViews];
  };

  const getWeatherIcon = () => {
    switch (weather) {
      case 'sunny': return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'cloudy': return <Cloud className="h-5 w-5 text-gray-500" />;
      case 'rainy': return <CloudRain className="h-5 w-5 text-blue-500" />;
      default: return <Moon className="h-5 w-5 text-purple-500" />;
    }
  };

  const seatView = getSeatSpecificView();

  return (
    <div className={`absolute inset-0 ${getBackgroundGradient()} transition-all duration-1000`}>
      {/* Weather overlay effects */}
      {weather === 'rainy' && (
        <div className="absolute inset-0 opacity-30">
          {/* Animated rain lines */}
          <div className="rain-container">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="rain-drop"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${0.5 + Math.random() * 1}s`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Steam effects for coffee areas */}
      {currentSeat?.includes('counter') && (
        <div className="absolute bottom-20 left-1/4 opacity-60">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="steam-particle animate-pulse"
              style={{
                left: `${i * 20}px`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Atmospheric Controls */}
      <Card className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm border-[#8B4513]/20">
        <div className="p-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              {getWeatherIcon()}
              <span className="text-sm font-medium capitalize">{weather}</span>
            </div>
            <div className="text-sm text-[#95A5A6] capitalize">{timeOfDay}</div>
          </div>

          {/* Audio Controls */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="p-1"
              >
                {audioEnabled ? 
                  <Volume2 className="h-4 w-4 text-[#8B4513]" /> : 
                  <VolumeX className="h-4 w-4 text-[#95A5A6]" />
                }
              </Button>
              <span className="text-xs text-[#95A5A6]">
                {audioEnabled ? 'Audio On' : 'Audio Off'}
              </span>
            </div>

            {audioEnabled && (
              <div className="grid grid-cols-2 gap-1">
                {audioOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant={currentAudio === option.id ? "default" : "ghost"}
                    size="sm"
                    className={`text-xs h-8 ${
                      currentAudio === option.id 
                        ? 'bg-[#8B4513] text-white' 
                        : 'text-[#8B4513] hover:bg-[#8B4513]/10'
                    }`}
                    onClick={() => setCurrentAudio(option.id)}
                  >
                    <span className="mr-1">{option.icon}</span>
                    {option.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Seat-specific view information */}
      {seatView && (
        <Card className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm border-[#8B4513]/20 max-w-xs">
          <div className="p-3">
            <h4 className="font-medium text-[#8B4513] mb-1">{seatView.view}</h4>
            <p className="text-xs text-[#95A5A6] mb-2">{seatView.description}</p>
            <div className="space-y-1">
              {seatView.elements.map((element, index) => (
                <div key={index} className="text-xs text-[#8B4513] flex items-center gap-1">
                  <div className="w-1 h-1 bg-[#8B4513] rounded-full" />
                  {element}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* CSS for animations */}
      <style jsx>{`
        .rain-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .rain-drop {
          position: absolute;
          top: -10px;
          width: 2px;
          height: 20px;
          background: linear-gradient(to bottom, transparent, #4A90E2, transparent);
          animation: rain-fall linear infinite;
        }
        
        @keyframes rain-fall {
          to {
            transform: translateY(calc(100vh + 20px));
          }
        }
        
        .steam-particle {
          position: absolute;
          width: 6px;
          height: 30px;
          background: linear-gradient(to top, transparent, rgba(255,255,255,0.6), transparent);
          border-radius: 50%;
          animation: steam-rise 3s infinite ease-out;
        }
        
        @keyframes steam-rise {
          0% { 
            transform: translateY(0) scale(1); 
            opacity: 0.8; 
          }
          100% { 
            transform: translateY(-40px) scale(1.5); 
            opacity: 0; 
          }
        }
      `}</style>
    </div>
  );
};
