
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Campaign {
  id: string;
  name: string;
  description: string;
  invite_count_required: number;
  bonus_points: number;
  starts_at: string;
  ends_at: string;
  active: boolean;
}

interface CampaignsTableProps {
  campaigns: Campaign[];
}

const CampaignsTable = ({ campaigns }: CampaignsTableProps) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Campaigns</CardTitle>
        <CardDescription>Complete campaign history</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Requirements</TableHead>
              <TableHead>Bonus Points</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{campaign.name}</div>
                    <div className="text-sm text-gray-500">{campaign.description}</div>
                  </div>
                </TableCell>
                <TableCell>{campaign.invite_count_required} invites</TableCell>
                <TableCell>{campaign.bonus_points} points</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {new Date(campaign.starts_at).toLocaleDateString()} - 
                    {campaign.ends_at ? new Date(campaign.ends_at).toLocaleDateString() : 'Ongoing'}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={campaign.active ? "default" : "secondary"}>
                    {campaign.active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleCampaignMutation.mutate({ 
                      id: campaign.id, 
                      active: !campaign.active 
                    })}
                  >
                    {campaign.active ? 'Deactivate' : 'Activate'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CampaignsTable;
