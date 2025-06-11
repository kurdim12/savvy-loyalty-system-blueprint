
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, MessageCircle, Coffee, Star, Users, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ActivityItem {
  id: string;
  type: 'message' | 'challenge' | 'reward' | 'join' | 'order';
  user_name: string;
  description: string;
  timestamp: string;
  area?: string;
  points?: number;
}

export const RealTimeActivityFeed = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  // Fetch recent activities
  const { data: recentMessages } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          body,
          created_at,
          thread_id,
          profiles:user_id (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Real-time subscription for new activities
  useEffect(() => {
    console.log('Setting up real-time activity feed');
    
    const messageChannel = supabase
      .channel('activity-feed-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('New message activity:', payload);
          
          const newActivity: ActivityItem = {
            id: payload.new.id,
            type: 'message',
            user_name: 'Someone',
            description: 'sent a message',
            timestamp: payload.new.created_at,
            area: payload.new.thread_id?.includes('area-') ? 
              payload.new.thread_id.replace('area-', '').replace('-', ' ') : 
              'community'
          };
          
          setActivities(prev => [newActivity, ...prev.slice(0, 19)]);
          queryClient.invalidateQueries({ queryKey: ['recent-activities'] });
        }
      )
      .subscribe();

    const challengeChannel = supabase
      .channel('activity-feed-challenges')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'challenge_participants'
        },
        (payload) => {
          console.log('New challenge activity:', payload);
          
          const newActivity: ActivityItem = {
            id: payload.new.id,
            type: 'challenge',
            user_name: 'Someone',
            description: 'completed a challenge',
            timestamp: payload.new.created_at,
            points: 50
          };
          
          setActivities(prev => [newActivity, ...prev.slice(0, 19)]);
        }
      )
      .subscribe();

    const transactionChannel = supabase
      .channel('activity-feed-transactions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions'
        },
        (payload) => {
          console.log('New transaction activity:', payload);
          
          const newActivity: ActivityItem = {
            id: payload.new.id,
            type: payload.new.transaction_type === 'redemption' ? 'reward' : 'order',
            user_name: 'Someone',
            description: payload.new.transaction_type === 'redemption' ? 
              'redeemed a reward' : 'earned points',
            timestamp: payload.new.created_at,
            points: Math.abs(payload.new.points)
          };
          
          setActivities(prev => [newActivity, ...prev.slice(0, 19)]);
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up activity feed subscriptions');
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(challengeChannel);
      supabase.removeChannel(transactionChannel);
    };
  }, [queryClient]);

  // Convert messages to activities
  useEffect(() => {
    if (recentMessages) {
      const messageActivities: ActivityItem[] = recentMessages.map(msg => ({
        id: msg.id,
        type: 'message' as const,
        user_name: msg.profiles ? 
          `${msg.profiles.first_name} ${msg.profiles.last_name}`.trim() || 'Anonymous' : 
          'Anonymous',
        description: msg.body.length > 30 ? 
          `"${msg.body.substring(0, 30)}..."` : 
          `"${msg.body}"`,
        timestamp: msg.created_at,
        area: msg.thread_id?.includes('area-') ? 
          msg.thread_id.replace('area-', '').replace('-', ' ') : 
          'community'
      }));
      
      setActivities(prev => {
        // Merge and deduplicate activities
        const existing = prev.filter(a => a.type !== 'message');
        const combined = [...existing, ...messageActivities];
        return combined
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 20);
      });
    }
  }, [recentMessages]);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'message': return <MessageCircle className="h-4 w-4 text-blue-600" />;
      case 'challenge': return <Trophy className="h-4 w-4 text-purple-600" />;
      case 'reward': return <Star className="h-4 w-4 text-yellow-600" />;
      case 'join': return <Users className="h-4 w-4 text-green-600" />;
      case 'order': return <Coffee className="h-4 w-4 text-orange-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-[#8B4513]/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-[#8B4513]">
          <Activity className="h-5 w-5" />
          <span>Live Activity Feed</span>
          <Badge className="bg-green-500 text-white animate-pulse">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {activities.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No recent activity</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user_name}</span>
                      {' '}
                      <span>{activity.description}</span>
                    </p>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                      
                      {activity.area && (
                        <Badge variant="outline" className="text-xs">
                          {activity.area}
                        </Badge>
                      )}
                      
                      {activity.points && (
                        <Badge className="text-xs bg-[#8B4513] text-white">
                          +{activity.points} pts
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
