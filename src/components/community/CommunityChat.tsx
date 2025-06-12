
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { XPToast } from './XPToast';

interface Message {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
  profiles: {
    first_name: string;
    last_name: string;
  } | null;
}

export const CommunityChat = () => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [showXPToast, setShowXPToast] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Use a fixed thread_id for community chat
  const communityThreadId = 'community-general';

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['community-messages'],
    queryFn: async () => {
      console.log('Fetching community messages');
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          body,
          created_at,
          user_id,
          profiles:user_id (
            first_name,
            last_name
          )
        `)
        .eq('thread_id', communityThreadId)
        .order('created_at', { ascending: true })
        .limit(50);
      
      if (error) {
        console.error('Error fetching community messages:', error);
        throw error;
      }
      
      console.log('Community messages fetched:', data?.length || 0);
      return (data || []) as Message[];
    },
    refetchInterval: 5000,
    enabled: !!user?.id,
  });

  // Real-time subscription for new messages
  useEffect(() => {
    if (!user?.id) return;

    console.log('Setting up community chat real-time subscription');
    
    const channel = supabase
      .channel('community-chat')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `thread_id=eq.${communityThreadId}`
        },
        (payload) => {
          console.log('New community message received:', payload);
          queryClient.invalidateQueries({ queryKey: ['community-messages'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up community chat subscription');
      supabase.removeChannel(channel);
    };
  }, [queryClient, user?.id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      console.log('Sending community message');
      
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          body: messageText,
          user_id: user.id,
          thread_id: communityThreadId
        });
      
      if (messageError) {
        console.error('Error sending community message:', messageError);
        throw messageError;
      }
      
      // Try to award XP points
      try {
        const { data: pointsData, error: pointsError } = await supabase.functions.invoke('earn-points', {
          body: { type: 'chat', points: 1 }
        });
        
        return { pointsData, pointsError };
      } catch (pointsError) {
        console.log('XP function call failed:', pointsError);
        return { pointsData: null, pointsError };
      }
    },
    onSuccess: ({ pointsData, pointsError }) => {
      setNewMessage('');
      
      if (!pointsError && pointsData) {
        setShowXPToast(true);
        console.log('💬 Chat XP earned:', pointsData);
      }
      
      queryClient.invalidateQueries({ queryKey: ['community-messages'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
    onError: (error: any) => {
      console.error('❌ Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    
    sendMessageMutation.mutate(newMessage.trim());
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDisplayName = (message: Message) => {
    if (message.user_id === user?.id) return 'You';
    const profile = message.profiles;
    return profile ? `${profile.first_name} ${profile.last_name}`.trim() : 'Anonymous';
  };

  return (
    <>
      <Card className="w-full h-[400px] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-[#8B4513]">
            <MessageCircle className="h-5 w-5" />
            Community Chat
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col gap-3 p-4">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {isLoading ? (
              <div className="text-center text-[#95A5A6] py-8">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-[#95A5A6] py-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium mb-2">No messages yet</p>
                <p className="text-sm">Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.user_id === user?.id
                        ? 'bg-[#8B4513] text-white'
                        : 'bg-[#95A5A6]/10 text-[#2C3E50]'
                    }`}
                  >
                    <div className="text-xs opacity-75 mb-1">
                      {getDisplayName(message)} • {formatTime(message.created_at)}
                    </div>
                    <div className="text-sm">{message.body}</div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message... (+1 XP per message)"
              className="flex-1 border-[#8B4513]/20 focus:border-[#8B4513]"
              maxLength={500}
              disabled={!user || sendMessageMutation.isPending}
            />
            <Button
              type="submit"
              disabled={!newMessage.trim() || !user || sendMessageMutation.isPending}
              className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white px-4"
            >
              {sendMessageMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
          
          {!user && (
            <div className="text-center text-[#95A5A6] text-sm">
              Please sign in to join the conversation
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* XP Toast */}
      <XPToast
        points={1}
        show={showXPToast}
        onComplete={() => setShowXPToast(false)}
        type="chat"
        position="top-right"
      />
    </>
  );
};
