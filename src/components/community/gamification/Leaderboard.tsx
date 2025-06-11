
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Award, Star, Coffee, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface LeaderboardEntry {
  id: string;
  user_id: string;
  category: string;
  score: number;
  period: string;
  profiles: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
    current_points: number;
    membership_tier: string;
  };
}

export const Leaderboard = () => {
  const { user } = useAuth();

  // Fetch leaderboard data
  const { data: pointsLeaderboard = [] } = useQuery({
    queryKey: ['leaderboard', 'points'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, current_points, membership_tier')
        .order('current_points', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: visitsLeaderboard = [] } = useQuery({
    queryKey: ['leaderboard', 'visits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, visits, membership_tier')
        .order('visits', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-sm font-bold text-muted-foreground">#{position}</span>;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'bronze': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderLeaderboardSection = (
    title: string,
    icon: React.ReactNode,
    data: any[],
    scoreKey: string,
    scoreSuffix: string
  ) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#8B4513]">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No data available yet
          </p>
        ) : (
          data.map((entry, index) => (
            <div
              key={entry.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                entry.id === user?.id ? 'bg-[#8B4513]/5 border-[#8B4513]/20' : ''
              }`}
            >
              <div className="flex items-center justify-center w-8">
                {getRankIcon(index + 1)}
              </div>
              
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-[#8B4513] text-white">
                  {getInitials(entry.first_name, entry.last_name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {entry.first_name} {entry.last_name}
                  </p>
                  {entry.id === user?.id && (
                    <Badge variant="outline" className="text-xs">You</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getTierColor(entry.membership_tier)}>
                    {entry.membership_tier}
                  </Badge>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-[#8B4513]">
                  {entry[scoreKey]} {scoreSuffix}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {renderLeaderboardSection(
          'Top Points Earners',
          <Star className="h-5 w-5" />,
          pointsLeaderboard,
          'current_points',
          'pts'
        )}
        
        {renderLeaderboardSection(
          'Most Frequent Visitors',
          <Coffee className="h-5 w-5" />,
          visitsLeaderboard,
          'visits',
          'visits'
        )}
      </div>

      {/* Current user position if not in top 10 */}
      {user && !pointsLeaderboard.some(entry => entry.id === user.id) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-[#8B4513]">Your Position</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Keep earning points and visiting to climb the leaderboard!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
