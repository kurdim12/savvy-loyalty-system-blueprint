
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { MessageSquare, Coffee, Plus, Search } from 'lucide-react';

import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

import { createEvent, createThread, getEvents, getThreads } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

// Define the form schemas
const threadFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  firstMessage: z.string().min(5, 'Message must be at least 5 characters'),
});

const eventFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  body: z.string().min(5, 'Announcement body must be at least 5 characters'),
});

type ThreadFormValues = z.infer<typeof threadFormSchema>;
type EventFormValues = z.infer<typeof eventFormSchema>;

export default function CommunityHome() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("announcements");
  const [isNewThreadDialogOpen, setIsNewThreadDialogOpen] = useState(false);
  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize forms
  const threadForm = useForm<ThreadFormValues>({
    resolver: zodResolver(threadFormSchema),
    defaultValues: {
      title: '',
      firstMessage: '',
    },
  });

  const eventForm = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      body: '',
    },
  });

  // Fetch events (announcements)
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  });

  // Fetch threads
  const { data: threads, isLoading: threadsLoading } = useQuery({
    queryKey: ['threads'],
    queryFn: getThreads,
  });

  // Create a new thread mutation
  const createThreadMutation = useMutation({
    mutationFn: (values: ThreadFormValues) => createThread(values.title, values.firstMessage),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['threads'] });
      setIsNewThreadDialogOpen(false);
      threadForm.reset();
      toast.success("Discussion thread created successfully");
      navigate(`/community/${data.id}`);
    },
    onError: (error: any) => {
      console.error("Error creating thread:", error);
      toast.error(`Error creating thread: ${error.message}`);
    }
  });

  // Create a new announcement mutation
  const createEventMutation = useMutation({
    mutationFn: (values: EventFormValues) => createEvent(values.title, values.body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setIsNewEventDialogOpen(false);
      eventForm.reset();
      toast.success("Announcement created successfully");
    },
    onError: (error: any) => {
      console.error("Error creating announcement:", error);
      toast.error(`Error creating announcement: ${error.message}`);
    }
  });

  const onSubmitThread = (values: ThreadFormValues) => {
    createThreadMutation.mutate(values);
  };

  const onSubmitEvent = (values: EventFormValues) => {
    createEventMutation.mutate(values);
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

  // Filter threads based on search query
  const filteredThreads = threads?.filter(thread => 
    thread.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="container max-w-6xl py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community</h1>
          <p className="text-muted-foreground">
            Connect with other Raw Smith Coffee enthusiasts.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="announcements">
                <Coffee className="mr-2 h-4 w-4" />
                Announcements
              </TabsTrigger>
              <TabsTrigger value="discussions">
                <MessageSquare className="mr-2 h-4 w-4" />
                Discussions
              </TabsTrigger>
            </TabsList>
            
            {activeTab === "discussions" ? (
              <Button 
                onClick={() => user ? setIsNewThreadDialogOpen(true) : toast.error("Please sign in to start a discussion")} 
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Thread
              </Button>
            ) : isAdmin && (
              <Button 
                onClick={() => setIsNewEventDialogOpen(true)} 
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Announcement
              </Button>
            )}
          </div>
          
          <TabsContent value="announcements" className="space-y-4">
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
          
          <TabsContent value="discussions" className="space-y-4">
            <div className="flex mb-4">
              <div className="relative w-full">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search discussions..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {threadsLoading ? (
              <div className="text-center py-8">Loading discussions...</div>
            ) : filteredThreads && filteredThreads.length > 0 ? (
              <div className="grid gap-4">
                {filteredThreads.map(thread => (
                  <Card 
                    key={thread.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => navigate(`/community/${thread.id}`)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{thread.title}</CardTitle>
                      <CardDescription>
                        Started by {thread.user_name} on {formatDate(thread.created_at)}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="text-sm text-muted-foreground pt-0">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {thread.message_count} {thread.message_count === 1 ? 'message' : 'messages'}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  {searchQuery ? 'No threads match your search' : 'No discussion threads yet. Be the first to start one!'}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* New Thread Dialog */}
      <Dialog open={isNewThreadDialogOpen} onOpenChange={setIsNewThreadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start a New Discussion</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={threadForm.handleSubmit(onSubmitThread)} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Discussion Title
              </label>
              <Input
                id="title"
                {...threadForm.register('title')}
                placeholder="What would you like to discuss?"
              />
              {threadForm.formState.errors.title && (
                <p className="text-sm text-red-500 mt-1">{threadForm.formState.errors.title.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="firstMessage" className="block text-sm font-medium mb-1">
                First Message
              </label>
              <Textarea
                id="firstMessage"
                {...threadForm.register('firstMessage')}
                placeholder="Share your thoughts..."
                rows={5}
              />
              {threadForm.formState.errors.firstMessage && (
                <p className="text-sm text-red-500 mt-1">{threadForm.formState.errors.firstMessage.message}</p>
              )}
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
                disabled={createThreadMutation.isPending}
              >
                {createThreadMutation.isPending ? "Creating..." : "Start Discussion"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* New Announcement Dialog */}
      <Dialog open={isNewEventDialogOpen} onOpenChange={setIsNewEventDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Announcement</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={eventForm.handleSubmit(onSubmitEvent)} className="space-y-4">
            <div>
              <label htmlFor="eventTitle" className="block text-sm font-medium mb-1">
                Announcement Title
              </label>
              <Input
                id="eventTitle"
                {...eventForm.register('title')}
                placeholder="Announcement title"
              />
              {eventForm.formState.errors.title && (
                <p className="text-sm text-red-500 mt-1">{eventForm.formState.errors.title.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="eventBody" className="block text-sm font-medium mb-1">
                Announcement Content
              </label>
              <Textarea
                id="eventBody"
                {...eventForm.register('body')}
                placeholder="Share your announcement..."
                rows={5}
              />
              {eventForm.formState.errors.body && (
                <p className="text-sm text-red-500 mt-1">{eventForm.formState.errors.body.message}</p>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsNewEventDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createEventMutation.isPending}
              >
                {createEventMutation.isPending ? "Creating..." : "Post Announcement"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
