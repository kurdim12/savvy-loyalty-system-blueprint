
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Search, UserPlus, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ConnectionProfile {
  first_name: string;
  last_name: string;
  avatar_url?: string;
}

interface Connection {
  id: string;
  user_id: string;
  connected_user_id: string;
  connection_type: string;
  first_met_at: string;
  profiles: ConnectionProfile;
}

interface SearchProfile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
}

export const FriendsSystem = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'search'>('friends');
  const queryClient = useQueryClient();

  // Fetch user's connections with proper error handling
  const { data: connections = [], isLoading: connectionsLoading } = useQuery({
    queryKey: ['connections', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      console.log('Fetching connections for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_connections')
        .select(`
          id,
          user_id,
          connected_user_id,
          connection_type,
          first_met_at,
          profiles!user_connections_connected_user_id_fkey (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('user_id', user.id)
        .eq('connection_type', 'friend');
      
      if (error) {
        console.error('Error fetching connections:', error);
        toast.error('Failed to load friends list');
        return [];
      }
      
      console.log('Connections fetched:', data?.length || 0);
      return (data || []) as Connection[];
    },
    enabled: !!user?.id,
  });

  // Search users with improved logic
  const { data: searchResults = [], isLoading: searchLoading } = useQuery({
    queryKey: ['user-search', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim() || !user?.id) return [];
      
      console.log('Searching for users with query:', searchQuery);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .neq('id', user.id)
        .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`)
        .limit(10);
      
      if (error) {
        console.error('Error searching users:', error);
        return [];
      }
      
      // Filter out users who are already connected
      const connectedUserIds = connections.map(c => c.connected_user_id);
      const filteredResults = (data || []).filter(profile => !connectedUserIds.includes(profile.id));
      
      console.log('Search results:', filteredResults.length);
      return filteredResults as SearchProfile[];
    },
    enabled: !!searchQuery.trim() && !!user?.id,
  });

  // Add connection with proper error handling
  const addConnection = useMutation({
    mutationFn: async (targetUserId: string) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      console.log('Adding connection between', user.id, 'and', targetUserId);
      
      const { error } = await supabase
        .from('user_connections')
        .insert({
          user_id: user.id,
          connected_user_id: targetUserId,
          connection_type: 'friend',
          first_met_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error adding connection:', error);
        throw error;
      }
      
      console.log('Connection added successfully');
    },
    onSuccess: () => {
      toast.success('Friend added!');
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      queryClient.invalidateQueries({ queryKey: ['user-search'] });
    },
    onError: (error: any) => {
      console.error('Failed to add friend:', error);
      toast.error('Failed to add friend. Please try again.');
    }
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium mb-2">Sign in to Connect</p>
          <p className="text-sm text-muted-foreground">
            Join the community to find and connect with other coffee lovers!
          </p>
        </CardContent>
      </Card>
    );
  }

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
              {searchLoading && searchQuery && (
                <div className="text-center text-muted-foreground py-4">
                  <Search className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                  Searching...
                </div>
              )}
              
              {!searchLoading && searchResults.map((profile) => (
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
                    onClick={() => addConnection.mutate(profile.id)}
                    disabled={addConnection.isPending}
                    className="bg-[#8B4513] hover:bg-[#8B4513]/90"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    {addConnection.isPending ? 'Adding...' : 'Add Friend'}
                  </Button>
                </div>
              ))}
              
              {searchQuery && !searchLoading && searchResults.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No users found matching "{searchQuery}"
                </p>
              )}
              
              {!searchQuery && (
                <p className="text-center text-muted-foreground py-4">
                  Type a name to search for coffee lovers
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="space-y-2">
            {connectionsLoading ? (
              <div className="text-center text-muted-foreground py-4">
                <Users className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                Loading friends...
              </div>
            ) : connections.length > 0 ? (
              connections.map((connection) => (
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
                        Friends since {new Date(connection.first_met_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Chat
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No friends yet. Use the search tab to find coffee lovers to connect with!
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
