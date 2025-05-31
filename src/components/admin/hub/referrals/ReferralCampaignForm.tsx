
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface FormData {
  name: string;
  description: string;
  invite_count_required: number;
  bonus_points: number;
  starts_at: string;
  ends_at: string;
}

const ReferralCampaignForm = () => {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    invite_count_required: 1,
    bonus_points: 0,
    starts_at: '',
    ends_at: ''
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (data: FormData) => {
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

  return (
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
  );
};

export default ReferralCampaignForm;
