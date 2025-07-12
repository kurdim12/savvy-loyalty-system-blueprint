import { Star, Lock, Clock, Gift } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RewardImage } from '@/components/rewards/RewardImage';

export interface RewardData {
  id: string;
  name: string;
  description?: string;
  points_required: number;
  membership_required?: string;
  inventory?: number;
  active: boolean;
  image_url?: string;
}

interface RewardCardProps {
  reward: RewardData;
  state: 'redeemable' | 'pending' | 'locked' | 'insufficient';
  onOpenDetails: (reward: RewardData) => void;
  onRedeem: (reward: RewardData) => void;
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
        label: 'Redeem Now',
        icon: <Gift className="h-3 w-3" />,
        className: 'bg-black text-white hover:bg-black/80 transition-colors'
      };
    case 'pending':
      return {
        label: 'Awaiting Approval',
        icon: <Clock className="h-3 w-3" />,
        className: 'bg-gray-200 text-gray-500 cursor-wait'
      };
    case 'locked':
      return {
        label: 'Tier Locked',
        icon: <Lock className="h-3 w-3" />,
        className: 'bg-gray-200 text-gray-500 cursor-not-allowed'
      };
    case 'insufficient':
      return {
        label: 'Not Enough Points',
        icon: <Star className="h-3 w-3" />,
        className: 'bg-gray-200 text-gray-500 cursor-not-allowed'
      };
    default:
      return {
        label: 'View Details',
        icon: <Gift className="h-3 w-3" />,
        className: 'bg-black text-white hover:bg-black/80'
      };
  }
};

export function RewardCard({ reward, state, onOpenDetails, onRedeem, canAccessTier }: RewardCardProps) {
  const buttonConfig = getButtonConfig(state);
  const tier = reward.membership_required || 'bronze';
  const tierColorClass = tierColors[tier as keyof typeof tierColors] || tierColors.bronze;

  return (
    <div className="relative flex flex-col bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_0_rgba(0,0,0,0.06)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Tier Badge */}
      {reward.membership_required && (
        <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold text-white rounded-md z-10 ${tierColorClass} ${!canAccessTier ? 'opacity-75' : ''}`}>
          {tier.charAt(0).toUpperCase() + tier.slice(1)} Tier
        </span>
      )}

      {/* Product Image */}
      <div className="relative w-full aspect-square">
        <RewardImage
          src={reward.image_url}
          alt={reward.name}
          className="w-full h-full object-cover"
        />
        
        {/* Inventory Warning */}
        {reward.inventory !== null && reward.inventory <= 5 && (
          <Badge 
            variant="destructive" 
            className="absolute top-2 right-2 text-xs"
          >
            Only {reward.inventory} left
          </Badge>
        )}

        {/* Pending Ribbon */}
        {state === 'pending' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Badge 
              variant="outline" 
              className="bg-black/20 text-white border-white/30 backdrop-blur-sm"
            >
              <Clock className="h-3 w-3 mr-1" />
              Pending Approval
            </Badge>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col gap-2 flex-grow">
        <h3 className={`text-sm font-semibold leading-tight line-clamp-2 ${!canAccessTier ? 'text-gray-500' : 'text-gray-900'}`}>
          {reward.name}
        </h3>
        
        {reward.description && (
          <p className={`text-xs line-clamp-2 flex-grow ${!canAccessTier ? 'text-gray-400' : 'text-gray-600'}`}>
            {reward.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className={`flex items-center gap-1 text-xs font-medium ${!canAccessTier ? 'text-gray-400' : 'text-gray-700'}`}>
            <Star className="h-3 w-3 fill-current" />
            {reward.points_required}
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenDetails(reward)}
              className="text-xs px-2 py-1 h-7 border-gray-300 hover:bg-gray-50"
            >
              Details
            </Button>
            
            <Button
              size="sm"
              disabled={state !== 'redeemable'}
              onClick={() => state === 'redeemable' ? onRedeem(reward) : undefined}
              className={`text-xs px-3 py-1 h-7 rounded-lg font-medium flex items-center gap-1 ${buttonConfig.className}`}
              aria-disabled={state !== 'redeemable'}
            >
              {buttonConfig.icon}
              {buttonConfig.label}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}