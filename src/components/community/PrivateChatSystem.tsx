
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, X, MessageCircle, Users, Coffee } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface PrivateMessage {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
  thread_id: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
}

interface ChatUser {
  id: string;
  name: string;
  mood: string;
  activity: string;
  isOnline: boolean;
  seatArea: string;
}

interface PrivateChatSystemProps {
  currentSeatId: string;
  onClose: () => void;
}

export const PrivateChatSystem = ({ currentSeatId, onClose }: PrivateChatSystemProps) => {
  const { user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [activeChats, setActiveChats] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Mock users in the same seating area
  const nearbyUsers: ChatUser[] = [
    { id: '1', name: 'Sarah M.', mood: '😊', activity: 'Enjoying coffee', isOnline: true, seatArea: currentSeatId },
    { id: '2', name: 'Mike R.', mood: '💻', activity: 'Working', isOnline: true, seatArea: currentSeatId },
    { id: '3', name: 'Emma L.', mood: '📸', activity: 'Photography', isOnline: false, seatArea: currentSeatId },
    { id: '4', name: 'Alex K.', mood: '☕', activity: 'Coffee tasting', isOnline: true, seatArea: currentSeatId },
  ].filter(u => u.id !== user?.id);

  // Generate chat thread ID for two users
  const getChatThreadId = (userId1: string, userId2: string) => {
    return [userId1, userId2].sort().join('-');
  };

  // Fetch private messages for selected chat
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['private-messages', selectedUserId],
    queryFn: async () => {
      if (!selectedUserId || !user?.id) return [];

      const threadId = getChatThreadId(user.id, selectedUserId);
      
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
        .limit(50);
      
      if (error) throw error;
      return (data || []) as PrivateMessage[];
    },
    enabled: !!selectedUserId && !!user?.id,
    refetchInterval: 3000,
  });

  // Real-time subscription for private messages
  useEffect(() => {
    if (!selectedUserId || !user?.id) return;

    const threadId = getChatThreadId(user.id, selectedUserId);
    const channel = supabase
      .channel(`private-chat-${threadId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `thread_id=eq.${threadId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['private-messages', selectedUserId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedUserId, user?.id, queryClient]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send private message
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      if (!user?.id || !selectedUserId) throw new Error('Invalid chat state');
      
      const threadId = getChatThreadId(user.id, selectedUserId);
      
      const { error } = await supabase
        .from('messages')
        .insert({
          body: messageText,
          user_id: user.id,
          thread_id: threadId
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['private-messages', selectedUserId] });
    },
    onError: (error: any) => {
      console.error('Failed to send private message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId) return;
    
    sendMessageMutation.mutate(newMessage.trim());
  };

  const handleStartChat = (userId: string) => {
    setSelectedUserId(userId);
    if (!activeChats.includes(userId)) {
      setActiveChats(prev => [...prev, userId]);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDisplayName = (message: PrivateMessage) => {
    if (message.user_id === user?.id) return 'You';
    const profile = message.profiles;
    return profile ? `${profile.first_name} ${profile.last_name}`.trim() : 'Anonymous';
  };

  const selectedUser = nearbyUsers.find(u => u.id === selectedUserId);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[600px] bg-white/95 backdrop-blur-sm border-[#8B4513]/20 flex">
        {/* Users List */}
        <div className="w-1/3 border-r border-[#8B4513]/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-[#8B4513]">
                <Users className="h-5 w-5" />
                Nearby People
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Badge variant="outline" className="text-xs">
              <Coffee className="h-3 w-3 mr-1" />
              Same seating area
            </Badge>
          </CardHeader>
          
          <CardContent className="space-y-2">
            {nearbyUsers.map((chatUser) => (
              <div
                key={chatUser.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedUserId === chatUser.id
                    ? 'bg-[#8B4513]/10 border border-[#8B4513]/20'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => handleStartChat(chatUser.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10 bg-[#8B4513] text-white">
                      <AvatarFallback>{chatUser.mood}</AvatarFallback>
                    </Avatar>
                    {chatUser.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-[#8B4513]">{chatUser.name}</div>
                    <div className="text-xs text-[#95A5A6]">{chatUser.activity}</div>
                  </div>
                  {activeChats.includes(chatUser.id) && (
                    <MessageCircle className="h-4 w-4 text-[#8B4513]" />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-[#8B4513]">
                  <Avatar className="h-8 w-8 bg-[#8B4513] text-white">
                    <AvatarFallback>{selectedUser.mood}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-lg">{selectedUser.name}</div>
                    <div className="text-sm font-normal text-[#95A5A6]">{selectedUser.activity}</div>
                  </div>
                  {selectedUser.isOnline && (
                    <Badge className="bg-green-500 text-white text-xs">Online</Badge>
                  )}
                </CardTitle>
              </CardHeader>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 space-y-3">
                {isLoading ? (
                  <div className="text-center text-[#95A5A6] py-8">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-[#95A5A6] py-8">
                    Start your conversation with {selectedUser.name}!
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
                            : 'bg-gray-100 text-[#2C3E50]'
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
              <div className="p-4 border-t border-[#8B4513]/20">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Message ${selectedUser.name}...`}
                    className="flex-1 border-[#8B4513]/20 focus:border-[#8B4513]"
                    maxLength={500}
                    disabled={sendMessageMutation.isPending}
                  />
                  <Button
                    type="submit"
                    disabled={!newMessage.trim() || sendMessageMutation.isPending}
                    className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white px-4"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-[#95A5A6]">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Select someone to chat with</h3>
                <p className="text-sm">Choose a person from the nearby list to start a private conversation</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
