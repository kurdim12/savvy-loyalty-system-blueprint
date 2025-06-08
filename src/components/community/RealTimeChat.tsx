
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessage {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
}

interface RealTimeChatProps {
  seatArea: string;
  onlineUsers: Array<{ name: string; mood: string; activity: string }>;
}

export const RealTimeChat = ({ seatArea, onlineUsers }: RealTimeChatProps) => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['area-messages', seatArea],
    queryFn: async () => {
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
        .eq('thread_id', `area-${seatArea}`)
        .order('created_at', { ascending: true })
        .limit(50);
      
      if (error) throw error;
      return data as ChatMessage[];
    },
    refetchInterval: 2000,
  });

  useEffect(() => {
    const channel = supabase
      .channel(`area-${seatArea}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      
      if (error) throw error;
    },
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['area-messages', seatArea] });
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

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-[#8B4513]">
          <MessageCircle className="h-5 w-5" />
          Area Chat
          <Badge className="bg-[#8B4513]/10 text-[#8B4513]">
            <Users className="h-3 w-3 mr-1" />
            {onlineUsers.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col h-[300px]">
        <div className="flex-1 overflow-y-auto space-y-2 mb-3">
          {isLoading ? (
            <div className="text-center text-gray-500 py-4">Loading chat...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              Start chatting with people in your area!
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-2 text-sm ${
                    message.user_id === user?.id
                      ? 'bg-[#8B4513] text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="text-xs opacity-75 mb-1">
                    {message.user_id === user?.id ? 'You' : 
                     `${message.profiles?.first_name || 'Anonymous'}`} • {formatTime(message.created_at)}
                  </div>
                  {message.body}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Chat with your area..."
            className="flex-1"
            disabled={!user || sendMessageMutation.isPending}
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || !user || sendMessageMutation.isPending}
            className="bg-[#8B4513] hover:bg-[#8B4513]/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
