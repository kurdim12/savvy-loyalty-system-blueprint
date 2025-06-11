
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

      // Test existing features/tables only
      const featureTests = [
        { name: 'User Profiles', table: 'profiles', description: 'User authentication and profiles' },
        { name: 'Messages/Chat', table: 'messages', description: 'Community messaging system' },
        { name: 'Transactions', table: 'transactions', description: 'Points and rewards system' },
        { name: 'Rewards', table: 'rewards', description: 'Available rewards catalog' },
        { name: 'Drinks Menu', table: 'drinks', description: 'Available drinks for ordering' },
        { name: 'Community Goals', table: 'community_goals', description: 'Shared community objectives' },
        { name: 'Notifications', table: 'notifications', description: 'User notifications system' }
      ];

      for (const feature of featureTests) {
        try {
          const { data, error } = await supabase
            .from(feature.table as any)
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
    refetchInterval: 30000,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-[#8B4513]">
          <span>System Status</span>
          <div className="flex gap-2">
            <Badge className="bg-green-100 text-green-800">
              ✅ {workingCount} Working
            </Badge>
            {errorCount > 0 && (
              <Badge className="bg-red-100 text-red-800">
                ❌ {errorCount} Errors
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-center text-muted-foreground py-4">
            Testing system components...
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{workingCount}</p>
                <p className="text-sm text-green-800">Components Working</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{testResults.length}</p>
                <p className="text-sm text-blue-800">Total Components</p>
              </div>
            </div>

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
                </div>
              ))}
            </div>

            {user && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Authentication Status</h4>
                <p className="text-sm text-blue-700">
                  ✅ Authenticated as: {user.email}
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
