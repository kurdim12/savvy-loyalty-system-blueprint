import { X, Star, Clock, Gift, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { RewardImage } from '@/components/rewards/RewardImage';
import { RewardData } from './RewardCard';

interface RewardDetailSheetProps {
  reward: RewardData | null;
  isOpen: boolean;
  onClose: () => void;
  onRedeem: (reward: RewardData) => void;
  state: 'redeemable' | 'pending' | 'locked' | 'insufficient';
  userPoints: number;
  canAccessTier: boolean;
}

const tierColors = {
  bronze: 'bg-[#CD7F32]',
  silver: 'bg-[#C0C0C0]', 
  gold: 'bg-[#D4AF37]',
} as const;

const getButtonConfig = (state: string) => {
  switch (state) {
    case 'redeemable':
      return {
        label: 'Confirm Redemption',
        icon: <Gift className="h-4 w-4" />,
        className: 'bg-black text-white hover:bg-black/80'
      };
    case 'pending':
      return {
        label: 'Awaiting Approval',
        icon: <Clock className="h-4 w-4" />,
        className: 'bg-gray-200 text-gray-500 cursor-not-allowed'
      };
    case 'locked':
      return {
        label: 'Tier Locked',
        icon: <Lock className="h-4 w-4" />,
        className: 'bg-gray-200 text-gray-500 cursor-not-allowed'
      };
    case 'insufficient':
      return {
        label: 'Not Enough Points',
        icon: <Star className="h-4 w-4" />,
        className: 'bg-gray-200 text-gray-500 cursor-not-allowed'
      };
    default:
      return {
        label: 'View Details',
        icon: <Gift className="h-4 w-4" />,
        className: 'bg-black text-white hover:bg-black/80'
      };
  }
};

export function RewardDetailSheet({ 
  reward, 
  isOpen, 
  onClose, 
  onRedeem, 
  state, 
  userPoints,
  canAccessTier 
}: RewardDetailSheetProps) {
  if (!reward) return null;

  const buttonConfig = getButtonConfig(state);
  const tier = reward.membership_required || 'bronze';
  const tierColorClass = tierColors[tier as keyof typeof tierColors] || tierColors.bronze;
  const remainingPoints = userPoints - reward.points_required;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-full sm:w-[500px] sm:max-w-[500px] flex flex-col p-0 gap-0"
      >
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <SheetHeader className="p-6 pb-4 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <SheetTitle className="text-lg font-semibold text-gray-900 leading-tight">
                  {reward.name}
                </SheetTitle>
                {reward.membership_required && (
                  <Badge className={`mt-2 text-white ${tierColorClass}`}>
                    {tier.charAt(0).toUpperCase() + tier.slice(1)} Tier Reward
                  </Badge>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="p-2 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          {/* Hero Image */}
          <div className="relative w-full h-80 bg-gray-50">
            <RewardImage
              src={reward.image_url}
              alt={reward.name}
              className="w-full h-full object-cover"
            />
            
            {reward.inventory !== null && reward.inventory <= 5 && (
              <Badge 
                variant="destructive" 
                className="absolute top-4 right-4"
              >
                Only {reward.inventory} left
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Points & Balance */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Points Required</span>
                <div className="flex items-center gap-1 text-lg font-bold text-gray-900">
                  <Star className="h-4 w-4 fill-current" />
                  {reward.points_required}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Your Balance</span>
                <span className="font-medium text-gray-900">{userPoints} points</span>
              </div>
              
              {state === 'redeemable' && (
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600">After Redemption</span>
                  <span className="font-medium text-green-600">{remainingPoints} points</span>
                </div>
              )}
            </div>

            {/* Description */}
            {reward.description && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {reward.description}
                </p>
              </div>
            )}

            {/* Brewing Tips (if coffee-related) */}
            {reward.name.toLowerCase().includes('coffee') && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Brewing Recommendations</h4>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-amber-800 text-sm">
                    For optimal flavor extraction, we recommend using a pour-over method 
                    with water temperature between 195-205°F. Grind just before brewing 
                    for the best taste experience.
                  </p>
                </div>
              </div>
            )}

            {/* Status Information */}
            {state === 'pending' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-800 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Pending Admin Approval</span>
                </div>
                <p className="text-blue-700 text-sm">
                  Your redemption request is being reviewed. You'll receive a notification once it's processed.
                </p>
              </div>
            )}

            {!canAccessTier && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800 mb-1">
                  <Lock className="h-4 w-4" />
                  <span className="font-medium">Tier Requirement Not Met</span>
                </div>
                <p className="text-red-700 text-sm">
                  This reward requires {tier.charAt(0).toUpperCase() + tier.slice(1)} tier membership. 
                  Earn more points to unlock higher tiers.
                </p>
              </div>
            )}

            {state === 'insufficient' && canAccessTier && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-orange-800 mb-1">
                  <Star className="h-4 w-4" />
                  <span className="font-medium">Insufficient Points</span>
                </div>
                <p className="text-orange-700 text-sm">
                  You need {reward.points_required - userPoints} more points to redeem this reward.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-6">
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
            
            <Button
              disabled={state !== 'redeemable'}
              onClick={() => state === 'redeemable' ? onRedeem(reward) : undefined}
              className={`flex-1 flex items-center justify-center gap-2 ${buttonConfig.className}`}
            >
              {buttonConfig.icon}
              {buttonConfig.label}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}