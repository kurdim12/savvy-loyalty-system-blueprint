
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Camera, Users, Target, TrendingUp, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const HubOverview = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['hub-overview'],
    queryFn: async () => {
      const [challenges, contests, referrals, goals] = await Promise.all([
        supabase.from('challenges').select('id, active').eq('active', true),
        supabase.from('photo_contests').select('id, active').eq('active', true),
        supabase.from('referrals').select('id, completed'),
        supabase.from('community_goals').select('id, active').eq('active', true)
      ]);

      return {
        activeChallenges: challenges.data?.length || 0,
        activeContests: contests.data?.length || 0,
        totalReferrals: referrals.data?.length || 0,
        completedReferrals: referrals.data?.filter(r => r.completed).length || 0,
        activeGoals: goals.data?.length || 0
      };
    }
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading overview...</div>;
  }

  const overviewCards = [
    {
      title: 'Active Challenges',
      value: stats?.activeChallenges || 0,
      icon: Trophy,
      description: 'Currently running challenges',
      color: 'text-amber-600'
    },
    {
      title: 'Photo Contests',
      value: stats?.activeContests || 0,
      icon: Camera,
      description: 'Active photo contests',
      color: 'text-blue-600'
    },
    {
      title: 'Total Referrals',
      value: stats?.totalReferrals || 0,
      icon: Users,
      description: `${stats?.completedReferrals || 0} completed`,
      color: 'text-green-600'
    },
    {
      title: 'Community Goals',
      value: stats?.activeGoals || 0,
      icon: Target,
      description: 'Active community goals',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest community engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">New challenge participants</span>
                <Badge variant="secondary">+12 today</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Photo contest submissions</span>
                <Badge variant="secondary">+5 today</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">New referrals</span>
                <Badge variant="secondary">+3 today</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">• Create new challenge</div>
              <div className="text-sm text-muted-foreground">• Launch photo contest</div>
              <div className="text-sm text-muted-foreground">• Set up referral campaign</div>
              <div className="text-sm text-muted-foreground">• Add community goal</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HubOverview;
