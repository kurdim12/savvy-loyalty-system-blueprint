import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, Crown } from 'lucide-react';

interface ProgressCardProps {
  currentPoints: number;
  membershipTier: string;
}

export const ProgressCard = ({ currentPoints, membershipTier }: ProgressCardProps) => {
  let nextTier = '';
  let pointsToNextTier = 0;
  let progress = 0;
  let currentTierMin = 0;
  let nextTierMin = 0;

  if (membershipTier === 'bronze') {
    nextTier = 'silver';
    currentTierMin = 0;
    nextTierMin = 200;
    pointsToNextTier = Math.max(0, 200 - currentPoints);
    progress = currentPoints > 0 ? Math.min((currentPoints / 200) * 100, 100) : 0;
  } else if (membershipTier === 'silver') {
    nextTier = 'gold';
    currentTierMin = 200;
    nextTierMin = 550;
    pointsToNextTier = Math.max(0, 550 - currentPoints);
    progress = Math.min(((currentPoints - 200) / (550 - 200)) * 100, 100);
  } else {
    // Gold tier - already at max
    nextTier = 'gold';
    pointsToNextTier = 0;
    progress = 100;
    currentTierMin = 550;
    nextTierMin = 550;
  }

  const getIcon = (tier: string) => {
    switch (tier) {
      case 'gold':
        return <Crown className="h-5 w-5 text-yellow-600" />;
      case 'silver':
        return <Trophy className="h-5 w-5 text-slate-600" />;
      default:
        return <Star className="h-5 w-5 text-amber-600" />;
    }
  };

  const getColors = (tier: string) => {
    switch (tier) {
      case 'gold':
        return {
          bg: 'from-yellow-50 to-amber-50',
          text: 'text-yellow-900',
          progress: 'bg-yellow-500'
        };
      case 'silver':
        return {
          bg: 'from-slate-50 to-slate-100',
          text: 'text-slate-900', 
          progress: 'bg-slate-500'
        };
      default:
        return {
          bg: 'from-amber-50 to-orange-50',
          text: 'text-amber-900',
          progress: 'bg-amber-500'
        };
    }
  };

  if (membershipTier === 'gold' && currentPoints >= 550) {
    const colors = getColors('gold');
    return (
      <Card className={`border-yellow-200 bg-gradient-to-r ${colors.bg} shadow-lg`}>
        <CardHeader className="pb-3">
          <CardTitle className={`text-lg flex items-center gap-2 ${colors.text}`}>
            <Crown className="h-5 w-5 text-yellow-600" />
            Gold Member - Maximum Tier Achieved! 
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Progress value={100} className="h-3 bg-yellow-100" />
            <div className="flex justify-between items-center">
              <p className={`text-sm ${colors.text} opacity-80`}>
                🎉 You've reached the highest tier! Enjoy all premium benefits.
              </p>
              <div className="flex items-center gap-1 text-yellow-700 font-semibold">
                <Trophy className="h-4 w-4" />
                VIP
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (pointsToNextTier === 0) return null;

  const colors = getColors(nextTier);

  return (
    <Card className={`border-amber-200 bg-gradient-to-r ${colors.bg} shadow-lg hover:shadow-xl transition-shadow`}>
      <CardHeader className="pb-3">
        <CardTitle className={`text-lg flex items-center gap-2 ${colors.text}`}>
          {getIcon(nextTier)}
          Progress to {nextTier.charAt(0).toUpperCase() + nextTier.slice(1)} Tier
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className={`text-sm ${colors.text} opacity-80`}>
              {currentPoints.toLocaleString()} / {nextTierMin.toLocaleString()} points
            </span>
            <span className={`text-sm font-medium ${colors.text}`}>
              {Math.round(progress)}%
            </span>
          </div>
          
          <div className="space-y-2">
            <Progress 
              value={progress} 
              className="h-3 bg-white/50"
            />
            <div className="flex justify-between text-xs opacity-70">
              <span>{currentTierMin.toLocaleString()}</span>
              <span>{nextTierMin.toLocaleString()}</span>
            </div>
          </div>
          
          <div className={`p-3 bg-white/50 rounded-lg`}>
            <p className={`text-sm ${colors.text} text-center`}>
              <span className="font-bold">{pointsToNextTier.toLocaleString()} more points</span> needed to unlock {nextTier} benefits!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};