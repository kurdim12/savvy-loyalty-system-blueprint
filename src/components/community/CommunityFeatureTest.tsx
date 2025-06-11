
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface FeatureTest {
  name: string;
  table: string;
  description: string;
  status: 'working' | 'error' | 'warning';
  message?: string;
}

export const CommunityFeatureTest = () => {
  const { user } = useAuth();

  const { data: testResults = [], isLoading } = useQuery({
    queryKey: ['feature-tests'],
    queryFn: async () => {
      const tests: FeatureTest[] = [];

      // Test each feature/table
      const featureTests = [
        { name: 'User Connections/Friends', table: 'user_connections', description: 'Friend system and social connections' },
        { name: 'Direct Messages', table: 'direct_messages', description: 'Private messaging between users' },
        { name: 'Photo Sharing', table: 'photo_shares', description: 'Share and like coffee photos' },
        { name: 'Photo Likes', table: 'photo_likes', description: 'Like system for shared photos' },
        { name: 'Check-ins', table: 'checkins', description: 'Location-based check-ins' },
        { name: 'Badges System', table: 'badges', description: 'Achievement badges and rewards' },
        { name: 'User Badges', table: 'user_badges', description: 'User-earned achievements' },
        { name: 'Leaderboards', table: 'leaderboard_entries', description: 'Competition rankings' },
        { name: 'Daily Challenges', table: 'daily_challenges', description: 'Daily tasks and challenges' },
        { name: 'Challenge Completions', table: 'user_challenge_completions', description: 'Track completed challenges' },
        { name: 'Event Calendar', table: 'cafe_events', description: 'Community events and workshops' },
        { name: 'Event Attendees', table: 'event_attendees', description: 'Event registration system' },
        { name: 'Table Reservations', table: 'table_reservations', description: 'Reserve specific tables' },
        { name: 'Coffee Reviews', table: 'coffee_reviews', description: 'Rate and review coffee' },
        { name: 'Community Polls', table: 'polls', description: 'Community voting and polls' },
        { name: 'Poll Votes', table: 'poll_votes', description: 'Vote tracking for polls' },
        { name: 'User Streaks', table: 'user_streaks', description: 'Track activity streaks' },
        { name: 'Notifications', table: 'notifications', description: 'System notifications' }
      ];

      for (const feature of featureTests) {
        try {
          const { data, error } = await supabase
            .from(feature.table)
            .select('*', { count: 'exact', head: true })
            .limit(1);

          if (error) {
            tests.push({
              ...feature,
              status: 'error',
              message: `Database error: ${error.message}`
            });
          } else {
            tests.push({
              ...feature,
              status: 'working',
              message: 'Table accessible and ready'
            });
          }
        } catch (err) {
          tests.push({
            ...feature,
            status: 'error',
            message: `Connection error: ${err}`
          });
        }
      }

      return tests;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const workingCount = testResults.filter(t => t.status === 'working').length;
  const errorCount = testResults.filter(t => t.status === 'error').length;
  const warningCount = testResults.filter(t => t.status === 'warning').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-[#8B4513]">
          <span>Community Features Status</span>
          <div className="flex gap-2">
            <Badge className="bg-green-100 text-green-800">
              ✅ {workingCount} Working
            </Badge>
            {errorCount > 0 && (
              <Badge className="bg-red-100 text-red-800">
                ❌ {errorCount} Errors
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge className="bg-yellow-100 text-yellow-800">
                ⚠️ {warningCount} Warnings
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-center text-muted-foreground py-4">
            Testing community features...
          </p>
        ) : (
          <>
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{workingCount}</p>
                <p className="text-sm text-green-800">Features Working</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">{errorCount}</p>
                <p className="text-sm text-red-800">Errors Found</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{testResults.length}</p>
                <p className="text-sm text-blue-800">Total Features</p>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="space-y-3">
              {testResults.map((test, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    {getStatusIcon(test.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{test.name}</h4>
                      <Badge className={getStatusColor(test.status)}>
                        {test.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {test.description}
                    </p>
                    {test.message && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {test.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Table: {test.table}
                  </div>
                </div>
              ))}
            </div>

            {/* Authentication Status */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Authentication Status</h4>
              {user ? (
                <p className="text-sm text-blue-700">
                  ✅ Authenticated as: {user.email} 
                  {user.user_metadata?.first_name && ` (${user.user_metadata.first_name})`}
                </p>
              ) : (
                <p className="text-sm text-blue-700">
                  ❌ Not authenticated - Some features may be limited
                </p>
              )}
            </div>

            {/* System Health */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">System Health</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Database Connection:</p>
                  <p className={errorCount === 0 ? 'text-green-600' : 'text-red-600'}>
                    {errorCount === 0 ? '✅ Healthy' : '❌ Issues Detected'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Feature Coverage:</p>
                  <p className="text-blue-600">
                    ✅ {Math.round((workingCount / testResults.length) * 100)}% Complete
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
