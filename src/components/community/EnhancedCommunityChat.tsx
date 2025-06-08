
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, Smile, Heart, ThumbsUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Message {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
  table_id?: string;
  reactions?: { [key: string]: string[] };
  profiles: {
    first_name: string;
    last_name: string;
  };
}

interface EnhancedCommunityChatProps {
  tableId?: string;
  title?: string;
}

export const EnhancedCommunityChat = ({ tableId, title = "Community Chat" }: EnhancedCommunityChatProps) => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const coffeeReactions = [
    { emoji: '☕', name: 'coffee' },
    { emoji: '🫖', name: 'tea' },
    { emoji: '🥐', name: 'croissant' },
    { emoji: '❤️', name: 'love' },
    { emoji: '👍', name: 'thumbs_up' },
    { emoji: '😂', name: 'laugh' },
    { emoji: '🔥', name: 'fire' },
    { emoji: '✨', name: 'sparkles' }
  ];

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['community-messages', tableId],
    queryFn: async () => {
      let query = supabase
        .from('messages')
        .select(`
          id,
          body,
          created_at,
          user_id,
          table_id,
          reactions,
          profiles:user_id (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: true })
        .limit(50);

      if (tableId) {
        query = query.eq('table_id', tableId);
      } else {
        query = query.is('table_id', null);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Message[];
    },
    refetchInterval: 3000,
  });

  // Real-time subscription for new messages and typing
  useEffect(() => {
    const channel = supabase
      .channel(`community-chat-${tableId || 'general'}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['community-messages', tableId] });
        }
      )
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const typing = Object.values(newState).flat().filter((user: any) => user.typing);
        setTypingUsers(typing.map((user: any) => user.user_id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, tableId]);

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
          table_id: tableId || null
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['community-messages', tableId] });
    },
    onError: (error: any) => {
      console.error('❌ Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  });

  const addReactionMutation = useMutation({
    mutationFn: async ({ messageId, reaction }: { messageId: string; reaction: string }) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      // This would need a proper reactions table in a real implementation
      // For now, we'll just log the reaction
      console.log('Adding reaction:', { messageId, reaction, userId: user.id });
    },
    onSuccess: () => {
      setShowReactions(null);
      // In a real implementation, would update the message reactions
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    
    sendMessageMutation.mutate(newMessage.trim());
  };

  const handleTyping = () => {
    // Implement typing indicator logic
    if (user) {
      const channel = supabase.channel(`community-chat-${tableId || 'general'}`);
      channel.track({ user_id: user.id, typing: true });
      
      // Clear typing after 3 seconds
      setTimeout(() => {
        channel.track({ user_id: user.id, typing: false });
      }, 3000);
    }
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

  const getReactionCount = (message: Message, reaction: string) => {
    return message.reactions?.[reaction]?.length || 0;
  };

  return (
    <Card className="w-full h-[500px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-[#8B4513]">
          <MessageCircle className="h-5 w-5" />
          {title}
          {tableId && (
            <Badge variant="outline" className="text-xs">
              Table Chat
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-3 p-4">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {isLoading ? (
            <div className="text-center text-[#95A5A6] py-8">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-[#95A5A6] py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 relative group ${
                    message.user_id === user?.id
                      ? 'bg-[#8B4513] text-white'
                      : 'bg-[#95A5A6]/10 text-[#2C3E50]'
                  }`}
                >
                  <div className="text-xs opacity-75 mb-1">
                    {getDisplayName(message)} • {formatTime(message.created_at)}
                  </div>
                  <div className="text-sm mb-2">{message.body}</div>
                  
                  {/* Reactions */}
                  <div className="flex flex-wrap gap-1 mb-1">
                    {coffeeReactions.map(({ emoji, name }) => {
                      const count = getReactionCount(message, name);
                      if (count === 0) return null;
                      
                      return (
                        <Badge
                          key={name}
                          variant="outline"
                          className="text-xs cursor-pointer hover:bg-[#8B4513]/10"
                          onClick={() => addReactionMutation.mutate({ messageId: message.id, reaction: name })}
                        >
                          {emoji} {count}
                        </Badge>
                      );
                    })}
                  </div>
                  
                  {/* Reaction Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -bottom-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-[#8B4513]/20 hover:bg-[#8B4513]/10"
                    onClick={() => setShowReactions(showReactions === message.id ? null : message.id)}
                  >
                    <Smile className="h-3 w-3" />
                  </Button>
                  
                  {/* Reaction Picker */}
                  {showReactions === message.id && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-[#8B4513]/20 rounded-lg p-2 shadow-lg z-10">
                      <div className="flex gap-1">
                        {coffeeReactions.slice(0, 6).map(({ emoji, name }) => (
                          <Button
                            key={name}
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0 hover:bg-[#8B4513]/10"
                            onClick={() => addReactionMutation.mutate({ messageId: message.id, reaction: name })}
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          
          {/* Typing Indicators */}
          {typingUsers.length > 0 && (
            <div className="flex justify-start">
              <div className="bg-[#95A5A6]/10 text-[#95A5A6] rounded-lg p-2 text-sm italic">
                {typingUsers.length === 1 ? 'Someone is' : `${typingUsers.length} people are`} typing...
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
            placeholder={`Type your message...${tableId ? ' (table chat)' : ''}`}
            className="flex-1 border-[#8B4513]/20 focus:border-[#8B4513]"
            maxLength={500}
            disabled={!user || sendMessageMutation.isPending}
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || !user || sendMessageMutation.isPending}
            className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white px-4"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        
        {!user && (
          <div className="text-center text-[#95A5A6] text-sm">
            Please sign in to join the conversation
          </div>
        )}
      </CardContent>
    </Card>
  );
};
