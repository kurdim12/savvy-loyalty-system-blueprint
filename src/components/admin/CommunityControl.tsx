
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageSquare, 
  Shield, 
  Ban, 
  UserCheck, 
  AlertTriangle,
  Eye,
  EyeOff,
  Trash2,
  Flag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];
type MembershipTier = Database['public']['Enums']['membership_tier'];

interface CommunityMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  membership_tier: MembershipTier;
  current_points: number;
  visits: number;
  created_at: string;
  last_active?: string;
}

interface CommunityMessage {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
  thread_id: string;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
  };
  thread_title?: string;
}

const CommunityControl = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');

  // Fetch community members
  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ['community-members', searchQuery, roleFilter, tierFilter],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
      }

      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter as UserRole);
      }

      if (tierFilter !== 'all') {
        query = query.eq('membership_tier', tierFilter as MembershipTier);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as CommunityMember[];
    },
  });

  // Fetch recent community messages - simplified to avoid join issues
  const { data: recentMessages, isLoading: messagesLoading } = useQuery({
    queryKey: ['community-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          body,
          created_at,
          user_id,
          thread_id,
          profiles (first_name, last_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      // Get thread titles separately if needed
      const messagesWithThreadInfo = await Promise.all(
        data.map(async (message) => {
          let thread_title = 'General Chat';
          
          // Try to get thread title if thread_id exists and looks like a UUID
          if (message.thread_id && message.thread_id.length === 36) {
            const { data: threadData } = await supabase
              .from('threads')
              .select('title')
              .eq('id', message.thread_id)
              .maybeSingle();
            
            if (threadData) {
              thread_title = threadData.title;
            }
          }
          
          return {
            ...message,
            thread_title
          };
        })
      );

      return messagesWithThreadInfo as CommunityMessage[];
    },
  });

  // Update user role mutation
  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: UserRole }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-members'] });
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    },
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-messages'] });
      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    },
  });

  const handleMemberClick = (member: CommunityMember) => {
    setSelectedMember(member);
    setIsUserDialogOpen(true);
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    updateUserRoleMutation.mutate({ userId, newRole });
  };

  const handleDeleteMessage = (messageId: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      deleteMessageMutation.mutate(messageId);
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTierBadgeColor = (tier: MembershipTier) => {
    switch (tier) {
      case 'gold': return 'bg-yellow-500 text-black';
      case 'silver': return 'bg-gray-400';
      case 'bronze': return 'bg-amber-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-amber-900">Community Control Center</h2>
          <p className="text-amber-700">Manage community members and moderate discussions</p>
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {members?.filter(m => m.role === 'admin').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Recent Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentMessages?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Member Management</CardTitle>
          <CardDescription>Search and filter community members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="customer">Customers</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Flag className="mr-2 h-4 w-4" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Community Members</CardTitle>
          <CardDescription>Manage user roles and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          {membersLoading ? (
            <div className="text-center py-8">Loading members...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Visits</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members?.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {member.first_name} {member.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {member.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(member.role)}>
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTierBadgeColor(member.membership_tier)}>
                        {member.membership_tier}
                      </Badge>
                    </TableCell>
                    <TableCell>{member.current_points}</TableCell>
                    <TableCell>{member.visits}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMemberClick(member)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        {member.role !== 'admin' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRoleChange(member.id, 'admin')}
                          >
                            <Shield className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Recent Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Community Messages</CardTitle>
          <CardDescription>Monitor and moderate community discussions</CardDescription>
        </CardHeader>
        <CardContent>
          {messagesLoading ? (
            <div className="text-center py-8">Loading messages...</div>
          ) : (
            <div className="space-y-4">
              {recentMessages?.map((message) => (
                <div key={message.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">
                          {message.profiles.first_name} {message.profiles.last_name}
                        </span>
                        <Badge variant="outline">{message.profiles.email}</Badge>
                        <span className="text-sm text-muted-foreground">
                          in "{message.thread_title}"
                        </span>
                      </div>
                      <p className="text-sm">{message.body}</p>
                      <div className="text-xs text-muted-foreground mt-2">
                        {new Date(message.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteMessage(message.id)}
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Member Details Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
          </DialogHeader>
          
          {selectedMember && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <div className="text-lg">
                    {selectedMember.first_name} {selectedMember.last_name}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <div>{selectedMember.email}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <Badge className={getRoleBadgeColor(selectedMember.role)}>
                    {selectedMember.role}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Membership Tier</label>
                  <Badge className={getTierBadgeColor(selectedMember.membership_tier)}>
                    {selectedMember.membership_tier}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Current Points</label>
                  <div className="text-lg font-bold text-amber-600">
                    {selectedMember.current_points}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Total Visits</label>
                  <div className="text-lg font-bold">{selectedMember.visits}</div>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => handleRoleChange(selectedMember.id, 
                    selectedMember.role === 'admin' ? 'customer' : 'admin'
                  )}
                >
                  {selectedMember.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                </Button>
                <Button variant="outline" className="text-red-600">
                  <Ban className="mr-2 h-4 w-4" />
                  Suspend User
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunityControl;
