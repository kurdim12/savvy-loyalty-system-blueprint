
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Wifi, Clock, Coffee, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface OnlineUser {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  current_mood?: string;
  current_drink?: string;
  last_seen: string;
  area?: string;
  activity?: string;
}

export const RealTimeUserPresence = () => {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  // Fetch real users from profiles table
  const { data: users = [] } = useQuery({
    queryKey: ['online-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, current_mood, current_drink')
        .limit(50);
      
      if (error) throw error;
      return data as OnlineUser[];
    },
    refetchInterval: 10000,
  });

  // Real-time presence tracking
  useEffect(() => {
    if (!user?.id) return;

    console.log('Setting up real-time presence tracking');
    setConnectionStatus('connecting');
    
    const channel = supabase
      .channel('user-presence')
      .on(
        'presence',
        { event: 'sync' },
        () => {
          const presenceState = channel.presenceState();
          const onlineUsersList: OnlineUser[] = [];
          
          Object.entries(presenceState).forEach(([key, presences]) => {
            if (presences && presences.length > 0) {
              const presence = presences[0] as any;
              onlineUsersList.push({
                id: presence.user_id,
                first_name: presence.first_name || 'Anonymous',
                last_name: presence.last_name || '',
                avatar_url: presence.avatar_url,
                current_mood: presence.current_mood,
                current_drink: presence.current_drink,
                last_seen: new Date().toISOString(),
                area: presence.area,
                activity: presence.activity
              });
            }
          });
          
          setOnlineUsers(onlineUsersList);
          console.log('Presence sync - online users:', onlineUsersList.length);
        }
      )
      .on(
        'presence',
        { event: 'join' },
        ({ key, newPresences }) => {
          console.log('User joined presence:', key, newPresences);
        }
      )
      .on(
        'presence',
        { event: 'leave' },
        ({ key, leftPresences }) => {
          console.log('User left presence:', key, leftPresences);
        }
      )
      .subscribe(async (status) => {
        console.log('Presence subscription status:', status);
        setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 'disconnected');
        
        if (status === 'SUBSCRIBED') {
          // Track current user presence
          const userProfile = users.find(u => u.id === user.id);
          const presenceData = {
            user_id: user.id,
            first_name: userProfile?.first_name || 'Anonymous',
            last_name: userProfile?.last_name || '',
            avatar_url: userProfile?.avatar_url,
            current_mood: userProfile?.current_mood,
            current_drink: userProfile?.current_drink,
            online_at: new Date().toISOString(),
            activity: 'browsing community'
          };
          
          await channel.track(presenceData);
          console.log('User presence tracked:', presenceData);
        }
      });

    return () => {
      console.log('Cleaning up presence subscription');
      supabase.removeChannel(channel);
    };
  }, [user?.id, users]);

  const formatLastSeen = (timestamp: string) => {
    const now = new Date();
    const lastSeen = new Date(timestamp);
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ago`;
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-[#8B4513]/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-[#8B4513]">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>Community Members</span>
            <Badge className="bg-[#8B4513]/10 text-[#8B4513]">
              {onlineUsers.length} online
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className={`w-4 h-4 ${connectionStatus === 'connected' ? 'text-green-500' : connectionStatus === 'connecting' ? 'text-yellow-500' : 'text-red-500'}`} />
            <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'}`} />
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3 max-h-64 overflow-y-auto">
        {onlineUsers.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No one else is online right now</p>
          </div>
        ) : (
          onlineUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar_url} alt={user.first_name} />
                <AvatarFallback className="bg-[#8B4513] text-white">
                  {user.first_name?.[0]}{user.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 truncate">
                    {user.first_name} {user.last_name}
                  </p>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {user.current_mood && (
                    <span>{user.current_mood}</span>
                  )}
                  {user.current_drink && (
                    <div className="flex items-center gap-1">
                      <Coffee className="h-3 w-3" />
                      <span>{user.current_drink}</span>
                    </div>
                  )}
                  {user.activity && (
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{user.activity}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{formatLastSeen(user.last_seen)}</span>
                </div>
                {user.area && (
                  <Badge variant="outline" className="text-xs mt-1">
                    {user.area}
                  </Badge>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
