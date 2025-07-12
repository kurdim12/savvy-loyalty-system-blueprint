import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RewardsHeader } from '@/components/rewards/RewardsHeader';
import { TierFilters } from '@/components/rewards/TierFilters';
import { RewardsGrid } from '@/components/rewards/RewardsGrid';
import { RewardDetailSheet } from '@/components/rewards/RewardDetailSheet';
import { RewardData } from '@/components/rewards/RewardCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Redemption {
  id: string;
  reward_id: string;
  status: string;
  created_at: string;
  rewards: {
    name: string;
  };
}

const Rewards = () => {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  
  // State management
  const [selectedTier, setSelectedTier] = useState<'all' | 'bronze' | 'silver' | 'gold'>('all');
  const [selectedReward, setSelectedReward] = useState<RewardData | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [isRedeemDialogOpen, setIsRedeemDialogOpen] = useState(false);
  const [rewardToRedeem, setRewardToRedeem] = useState<RewardData | null>(null);

  // Helper function to check if user can access a reward tier
  const canAccessTier = (rewardTier?: string) => {
    if (!rewardTier || !profile) return true;
    
    const userTier = profile.membership_tier;
    const tierHierarchy = { bronze: 1, silver: 2, gold: 3 };
    
    return tierHierarchy[userTier as keyof typeof tierHierarchy] >= 
           tierHierarchy[rewardTier as keyof typeof tierHierarchy];
  };

  // Fetch ALL available rewards
  const { data: rewards, isLoading, error } = useQuery({
    queryKey: ['rewards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('active', true)
        .order('points_required');
      
      if (error) {
        console.error('Error fetching rewards:', error);
        throw error;
      }
      
      return data as RewardData[];
    },
    enabled: !!profile,
    retry: 3,
    retryDelay: 1000
  });

  // Fetch user's pending redemptions
  const { data: pendingRedemptions } = useQuery({
    queryKey: ['user-redemptions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('redemptions')
        .select(`
          id,
          reward_id,
          status,
          created_at,
          rewards (name)
        `)
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching redemptions:', error);
        throw error;
      }
      return data as Redemption[];
    },
    enabled: !!user,
    retry: 2
  });

  // Filter rewards based on selected tier
  const filteredRewards = rewards?.filter(reward => {
    if (selectedTier === 'all') return true;
    return (reward.membership_required || 'bronze') === selectedTier;
  }) || [];

  // Calculate reward counts for each tier
  const rewardCounts = {
    all: rewards?.length || 0,
    bronze: rewards?.filter(r => (r.membership_required || 'bronze') === 'bronze').length || 0,
    silver: rewards?.filter(r => r.membership_required === 'silver').length || 0,
    gold: rewards?.filter(r => r.membership_required === 'gold').length || 0,
  };

  // Get reward state
  const getRewardState = (reward: RewardData): 'redeemable' | 'pending' | 'locked' | 'insufficient' => {
    if (!user || !profile) return 'locked';
    
    const hasActivePendingRedemption = pendingRedemptions?.some(r => r.reward_id === reward.id);
    if (hasActivePendingRedemption) return 'pending';
    
    const hasTierAccess = canAccessTier(reward.membership_required);
    if (!hasTierAccess) return 'locked';
    
    const hasEnoughPoints = profile.current_points >= reward.points_required;
    if (!hasEnoughPoints) return 'insufficient';
    
    return reward.active ? 'redeemable' : 'locked';
  };

  // Redeem reward mutation
  const redeemReward = useMutation({
    mutationFn: async (rewardId: string) => {
      const reward = rewards?.find(r => r.id === rewardId);
      if (!reward || !user) {
        throw new Error('Invalid reward or user');
      }

      if (!profile || profile.current_points < reward.points_required) {
        throw new Error('Insufficient points');
      }

      if (!canAccessTier(reward.membership_required)) {
        throw new Error('Tier requirement not met');
      }

      // Create redemption record
      const { error: redemptionError } = await supabase
        .from('redemptions')
        .insert({
          user_id: user.id,
          reward_id: rewardId,
          points_spent: reward.points_required,
          status: 'pending'
        });

      if (redemptionError) {
        console.error('Redemption error:', redemptionError);
        throw redemptionError;
      }

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          reward_id: rewardId,
          points: reward.points_required,
          transaction_type: 'redeem',
          notes: `Redeemed: ${reward.name}`
        });

      if (transactionError) {
        console.error('Transaction error:', transactionError);
        throw transactionError;
      }

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: 'Reward Redemption Pending!',
          message: `Your redemption of ${reward.name} is pending admin approval. You'll be notified once it's processed.`,
          type: 'reward'
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['user-redemptions'] });
      toast.success('🎉 Reward redemption submitted! Your request is pending admin approval - we\'ll notify you once it\'s processed.');
      setIsRedeemDialogOpen(false);
      setIsDetailSheetOpen(false);
      setRewardToRedeem(null);
      setSelectedReward(null);
    },
    onError: (error: any) => {
      console.error('Redemption failed:', error);
      toast.error(`Failed to redeem reward: ${error.message}`);
    }
  });

  // Event handlers
  const handleOpenDetails = (reward: RewardData) => {
    setSelectedReward(reward);
    setIsDetailSheetOpen(true);
  };

  const handleRedeem = (reward: RewardData) => {
    setRewardToRedeem(reward);
    setIsRedeemDialogOpen(true);
  };

  const handleConfirmRedeem = () => {
    if (rewardToRedeem) {
      redeemReward.mutate(rewardToRedeem.id);
    }
  };

  const handleSheetRedeem = (reward: RewardData) => {
    setIsDetailSheetOpen(false);
    setRewardToRedeem(reward);
    setIsRedeemDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Rewards</h1>
              <p className="text-gray-600 mt-2">Loading available rewards...</p>
            </div>
            
            {/* Loading skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                  <div className="w-full aspect-square bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-8 bg-gray-200 rounded w-full mt-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Rewards</h1>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto mt-8">
                <p className="text-red-600 text-center">Failed to load rewards. Please try again later.</p>
                <Button 
                  variant="outline" 
                  className="mt-4 w-full"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-8">
          {/* Header with Progress */}
          <RewardsHeader
            currentPoints={profile?.current_points || 0}
            membershipTier={profile?.membership_tier || 'bronze'}
            pendingRedemptions={pendingRedemptions?.length || 0}
          />

          {/* Tier Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Available Rewards</h2>
              <p className="text-gray-600 text-sm">
                Choose from our curated selection of premium coffee rewards
              </p>
            </div>
            
            <TierFilters
              selectedTier={selectedTier}
              onTierChange={setSelectedTier}
              rewardCounts={rewardCounts}
            />
          </div>

          {/* Rewards Grid */}
          <RewardsGrid
            rewards={filteredRewards}
            onOpenDetails={handleOpenDetails}
            onRedeem={handleRedeem}
            getRewardState={getRewardState}
            canAccessTier={canAccessTier}
          />
        </div>
      </div>

      {/* Reward Detail Sheet */}
      <RewardDetailSheet
        reward={selectedReward}
        isOpen={isDetailSheetOpen}
        onClose={() => setIsDetailSheetOpen(false)}
        onRedeem={handleSheetRedeem}
        state={selectedReward ? getRewardState(selectedReward) : 'locked'}
        userPoints={profile?.current_points || 0}
        canAccessTier={selectedReward ? canAccessTier(selectedReward.membership_required) : false}
      />

      {/* Redeem Confirmation Dialog */}
      <Dialog open={isRedeemDialogOpen} onOpenChange={setIsRedeemDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Confirm Redemption</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to redeem "{rewardToRedeem?.name}" for {rewardToRedeem?.points_required} points?
            </DialogDescription>
          </DialogHeader>
          
          {rewardToRedeem && (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Your current balance</span>
                  <span className="font-medium text-gray-900">{profile?.current_points || 0} points</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600">After redemption</span>
                  <span className="font-medium text-green-600">
                    {(profile?.current_points || 0) - rewardToRedeem.points_required} points
                  </span>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> Your redemption request will be pending admin approval. 
                  You'll receive a notification once it's processed.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsRedeemDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmRedeem}
              disabled={redeemReward.isPending}
              className="w-full sm:w-auto bg-black text-white hover:bg-black/80"
            >
              {redeemReward.isPending ? 'Processing...' : 'Confirm Redemption'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Rewards;