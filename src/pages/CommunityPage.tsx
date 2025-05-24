
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Trophy, 
  Target, 
  Coffee, 
  MessageSquare, 
  Star,
  Award,
  TrendingUp,
  Calendar,
  Heart
} from 'lucide-react';
import CommunityGoalsList from '@/components/community/CommunityGoalsList';

const CommunityPage = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('goals');

  // Fetch community stats
  const { data: communityStats } = useQuery({
    queryKey: ['communityStats'],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('membership_tier, current_points')
        .eq('role', 'user');

      if (profilesError) throw profilesError;

      const totalMembers = profiles?.length || 0;
      const totalPoints = profiles?.reduce((sum, p) => sum + (p.current_points || 0), 0) || 0;
      const goldMembers = profiles?.filter(p => p.membership_tier === 'gold').length || 0;
      const silverMembers = profiles?.filter(p => p.membership_tier === 'silver').length || 0;

      return {
        totalMembers,
        totalPoints,
        goldMembers,
        silverMembers,
        averagePoints: totalMembers > 0 ? Math.round(totalPoints / totalMembers) : 0
      };
    }
  });

  // Fetch recent community achievements
  const { data: recentAchievements } = useQuery({
    queryKey: ['recentAchievements'],
    queryFn: async () => {
      // Mock data for community achievements - in real app this would come from database
      return [
        {
          id: '1',
          title: 'Monthly Coffee Goal Reached!',
          description: 'Community collectively earned 50,000 points this month',
          type: 'milestone',
          date: new Date().toISOString(),
          participants: 127
        },
        {
          id: '2',
          title: 'Sustainability Challenge Complete',
          description: 'Members used reusable cups 1,000 times',
          type: 'environmental',
          date: new Date(Date.now() - 86400000 * 3).toISOString(),
          participants: 89
        },
        {
          id: '3',
          title: 'New Member Milestone',
          description: 'Welcome to our 200th community member!',
          type: 'growth',
          date: new Date(Date.now() - 86400000 * 7).toISOString(),
          participants: 200
        }
      ];
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'milestone': return <Trophy className="h-5 w-5 text-amber-600" />;
      case 'environmental': return <Heart className="h-5 w-5 text-green-600" />;
      case 'growth': return <TrendingUp className="h-5 w-5 text-blue-600" />;
      default: return <Award className="h-5 w-5 text-amber-600" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">Coffee Community</h1>
          <p className="text-amber-700">Connect, contribute, and celebrate together</p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-amber-900">{communityStats?.totalMembers || 0}</div>
              <p className="text-sm text-amber-700">Members</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Coffee className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-amber-900">{communityStats?.totalPoints?.toLocaleString() || 0}</div>
              <p className="text-sm text-amber-700">Total Points</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-amber-900">{communityStats?.goldMembers || 0}</div>
              <p className="text-sm text-amber-700">Gold Members</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-amber-900">{communityStats?.averagePoints || 0}</div>
              <p className="text-sm text-amber-700">Avg Points</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Community Goals
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="goals" className="space-y-4">
            <CommunityGoalsList />
            
            {/* Contribution Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-amber-600" />
                  How to Contribute
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <Coffee className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-amber-900">Visit Often</h4>
                    <p className="text-sm text-amber-700">Every visit earns points for community goals</p>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <Heart className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-amber-900">Go Green</h4>
                    <p className="text-sm text-amber-700">Use reusable cups for bonus contributions</p>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-amber-900">Refer Friends</h4>
                    <p className="text-sm text-amber-700">Bring new members to grow our community</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Community Achievements</CardTitle>
                <CardDescription>Celebrating our collective successes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAchievements?.map((achievement) => (
                    <div key={achievement.id} className="flex items-start gap-4 p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg">
                      <div className="p-2 bg-white rounded-full">
                        {getAchievementIcon(achievement.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-amber-900">{achievement.title}</h4>
                        <p className="text-sm text-amber-700 mb-2">{achievement.description}</p>
                        <div className="flex items-center gap-4 text-xs text-amber-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(achievement.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {achievement.participants} participants
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Contributors</CardTitle>
                <CardDescription>Top community contributors this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-yellow-900 font-bold">1</div>
                      <div>
                        <p className="font-semibold text-yellow-900">Sarah M.</p>
                        <p className="text-sm text-yellow-700">Gold Member</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-400 text-yellow-900">1,250 pts contributed</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-gray-900 font-bold">2</div>
                      <div>
                        <p className="font-semibold text-gray-900">Mike D.</p>
                        <p className="text-sm text-gray-700">Silver Member</p>
                      </div>
                    </div>
                    <Badge variant="secondary">890 pts contributed</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-orange-900 font-bold">3</div>
                      <div>
                        <p className="font-semibold text-orange-900">Emma L.</p>
                        <p className="text-sm text-orange-700">Silver Member</p>
                      </div>
                    </div>
                    <Badge className="bg-orange-400 text-orange-900">720 pts contributed</Badge>
                  </div>

                  {/* User's position if they're not in top 3 */}
                  {profile && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-amber-900 font-bold">12</div>
                          <div>
                            <p className="font-semibold text-amber-900">You ({profile.first_name || 'User'})</p>
                            <p className="text-sm text-amber-700 capitalize">{profile.membership_tier} Member</p>
                          </div>
                        </div>
                        <Badge className="bg-amber-400 text-amber-900">150 pts contributed</Badge>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CommunityPage;
