
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Award, Star, Gift, Clock, Trophy } from 'lucide-react';
import { RewardImage } from '@/components/rewards/RewardImage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface Reward {
  id: string;
  name: string;
  description?: string;
  points_required: number;
  membership_required?: string;
  inventory?: number;
  active: boolean;
  image_url?: string;
}

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
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isRedeemDialogOpen, setIsRedeemDialogOpen] = useState(false);

  // Helper function to check if user can access a reward tier
  const canAccessTier = (rewardTier?: string) => {
    if (!rewardTier || !profile) return true;
    
    const userTier = profile.membership_tier;
    const tierHierarchy = { bronze: 1, silver: 2, gold: 3 };
    
    return tierHierarchy[userTier as keyof typeof tierHierarchy] >= 
           tierHierarchy[rewardTier as keyof typeof tierHierarchy];
  };

  // Fetch available rewards filtered by user's membership tier
  const { data: rewards, isLoading } = useQuery({
    queryKey: ['rewards', profile?.membership_tier],
    queryFn: async () => {
      let query = supabase
        .from('rewards')
        .select('*')
        .eq('active', true)
        .order('points_required');

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Filter rewards client-side based on membership tier
      const filteredRewards = (data as Reward[]).filter(reward => 
        canAccessTier(reward.membership_required)
      );
      
      return filteredRewards;
    },
    enabled: !!profile
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
      
      if (error) throw error;
      return data as Redemption[];
    },
    enabled: !!user
  });

  // Redeem reward mutation
  const redeemReward = useMutation({
    mutationFn: async (rewardId: string) => {
      const reward = rewards?.find(r => r.id === rewardId);
      if (!reward || !user) throw new Error('Invalid reward or user');

      // Create redemption record
      const { error: redemptionError } = await supabase
        .from('redemptions')
        .insert({
          user_id: user.id,
          reward_id: rewardId,
          points_spent: reward.points_required,
          status: 'pending'
        });

      if (redemptionError) throw redemptionError;

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

      if (transactionError) throw transactionError;

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
      setSelectedReward(null);
    },
    onError: (error) => {
      toast.error(`Failed to redeem reward: ${error.message}`);
    }
  });

  const handleRedeemClick = (reward: Reward) => {
    setSelectedReward(reward);
    setIsRedeemDialogOpen(true);
  };

  const handleConfirmRedeem = () => {
    if (selectedReward) {
      redeemReward.mutate(selectedReward.id);
    }
  };

  const canRedeem = (reward: Reward) => {
    if (!user || !profile) return false;
    
    const hasEnoughPoints = profile.current_points >= reward.points_required;
    const hasActivePendingRedemption = pendingRedemptions?.some(r => r.reward_id === reward.id);
    
    return hasEnoughPoints && reward.active && !hasActivePendingRedemption && canAccessTier(reward.membership_required);
  };

  const getRedemptionStatus = (reward: Reward) => {
    const pendingRedemption = pendingRedemptions?.find(r => r.reward_id === reward.id);
    if (pendingRedemption) {
      return 'pending';
    }
    return null;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-black">Rewards</h1>
              <p className="text-[#95A5A6] mt-2">Loading available rewards...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-black">Rewards Catalog</h1>
            <p className="text-[#95A5A6] mt-2">Redeem your loyalty points for premium coffee rewards</p>
            <p className="text-sm text-[#95A5A6] mt-1">
              Showing rewards available for your {profile?.membership_tier} tier
            </p>
          </div>

          {/* User Points Display */}
          <Card className="bg-gradient-to-r from-[#95A5A6]/10 to-[#95A5A6]/20 border-[#95A5A6]">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#95A5A6] rounded-full">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-semibold text-black">Your Balance</h3>
                    <p className="text-2xl font-bold text-black">{profile?.current_points || 0} Points</p>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <Badge variant="secondary" className="capitalize bg-[#95A5A6] text-white">
                    {profile?.membership_tier || 'Bronze'} Member
                  </Badge>
                  {pendingRedemptions && pendingRedemptions.length > 0 && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-black border-[#95A5A6]">
                        <Clock className="h-3 w-3 mr-1" />
                        {pendingRedemptions.length} Pending Approval
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tier Info */}
          <Card className="border-[#95A5A6] bg-gradient-to-r from-[#95A5A6]/5 to-[#95A5A6]/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-[#95A5A6]" />
                <div>
                  <h3 className="font-semibold text-black">Your Tier Benefits</h3>
                  <p className="text-sm text-[#95A5A6]">
                    As a {profile?.membership_tier} member, you can access all {profile?.membership_tier} tier rewards and below.
                    {profile?.membership_tier === 'bronze' && ' Upgrade to Silver (200+ points) or Gold (550+ points) for more exclusive rewards!'}
                    {profile?.membership_tier === 'silver' && ' Upgrade to Gold (550+ points) for the most exclusive rewards!'}
                    {profile?.membership_tier === 'gold' && ' You have access to all available rewards!'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Redemptions Alert */}
          {pendingRedemptions && pendingRedemptions.length > 0 && (
            <Card className="border-[#95A5A6] bg-gradient-to-r from-[#95A5A6]/10 to-[#95A5A6]/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[#95A5A6]" />
                  <div>
                    <h3 className="font-semibold text-black">Pending Admin Approval</h3>
                    <p className="text-sm text-[#95A5A6]">
                      You have {pendingRedemptions.length} redemption request(s) waiting for admin approval. We'll notify you once they're processed!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rewards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {rewards?.map((reward) => {
              const redemptionStatus = getRedemptionStatus(reward);
              
              return (
                <Card key={reward.id} className="overflow-hidden hover:shadow-lg transition-shadow border-[#95A5A6] bg-white shadow-md">
                  <div className="aspect-video relative bg-gradient-to-br from-[#95A5A6]/10 to-[#95A5A6]/20">
                    <RewardImage
                      src={reward.image_url}
                      alt={reward.name}
                      className="absolute inset-0 w-full h-full rounded-t-lg object-cover"
                    />
                    {reward.inventory !== null && reward.inventory <= 5 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute top-2 left-2"
                      >
                        Only {reward.inventory} left
                      </Badge>
                    )}
                    {redemptionStatus === 'pending' && (
                      <Badge 
                        variant="outline" 
                        className="absolute top-2 right-2 bg-[#95A5A6]/20 text-black border-[#95A5A6]"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        Pending Approval
                      </Badge>
                    )}
                    {reward.membership_required && (
                      <Badge 
                        variant="secondary" 
                        className="absolute bottom-2 left-2 capitalize bg-[#95A5A6] text-white"
                      >
                        {reward.membership_required} Tier
                      </Badge>
                    )}
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg leading-tight text-black">{reward.name}</CardTitle>
                      <div className="flex items-center gap-1 text-[#95A5A6] shrink-0">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-bold">{reward.points_required}</span>
                      </div>
                    </div>
                    {reward.description && (
                      <CardDescription className="text-sm line-clamp-2 text-[#95A5A6]">
                        {reward.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <Button
                      onClick={() => handleRedeemClick(reward)}
                      disabled={!canRedeem(reward) || redemptionStatus === 'pending'}
                      className="w-full bg-black hover:bg-[#95A5A6] text-white disabled:opacity-50"
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      {redemptionStatus === 'pending' ? 'Awaiting Approval' :
                       canRedeem(reward) ? 'Redeem Now' : 
                       profile && profile.current_points < reward.points_required ? 'Not Enough Points' : 
                       'Requirements Not Met'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {!rewards || rewards.length === 0 && (
            <Card className="border-[#95A5A6]">
              <CardContent className="p-8 text-center">
                <Gift className="h-12 w-12 text-[#95A5A6] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-black mb-2">No rewards available for your tier</h3>
                <p className="text-[#95A5A6]">
                  {profile?.membership_tier === 'bronze' && 'Earn more points to unlock Silver and Gold tier rewards!'}
                  {profile?.membership_tier === 'silver' && 'Earn more points to unlock Gold tier rewards!'}
                  {profile?.membership_tier === 'gold' && 'Check back soon for new rewards!'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Redeem Confirmation Dialog */}
      <Dialog open={isRedeemDialogOpen} onOpenChange={setIsRedeemDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-black">Confirm Redemption Request</DialogTitle>
            <DialogDescription className="text-[#95A5A6]">
              Submit a redemption request for "{selectedReward?.name}" for {selectedReward?.points_required} points?
            </DialogDescription>
          </DialogHeader>
          
          {selectedReward && (
            <div className="space-y-4">
              <div className="aspect-video relative bg-[#95A5A6]/10 rounded-lg overflow-hidden">
                <RewardImage
                  src={selectedReward.image_url}
                  alt={selectedReward.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              
              <div className="bg-[#95A5A6]/10 p-3 rounded-lg border border-[#95A5A6]">
                <div className="flex items-center gap-2 text-black">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Requires Admin Approval</span>
                </div>
                <p className="text-xs text-[#95A5A6] mt-1">
                  Your redemption request will be pending until an admin reviews and approves it. You'll receive a notification once it's processed!
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-[#95A5A6]">
                  Your remaining balance will be: <strong className="text-black">{(profile?.current_points || 0) - selectedReward.points_required} points</strong>
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsRedeemDialogOpen(false)}
              className="w-full sm:w-auto border-[#95A5A6] text-black hover:bg-[#95A5A6]/20"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmRedeem}
              disabled={redeemReward.isPending}
              className="w-full sm:w-auto bg-black hover:bg-[#95A5A6] text-white"
            >
              {redeemReward.isPending ? 'Submitting Request...' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Rewards;
