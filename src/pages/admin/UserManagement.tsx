
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Search, Download, Upload, Users } from 'lucide-react';
import CustomerTransactionsList from '@/components/admin/CustomerTransactionsList';
import ManagePointsDialog from '@/components/admin/ManagePointsDialog';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showPointsDialog, setShowPointsDialog] = useState(false);

  // Fetch users
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      return data as Profile[];
    }
  });

  const filteredUsers = users?.filter(user => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      (user.email && user.email.toLowerCase().includes(query)) ||
      (user.first_name && user.first_name.toLowerCase().includes(query)) ||
      (user.last_name && user.last_name.toLowerCase().includes(query)) ||
      (user.phone && user.phone.toLowerCase().includes(query)) ||
      (user.membership_tier && user.membership_tier.toLowerCase().includes(query))
    );
  });

  const handleManagePoints = (userId: string) => {
    setSelectedUser(userId);
    setShowPointsDialog(true);
  };

  const handleResetPassword = (email: string) => {
    // In a real implementation, this would trigger a password reset email
    toast.success(`Password reset link sent to ${email}`);
  };

  const handleSuspendUser = (userId: string) => {
    // In a real implementation, this would update the user's status in the database
    toast.success('User account suspended');
  };

  const handleDeleteUser = (userId: string) => {
    // In a real implementation, this would delete the user from the database
    toast.success('User account deleted');
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-500">Manage loyalty program users and their accounts</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleBulkExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" onClick={handleBulkImport}>
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button>
              <Users className="mr-2 h-4 w-4" />
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
                {filteredUsers ? filteredUsers.length : 0} total users
              </CardDescription>
              <div className="mt-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rank</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          Loading users...
                        </TableCell>
                      </TableRow>
                    ) : filteredUsers && filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow 
                          key={user.id}
                          onClick={() => setSelectedUser(user.id)}
                          className={`cursor-pointer hover:bg-muted/50 ${selectedUser === user.id ? 'bg-muted' : ''}`}
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {user.first_name || ''} {user.last_name || ''}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {user.phone || 'No phone'}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getMembershipBadge(user.membership_tier)}</TableCell>
                          <TableCell>{user.current_points}</TableCell>
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
                                <DropdownMenuItem onClick={() => handleManagePoints(user.id)}>
                                  Adjust Points
                                </DropdownMenuItem>
                                <DropdownMenuItem>Change Rank</DropdownMenuItem>
                                <DropdownMenuItem>View History</DropdownMenuItem>
                                <DropdownMenuItem>Send Notification</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleResetPassword(user.email)}>
                                  Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSuspendUser(user.id)}>
                                  Suspend Account
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* User Transactions */}
          <div className="w-full md:w-2/5">
            <CustomerTransactionsList customerId={selectedUser || undefined} />
          </div>
        </div>

        {/* Manage Points Dialog */}
        {showPointsDialog && selectedUser && (
          <ManagePointsDialog
            userId={selectedUser}
            open={showPointsDialog}
            onOpenChange={(open) => {
              setShowPointsDialog(open);
              if (!open) {
                // Refresh the users data when dialog is closed
              }
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
