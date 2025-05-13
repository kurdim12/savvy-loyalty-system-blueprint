
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, Search, Download, Upload, Users, Edit, Trash2, 
  UserPlus, ChevronLeft, ChevronRight, Filter, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import CustomerTransactionsList from '@/components/admin/CustomerTransactionsList';
import ManagePointsDialog from '@/components/admin/ManagePointsDialog';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

const ITEMS_PER_PAGE = 10;

const UserManagement = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showPointsDialog, setShowPointsDialog] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPurgeDialog, setShowPurgeDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [tierFilter, setTierFilter] = useState<string>('all');

  // Fetch users with pagination
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin', 'users', currentPage, searchQuery, tierFilter],
    queryFn: async () => {
      try {
        // Calculate range for pagination
        const from = (currentPage - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;
        
        // Start building the query
        let query = supabase
          .from('profiles')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false });
        
        // Apply tier filter if not 'all'
        if (tierFilter !== 'all') {
          query = query.eq('membership_tier', tierFilter);
        }
        
        // Apply search filter if present
        if (searchQuery) {
          query = query.or(
            `first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`
          );
        }
        
        // Apply pagination
        query = query.range(from, to);
        
        // Execute query
        const { data, count, error } = await query;
        
        if (error) throw error;
        
        return {
          users: data as Profile[],
          totalCount: count || 0
        };
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    }
  });

  // Delete user mutation
  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      try {
        // Delete user's profile first
        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);
        
        if (profileError) throw profileError;
        
        // In a real app, you would also delete the auth user and handle related data
      } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User deleted successfully');
      setDeleteUserId(null);
      setShowDeleteDialog(false);
    },
    onError: (error) => {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user');
    }
  });

  // Update user mutation
  const updateUser = useMutation({
    mutationFn: async (userData: Partial<Profile>) => {
      try {
        const { id, ...updateData } = userData;
        
        if (!id) throw new Error('User ID is required');
        
        const { error } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', id);
        
        if (error) throw error;
      } catch (error) {
        console.error('Error updating user:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User updated successfully');
      setEditingUser(null);
      setShowEditDialog(false);
    },
    onError: (error) => {
      console.error('Failed to update user:', error);
      toast.error('Failed to update user');
    }
  });

  // Purge users mutation
  const purgeUsers = useMutation({
    mutationFn: async () => {
      try {
        // Delete all non-admin users
        const { error } = await supabase
          .from('profiles')
          .delete()
          .neq('role', 'admin');
        
        if (error) throw error;
      } catch (error) {
        console.error('Error purging users:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('All non-admin users have been purged');
      setShowPurgeDialog(false);
    },
    onError: (error) => {
      console.error('Failed to purge users:', error);
      toast.error('Failed to purge users');
    }
  });

  const handleManagePoints = (userId: string, userName: string) => {
    setSelectedUser(userId);
    setSelectedUserName(userName);
    setShowPointsDialog(true);
  };

  const handleEditUser = (user: Profile) => {
    setEditingUser({ ...user });
    setShowEditDialog(true);
  };

  const handleDeleteUser = (userId: string) => {
    setDeleteUserId(userId);
    setShowDeleteDialog(true);
  };

  const handleUpdateUser = () => {
    if (editingUser) {
      updateUser.mutate(editingUser);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteUserId) {
      deleteUser.mutate(deleteUserId);
    }
  };

  const handlePurgeUsers = () => {
    purgeUsers.mutate();
  };

  const handleResetPassword = (email: string) => {
    // In a real implementation, you would trigger a password reset email
    toast.success(`Password reset link sent to ${email}`);
  };

  const handleBulkExport = () => {
    // In a real implementation, this would export user data to CSV
    toast.success('Exporting user data');
  };

  const handleBulkImport = () => {
    // In a real implementation, this would show a file upload dialog
    toast.success('Please select a CSV file to import');
  };

  const getMembershipBadge = (tier: string) => {
    switch(tier) {
      case 'bronze':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Bronze</Badge>;
      case 'silver':
        return <Badge variant="outline" className="bg-gray-200 text-gray-800">Silver</Badge>;
      case 'gold':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Gold</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Calculate total pages for pagination
  const totalPages = usersData ? Math.ceil(usersData.totalCount / ITEMS_PER_PAGE) : 1;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-500">Manage loyalty program users and their accounts</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleBulkExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" onClick={handleBulkImport}>
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Users List */}
          <Card className="w-full md:w-3/5">
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                {usersData ? usersData.totalCount : 0} total users
              </CardDescription>
              <div className="mt-2 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1); // Reset to first page on search
                    }}
                  />
                </div>
                
                <div className="flex-shrink-0 w-full sm:w-40">
                  <Select
                    value={tierFilter}
                    onValueChange={(value) => {
                      setTierFilter(value);
                      setCurrentPage(1); // Reset to first page on filter change
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter by tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="bronze">Bronze</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="destructive"
                  className="flex-shrink-0"
                  onClick={() => setShowPurgeDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Purge Users
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer ID</TableHead>
                      <TableHead>Name & Email</TableHead>
                      <TableHead>Rank</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Visits</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          Loading users...
                        </TableCell>
                      </TableRow>
                    ) : usersData?.users && usersData.users.length > 0 ? (
                      usersData.users.map((user) => (
                        <TableRow 
                          key={user.id}
                          onClick={() => setSelectedUser(user.id)}
                          className={`cursor-pointer hover:bg-muted/50 ${selectedUser === user.id ? 'bg-muted' : ''}`}
                        >
                          <TableCell>
                            <Badge variant="outline">
                              #{user.id.substring(0, 4)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {user.first_name || ''} {user.last_name || ''}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{getMembershipBadge(user.membership_tier)}</TableCell>
                          <TableCell>{user.current_points}</TableCell>
                          <TableCell>{user.visits}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditUser(user);
                                }}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  handleManagePoints(
                                    user.id, 
                                    `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email
                                  );
                                }}>
                                  Adjust Points
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  handleResetPassword(user.email);
                                }}>
                                  Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteUser(user.id);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              {usersData && usersData.totalCount > 0 && (
                <div className="flex items-center justify-between space-x-2 mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, usersData.totalCount)} of {usersData.totalCount} users
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-sm">
                      Page {currentPage} of {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage >= totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Transactions */}
          <div className="w-full md:w-2/5">
            <CustomerTransactionsList customerId={selectedUser || undefined} />
          </div>
        </div>

        {/* Edit User Dialog */}
        {editingUser && (
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>
                  Update user information and membership details.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="points" className="text-right font-medium">
                    Points
                  </label>
                  <Input
                    id="points"
                    className="col-span-3"
                    type="number"
                    value={editingUser.current_points}
                    onChange={(e) => setEditingUser({
                      ...editingUser,
                      current_points: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="tier" className="text-right font-medium">
                    Tier
                  </label>
                  <div className="col-span-3">
                    <Select
                      value={editingUser.membership_tier}
                      onValueChange={(value) => setEditingUser({
                        ...editingUser,
                        membership_tier: value as any
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bronze">Bronze</SelectItem>
                        <SelectItem value="silver">Silver</SelectItem>
                        <SelectItem value="gold">Gold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="visits" className="text-right font-medium">
                    Visits
                  </label>
                  <Input
                    id="visits"
                    className="col-span-3"
                    type="number"
                    value={editingUser.visits}
                    onChange={(e) => setEditingUser({
                      ...editingUser,
                      visits: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="birthday" className="text-right font-medium">
                    Birthday
                  </label>
                  <Input
                    id="birthday"
                    className="col-span-3"
                    type="date"
                    value={editingUser.birthday || ''}
                    onChange={(e) => setEditingUser({
                      ...editingUser,
                      birthday: e.target.value || null
                    })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateUser} disabled={updateUser.isPending}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Delete User Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this user? This action cannot be undone and will remove all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmDelete}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Purge Users Dialog */}
        <AlertDialog open={showPurgeDialog} onOpenChange={setShowPurgeDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center text-red-600">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Purge All Non-Admin Users
              </AlertDialogTitle>
              <AlertDialogDescription>
                <p className="mb-2">
                  This action will <span className="font-bold">permanently delete ALL non-admin users</span> from your loyalty program.
                </p>
                <p className="mb-2">
                  All customer data, points, transaction history, and redemptions will be lost.
                </p>
                <p className="font-semibold">
                  This cannot be undone. Are you absolutely sure?
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No, Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handlePurgeUsers}
                className="bg-red-500 hover:bg-red-600"
              >
                Yes, Delete All Users
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Manage Points Dialog */}
        {showPointsDialog && selectedUser && (
          <ManagePointsDialog
            userId={selectedUser}
            customerName={selectedUserName}
            open={showPointsDialog}
            onOpenChange={(open) => {
              setShowPointsDialog(open);
              if (!open) {
                // Refresh the users data when dialog is closed
                queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
              }
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
