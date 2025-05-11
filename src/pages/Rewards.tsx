
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertCircle, Gift, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { wouldCauseRankDowngrade } from '@/integrations/supabase/functions';

const Rewards = () => {
  const { profile } = useAuth();
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: rewards, refetch: refetchRewards } = useQuery({
    queryKey: ['rewards'],
    queryFn: async () => {
      // Fetch all rewards - filtering will be done on the frontend
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('active', true)
        .order('points_required', { ascending: true });

      if (error) throw error;
      return data;
    }
  });
  
  // Filter rewards by membership tier
  const filteredRewards = rewards?.filter(reward => {
    // If reward has no tier requirement, show to everyone
    if (!reward.membership_required) return true;
    
    // If the reward has a tier requirement, check if user meets it
    if (profile?.membership_tier === 'gold') return true; // Gold can see all rewards
    if (profile?.membership_tier === 'silver' && reward.membership_required !== 'gold') return true;
    if (profile?.membership_tier === 'bronze' && reward.membership_required === 'bronze') return true;
    
    return false;
  });
  
  const handleRedeemReward = async () => {
    if (!profile || !selectedReward) return;
    
    setIsRedeeming(true);
    
    try {
      // 1. Check if user has enough points
      if (profile.current_points < selectedReward.points_required) {
        toast.error('Not enough points to redeem this reward');
        return;
      }
      
      // 2. Create a transaction for the redemption
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: profile.id,
          transaction_type: 'redeem',
          points: selectedReward.points_required,
          reward_id: selectedReward.id,
          notes: `Redeemed: ${selectedReward.name}`
        });
        
      if (transactionError) throw transactionError;
      
      // 3. Create a redemption record
      const { error: redemptionError } = await supabase
        .from('redemptions')
        .insert({
          user_id: profile.id,
          reward_id: selectedReward.id,
          points_spent: selectedReward.points_required,
        });
        
      if (redemptionError) throw redemptionError;
      
      // 4. Update user's point balance
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          current_points: profile.current_points - selectedReward.points_required 
        })
        .eq('id', profile.id);
        
      if (updateError) throw updateError;
      
      toast.success('Reward redeemed successfully!');
      setDialogOpen(false);
      
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast.error('An error occurred while redeeming the reward');
    } finally {
      setIsRedeeming(false);
      // Refresh rewards and query cache
      refetchRewards();
    }
  };
  
  const handleOpenRedeemDialog = (reward: any) => {
    setSelectedReward(reward);
    setDialogOpen(true);
  };

  // Calculate if a reward would cause rank downgrade
  const getRankDowngradeWarning = (reward: any) => {
    if (!profile) return null;
    
    const downgradeInfo = wouldCauseRankDowngrade(
      profile.current_points, 
      reward.points_required
    );
    
    if (downgradeInfo.wouldDowngrade) {
      return {
        message: `Redeeming this reward will downgrade your rank from ${downgradeInfo.currentTier} to ${downgradeInfo.newTier}`,
        fromTier: downgradeInfo.currentTier,
        toTier: downgradeInfo.newTier
      };
    }
    
    return null;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-amber-900">Available Rewards</h1>
          <p className="text-amber-700">
            You have <span className="font-bold">{profile?.current_points || 0}</span> points available 
            to redeem for rewards.
          </p>
          <p className="text-amber-600 italic text-sm mt-2">
            Points used for rewards will be deducted from your total. This may affect your rank status.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRewards && filteredRewards.map((reward) => {
            const downgradeWarning = getRankDowngradeWarning(reward);
            return (
              <Card key={reward.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{reward.name}</CardTitle>
                    <Badge className="bg-amber-100 text-amber-900 border-amber-300">
                      {reward.points_required} pts
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {reward.membership_required && (
                      <Badge variant="outline" className="capitalize">
                        {reward.membership_required} tier
                      </Badge>
                    )}
                    {reward.category !== 'any' && (
                      <Badge variant="secondary" className="capitalize">
                        {reward.category}
                      </Badge>
                    )}
                    {reward.cupping_score_min && (
                      <Badge variant="secondary" className="bg-amber-50 text-amber-800">
                        {reward.cupping_score_min}+ cupping score
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{reward.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {reward.inventory !== null && (
                    <p className="text-sm text-amber-700">{reward.inventory > 0 ? `${reward.inventory} available` : 'Out of stock'}</p>
                  )}
                  
                  {downgradeWarning && (
                    <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <p className="text-xs text-amber-800">
                        Redeeming will downgrade you to {downgradeWarning.toTier}
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="bg-amber-50">
                  <Button 
                    className="w-full bg-amber-700 hover:bg-amber-800" 
                    onClick={() => handleOpenRedeemDialog(reward)}
                    disabled={(profile?.current_points || 0) < reward.points_required || (reward.inventory !== null && reward.inventory <= 0)}
                  >
                    {(profile?.current_points || 0) < reward.points_required 
                      ? `Need ${reward.points_required - (profile?.current_points || 0)} more points` 
                      : reward.inventory !== null && reward.inventory <= 0 
                        ? 'Out of Stock'
                        : 'Redeem Reward'}
                  </Button>
                </CardFooter>
              </Card>
            )})}
        </div>

        {(!filteredRewards || filteredRewards.length === 0) && (
          <div className="py-12 text-center">
            <Gift className="mx-auto h-12 w-12 text-amber-300" />
            <h3 className="mt-4 text-lg font-semibold">No rewards available</h3>
            <p className="mt-2 text-amber-700">Check back later for new rewards or upgrade your membership tier.</p>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redeem Reward</DialogTitle>
            <DialogDescription>
              Are you sure you want to redeem this reward?
            </DialogDescription>
          </DialogHeader>

          {selectedReward && (
            <div className="py-4">
              <h4 className="font-bold text-lg mb-2">{selectedReward.name}</h4>
              <p className="text-amber-700 mb-4">{selectedReward.description}</p>
              
              <div className="flex items-center gap-2 text-amber-900 bg-amber-100 p-3 rounded-md">
                <AlertCircle className="h-5 w-5" />
                <span>This will deduct <strong>{selectedReward.points_required} points</strong> from your balance.</span>
              </div>
              
              {getRankDowngradeWarning(selectedReward) && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-300 rounded-md">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <span className="font-semibold text-amber-800">Rank Downgrade Warning</span>
                  </div>
                  <p className="mt-1 text-sm text-amber-700">
                    Redeeming this reward will reduce your points and downgrade your membership from 
                    <span className="font-semibold capitalize"> {getRankDowngradeWarning(selectedReward)?.fromTier} </span> 
                    to 
                    <span className="font-semibold capitalize"> {getRankDowngradeWarning(selectedReward)?.toTier}</span>.
                    This will affect your discount rate.
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isRedeeming}>
              Cancel
            </Button>
            <Button 
              onClick={handleRedeemReward} 
              className="bg-amber-700 hover:bg-amber-800"
              disabled={isRedeeming || (profile?.current_points || 0) < (selectedReward?.points_required || 0)}
            >
              {isRedeeming ? 'Processing...' : 'Confirm Redemption'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Rewards;
