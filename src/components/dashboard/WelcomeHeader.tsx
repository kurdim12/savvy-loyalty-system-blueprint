import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Wallet, Copy, Crown, Award } from 'lucide-react';
import { toast } from 'sonner';

interface WelcomeHeaderProps {
  firstName?: string;
  currentPoints: number;
  membershipTier: string;
}

export const WelcomeHeader = ({ firstName, currentPoints, membershipTier }: WelcomeHeaderProps) => {
  const copyPointsToClipboard = () => {
    navigator.clipboard.writeText(currentPoints.toString());
    toast.success('Points copied to clipboard!');
  };

  const getTierIcon = () => {
    switch (membershipTier) {
      case 'gold':
        return <Crown className="h-4 w-4 mr-1 fill-current" />;
      case 'silver':
        return <Award className="h-4 w-4 mr-1 fill-current" />;
      default:
        return <Star className="h-4 w-4 mr-1 fill-current" />;
    }
  };

  const getTierColors = () => {
    switch (membershipTier) {
      case 'gold':
        return {
          bg: 'bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100',
          border: 'border-yellow-200',
          text: 'text-yellow-900',
          badge: 'bg-yellow-200 text-yellow-800 border-yellow-300'
        };
      case 'silver':
        return {
          bg: 'bg-gradient-to-br from-slate-100 via-slate-50 to-gray-100',
          border: 'border-slate-200',
          text: 'text-slate-900',
          badge: 'bg-slate-200 text-slate-800 border-slate-300'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100',
          border: 'border-amber-200',
          text: 'text-amber-900',
          badge: 'bg-amber-200 text-amber-800 border-amber-300'
        };
    }
  };

  const colors = getTierColors();

  return (
    <div className={`relative overflow-hidden rounded-2xl ${colors.bg} ${colors.border} border shadow-lg`}>
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full transform translate-x-32 -translate-y-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full transform -translate-x-24 translate-y-24" />
      </div>
      
      <div className="relative p-6 md:p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-4xl">☕</div>
              <div>
                <h1 className={`text-2xl md:text-4xl font-bold ${colors.text}`}>
                  Welcome back{firstName ? `, ${firstName}` : ''}!
                </h1>
                <p className={`${colors.text} opacity-80 text-lg`}>
                  Ready for your next coffee adventure?
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Badge 
              variant="outline" 
              className={`${colors.badge} px-4 py-2 text-sm font-semibold border`}
            >
              {getTierIcon()}
              {membershipTier.charAt(0).toUpperCase() + membershipTier.slice(1)} Member
            </Badge>
            
            <Button
              variant="outline"
              onClick={copyPointsToClipboard}
              className={`${colors.badge} border hover:bg-opacity-80 transition-all px-4 py-2 font-bold group`}
            >
              <Wallet className="h-4 w-4 mr-2" />
              {currentPoints.toLocaleString()} Points
              <Copy className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};