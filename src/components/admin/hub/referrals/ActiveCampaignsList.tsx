
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Campaign {
  id: string;
  name: string;
  description: string;
  invite_count_required: number;
  bonus_points: number;
  active: boolean;
}

interface ActiveCampaignsListProps {
  campaigns: Campaign[];
}

const ActiveCampaignsList = ({ campaigns }: ActiveCampaignsListProps) => {
  const queryClient = useQueryClient();

  const toggleCampaignMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from('referral_campaigns')
        .update({ active })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referral-campaigns'] });
      toast.success('Campaign updated successfully!');
    }
  });

  const activeCampaigns = campaigns.filter(c => c.active);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Campaigns</CardTitle>
        <CardDescription>Current referral campaigns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeCampaigns.map((campaign) => (
            <div key={campaign.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{campaign.name}</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleCampaignMutation.mutate({ 
                    id: campaign.id, 
                    active: false 
                  })}
                >
                  Deactivate
                </Button>
              </div>
              <p className="text-sm text-gray-500 mb-2">{campaign.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <span><Users className="inline h-3 w-3 mr-1" />{campaign.invite_count_required} invites</span>
                <span><Trophy className="inline h-3 w-3 mr-1" />{campaign.bonus_points} points</span>
              </div>
            </div>
          ))}
          {activeCampaigns.length === 0 && (
            <p className="text-gray-500 text-center py-4">No active campaigns</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveCampaignsList;
