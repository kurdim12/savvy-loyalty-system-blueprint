
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, Users, Smile, Hash, Wifi } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
  thread_id: string;
  profiles: {
    first_name: string;
    last_name: string;
  } | null;
}

interface RealTimeChatProps {
  seatArea: string;
  onlineUsers: Array<{ name: string; mood: string; activity: string }>;
}

export const RealTimeChat = ({ seatArea, onlineUsers }: RealTimeChatProps) => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [onlineCount, setOnlineCount] = useState(onlineUsers.length);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Create thread_id for area chat - using text format
  const threadId = `area-${seatArea}`;

  // Real-time messages query - fixed to work with text thread_id
  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ['area-messages', seatArea],
    queryFn: async () => {
      try {
        console.log('Fetching messages for thread_id:', threadId);
        
        const { data, error } = await supabase
          .from('messages')
          .select(`
            id,
            body,
            created_at,
            user_id,
            thread_id,
            profiles:user_id (
              first_name,
              last_name
            )
          `)
          .eq('thread_id', threadId)
          .order('created_at', { ascending: true })
          .limit(100);
        
        if (error) {
          console.error('Error fetching messages:', error);
          throw error;
        }
        
        console.log('Messages fetched successfully:', data?.length || 0);
        return (data || []) as ChatMessage[];
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        return [];
      }
    },
    refetchInterval: 2000,
    retry: 3,
    enabled: !!user?.id,
  });

  // Enhanced real-time subscription with presence tracking
  useEffect(() => {
    if (!user?.id) return;

    console.log('Setting up real-time subscription for area:', seatArea);
    setConnectionStatus('connecting');
    
    const channel = supabase
      .channel(`area-chat-${seatArea}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `thread_id=eq.${threadId}`
        },
        (payload) => {
          console.log('New message received:', payload);
          queryClient.invalidateQueries({ queryKey: ['area-messages', seatArea] });
          
          // Show notification for new messages from other users
          if (payload.new.user_id !== user?.id) {
            toast.success('📨 New message in area chat!', {
              duration: 2000,
            });
          }
        }
      )
      .on(
        'presence',
        { event: 'sync' },
        () => {
          const presenceState = channel.presenceState();
          const userCount = Object.keys(presenceState).length;
          setOnlineCount(userCount);
          console.log('Presence sync - users online:', userCount);
        }
      )
      .on(
        'presence',
        { event: 'join' },
        ({ key, newPresences }) => {
          console.log('User joined:', key, newPresences);
          toast.info(`Someone joined the ${seatArea} area`, { duration: 1000 });
        }
      )
      .on(
        'presence',
        { event: 'leave' },
        ({ key, leftPresences }) => {
          console.log('User left:', key, leftPresences);
        }
      )
      .subscribe(async (status) => {
        console.log('Chat subscription status:', status);
        setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 'disconnected');
        
        // Track user presence when connected
        if (status === 'SUBSCRIBED' && user?.id) {
          const presenceData = {
            user_id: user.id,
            online_at: new Date().toISOString(),
            area: seatArea
          };
          
          await channel.track(presenceData);
          console.log('User presence tracked:', presenceData);
        }
      });

    return () => {
      console.log('Cleaning up chat subscription');
      supabase.removeChannel(channel);
    };
  }, [seatArea, queryClient, user?.id, threadId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message mutation - fixed to use text thread_id
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      console.log('Sending message to thread_id:', threadId);
      
      const { error } = await supabase
        .from('messages')
        .insert({
          body: messageText,
          user_id: user.id,
          thread_id: threadId
        });
      
      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }
      
      console.log('Message sent successfully');
    },
    onSuccess: () => {
      setNewMessage('');
      setIsTyping(false);
      toast.success('Message sent!', { duration: 1000 });
      queryClient.invalidateQueries({ queryKey: ['area-messages', seatArea] });
    },
    onError: (error: any) => {
      console.error('Failed to send message:', error);
      if (error.message?.includes('not authenticated')) {
        toast.error('Please sign in to send messages');
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    
    try {
      await sendMessageMutation.mutateAsync(newMessage.trim());
    } catch (error) {
      console.error('Message send failed:', error);
    }
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDisplayName = (message: ChatMessage) => {
    if (message.user_id === user?.id) return 'You';
    if (!message.profiles) return 'Anonymous';
    return `${message.profiles.first_name || ''} ${message.profiles.last_name || ''}`.trim() || 'Anonymous';
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'disconnected': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (!user) {
    return (
      <Card className="h-full flex flex-col bg-white/95 backdrop-blur-sm border-[#8B4513]/20">
        <CardContent className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-2">Sign in to Chat</p>
            <p className="text-sm">Join the conversation with other coffee lovers!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col bg-white/95 backdrop-blur-sm border-[#8B4513]/20">
      <CardHeader className="pb-3 border-b border-[#8B4513]/10">
        <CardTitle className="flex items-center justify-between text-[#8B4513]">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <span>Real-Time Area Chat</span>
            <Badge className="bg-[#8B4513]/10 text-[#8B4513]">
              <Users className="h-3 w-3 mr-1" />
              {onlineCount} online
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className={`w-4 h-4 ${connectionStatus === 'connected' ? 'text-green-500' : connectionStatus === 'connecting' ? 'text-yellow-500' : 'text-red-500'}`} />
            <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'}`} />
            <span className={`text-xs ${getConnectionStatusColor()}`}>
              {connectionStatus}
            </span>
          </div>
        </CardTitle>
        {seatArea && (
          <div className="flex items-center gap-2">
            <Hash className="h-3 w-3 text-gray-500" />
            <Badge variant="outline" className="text-xs border-[#8B4513]/20">
              {seatArea.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Area
            </Badge>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-3 p-4">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 max-h-96">
          {isLoading ? (
            <div className="text-center text-gray-500 py-4">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 animate-pulse" />
              Loading chat...
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="font-medium">Failed to load messages</p>
              <p className="text-sm">Real-time connection issue - trying to reconnect...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-2">No messages yet</p>
              <p className="text-sm">Start chatting with people in your area!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 shadow-sm ${
                    message.user_id === user?.id
                      ? 'bg-[#8B4513] text-white'
                      : 'bg-gray-100 text-gray-900 border border-gray-200'
                  }`}
                >
                  <div className="text-xs opacity-75 mb-1">
                    {getDisplayName(message)} • {formatTime(message.created_at)}
                  </div>
                  <div className="text-sm break-words">{message.body}</div>
                </div>
              </div>
            ))
          )}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-blue-100 text-blue-900 rounded-lg p-3 max-w-[80%] border border-blue-200">
                <div className="text-xs opacity-75 mb-1">You</div>
                <div className="text-sm italic flex items-center gap-1">
                  <Smile className="h-3 w-3" />
                  typing...
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Message Input */}
        <form onSubmit={handleSubmit} className="flex gap-2 border-t border-[#8B4513]/10 pt-3">
          <Input
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Chat with your area..."
            className="flex-1 border-[#8B4513]/20 focus:border-[#8B4513] focus:ring-[#8B4513]/20"
            disabled={sendMessageMutation.isPending || connectionStatus !== 'connected'}
            maxLength={500}
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || sendMessageMutation.isPending || connectionStatus !== 'connected'}
            className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white px-4 shadow-lg"
          >
            {sendMessageMutation.isPending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        
        {connectionStatus === 'disconnected' && (
          <div className="text-center text-red-500 text-sm bg-red-50 p-3 rounded-lg">
            Real-time connection lost. Attempting to reconnect...
          </div>
        )}
      </CardContent>
    </Card>
  );
};
