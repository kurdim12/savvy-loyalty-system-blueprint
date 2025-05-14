
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { MessageSquare, Coffee, Plus, Send } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  body: string;
  created_at: string;
  author_name?: string;
}

interface Thread {
  id: string;
  title: string;
  created_at: string;
  user_id: string;
  user_name?: string;
  message_count?: number;
}

interface Message {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
  user_name?: string;
}

const CommunityPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("events");
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [isNewThreadDialogOpen, setIsNewThreadDialogOpen] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadFirstMessage, setNewThreadFirstMessage] = useState("");
  const [newMessage, setNewMessage] = useState("");

  // Fetch events
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          id,
          title,
          body,
          created_at,
          author,
          profiles:author (first_name, last_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Format data
      return data.map(event => ({
        ...event,
        author_name: event.profiles ? 
          `${event.profiles.first_name || ''} ${event.profiles.last_name || ''}`.trim() : 
          'Admin'
      }));
    }
  });

  // Fetch threads
  const { data: threads, isLoading: threadsLoading } = useQuery({
    queryKey: ['threads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('threads')
        .select(`
          id,
          title,
          created_at,
          user_id,
          profiles:user_id (first_name, last_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Get message counts for each thread
      const messagesPromises = data.map(async (thread) => {
        const { count, error: countError } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('thread_id', thread.id);
          
        return {
          ...thread,
          user_name: thread.profiles ? 
            `${thread.profiles.first_name || ''} ${thread.profiles.last_name || ''}`.trim() : 
            'Anonymous',
          message_count: count || 0
        };
      });
      
      return Promise.all(messagesPromises);
    }
  });

  // Fetch messages for the selected thread
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', selectedThread?.id],
    queryFn: async () => {
      if (!selectedThread) return [];
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          body,
          created_at,
          user_id,
          profiles:user_id (first_name, last_name)
        `)
        .eq('thread_id', selectedThread.id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      return data.map(message => ({
        ...message,
        user_name: message.profiles ? 
          `${message.profiles.first_name || ''} ${message.profiles.last_name || ''}`.trim() : 
          'Anonymous'
      }));
    },
    enabled: !!selectedThread
  });

  // Create a new thread mutation
  const createThreadMutation = useMutation({
    mutationFn: async ({ title, firstMessage }: { title: string; firstMessage: string }) => {
      if (!user) throw new Error("You must be logged in");
      
      // First create the thread
      const { data: threadData, error: threadError } = await supabase
        .from('threads')
        .insert({ 
          title, 
          user_id: user.id 
        })
        .select()
        .single();
      
      if (threadError) throw threadError;
      
      // Then add the first message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({ 
          body: firstMessage, 
          thread_id: threadData.id,
          user_id: user.id
        });
      
      if (messageError) throw messageError;
      
      return threadData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threads'] });
      setIsNewThreadDialogOpen(false);
      setNewThreadTitle("");
      setNewThreadFirstMessage("");
      toast.success("Discussion thread created successfully");
    },
    onError: (error: any) => {
      toast.error(`Error creating thread: ${error.message}`);
    }
  });

  // Add message to thread mutation
  const addMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!user || !selectedThread) throw new Error("You must be logged in and have a thread selected");
      
      const { error } = await supabase
        .from('messages')
        .insert({ 
          body: message, 
          thread_id: selectedThread.id,
          user_id: user.id
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', selectedThread?.id] });
      setNewMessage("");
    },
    onError: (error: any) => {
      toast.error(`Error sending message: ${error.message}`);
    }
  });

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadTitle.trim() || !newThreadFirstMessage.trim()) {
      toast.error("Please provide both a title and a message");
      return;
    }
    
    createThreadMutation.mutate({ 
      title: newThreadTitle.trim(), 
      firstMessage: newThreadFirstMessage.trim() 
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    addMessageMutation.mutate(newMessage.trim());
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

  return (
    <Layout>
      <div className="container max-w-6xl py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community</h1>
          <p className="text-muted-foreground">
            Stay connected with the Raw Smith Coffee community.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="events">
                <Coffee className="mr-2 h-4 w-4" />
                Announcements
              </TabsTrigger>
              <TabsTrigger value="discussions">
                <MessageSquare className="mr-2 h-4 w-4" />
                Discussions
              </TabsTrigger>
            </TabsList>
            
            {activeTab === "discussions" && user && (
              <Button 
                onClick={() => setIsNewThreadDialogOpen(true)} 
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Thread
              </Button>
            )}
          </div>
          
          <TabsContent value="events" className="space-y-4">
            {eventsLoading ? (
              <div className="text-center py-8">Loading announcements...</div>
            ) : events && events.length > 0 ? (
              events.map(event => (
                <Card key={event.id}>
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>
                      Posted by {event.author_name} on {formatDate(event.created_at)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm">
                      <p>{event.body}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  No announcements yet. Check back later!
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="discussions">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Community Threads</CardTitle>
                    <CardDescription>
                      Join the conversation with other coffee lovers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    {threadsLoading ? (
                      <div className="text-center py-8">Loading threads...</div>
                    ) : threads && threads.length > 0 ? (
                      <div className="divide-y">
                        {threads.map(thread => (
                          <div 
                            key={thread.id}
                            onClick={() => setSelectedThread(thread)}
                            className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                              selectedThread?.id === thread.id ? 'bg-muted' : ''
                            }`}
                          >
                            <h3 className="font-medium">{thread.title}</h3>
                            <div className="text-sm text-muted-foreground">
                              By {thread.user_name} • {formatDate(thread.created_at)}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {thread.message_count} {thread.message_count === 1 ? 'message' : 'messages'}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        No discussion threads yet. Start a new one!
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                {selectedThread ? (
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <CardTitle>{selectedThread.title}</CardTitle>
                      <CardDescription>
                        Started by {selectedThread.user_name} on {formatDate(selectedThread.created_at)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-auto">
                      {messagesLoading ? (
                        <div className="text-center py-8">Loading messages...</div>
                      ) : messages && messages.length > 0 ? (
                        <div className="space-y-4">
                          {messages.map(message => (
                            <div key={message.id} className="flex flex-col">
                              <div className="bg-muted rounded-lg p-3">
                                <div className="text-sm font-semibold mb-1">
                                  {message.user_name}
                                </div>
                                <div>{message.body}</div>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {formatDate(message.created_at)}
                              </div>
                            </div>
                          ))}
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
                            size="sm" 
                            disabled={!newMessage.trim() || addMessageMutation.isPending}
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
                  <Card className="h-full flex items-center justify-center">
                    <CardContent className="text-center py-12">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">Select a thread</h3>
                      <p className="text-muted-foreground mt-1">
                        Choose a discussion thread from the list to join the conversation
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* New Thread Dialog */}
      <Dialog open={isNewThreadDialogOpen} onOpenChange={setIsNewThreadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start a New Discussion</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleCreateThread} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Discussion Title
              </label>
              <Input
                id="title"
                value={newThreadTitle}
                onChange={(e) => setNewThreadTitle(e.target.value)}
                placeholder="What would you like to discuss?"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                First Message
              </label>
              <Textarea
                id="message"
                value={newThreadFirstMessage}
                onChange={(e) => setNewThreadFirstMessage(e.target.value)}
                placeholder="Share your thoughts..."
                rows={5}
                required
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsNewThreadDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createThreadMutation.isPending || !newThreadTitle.trim() || !newThreadFirstMessage.trim()}
              >
                {createThreadMutation.isPending ? "Creating..." : "Start Discussion"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default CommunityPage;
