
import { useEffect, useState } from 'react';

interface ParticleEffect {
  id: string;
  x: number;
  y: number;
  type: 'join' | 'leave' | 'steam' | 'sparkle';
  timestamp: number;
}

interface EnhancedSeatingEffectsProps {
  particles: ParticleEffect[];
}

export const EnhancedSeatingEffects = ({ particles }: EnhancedSeatingEffectsProps) => {
  const [activeParticles, setActiveParticles] = useState<ParticleEffect[]>([]);

  useEffect(() => {
    setActiveParticles(particles);
    const timer = setTimeout(() => {
      setActiveParticles(prev => 
        prev.filter(p => Date.now() - p.timestamp < 3000)
      );
    }, 100);
    return () => clearTimeout(timer);
  }, [particles]);

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {activeParticles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute w-2 h-2 rounded-full animate-ping ${
            particle.type === 'join' ? 'bg-green-400' :
            particle.type === 'leave' ? 'bg-red-400' :
            particle.type === 'steam' ? 'bg-white/60' :
            'bg-yellow-400'
          }`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `${particle.type === 'steam' ? 'steam-rise' : 'ping'} 2s ease-out infinite`
          }}
        />
      ))}
    </div>
  );
};
