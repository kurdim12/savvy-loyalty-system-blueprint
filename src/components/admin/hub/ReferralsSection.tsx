
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Copy, Trophy, Users, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Define the type for referral stats
interface ReferralStats {
  referrer_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  total_referrals: number;
  completed_referrals: number;
  total_bonus_points: number;
}

const ReferralsSection = () => {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    invite_count_required: 1,
    bonus_points: 0,
    starts_at: '',
    ends_at: ''
  });

  const { data: campaigns = [], isLoading: campaignsLoading } = useQuery({
    queryKey: ['referral-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('referral_campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: leaderboard = [], isLoading: leaderboardLoading } = useQuery({
    queryKey: ['referral-leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_referral_stats');
      
      if (error) throw error;
      return (data || []) as ReferralStats[];
    }
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('referral_campaigns')
        .insert({
          name: data.name,
          description: data.description,
          invite_count_required: data.invite_count_required,
          bonus_points: data.bonus_points,
          starts_at: data.starts_at,
          ends_at: data.ends_at,
          active: true
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referral-campaigns'] });
      toast.success('Referral campaign created successfully!');
      setIsCreateOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error('Failed to create referral campaign');
    }
  });

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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      invite_count_required: 1,
      bonus_points: 0,
      starts_at: '',
      ends_at: ''
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a campaign name');
      return;
    }
    createCampaignMutation.mutate(formData);
  };

  const generateReferralLink = (referralCode: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/signup?ref=${referralCode}`;
  };

  const copyReferralLink = (referralCode: string) => {
    const link = generateReferralLink(referralCode);
    navigator.clipboard.writeText(link);
    toast.success('Referral link copied to clipboard!');
  };

  if (campaignsLoading || leaderboardLoading) {
    return <div className="text-center py-8">Loading referral data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Referral Campaigns</h2>
          <p className="text-gray-500">Manage referral programs and track performance</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Referral Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Campaign name*"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Textarea
                placeholder="Campaign description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Invites required"
                  min="1"
                  value={formData.invite_count_required}
                  onChange={(e) => setFormData({ ...formData, invite_count_required: parseInt(e.target.value) || 1 })}
                />
                <Input
                  type="number"
                  placeholder="Bonus points"
                  min="0"
                  value={formData.bonus_points}
                  onChange={(e) => setFormData({ ...formData, bonus_points: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="datetime-local"
                  placeholder="Start date"
                  value={formData.starts_at}
                  onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                />
                <Input
                  type="datetime-local"
                  placeholder="End date"
                  value={formData.ends_at}
                  onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                />
              </div>
              <Button 
                onClick={handleSubmit} 
                disabled={createCampaignMutation.isPending}
                className="w-full"
              >
                {createCampaignMutation.isPending ? 'Creating...' : 'Create Campaign'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Active Campaigns</CardTitle>
            <CardDescription>Current referral campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.filter(c => c.active).map((campaign) => (
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
              {campaigns.filter(c => c.active).length === 0 && (
                <p className="text-gray-500 text-center py-4">No active campaigns</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Referral Leaderboard</CardTitle>
            <CardDescription>Top referrers by points earned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((user, index) => (
                <div key={user.referrer_id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">
                        {user.first_name} {user.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.completed_referrals}/{user.total_referrals} completed
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-amber-600">
                      {user.total_bonus_points} pts
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyReferralLink('USER_CODE')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {leaderboard.length === 0 && (
                <p className="text-gray-500 text-center py-4">No referral data yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

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
    </div>
  );
};

export default ReferralsSection;
