
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, Users, Plus, MapPin, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CafeEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
  duration_minutes: number;
  max_attendees: number;
  created_by: string;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
  attendeeCount?: number;
  isAttending?: boolean;
}

export const EventCalendar = () => {
  const { user } = useAuth();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    eventDate: '',
    durationMinutes: 60,
    maxAttendees: 10
  });
  const queryClient = useQueryClient();

  // Fetch upcoming events
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['cafe-events', user?.id],
    queryFn: async () => {
      const { data: eventsData, error } = await supabase
        .from('cafe_events')
        .select(`
          *,
          profiles:created_by (
            first_name,
            last_name
          )
        `)
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true });
      
      if (error) throw error;
      
      if (!user?.id) return eventsData;

      // Get attendee counts and check if user is attending
      const eventIds = eventsData.map(e => e.id);
      const { data: attendees } = await supabase
        .from('event_attendees')
        .select('event_id, user_id')
        .in('event_id', eventIds);
      
      const attendeeCounts = attendees?.reduce((acc, a) => {
        acc[a.event_id] = (acc[a.event_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};
      
      const userAttending = new Set(
        attendees?.filter(a => a.user_id === user.id).map(a => a.event_id) || []
      );
      
      return eventsData.map(event => ({
        ...event,
        attendeeCount: attendeeCounts[event.id] || 0,
        isAttending: userAttending.has(event.id)
      })) as CafeEvent[];
    },
  });

  // Create event
  const createEvent = useMutation({
    mutationFn: async (eventData: typeof newEvent) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('cafe_events')
        .insert({
          title: eventData.title,
          description: eventData.description,
          event_date: eventData.eventDate,
          duration_minutes: eventData.durationMinutes,
          max_attendees: eventData.maxAttendees,
          created_by: user.id
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Event created successfully!');
      setNewEvent({
        title: '',
        description: '',
        eventDate: '',
        durationMinutes: 60,
        maxAttendees: 10
      });
      setShowCreateDialog(false);
      queryClient.invalidateQueries({ queryKey: ['cafe-events'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create event');
    }
  });

  // Join/leave event
  const toggleAttendance = useMutation({
    mutationFn: async ({ eventId, isAttending }: { eventId: string; isAttending: boolean }) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      if (isAttending) {
        const { error } = await supabase
          .from('event_attendees')
          .delete()
          .eq('event_id', eventId)
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('event_attendees')
          .insert({
            event_id: eventId,
            user_id: user.id
          });
        
        if (error) throw error;
      }
    },
    onSuccess: (_, { isAttending }) => {
      toast.success(isAttending ? 'Left event' : 'Joined event!');
      queryClient.invalidateQueries({ queryKey: ['cafe-events'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update attendance');
    }
  });

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const isEventFull = (event: CafeEvent) => {
    return event.attendeeCount >= event.max_attendees;
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
                        value={newEvent.description}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Date & Time</label>
                      <Input
                        type="datetime-local"
                        value={newEvent.eventDate}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, eventDate: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                        <Input
                          type="number"
                          value={newEvent.durationMinutes}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, durationMinutes: parseInt(e.target.value) || 60 }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Max Attendees</label>
                        <Input
                          type="number"
                          value={newEvent.maxAttendees}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, maxAttendees: parseInt(e.target.value) || 10 }))}
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => createEvent.mutate(newEvent)}
                      disabled={createEvent.isPending || !newEvent.title || !newEvent.eventDate}
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
                No upcoming events. Be the first to create one!
              </p>
            </CardContent>
          </Card>
        ) : (
          events.map((event) => {
            const { date, time } = formatEventDate(event.event_date);
            const isFull = isEventFull(event);
            
            return (
              <Card key={event.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {event.description}
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
                          {time} ({event.duration_minutes}min)
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {event.attendeeCount}/{event.max_attendees} attending
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          by {event.profiles.first_name} {event.profiles.last_name}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isFull && (
                          <Badge variant="destructive">Full</Badge>
                        )}
                        {event.isAttending && (
                          <Badge className="bg-green-600 text-white">Attending</Badge>
                        )}
                      </div>
                    </div>
                    
                    {user && (
                      <div className="ml-4">
                        <Button
                          variant={event.isAttending ? 'outline' : 'default'}
                          onClick={() => toggleAttendance.mutate({ 
                            eventId: event.id, 
                            isAttending: event.isAttending || false 
                          })}
                          disabled={toggleAttendance.isPending || (!event.isAttending && isFull)}
                          className={!event.isAttending ? 'bg-[#8B4513] hover:bg-[#8B4513]/90' : ''}
                        >
                          {event.isAttending ? 'Leave Event' : 'Join Event'}
                        </Button>
                      </div>
                    )}
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
