import { RewardCard, RewardData } from './RewardCard';

interface RewardsGridProps {
  rewards: RewardData[];
  onOpenDetails: (reward: RewardData) => void;
  onRedeem: (reward: RewardData) => void;
  getRewardState: (reward: RewardData) => 'redeemable' | 'pending' | 'locked' | 'insufficient';
  canAccessTier: (rewardTier?: string) => boolean;
}

export function RewardsGrid({ 
  rewards, 
  onOpenDetails, 
  onRedeem, 
  getRewardState, 
  canAccessTier 
}: RewardsGridProps) {
  if (rewards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No rewards found</h3>
        <p className="text-gray-500">Try adjusting your filter to see available rewards.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
      {rewards.map((reward) => (
        <RewardCard
          key={reward.id}
          reward={reward}
          state={getRewardState(reward)}
          onOpenDetails={onOpenDetails}
          onRedeem={onRedeem}
          canAccessTier={canAccessTier(reward.membership_required)}
        />
      ))}
    </div>
  );
}