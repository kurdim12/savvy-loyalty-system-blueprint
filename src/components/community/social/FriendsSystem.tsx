
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Search, UserPlus, Check, X, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Connection {
  id: string;
  follower_id: string;
  following_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

export const FriendsSystem = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search'>('friends');
  const queryClient = useQueryClient();

  // Fetch user's connections
  const { data: connections = [] } = useQuery({
    queryKey: ['connections', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_connections')
        .select(`
          *,
          profiles:following_id (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('follower_id', user.id)
        .eq('status', 'accepted');
      
      if (error) throw error;
      return data as Connection[];
    },
    enabled: !!user?.id,
  });

  // Fetch pending requests
  const { data: pendingRequests = [] } = useQuery({
    queryKey: ['pending-requests', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_connections')
        .select(`
          *,
          profiles:follower_id (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('following_id', user.id)
        .eq('status', 'pending');
      
      if (error) throw error;
      return data as Connection[];
    },
    enabled: !!user?.id,
  });

  // Search users
  const { data: searchResults = [] } = useQuery({
    queryKey: ['user-search', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim() || !user?.id) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .neq('id', user.id)
        .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`)
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    enabled: !!searchQuery.trim() && !!user?.id,
  });

  // Send friend request
  const sendRequest = useMutation({
    mutationFn: async (targetUserId: string) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('user_connections')
        .insert({
          follower_id: user.id,
          following_id: targetUserId,
          status: 'pending'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Friend request sent!');
      queryClient.invalidateQueries({ queryKey: ['user-search'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send friend request');
    }
  });

  // Accept/reject friend request
  const handleRequest = useMutation({
    mutationFn: async ({ connectionId, action }: { connectionId: string, action: 'accept' | 'reject' }) => {
      const { error } = await supabase
        .from('user_connections')
        .update({ 
          status: action === 'accept' ? 'accepted' : 'blocked' 
        })
        .eq('id', connectionId);
      
      if (error) throw error;
    },
    onSuccess: (_, { action }) => {
      toast.success(action === 'accept' ? 'Friend request accepted!' : 'Request rejected');
      queryClient.invalidateQueries({ queryKey: ['pending-requests'] });
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to handle request');
    }
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#8B4513]">
          <Users className="h-5 w-5" />
          Friends & Connections
        </CardTitle>
        
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'friends' ? 'default' : 'outline'}
            onClick={() => setActiveTab('friends')}
            className={activeTab === 'friends' ? 'bg-[#8B4513] text-white' : ''}
          >
            Friends ({connections.length})
          </Button>
          <Button
            variant={activeTab === 'requests' ? 'default' : 'outline'}
            onClick={() => setActiveTab('requests')}
            className={activeTab === 'requests' ? 'bg-[#8B4513] text-white' : ''}
          >
            Requests ({pendingRequests.length})
          </Button>
          <Button
            variant={activeTab === 'search' ? 'default' : 'outline'}
            onClick={() => setActiveTab('search')}
            className={activeTab === 'search' ? 'bg-[#8B4513] text-white' : ''}
          >
            <Search className="h-4 w-4" />
            Find Friends
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {activeTab === 'search' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for coffee lovers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="space-y-2">
              {searchResults.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-[#8B4513] text-white">
                        {getInitials(profile.first_name, profile.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{profile.first_name} {profile.last_name}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => sendRequest.mutate(profile.id)}
                    disabled={sendRequest.isPending}
                    className="bg-[#8B4513] hover:bg-[#8B4513]/90"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Add Friend
                  </Button>
                </div>
              ))}
              
              {searchQuery && searchResults.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No users found matching "{searchQuery}"
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="space-y-2">
            {connections.map((connection) => (
              <div key={connection.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-[#8B4513] text-white">
                      {getInitials(connection.profiles.first_name, connection.profiles.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{connection.profiles.first_name} {connection.profiles.last_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Friends since {new Date(connection.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Chat
                </Button>
              </div>
            ))}
            
            {connections.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No friends yet. Use the search tab to find coffee lovers to connect with!
              </p>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-2">
            {pendingRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-[#8B4513] text-white">
                      {getInitials(request.profiles.first_name, request.profiles.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{request.profiles.first_name} {request.profiles.last_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Sent {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleRequest.mutate({ connectionId: request.id, action: 'accept' })}
                    disabled={handleRequest.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRequest.mutate({ connectionId: request.id, action: 'reject' })}
                    disabled={handleRequest.isPending}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {pendingRequests.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No pending friend requests
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
