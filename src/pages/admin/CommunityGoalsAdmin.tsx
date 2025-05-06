
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import NewGoalForm from '@/components/community/NewGoalForm';
import { CommunityGoalRow } from '@/types/communityGoals';

const CommunityGoalsAdmin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'list' | 'create'>('list');
  const [deleteGoalId, setDeleteGoalId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get all community goals for admins
  const { data: goals, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'communityGoals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CommunityGoalRow[];
    },
    enabled: isAdmin,
  });

  // Delete community goal
  const handleDeleteGoal = async () => {
    if (!deleteGoalId) return;
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('community_goals')
        .delete()
        .eq('id', deleteGoalId);
        
      if (error) throw error;
      
      toast.success('Community goal deleted successfully');
      refetch();
    } catch (error: any) {
      toast.error(`Error deleting community goal: ${error.message}`);
    } finally {
      setIsDeleting(false);
      setDeleteGoalId(null);
    }
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No expiry';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Layout adminOnly>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          {mode === 'create' ? (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setMode('list')}
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Goals
              </Button>
              <h2 className="text-xl font-bold text-amber-900">New Community Goal</h2>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-amber-900">Community Goals Management</h1>
              <Button 
                onClick={() => setMode('create')} 
                className="bg-amber-700 hover:bg-amber-800"
              >
                <Plus className="w-4 h-4 mr-1" /> New Goal
              </Button>
            </>
          )}
        </div>
        
        {mode === 'create' ? (
          <NewGoalForm />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Community Goals</CardTitle>
              <CardDescription>
                Manage the community goals visible to your customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading goals...</div>
              ) : goals && goals.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Expiry</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {goals.map((goal) => {
                        const progress = Math.min((goal.current_points / goal.target_points) * 100, 100);
                        const isComplete = goal.current_points >= goal.target_points;
                        
                        return (
                          <TableRow key={goal.id}>
                            <TableCell className="font-medium">
                              <div className="font-semibold">{goal.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {goal.current_points} / {goal.target_points} points
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="w-full max-w-[200px]">
                                <Progress value={progress} className="h-2" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="whitespace-nowrap">
                                {formatDate(goal.expires_at)}
                              </div>
                            </TableCell>
                            <TableCell>
                              {isComplete ? (
                                <Badge className="bg-green-600">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Completed
                                </Badge>
                              ) : goal.active ? (
                                <Badge className="bg-amber-600">Active</Badge>
                              ) : (
                                <Badge variant="outline" className="text-muted-foreground">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Inactive
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/admin/community-goals/edit/${goal.id}`)}
                                className="mr-1"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDeleteGoalId(goal.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Community Goal
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this community goal?
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={handleDeleteGoal}
                                      disabled={isDeleting}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      {isDeleting ? 'Deleting...' : 'Delete'}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No community goals found.</p>
                  <p className="text-sm">Create your first community goal to engage your customers.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default CommunityGoalsAdmin;
