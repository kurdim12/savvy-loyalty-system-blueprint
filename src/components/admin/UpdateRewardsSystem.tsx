
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { rewardsData, convertRewardToDbFormat } from '@/utils/rewardsData';
import { AlertCircle, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQueryClient } from '@tanstack/react-query';

const UpdateRewardsSystem = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleUpdateRewards = async () => {
    setIsUpdating(true);
    setError(null);
    
    try {
      // Step 1: First fetch all existing rewards to map old rewards to new ones
      const { data: existingRewards, error: fetchError } = await supabase
        .from('rewards')
        .select('id, name');
      
      if (fetchError) throw new Error(`Error fetching existing rewards: ${fetchError.message}`);
      
      // Step 2: Check for existing redemptions
      const { data: redemptions, error: redemptionsError } = await supabase
        .from('redemptions')
        .select('*');
      
      if (redemptionsError) throw new Error(`Error checking existing redemptions: ${redemptionsError.message}`);
      
      if (redemptions && redemptions.length > 0) {
        // Step 3: Update redemptions to use a placeholder or null for reward_id
        const { error: updateError } = await supabase
          .from('redemptions')
          .update({ reward_id: null, status: 'archived' })
          .neq('id', '00000000-0000-0000-0000-000000000000');
        
        if (updateError) throw new Error(`Error updating redemptions: ${updateError.message}`);
        
        toast.info(`${redemptions.length} existing redemption(s) have been archived`);
      }
      
      // Step 4: Now we can safely delete all existing rewards
      const { error: deleteError } = await supabase
        .from('rewards')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (deleteError) throw new Error(`Error deleting existing rewards: ${deleteError.message}`);
      
      toast.success('Successfully removed old rewards');
      
      // Step 5: Insert new rewards from our predefined data
      const newRewards = rewardsData.map(convertRewardToDbFormat);
      
      const { error: insertError } = await supabase
        .from('rewards')
        .insert(newRewards);
      
      if (insertError) throw new Error(`Error inserting new rewards: ${insertError.message}`);
      
      // Invalidate any related queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['admin', 'rewards'] });
      queryClient.invalidateQueries({ queryKey: ['availableRewards'] });
      
      toast.success('Successfully added new rewards');
      setIsComplete(true);
      
    } catch (err) {
      console.error('Error updating rewards:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error('Failed to update rewards');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Rewards System</CardTitle>
        <CardDescription>
          Reset and update the rewards system with new tiered rewards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {isComplete ? (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <Check className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              The rewards system has been successfully updated with the new tiered rewards.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <p className="text-amber-700">
              This action will delete all existing rewards and replace them with new tiered rewards for Bronze, Silver, and Gold members.
              Any existing redemptions will be archived.
            </p>
            <div>
              <h3 className="font-medium mb-2">New Rewards to be added:</h3>
              <ul className="list-disc pl-5 space-y-2">
                {rewardsData.map((reward, index) => (
                  <li key={index} className="text-sm">
                    <span className="font-medium">{reward.name}</span> ({reward.membership_required} tier, {reward.points} points)
                  </li>
                ))}
              </ul>
            </div>
            <Button 
              onClick={handleUpdateRewards} 
              disabled={isUpdating} 
              className="bg-amber-700 hover:bg-amber-800"
            >
              {isUpdating ? 'Updating...' : 'Update Rewards System'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpdateRewardsSystem;
