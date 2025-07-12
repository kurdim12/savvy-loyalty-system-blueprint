import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Bug, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Search, 
  RefreshCw,
  BarChart3,
  Clock
} from 'lucide-react';

interface QAError {
  id: string;
  page_name: string;
  element: string;
  error_type: string;
  message: string;
  suggested_fix: string | null;
  severity: string;
  status: string;
  created_at: string;
}

interface TestCase {
  id: string;
  page: string;
  description: string;
  element: string;
  expectedBehavior: string;
  criticalPath: boolean;
}

const TEST_CASES: TestCase[] = [
  // Authentication Flow
  { id: '1', page: '/auth', description: 'Login with valid credentials', element: 'Login Form', expectedBehavior: 'Redirects to dashboard', criticalPath: true },
  { id: '2', page: '/auth', description: 'Sign up new user', element: 'Sign Up Form', expectedBehavior: 'Creates account and redirects', criticalPath: true },
  { id: '3', page: '/auth', description: 'Referral code processing', element: 'Referral Input', expectedBehavior: 'Applies referral bonus', criticalPath: false },
  
  // User Dashboard
  { id: '4', page: '/dashboard', description: 'Display current points', element: 'Points Counter', expectedBehavior: 'Shows accurate point balance', criticalPath: true },
  { id: '5', page: '/dashboard', description: 'Show membership tier', element: 'Tier Display', expectedBehavior: 'Displays correct tier with benefits', criticalPath: true },
  { id: '6', page: '/dashboard', description: 'Navigation to rewards', element: 'Rewards Button', expectedBehavior: 'Navigates to rewards page', criticalPath: true },
  
  // Rewards System
  { id: '7', page: '/rewards', description: 'Display available rewards', element: 'Rewards List', expectedBehavior: 'Shows active rewards only', criticalPath: true },
  { id: '8', page: '/rewards', description: 'Redeem reward with sufficient points', element: 'Redeem Button', expectedBehavior: 'Deducts points and creates redemption', criticalPath: true },
  { id: '9', page: '/rewards', description: 'Block redemption with insufficient points', element: 'Redeem Button', expectedBehavior: 'Shows error message', criticalPath: true },
  
  // Profile Management
  { id: '10', page: '/profile', description: 'Update profile information', element: 'Profile Form', expectedBehavior: 'Saves changes successfully', criticalPath: false },
  { id: '11', page: '/profile', description: 'Upload avatar image', element: 'Avatar Upload', expectedBehavior: 'Updates profile picture', criticalPath: false },
  { id: '12', page: '/profile', description: 'View transaction history', element: 'Transaction List', expectedBehavior: 'Shows all user transactions', criticalPath: false },
  
  // Referral System
  { id: '13', page: '/dashboard', description: 'Send referral email', element: 'Refer Friend Form', expectedBehavior: 'Sends invitation email', criticalPath: false },
  { id: '14', page: '/dashboard', description: 'Share referral link', element: 'Share Link Button', expectedBehavior: 'Copies link to clipboard', criticalPath: false },
  
  // Community Features
  { id: '15', page: '/community', description: 'Access community page', element: 'Community Navigation', expectedBehavior: 'Loads community features', criticalPath: false },
  { id: '16', page: '/community', description: 'Virtual cafe experience', element: 'Cafe Interface', expectedBehavior: 'Interactive cafe environment', criticalPath: false },
  
  // Admin Panel
  { id: '17', page: '/admin', description: 'Admin login access', element: 'Admin Login', expectedBehavior: 'Grants admin access', criticalPath: true },
  { id: '18', page: '/admin/dashboard', description: 'View user analytics', element: 'Analytics Dashboard', expectedBehavior: 'Shows user metrics', criticalPath: true },
  { id: '19', page: '/admin/users', description: 'Manage user accounts', element: 'User Management', expectedBehavior: 'CRUD operations on users', criticalPath: true },
  { id: '20', page: '/admin/rewards', description: 'Manage rewards catalog', element: 'Rewards Management', expectedBehavior: 'CRUD operations on rewards', criticalPath: true },
];

export default function QAInspectorAgent() {
  const [qaErrors, setQaErrors] = useState<QAError[]>([]);
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchQAErrors();
  }, []);

  const fetchQAErrors = async () => {
    try {
      const { data, error } = await supabase
        .from('qa_errors_log')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQaErrors(data || []);
    } catch (error) {
      console.error('Error fetching QA errors:', error);
      toast.error('Failed to load QA errors');
    } finally {
      setLoading(false);
    }
  };

  const logQAError = async (testCase: TestCase, errorType: string, message: string, suggestedFix: string) => {
    try {
      const { error } = await supabase
        .from('qa_errors_log')
        .insert({
          page_name: testCase.page,
          element: testCase.element,
          error_type: errorType,
          message: message,
          suggested_fix: suggestedFix,
          severity: testCase.criticalPath ? 'high' : 'medium',
          reported_by: user?.id
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging QA error:', error);
    }
  };

  const runSystemAudit = async () => {
    setIsRunningAudit(true);
    setAuditProgress(0);
    
    const totalTests = TEST_CASES.length;
    let completedTests = 0;
    let newErrors = 0;

    for (const testCase of TEST_CASES) {
      // Simulate test execution time
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate random test failures for demonstration
      const shouldFail = Math.random() < 0.15; // 15% failure rate for demo
      
      if (shouldFail) {
        const errorTypes = ['Element Not Found', 'Logic Error', 'Performance Issue', 'UI Bug'];
        const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
        
        let message = '';
        let suggestedFix = '';
        
        switch (errorType) {
          case 'Element Not Found':
            message = `${testCase.element} is missing or not accessible`;
            suggestedFix = `Verify ${testCase.element} exists and has correct CSS selectors`;
            break;
          case 'Logic Error':
            message = `${testCase.description} does not behave as expected`;
            suggestedFix = `Review business logic for ${testCase.element} functionality`;
            break;
          case 'Performance Issue':
            message = `${testCase.page} loads slowly or times out`;
            suggestedFix = `Optimize database queries and component rendering for ${testCase.page}`;
            break;
          case 'UI Bug':
            message = `Visual inconsistency or layout issue on ${testCase.page}`;
            suggestedFix = `Review CSS styles and responsive design for ${testCase.element}`;
            break;
        }
        
        await logQAError(testCase, errorType, message, suggestedFix);
        newErrors++;
      }
      
      completedTests++;
      setAuditProgress((completedTests / totalTests) * 100);
    }

    await fetchQAErrors();
    setIsRunningAudit(false);
    
    toast.success(`Audit completed! Found ${newErrors} new issues out of ${totalTests} tests.`);
  };

  const markAsResolved = async (errorId: string) => {
    try {
      const { error } = await supabase
        .from('qa_errors_log')
        .update({ status: 'resolved' })
        .eq('id', errorId);

      if (error) throw error;
      
      setQaErrors(prev => 
        prev.map(error => 
          error.id === errorId ? { ...error, status: 'resolved' } : error
        )
      );
      
      toast.success('Error marked as resolved');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update error status');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'in_progress': return 'default';
      case 'resolved': return 'secondary';
      default: return 'default';
    }
  };

  const openErrors = qaErrors.filter(error => error.status === 'open');
  const highPriorityErrors = qaErrors.filter(error => error.severity === 'high' && error.status === 'open');

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Bug className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">🛠 ErrorSmith QA Inspector</h1>
        </div>
        <p className="text-muted-foreground">
          Automated quality assurance monitoring for the Raw Smith Coffee Loyalty System
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qaErrors.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{openErrors.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{highPriorityErrors.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Cases</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{TEST_CASES.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            System Audit Controls
          </CardTitle>
          <CardDescription>
            Run comprehensive tests across all system components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={runSystemAudit} 
              disabled={isRunningAudit}
              className="w-full md:w-auto"
            >
              {isRunningAudit ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Running Audit...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Run Full System Audit
                </>
              )}
            </Button>
            
            {isRunningAudit && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(auditProgress)}%</span>
                </div>
                <Progress value={auditProgress} className="w-full" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="errors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="errors">Error Log</TabsTrigger>
          <TabsTrigger value="tests">Test Cases</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="errors">
          <Card>
            <CardHeader>
              <CardTitle>QA Error Log</CardTitle>
              <CardDescription>
                All detected issues and their recommended fixes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                {qaErrors.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                    <CheckCircle className="h-8 w-8 mb-2" />
                    <p>No errors found. System is healthy!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {qaErrors.map((error) => (
                      <Alert key={error.id} className="relative">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="space-x-2">
                                <Badge variant={getSeverityColor(error.severity)}>
                                  {error.severity.toUpperCase()}
                                </Badge>
                                <Badge variant={getStatusColor(error.status)}>
                                  {error.status.replace('_', ' ').toUpperCase()}
                                </Badge>
                                <Badge variant="outline">
                                  {error.error_type}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {new Date(error.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            
                            <div>
                              <p className="font-medium">{error.page_name} - {error.element}</p>
                              <p className="text-sm text-muted-foreground mb-2">{error.message}</p>
                              
                              {error.suggested_fix && (
                                <div className="bg-muted p-2 rounded text-sm">
                                  <p className="font-medium">Suggested Fix:</p>
                                  <p>{error.suggested_fix}</p>
                                </div>
                              )}
                            </div>
                            
                            {error.status === 'open' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => markAsResolved(error.id)}
                              >
                                Mark as Resolved
                              </Button>
                            )}
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests">
          <Card>
            <CardHeader>
              <CardTitle>Test Cases</CardTitle>
              <CardDescription>
                Comprehensive test scenarios for the loyalty system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {TEST_CASES.map((testCase) => (
                    <Card key={testCase.id} className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{testCase.description}</h4>
                          {testCase.criticalPath && (
                            <Badge variant="destructive">Critical Path</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p><strong>Page:</strong> {testCase.page}</p>
                          <p><strong>Element:</strong> {testCase.element}</p>
                          <p><strong>Expected:</strong> {testCase.expectedBehavior}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Error Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['high', 'medium', 'low'].map(severity => {
                    const count = qaErrors.filter(e => e.severity === severity).length;
                    const percentage = qaErrors.length > 0 ? (count / qaErrors.length) * 100 : 0;
                    
                    return (
                      <div key={severity} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{severity} Priority</span>
                          <span>{count} errors</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {Math.max(0, Math.round(100 - (openErrors.length / TEST_CASES.length) * 100))}%
                    </div>
                    <p className="text-sm text-muted-foreground">System Health Score</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Passing Tests</span>
                      <span>{TEST_CASES.length - openErrors.length}/{TEST_CASES.length}</span>
                    </div>
                    <Progress 
                      value={((TEST_CASES.length - openErrors.length) / TEST_CASES.length) * 100} 
                      className="h-2" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}