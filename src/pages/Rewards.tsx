
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CoffeeIcon, Award, Gift, Trophy, Star, AlertCircle } from 'lucide-react';
import { getDiscountRate } from '@/integrations/supabase/functions';
import { useState } from 'react';
import { toast } from 'sonner';

const Rewards = () => {
  const { profile } = useAuth();
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [redeemError, setRedeemError] = useState<string | null>(null);
  
  // Get available rewards from Supabase
  const { data: availableRewards } = useQuery({
    queryKey: ['availableRewards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .order('points_required', { ascending: true });

      if (error) throw error;
      return data || [];
    }
  });
  
  // Get user's past redemptions
  const { data: pastRedemptions, refetch: refetchRedemptions } = useQuery({
    queryKey: ['pastRedemptions', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      const { data, error } = await supabase
        .from('redemptions')
        .select('*, reward:rewards(*)')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.id
  });
  
  // Handle reward redemption
  const handleRedeemReward = async (rewardId: string, pointsCost: number) => {
    if (!profile?.id) {
      toast.error('You must be logged in to redeem rewards');
      return;
    }
    
    if ((profile?.current_points || 0) < pointsCost) {
      toast.error('Not enough points to redeem this reward');
      return;
    }
    
    setRedeeming(rewardId);
    setRedeemError(null);
    
    try {
      // Create redemption record - now with pointsCost included as points_spent
      const { data: reward, error: rewardError } = await supabase
        .from('rewards')
        .select('id, name')
        .eq('id', rewardId)
        .single();
        
      if (rewardError) throw rewardError;
        
      const { error: redemptionError } = await supabase
        .from('redemptions')
        .insert({
          user_id: profile.id,
          reward_id: rewardId,
          status: 'pending',
          points_spent: pointsCost
        });
        
      if (redemptionError) throw redemptionError;
      
      // Deduct points from user's account
      const { error: pointsError } = await supabase.rpc(
        'decrement_points',
        { user_id: profile.id, point_amount: pointsCost }
      );
      
      if (pointsError) throw pointsError;
      
      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: profile.id,
          points: pointsCost,
          transaction_type: 'redeem',
          notes: `Redeemed reward: ${reward.name}`
        });
        
      if (transactionError) throw transactionError;
      
      toast.success('Reward redeemed successfully!');
      refetchRedemptions();
      
    } catch (error) {
      console.error('Error redeeming reward:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setRedeemError(errorMessage);
      toast.error('Failed to redeem reward. Please try again.');
    } finally {
      setRedeeming(null);
    }
  };
  
  // Filter rewards based on user's membership tier
  const filteredRewards = availableRewards?.filter(reward => {
    // For each tier, show only rewards available for that tier or lower tiers
    const tierLevels = { bronze: 1, silver: 2, gold: 3 };
    const userTierLevel = tierLevels[profile?.membership_tier || 'bronze'];
    const rewardTierLevel = tierLevels[reward.membership_required || 'bronze'];
    
    // Users can only see rewards for their tier or lower
    return rewardTierLevel <= userTierLevel;
  });
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  const calculateNextTier = () => {
    const currentPoints = profile?.current_points || 0;
    const currentTier = profile?.membership_tier || 'bronze';
    
    if (currentTier === 'bronze') {
      const pointsToSilver = 200 - currentPoints;
      const progress = (currentPoints / 200) * 100;
      return {
        nextTier: 'silver',
        pointsNeeded: Math.max(0, pointsToSilver),
        progress: Math.min(progress, 100)
      };
    } else if (currentTier === 'silver') {
      const pointsToGold = 550 - currentPoints;
      const progress = ((currentPoints - 200) / (550 - 200)) * 100;
      return {
        nextTier: 'gold',
        pointsNeeded: Math.max(0, pointsToGold),
        progress: Math.min(progress, 100)
      };
    } else {
      // Already gold
      return {
        nextTier: 'gold',
        pointsNeeded: 0,
        progress: 100
      };
    }
  };
  
  const { nextTier, pointsNeeded, progress } = calculateNextTier();
  
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF6F0]">
      <Header />
      <main className="flex-1 p-4 md:p-6 container mx-auto">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#8B4513]">My Rewards</h1>
              <p className="text-[#6F4E37]">Redeem your points for exclusive rewards!</p>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <Badge className="bg-[#8B4513] text-white px-3 py-1.5">
                {profile?.current_points || 0} Points Available
              </Badge>
              <span className="text-sm text-[#6F4E37]">
                Current tier: <span className="font-medium capitalize">{profile?.membership_tier || 'bronze'}</span>
              </span>
            </div>
          </div>
          
          {/* Next Tier Progress */}
          {pointsNeeded > 0 && (
            <Card className="border-[#8B4513]/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-[#8B4513]">
                  <Trophy className="h-5 w-5 text-[#8B4513]" />
                  Next Tier Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium capitalize text-[#6F4E37]">
                      {profile?.membership_tier || 'bronze'}
                    </span>
                    <span className="text-sm font-medium capitalize text-[#8B4513]">
                      {nextTier}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-[#6F4E37]">
                    {pointsNeeded} more points needed to reach {nextTier} tier!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Available Rewards */}
          <div>
            <h2 className="text-xl font-semibold text-[#8B4513] mb-4">Available Rewards</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRewards?.map((reward: any) => (
                <Card key={reward.id} className="border-[#8B4513]/20">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-[#8B4513]">{reward.name}</CardTitle>
                      <Badge className="bg-[#FFF8DC] text-[#8B4513] border-[#8B4513]/30">
                        {reward.points_required} pts
                      </Badge>
                    </div>
                    <CardDescription className="text-[#6F4E37]">{reward.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center py-4">
                      <Gift className="h-12 w-12 text-[#8B4513]" />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col">
                    <Button 
                      className="w-full bg-[#8B4513] hover:bg-[#6F4E37]"
                      disabled={(profile?.current_points || 0) < reward.points_required || redeeming === reward.id}
                      onClick={() => handleRedeemReward(reward.id, reward.points_required)}
                    >
                      {redeeming === reward.id ? (
                        "Processing..."
                      ) : (profile?.current_points || 0) < reward.points_required ? (
                        `Need ${reward.points_required - (profile?.current_points || 0)} more points`
                      ) : (
                        "Redeem Reward"
                      )}
                    </Button>
                    
                    {redeemError && redeeming === reward.id && (
                      <div className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" /> {redeemError}
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
              
              {(!filteredRewards || filteredRewards.length === 0) && (
                <Card className="border-[#8B4513]/20 col-span-full text-center py-8">
                  <CardContent>
                    <Star className="h-12 w-12 mx-auto text-[#8B4513] opacity-50 mb-2" />
                    <h3 className="text-lg font-medium text-[#8B4513]">No rewards available</h3>
                    <p className="text-sm text-[#6F4E37]">Check back soon for new rewards!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          {/* Redemption History */}
          <div>
            <h2 className="text-xl font-semibold text-[#8B4513] mb-4">Redemption History</h2>
            <Card className="border-[#8B4513]/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-[#8B4513]">
                  <CoffeeIcon className="h-5 w-5 text-[#8B4513]" />
                  Past Redemptions
                </CardTitle>
                <CardDescription className="text-[#6F4E37]">Your previous reward redemptions</CardDescription>
              </CardHeader>
              <CardContent>
                {pastRedemptions && pastRedemptions.length > 0 ? (
                  <div className="space-y-3">
                    {pastRedemptions.map((redemption: any) => (
                      <div 
                        key={redemption.id} 
                        className="flex justify-between items-center border-b border-[#8B4513]/10 pb-3 last:border-0"
                      >
                        <div>
                          <div className="font-medium text-[#8B4513]">{redemption.reward?.name || "Reward no longer available"}</div>
                          <div className="text-sm text-[#6F4E37]">
                            {formatDate(redemption.created_at)} • {redemption.status} • {redemption.points_spent} points
                          </div>
                        </div>
                        <Badge 
                          className={
                            redemption.status === 'redeemed' 
                              ? 'bg-green-100 text-green-800 border-green-300' 
                              : redemption.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                              : 'bg-red-100 text-red-800 border-red-300'
                          }
                        >
                          {redemption.status.charAt(0).toUpperCase() + redemption.status.slice(1)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-[#6F4E37]">
                    <Award className="h-8 w-8 mx-auto text-[#6F4E37] opacity-50 mb-2" />
                    <p>You haven't redeemed any rewards yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Membership Tier Benefits */}
          <div>
            <h2 className="text-xl font-semibold text-[#8B4513] mb-4">Membership Tier Benefits</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className={`border-[#8B4513]/20 ${profile?.membership_tier === 'bronze' ? 'ring-2 ring-[#CD7F32]' : ''}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="text-[#CD7F32]">Bronze</span>
                    {profile?.membership_tier === 'bronze' && (
                      <Badge className="bg-[#CD7F32] text-white">Current</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-[#6F4E37]">0-199 points</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#CD7F32]" />
                      <span>{getDiscountRate('bronze')}% off every purchase</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#CD7F32]" />
                      <span>Birthday reward (free small coffee)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#CD7F32]" />
                      <span>Early access to seasonal drinks</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className={`border-[#8B4513]/20 ${profile?.membership_tier === 'silver' ? 'ring-2 ring-[#C0C0C0]' : ''}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="text-[#808080]">Silver</span>
                    {profile?.membership_tier === 'silver' && (
                      <Badge className="bg-[#C0C0C0] text-white">Current</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-[#6F4E37]">200-549 points</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#C0C0C0]" />
                      <span>{getDiscountRate('silver')}% off every purchase</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#C0C0C0]" />
                      <span>Birthday reward (free medium coffee)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#C0C0C0]" />
                      <span>Early access to seasonal drinks</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#C0C0C0]" />
                      <span>Free size upgrade once a month</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#C0C0C0]" />
                      <span>Exclusive silver member events</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className={`border-[#8B4513]/20 ${profile?.membership_tier === 'gold' ? 'ring-2 ring-[#FFD700]' : ''}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="text-[#B8860B]">Gold</span>
                    {profile?.membership_tier === 'gold' && (
                      <Badge className="bg-[#FFD700] text-[#8B4513]">Current</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-[#6F4E37]">550+ points</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#FFD700]" />
                      <span>{getDiscountRate('gold')}% off every purchase</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#FFD700]" />
                      <span>Birthday reward (free any size drink + pastry)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#FFD700]" />
                      <span>Early access to seasonal drinks</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#FFD700]" />
                      <span>Free size upgrade on every visit</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#FFD700]" />
                      <span>Exclusive gold member events</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#FFD700]" />
                      <span>Free drink every 10th visit</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#FFD700]" />
                      <span>Priority coffee tasting invitations</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <footer className="py-4 px-6 text-center text-sm text-[#6F4E37] border-t border-[#8B4513]/10">
        &copy; {new Date().getFullYear()} Raw Smith Coffee Loyalty Program
      </footer>
    </div>
  );
};

export default Rewards;
