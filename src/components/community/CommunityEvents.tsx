
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, MapPin, Plus, Coffee, BookOpen, Music, Code } from 'lucide-react';

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  type: 'workshop' | 'social' | 'study' | 'music' | 'networking';
  date: Date;
  duration: number; // minutes
  space: string;
  maxAttendees: number;
  currentAttendees: number;
  host: string;
  tags: string[];
}

const SAMPLE_EVENTS: CommunityEvent[] = [
  {
    id: '1',
    title: 'React Hooks Deep Dive',
    description: 'Learn advanced React patterns and custom hooks with practical examples',
    type: 'workshop',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    duration: 90,
    space: 'Study Lounge',
    maxAttendees: 15,
    currentAttendees: 8,
    host: 'Sarah Martinez',
    tags: ['React', 'JavaScript', 'Frontend']
  },
  {
    id: '2',
    title: 'Coffee & Code Morning',
    description: 'Casual coding session with fresh coffee and good vibes',
    type: 'social',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
    duration: 120,
    space: 'Main Hall',
    maxAttendees: 25,
    currentAttendees: 12,
    host: 'Alex Chen',
    tags: ['Social', 'Networking', 'Coffee']
  },
  {
    id: '3',
    title: 'Jazz & Chill Session',
    description: 'Relax with smooth jazz while working on personal projects',
    type: 'music',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    duration: 180,
    space: 'Creative Corner',
    maxAttendees: 20,
    currentAttendees: 15,
    host: 'Emma Thompson',
    tags: ['Music', 'Relaxation', 'Creative']
  }
];

export const CommunityEvents = () => {
  const [events, setEvents] = useState<CommunityEvent[]>(SAMPLE_EVENTS);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'today' | 'this-week'>('upcoming');

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'workshop': return <BookOpen className="h-5 w-5" />;
      case 'social': return <Users className="h-5 w-5" />;
      case 'study': return <Coffee className="h-5 w-5" />;
      case 'music': return <Music className="h-5 w-5" />;
      case 'networking': return <Code className="h-5 w-5" />;
      default: return <Calendar className="h-5 w-5" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'bg-blue-100 text-blue-800';
      case 'social': return 'bg-green-100 text-green-800';
      case 'study': return 'bg-purple-100 text-purple-800';
      case 'music': return 'bg-pink-100 text-pink-800';
      case 'networking': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatEventDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const formatEventTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getAttendanceStatus = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage < 50) return { color: 'text-green-600', status: 'Open' };
    if (percentage < 80) return { color: 'text-yellow-600', status: 'Filling up' };
    if (percentage < 100) return { color: 'text-orange-600', status: 'Almost full' };
    return { color: 'text-red-600', status: 'Full' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#8B4513]">Community Events</h2>
          <p className="text-gray-600">Join workshops, socials, and learning sessions</p>
        </div>
        <Button className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Filter Tabs */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            {[
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'today', label: 'Today' },
              { key: 'this-week', label: 'This Week' },
              { key: 'all', label: 'All Events' }
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={filter === tab.key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(tab.key as any)}
                className={filter === tab.key ? 'bg-[#8B4513] text-white' : ''}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="space-y-4">
        {events.map((event) => {
          const attendanceStatus = getAttendanceStatus(event.currentAttendees, event.maxAttendees);
          
          return (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg text-[#8B4513] bg-[#8B4513]/10`}>
                    {getEventIcon(event.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-[#8B4513] mb-1">{event.title}</h3>
                        <p className="text-gray-600 mb-3">{event.description}</p>
                      </div>
                      <Badge className={getEventTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{formatEventDate(event.date)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{formatEventTime(event.date)} ({event.duration}m)</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{event.space}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-gray-600" />
                        <span className={attendanceStatus.color}>
                          {event.currentAttendees}/{event.maxAttendees}
                        </span>
                        <span className="text-gray-500">({attendanceStatus.status})</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600">
                          Hosted by <span className="font-medium text-[#8B4513]">{event.host}</span>
                        </div>
                        
                        <div className="flex gap-1">
                          {event.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Learn More
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white"
                          disabled={event.currentAttendees >= event.maxAttendees}
                        >
                          {event.currentAttendees >= event.maxAttendees ? 'Full' : 'Join Event'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {events.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No events found</h3>
            <p className="text-gray-500 mb-4">Be the first to create an event for the community!</p>
            <Button className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create First Event
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
