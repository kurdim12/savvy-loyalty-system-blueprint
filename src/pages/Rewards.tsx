
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Award, Star, Gift } from 'lucide-react';
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

const Rewards = () => {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isRedeemDialogOpen, setIsRedeemDialogOpen] = useState(false);

  // Fetch available rewards
  const { data: rewards, isLoading } = useQuery({
    queryKey: ['rewards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('active', true)
        .order('points_required');
      
      if (error) throw error;
      return data as Reward[];
    }
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
          title: 'Reward Redeemed!',
          message: `You've successfully redeemed ${reward.name} for ${reward.points_required} points.`,
          type: 'reward'
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Reward redeemed successfully! Check your profile for details.');
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
    const meetsRequirement = !reward.membership_required || 
      profile.membership_tier === reward.membership_required ||
      (reward.membership_required === 'bronze') ||
      (reward.membership_required === 'silver' && ['silver', 'gold'].includes(profile.membership_tier)) ||
      (reward.membership_required === 'gold' && profile.membership_tier === 'gold');
    
    return hasEnoughPoints && meetsRequirement && reward.active;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Rewards</h1>
              <p className="text-gray-600 mt-2">Loading available rewards...</p>
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Rewards</h1>
            <p className="text-gray-600 mt-2">Redeem your points for amazing rewards</p>
          </div>

          {/* User Points Display */}
          <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-200 rounded-full">
                    <Award className="h-6 w-6 text-amber-700" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-semibold text-amber-900">Your Points</h3>
                    <p className="text-2xl font-bold text-amber-800">{profile?.current_points || 0}</p>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <Badge variant="secondary" className="capitalize">
                    {profile?.membership_tier || 'Bronze'} Member
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rewards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {rewards?.map((reward) => (
              <Card key={reward.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative bg-gray-100">
                  <RewardImage
                    src={reward.image_url}
                    alt={reward.name}
                    className="absolute inset-0 w-full h-full rounded-t-lg"
                  />
                  {reward.inventory !== null && reward.inventory <= 5 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute top-2 right-2"
                    >
                      Only {reward.inventory} left
                    </Badge>
                  )}
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg leading-tight">{reward.name}</CardTitle>
                    <div className="flex items-center gap-1 text-amber-600 shrink-0">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-bold">{reward.points_required}</span>
                    </div>
                  </div>
                  {reward.description && (
                    <CardDescription className="text-sm line-clamp-2">
                      {reward.description}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {reward.membership_required && (
                      <Badge variant="outline" className="capitalize text-xs">
                        {reward.membership_required}+ Members
                      </Badge>
                    )}
                    
                    <Button
                      onClick={() => handleRedeemClick(reward)}
                      disabled={!canRedeem(reward)}
                      className="w-full bg-amber-700 hover:bg-amber-800 disabled:opacity-50"
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      {canRedeem(reward) ? 'Redeem' : 
                       profile && profile.current_points < reward.points_required ? 'Not Enough Points' : 
                       'Requirements Not Met'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {!rewards || rewards.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No rewards available</h3>
                <p className="text-gray-600">Check back soon for new rewards!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Redeem Confirmation Dialog */}
      <Dialog open={isRedeemDialogOpen} onOpenChange={setIsRedeemDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Redemption</DialogTitle>
            <DialogDescription>
              Are you sure you want to redeem "{selectedReward?.name}" for {selectedReward?.points_required} points?
            </DialogDescription>
          </DialogHeader>
          
          {selectedReward && (
            <div className="space-y-4">
              <div className="aspect-video relative bg-gray-100 rounded-lg overflow-hidden">
                <RewardImage
                  src={selectedReward.image_url}
                  alt={selectedReward.name}
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Your remaining balance will be: {(profile?.current_points || 0) - selectedReward.points_required} points
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
              className="w-full sm:w-auto bg-amber-700 hover:bg-amber-800"
            >
              {redeemReward.isPending ? 'Redeeming...' : 'Confirm Redemption'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Rewards;
