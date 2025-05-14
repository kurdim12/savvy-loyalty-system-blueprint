
import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ChevronLeft, Send } from 'lucide-react';

import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { getThread, getMessages, sendMessage, subscribeToMessages } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export default function ThreadPage() {
  const { threadId } = useParams<{ threadId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch thread details
  const { data: thread, isLoading: threadLoading } = useQuery({
    queryKey: ['thread', threadId],
    queryFn: () => threadId ? getThread(threadId) : Promise.reject('No thread ID'),
    enabled: !!threadId
  });

  // Fetch messages
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', threadId],
    queryFn: () => threadId ? getMessages(threadId) : Promise.reject('No thread ID'),
    enabled: !!threadId
  });

  // Set up realtime subscription for messages
  useEffect(() => {
    if (!threadId) return;

    const channel = supabase
      .channel(`thread-${threadId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `thread_id=eq.${threadId}`
        },
        payload => {
          queryClient.setQueryData(['messages', threadId], (oldData: any) => {
            // If we don't have the user data yet, we'll refresh the entire messages list
            if (!payload.new.user_name) {
              queryClient.invalidateQueries({ queryKey: ['messages', threadId] });
              return oldData;
            }
            
            return [...(oldData || []), payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [threadId, queryClient]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (messageText: string) => {
      if (!threadId) throw new Error('Thread ID is required');
      return sendMessage(threadId, messageText);
    },
    onError: (error: any) => {
      console.error("Error sending message:", error);
      toast.error(`Error sending message: ${error.message}`);
    }
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    
    sendMessageMutation.mutate(newMessage.trim());
    setNewMessage("");
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <Layout>
      <div className="container max-w-4xl py-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/community">
              <ChevronLeft className="h-4 w-4" />
              Back to Community
            </Link>
          </Button>
        </div>

        {threadLoading ? (
          <div className="text-center py-8">Loading thread...</div>
        ) : thread ? (
          <Card className="h-[calc(100vh-220px)] flex flex-col">
            <CardHeader>
              <CardTitle>{thread.title}</CardTitle>
              <CardDescription>
                Started by {thread.user_name} on {formatDate(thread.created_at)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto">
              {messagesLoading ? (
                <div className="text-center py-8">Loading messages...</div>
              ) : messages && messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map(message => (
                    <div key={message.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{getInitials(message.user_name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <div className="bg-muted rounded-lg p-3">
                          <div className="text-sm font-semibold mb-1">
                            {message.user_name}
                          </div>
                          <div className="text-sm">{message.body}</div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatDate(message.created_at)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="text-center py-8">No messages in this thread yet.</div>
              )}
            </CardContent>
            <CardFooter className="border-t p-3">
              {user ? (
                <form onSubmit={handleSendMessage} className="w-full flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow"
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={!newMessage.trim() || sendMessageMutation.isPending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <div className="w-full text-center text-sm text-muted-foreground">
                  Please sign in to participate in discussions
                </div>
              )}
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              Thread not found or it has been removed.
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
