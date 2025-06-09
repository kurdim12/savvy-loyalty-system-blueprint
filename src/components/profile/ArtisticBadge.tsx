
import { cn } from '@/lib/utils';
import { Crown, Award, Star } from 'lucide-react';

interface ArtisticBadgeProps {
  type: 'rank' | 'achievement';
  tier?: 'bronze' | 'silver' | 'gold';
  achievement?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  glowing?: boolean;
  className?: string;
}

export const ArtisticBadge = ({ 
  type, 
  tier, 
  achievement, 
  size = 'md', 
  glowing = false,
  className 
}: ArtisticBadgeProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  if (type === 'rank' && tier) {
    const tierStyles = {
      bronze: {
        gradient: 'from-amber-600 via-orange-500 to-amber-700',
        shadow: 'shadow-amber-500/30',
        glow: 'shadow-amber-400/50 shadow-2xl',
        border: 'border-amber-400/60',
        icon: <Award className={cn(iconSizes[size], 'text-amber-100')} />
      },
      silver: {
        gradient: 'from-slate-400 via-gray-300 to-slate-500',
        shadow: 'shadow-slate-400/30',
        glow: 'shadow-slate-300/50 shadow-2xl',
        border: 'border-slate-300/60',
        icon: <Star className={cn(iconSizes[size], 'text-slate-100')} />
      },
      gold: {
        gradient: 'from-yellow-400 via-amber-300 to-yellow-600',
        shadow: 'shadow-yellow-400/40',
        glow: 'shadow-yellow-300/60 shadow-2xl',
        border: 'border-yellow-300/70',
        icon: <Crown className={cn(iconSizes[size], 'text-yellow-100')} />
      }
    };

    const style = tierStyles[tier];

    return (
      <div className={cn(
        'relative flex items-center justify-center rounded-full border-2',
        `bg-gradient-to-br ${style.gradient}`,
        style.border,
        style.shadow,
        sizeClasses[size],
        glowing && style.glow,
        'transition-all duration-300 hover:scale-110',
        className
      )}>
        {/* Artistic inner ring */}
        <div className={cn(
          'absolute inset-1 rounded-full border border-white/20',
          'bg-gradient-to-t from-transparent to-white/10'
        )} />
        
        {/* Icon */}
        <div className="relative z-10">
          {style.icon}
        </div>
        
        {/* Glowing effect for special occasions */}
        {glowing && (
          <div className={cn(
            'absolute -inset-2 rounded-full opacity-75 blur-md',
            `bg-gradient-to-br ${style.gradient}`,
            'animate-pulse'
          )} />
        )}
      </div>
    );
  }

  // Achievement badges
  if (type === 'achievement' && achievement) {
    const achievementStyles = {
      'First Visit': {
        gradient: 'from-emerald-500 to-teal-600',
        icon: <Star className={cn(iconSizes[size], 'text-emerald-100')} />
      },
      'Coffee Connoisseur': {
        gradient: 'from-amber-600 to-orange-600',
        icon: <Award className={cn(iconSizes[size], 'text-amber-100')} />
      },
      'Social Butterfly': {
        gradient: 'from-pink-500 to-rose-600',
        icon: <Star className={cn(iconSizes[size], 'text-pink-100')} />
      }
    };

    const style = achievementStyles[achievement as keyof typeof achievementStyles] || achievementStyles['First Visit'];

    return (
      <div className={cn(
        'relative flex items-center justify-center rounded-full border-2 border-white/30',
        `bg-gradient-to-br ${style.gradient}`,
        'shadow-lg',
        sizeClasses[size],
        glowing && 'shadow-2xl shadow-current/50',
        'transition-all duration-300 hover:scale-110',
        className
      )}>
        <div className={cn(
          'absolute inset-1 rounded-full border border-white/20',
          'bg-gradient-to-t from-transparent to-white/10'
        )} />
        <div className="relative z-10">
          {style.icon}
        </div>
      </div>
    );
  }

  return null;
};
