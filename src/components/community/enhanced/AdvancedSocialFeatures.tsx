
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coffee, MessageCircle, Heart, Filter, UserPlus } from 'lucide-react';

interface ConversationThread {
  id: string;
  title: string;
  participantCount: number;
  lastMessage: string;
  timestamp: string;
  seatArea: string;
}

interface CoffeeBreakBuddy {
  id: string;
  name: string;
  interests: string[];
  availability: 'now' | 'later' | 'offline';
  compatibility: number;
}

export const AdvancedSocialFeatures = () => {
  const [activeFeature, setActiveFeature] = useState<'threads' | 'buddies' | 'filters' | null>(null);
  const [interestFilter, setInterestFilter] = useState<string[]>([]);

  const conversationThreads: ConversationThread[] = [
    {
      id: '1',
      title: 'Best Coffee Brewing Methods',
      participantCount: 5,
      lastMessage: 'French press is definitely superior...',
      timestamp: '2 min ago',
      seatArea: 'Corner Table'
    },
    {
      id: '2', 
      title: 'Startup Ideas Discussion',
      participantCount: 3,
      lastMessage: 'What about AI for coffee shops?',
      timestamp: '5 min ago',
      seatArea: 'Window Seats'
    }
  ];

  const coffeeBreakBuddies: CoffeeBreakBuddy[] = [
    {
      id: '1',
      name: 'Sarah M.',
      interests: ['Design', 'Coffee', 'Travel'],
      availability: 'now',
      compatibility: 92
    },
    {
      id: '2',
      name: 'Alex K.',
      interests: ['Tech', 'Books', 'Music'],
      availability: 'later',
      compatibility: 87
    }
  ];

  const interests = ['Coffee', 'Tech', 'Design', 'Music', 'Books', 'Travel', 'Startup', 'Art'];

  return (
    <div className="space-y-2">
      {/* Feature Selector */}
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={() => setActiveFeature(activeFeature === 'threads' ? null : 'threads')}
          variant={activeFeature === 'threads' ? 'default' : 'outline'}
          size="sm"
          className="text-xs"
        >
          <MessageCircle className="h-3 w-3 mr-1" />
          Conversations
        </Button>
        
        <Button
          onClick={() => setActiveFeature(activeFeature === 'buddies' ? null : 'buddies')}
          variant={activeFeature === 'buddies' ? 'default' : 'outline'}
          size="sm"
          className="text-xs"
        >
          <Coffee className="h-3 w-3 mr-1" />
          Coffee Buddies
        </Button>
        
        <Button
          onClick={() => setActiveFeature(activeFeature === 'filters' ? null : 'filters')}
          variant={activeFeature === 'filters' ? 'default' : 'outline'}
          size="sm"
          className="text-xs"
        >
          <Filter className="h-3 w-3 mr-1" />
          Filters
        </Button>
      </div>

      {/* Feature Panels */}
      {activeFeature === 'threads' && (
        <Card className="w-96 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Active Conversations
            </h3>
            
            <div className="space-y-3">
              {conversationThreads.map((thread) => (
                <div 
                  key={thread.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">{thread.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {thread.participantCount} people
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2">{thread.lastMessage}</p>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{thread.seatArea}</span>
                    <span>{thread.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeFeature === 'buddies' && (
        <Card className="w-96 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Coffee className="h-4 w-4" />
              Coffee Break Buddies
            </h3>
            
            <div className="space-y-3">
              {coffeeBreakBuddies.map((buddy) => (
                <div 
                  key={buddy.id}
                  className="p-3 bg-amber-50 rounded-lg border border-amber-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">{buddy.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={`text-xs ${
                          buddy.availability === 'now' 
                            ? 'bg-green-600 text-white' 
                            : buddy.availability === 'later'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-gray-400 text-white'
                        }`}
                      >
                        {buddy.availability}
                      </Badge>
                      <span className="text-xs text-amber-600 font-medium">
                        {buddy.compatibility}% match
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {buddy.interests.map((interest) => (
                      <Badge key={interest} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    <UserPlus className="h-3 w-3 mr-1" />
                    Start Coffee Chat
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeFeature === 'filters' && (
        <Card className="w-80 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Interest Filters
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <Badge
                  key={interest}
                  variant={interestFilter.includes(interest) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => {
                    setInterestFilter(prev => 
                      prev.includes(interest)
                        ? prev.filter(i => i !== interest)
                        : [...prev, interest]
                    );
                  }}
                >
                  {interest}
                </Badge>
              ))}
            </div>
            
            {interestFilter.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-gray-600 mb-2">
                  Showing seats with: {interestFilter.join(', ')}
                </p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setInterestFilter([])}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
