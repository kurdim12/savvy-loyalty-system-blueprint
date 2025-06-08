
import { useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface AtmosphericBackgroundProps {
  currentSeat: string;
  weather: 'sunny' | 'cloudy' | 'rainy' | 'evening' | 'snowy';
}

export const AtmosphericBackground = ({ currentSeat, weather }: AtmosphericBackgroundProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);

  useEffect(() => {
    // Generate weather particles based on weather type
    if (weather === 'rainy' || weather === 'snowy') {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [weather]);

  const getBackgroundGradient = () => {
    const seatBackgrounds = {
      'seat-1': 'linear-gradient(135deg, #F5DEB3 0%, #DEB887 50%, #D2B48C 100%)',
      'seat-2': 'linear-gradient(135deg, #E6D7C7 0%, #D2B48C 50%, #C1A882 100%)',
      'seat-3': 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #CD853F 100%)',
      'seat-4': 'linear-gradient(135deg, #DEB887 0%, #D2B48C 50%, #BC9A6A 100%)'
    };

    let baseGradient = seatBackgrounds[currentSeat as keyof typeof seatBackgrounds] || seatBackgrounds['seat-1'];

    // Apply weather overlay
    switch (weather) {
      case 'rainy':
        return `${baseGradient}, linear-gradient(rgba(100, 150, 200, 0.3), rgba(100, 150, 200, 0.3))`;
      case 'cloudy':
        return `${baseGradient}, linear-gradient(rgba(150, 150, 150, 0.2), rgba(150, 150, 150, 0.2))`;
      case 'evening':
        return `${baseGradient}, linear-gradient(rgba(75, 50, 100, 0.4), rgba(75, 50, 100, 0.4))`;
      case 'snowy':
        return `${baseGradient}, linear-gradient(rgba(240, 248, 255, 0.3), rgba(240, 248, 255, 0.3))`;
      default:
        return baseGradient;
    }
  };

  return (
    <div 
      className="absolute inset-0 transition-all duration-1000"
      style={{
        background: getBackgroundGradient(),
        opacity: 0.95
      }}
    >
      {/* Weather particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full ${
            weather === 'rainy' ? 'bg-blue-300' : 'bg-white'
          } opacity-70 animate-pulse`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.id * 100}ms`
          }}
        />
      ))}
      
      {/* Atmospheric overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
    </div>
  );
};
