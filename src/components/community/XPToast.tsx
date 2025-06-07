
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, TrendingUp } from 'lucide-react';

interface XPToastProps {
  points: number;
  show: boolean;
  onComplete?: () => void;
  position?: 'top-right' | 'center' | 'bottom-right';
  type?: 'chat' | 'chill' | 'achievement';
}

export const XPToast = ({ 
  points, 
  show, 
  onComplete, 
  position = 'top-right',
  type = 'chat'
}: XPToastProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onComplete?.(), 300); // Wait for fade out
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    'bottom-right': 'bottom-4 right-4'
  };

  const typeConfig = {
    chat: {
      icon: <Sparkles className="h-4 w-4" />,
      bg: 'bg-gradient-to-r from-blue-500 to-purple-600',
      text: 'Chat XP!'
    },
    chill: {
      icon: <TrendingUp className="h-4 w-4" />,
      bg: 'bg-gradient-to-r from-[#8B4513] to-[#D2B48C]',
      text: 'Chill Bonus!'
    },
    achievement: {
      icon: <Sparkles className="h-4 w-4" />,
      bg: 'bg-gradient-to-r from-yellow-500 to-orange-600',
      text: 'Achievement!'
    }
  };

  const config = typeConfig[type];

  return (
    <div
      className={cn(
        'fixed z-50 pointer-events-none',
        positionClasses[position],
        'transition-all duration-300 ease-out',
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 -translate-y-2 scale-95'
      )}
    >
      <div className={cn(
        'px-4 py-2 rounded-full shadow-lg text-white font-bold',
        'flex items-center gap-2 min-w-[120px] justify-center',
        'animate-bounce',
        config.bg
      )}>
        {config.icon}
        <span>+{points} XP</span>
      </div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={cn(
              'absolute w-1 h-1 bg-yellow-300 rounded-full',
              'animate-ping opacity-75',
              i === 0 && 'top-0 left-2 animation-delay-100',
              i === 1 && 'top-2 right-2 animation-delay-300',
              i === 2 && 'bottom-0 left-1/2 animation-delay-500'
            )}
            style={{
              animationDuration: '1.5s',
              animationDelay: `${i * 200}ms`
            }}
          />
        ))}
      </div>
    </div>
  );
};
