
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smile, Hand, Heart, Zap, Coffee, Music } from 'lucide-react';

interface AvatarProps {
  userId: string;
  name: string;
  mood: string;
  activity: string;
  emotion: 'happy' | 'excited' | 'calm' | 'focused' | 'creative' | 'social';
  gesture: 'wave' | 'coffee_sip' | 'typing' | 'listening' | 'thinking' | 'idle';
  aura: 'creative' | 'social' | 'focused' | 'energetic' | 'calm';
  position: [number, number, number];
  onInteract: (action: string) => void;
}

interface EmotionAura {
  color: string;
  intensity: number;
  particles: boolean;
  animation: string;
}

const getEmotionAura = (emotion: string): EmotionAura => {
  const auras = {
    happy: { color: '#FFD700', intensity: 0.8, particles: true, animation: 'pulse' },
    excited: { color: '#FF6347', intensity: 1.0, particles: true, animation: 'bounce' },
    calm: { color: '#87CEEB', intensity: 0.6, particles: false, animation: 'gentle-wave' },
    focused: { color: '#9370DB', intensity: 0.7, particles: false, animation: 'steady-glow' },
    creative: { color: '#FF69B4', intensity: 0.9, particles: true, animation: 'sparkle' },
    social: { color: '#32CD32', intensity: 0.8, particles: true, animation: 'ripple' }
  };
  return auras[emotion as keyof typeof auras] || auras.calm;
};

const getGestureIcon = (gesture: string) => {
  const icons = {
    wave: Hand,
    coffee_sip: Coffee,
    typing: Zap,
    listening: Music,
    thinking: Smile,
    idle: Heart
  };
  return icons[gesture as keyof typeof icons] || Smile;
};

export const NextGenAvatar = ({ 
  userId, 
  name, 
  mood, 
  activity, 
  emotion, 
  gesture, 
  aura, 
  position,
  onInteract 
}: AvatarProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentGesture, setCurrentGesture] = useState(gesture);
  const emotionAura = getEmotionAura(emotion);
  const GestureIcon = getGestureIcon(currentGesture);

  useEffect(() => {
    // Simulate gesture changes
    const gestureTimer = setInterval(() => {
      const gestures = ['wave', 'coffee_sip', 'typing', 'listening', 'thinking', 'idle'];
      const randomGesture = gestures[Math.floor(Math.random() * gestures.length)];
      setCurrentGesture(randomGesture as any);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 5000);

    return () => clearInterval(gestureTimer);
  }, []);

  const avatarStyle = {
    transform: `translate3d(${position[0]}px, ${position[1]}px, ${position[2]}px)`,
    filter: `drop-shadow(0 0 ${emotionAura.intensity * 10}px ${emotionAura.color})`,
  };

  return (
    <div 
      className={`absolute transition-all duration-500 ${isAnimating ? 'animate-bounce' : ''}`}
      style={avatarStyle}
    >
      <Card className="w-48 bg-white/90 backdrop-blur-sm border-2 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-4">
          {/* Avatar Circle with Aura */}
          <div className="relative mb-3">
            <div 
              className={`w-16 h-16 rounded-full mx-auto animate-${emotionAura.animation} relative overflow-hidden`}
              style={{ 
                backgroundColor: emotionAura.color,
                boxShadow: `0 0 ${emotionAura.intensity * 20}px ${emotionAura.color}40`
              }}
            >
              {/* Avatar Image Placeholder */}
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
              
              {/* Emotion particles */}
              {emotionAura.particles && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: '2s'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Gesture indicator */}
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
              <GestureIcon className="h-4 w-4 text-gray-600" />
            </div>
          </div>

          {/* User Info */}
          <div className="text-center space-y-2">
            <h4 className="font-semibold text-gray-800">{name}</h4>
            <div className="flex flex-wrap gap-1 justify-center">
              <Badge variant="outline" className="text-xs">{mood}</Badge>
              <Badge variant="outline" className="text-xs">{activity}</Badge>
            </div>
          </div>

          {/* Interaction Buttons */}
          <div className="flex gap-2 mt-3">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => onInteract('wave')}
            >
              👋 Wave
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => onInteract('chat')}
            >
              💬 Chat
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const AvatarCustomizationPanel = ({ 
  onEmotionChange, 
  onGestureChange, 
  onAuraChange 
}: {
  onEmotionChange: (emotion: string) => void;
  onGestureChange: (gesture: string) => void;
  onAuraChange: (aura: string) => void;
}) => {
  const emotions = ['happy', 'excited', 'calm', 'focused', 'creative', 'social'];
  const gestures = ['wave', 'coffee_sip', 'typing', 'listening', 'thinking', 'idle'];
  const auras = ['creative', 'social', 'focused', 'energetic', 'calm'];

  return (
    <Card className="mb-4">
      <CardContent className="p-4 space-y-4">
        <div>
          <h4 className="font-medium mb-2">Emotion</h4>
          <div className="grid grid-cols-3 gap-2">
            {emotions.map(emotion => (
              <Button
                key={emotion}
                size="sm"
                variant="outline"
                onClick={() => onEmotionChange(emotion)}
                className="capitalize"
              >
                {emotion}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Gesture</h4>
          <div className="grid grid-cols-3 gap-2">
            {gestures.map(gesture => (
              <Button
                key={gesture}
                size="sm"
                variant="outline"
                onClick={() => onGestureChange(gesture)}
                className="capitalize"
              >
                {gesture.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Aura</h4>
          <div className="grid grid-cols-3 gap-2">
            {auras.map(aura => (
              <Button
                key={aura}
                size="sm"
                variant="outline"
                onClick={() => onAuraChange(aura)}
                className="capitalize"
              >
                {aura}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
