
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, Users, Smile } from 'lucide-react';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ['area-messages', seatArea],
    queryFn: async () => {
      try {
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
          .eq('thread_id', `area-${seatArea}`)
          .order('created_at', { ascending: true })
          .limit(50);
        
        if (error) {
          console.error('Error fetching messages:', error);
          throw error;
        }
        
        return (data || []) as ChatMessage[];
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        return [];
      }
    },
    refetchInterval: 3000,
    retry: 3,
  });

  // Real-time subscription for new messages
  useEffect(() => {
    const channel = supabase
      .channel(`area-chat-${seatArea}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `thread_id=eq.area-${seatArea}`
        },
        (payload) => {
          console.log('New message received:', payload);
          queryClient.invalidateQueries({ queryKey: ['area-messages', seatArea] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `thread_id=eq.area-${seatArea}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['area-messages', seatArea] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [seatArea, queryClient]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message mutation with better error handling
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('messages')
        .insert({
          body: messageText,
          user_id: user.id,
          thread_id: `area-${seatArea}`
        });
      
      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    },
    onSuccess: () => {
      setNewMessage('');
      setIsTyping(false);
      queryClient.invalidateQueries({ queryKey: ['area-messages', seatArea] });
    },
    onError: (error: any) => {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
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

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-[#8B4513]">
          <MessageCircle className="h-5 w-5" />
          Area Chat
          <Badge className="bg-[#8B4513]/10 text-[#8B4513]">
            <Users className="h-3 w-3 mr-1" />
            {onlineUsers.length}
          </Badge>
        </CardTitle>
        {seatArea && (
          <Badge variant="outline" className="text-xs w-fit">
            {seatArea.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Area
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-3 p-4">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {isLoading ? (
            <div className="text-center text-gray-500 py-4">Loading chat...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">
              Failed to load messages. Please try refreshing.
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No messages yet. Start chatting with people in your area!
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
                      : 'bg-gray-100 text-gray-900'
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
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 rounded-lg p-3 max-w-[80%]">
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
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Chat with your area..."
            className="flex-1 border-[#8B4513]/20 focus:border-[#8B4513]"
            disabled={!user || sendMessageMutation.isPending}
            maxLength={500}
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || !user || sendMessageMutation.isPending}
            className="bg-[#8B4513] hover:bg-[#8B4513]/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        
        {!user && (
          <div className="text-center text-gray-500 text-sm">
            Please sign in to join the conversation
          </div>
        )}
      </CardContent>
    </Card>
  );
};
