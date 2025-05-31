
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface ReferralStats {
  referrer_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  total_referrals: number;
  completed_referrals: number;
  total_bonus_points: number;
}

interface ReferralLeaderboardProps {
  leaderboard: ReferralStats[];
}

const ReferralLeaderboard = ({ leaderboard }: ReferralLeaderboardProps) => {
  const generateReferralLink = (referralCode: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/signup?ref=${referralCode}`;
  };

  const copyReferralLink = (referralCode: string) => {
    const link = generateReferralLink(referralCode);
    navigator.clipboard.writeText(link);
    toast.success('Referral link copied to clipboard!');
  };

  return (
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
  );
};

export default ReferralLeaderboard;
