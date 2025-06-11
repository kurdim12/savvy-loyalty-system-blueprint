
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, Users, Plus, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CommunityEvent {
  id: string;
  title: string;
  body: string;
  created_at: string;
  author: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
}

export const EventCalendar = () => {
  const { user } = useAuth();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    body: ''
  });
  const queryClient = useQueryClient();

  // Fetch events (using existing events table)
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['community-events'],
    queryFn: async () => {
      const { data: eventsData, error } = await supabase
        .from('events')
        .select(`
          *,
          profiles:author (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      return eventsData as CommunityEvent[];
    },
  });

  // Create event
  const createEvent = useMutation({
    mutationFn: async (eventData: typeof newEvent) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('events')
        .insert({
          title: eventData.title,
          body: eventData.body,
          author: user.id
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Event created successfully!');
      setNewEvent({
        title: '',
        body: ''
      });
      setShowCreateDialog(false);
      queryClient.invalidateQueries({ queryKey: ['community-events'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create event');
    }
  });

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[#8B4513]">
              <Calendar className="h-5 w-5" />
              Community Events
            </CardTitle>
            
            {user && (
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-[#8B4513] hover:bg-[#8B4513]/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Event Title</label>
                      <Input
                        placeholder="Coffee Cupping Session"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea
                        placeholder="Learn about different coffee origins..."
                        value={newEvent.body}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, body: e.target.value }))}
                      />
                    </div>
                    <Button
                      onClick={() => createEvent.mutate(newEvent)}
                      disabled={createEvent.isPending || !newEvent.title || !newEvent.body}
                      className="w-full bg-[#8B4513] hover:bg-[#8B4513]/90"
                    >
                      {createEvent.isPending ? 'Creating...' : 'Create Event'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Events List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Loading events...</p>
            </CardContent>
          </Card>
        ) : events.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                No events yet. Be the first to create one!
              </p>
            </CardContent>
          </Card>
        ) : (
          events.map((event) => {
            const { date, time } = formatEventDate(event.created_at);
            
            return (
              <Card key={event.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {event.body}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {time}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          by {event.profiles?.first_name || 'Community'} {event.profiles?.last_name || 'Member'}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-600 text-white">Community Event</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
