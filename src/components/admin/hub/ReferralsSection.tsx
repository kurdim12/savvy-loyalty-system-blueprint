
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ReferralCampaignForm from './referrals/ReferralCampaignForm';
import ActiveCampaignsList from './referrals/ActiveCampaignsList';
import ReferralLeaderboard from './referrals/ReferralLeaderboard';
import CampaignsTable from './referrals/CampaignsTable';

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
        <ReferralCampaignForm />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ActiveCampaignsList campaigns={campaigns} />
        <ReferralLeaderboard leaderboard={leaderboard} />
      </div>

      <CampaignsTable campaigns={campaigns} />
    </div>
  );
};

export default ReferralsSection;
