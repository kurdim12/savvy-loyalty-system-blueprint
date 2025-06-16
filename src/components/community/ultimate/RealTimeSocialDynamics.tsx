
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Heart, MessageCircle, Users, Zap, TrendingUp, Coffee } from 'lucide-react';

interface SocialConnection {
  userId: string;
  name: string;
  connectionStrength: number;
  sharedInterests: string[];
  conversationHistory: number;
  lastInteraction: Date;
  status: 'online' | 'away' | 'offline';
}

interface CommunityMood {
  overall: 'energetic' | 'relaxed' | 'focused' | 'social' | 'creative';
  energy: number;
  socialActivity: number;
  averageStayTime: number;
  popularTopics: string[];
}

interface SocialEvent {
  id: string;
  type: 'conversation_started' | 'group_formed' | 'topic_trending' | 'user_joined' | 'achievement_shared';
  description: string;
  participants: string[];
  timestamp: Date;
  impact: 'low' | 'medium' | 'high';
}

export const RealTimeSocialDynamics = () => {
  const [connections, setConnections] = useState<SocialConnection[]>([
    {
      userId: '1',
      name: 'Alex Chen',
      connectionStrength: 85,
      sharedInterests: ['coffee', 'tech', 'travel'],
      conversationHistory: 12,
      lastInteraction: new Date(Date.now() - 300000),
      status: 'online'
    },
    {
      userId: '2',
      name: 'Sarah Johnson',
      connectionStrength: 92,
      sharedInterests: ['books', 'coffee', 'art'],
      conversationHistory: 8,
      lastInteraction: new Date(Date.now() - 600000),
      status: 'online'
    },
    {
      userId: '3',
      name: 'Marcus Williams',
      connectionStrength: 78,
      sharedInterests: ['music', 'philosophy'],
      conversationHistory: 5,
      lastInteraction: new Date(Date.now() - 1800000),
      status: 'away'
    }
  ]);

  const [communityMood, setCommunityMood] = useState<CommunityMood>({
    overall: 'social',
    energy: 78,
    socialActivity: 85,
    averageStayTime: 45,
    popularTopics: ['weekend plans', 'new coffee blend', 'book recommendations', 'local events']
  });

  const [recentEvents, setRecentEvents] = useState<SocialEvent[]>([
    {
      id: '1',
      type: 'conversation_started',
      description: 'Alex and Sarah started discussing travel photography',
      participants: ['Alex Chen', 'Sarah Johnson'],
      timestamp: new Date(Date.now() - 120000),
      impact: 'medium'
    },
    {
      id: '2',
      type: 'topic_trending',
      description: 'Weekend plans is trending in conversations',
      participants: [],
      timestamp: new Date(Date.now() - 300000),
      impact: 'high'
    },
    {
      id: '3',
      type: 'group_formed',
      description: 'Book club discussion group formed',
      participants: ['Sarah Johnson', 'Emma Davis', 'Tom Wilson'],
      timestamp: new Date(Date.now() - 600000),
      impact: 'high'
    }
  ]);

  const [socialInsights, setSocialInsights] = useState({
    bestTimeToConnect: '2:30 PM - 4:00 PM',
    connectionOpportunities: 3,
    communityRole: 'Conversation Catalyst',
    influenceScore: 245
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Update community mood
      setCommunityMood(prev => ({
        ...prev,
        energy: Math.max(0, Math.min(100, prev.energy + (Math.random() - 0.5) * 10)),
        socialActivity: Math.max(0, Math.min(100, prev.socialActivity + (Math.random() - 0.5) * 15))
      }));

      // Simulate new events
      if (Math.random() > 0.7) {
        const newEvent: SocialEvent = {
          id: Date.now().toString(),
          type: 'conversation_started',
          description: 'New conversation started about coffee brewing techniques',
          participants: ['Random User A', 'Random User B'],
          timestamp: new Date(),
          impact: 'medium'
        };
        setRecentEvents(prev => [newEvent, ...prev.slice(0, 4)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getMoodColor = (mood: string) => {
    const colors = {
      energetic: 'bg-red-100 text-red-800',
      relaxed: 'bg-blue-100 text-blue-800',
      focused: 'bg-purple-100 text-purple-800',
      social: 'bg-green-100 text-green-800',
      creative: 'bg-yellow-100 text-yellow-800'
    };
    return colors[mood as keyof typeof colors] || colors.social;
  };

  const getEventIcon = (type: string) => {
    const icons = {
      conversation_started: MessageCircle,
      group_formed: Users,
      topic_trending: TrendingUp,
      user_joined: Heart,
      achievement_shared: Zap
    };
    return icons[type as keyof typeof icons] || MessageCircle;
  };

  const getConnectionStrengthColor = (strength: number) => {
    if (strength >= 80) return 'text-green-600';
    if (strength >= 60) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="space-y-4">
      {/* Community Pulse */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Community Pulse
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{communityMood.energy}%</div>
              <div className="text-sm text-gray-600">Energy Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{communityMood.socialActivity}%</div>
              <div className="text-sm text-gray-600">Social Activity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{communityMood.averageStayTime}m</div>
              <div className="text-sm text-gray-600">Avg Stay</div>
            </div>
            <div className="text-center">
              <Badge className={getMoodColor(communityMood.overall)}>
                {communityMood.overall}
              </Badge>
              <div className="text-sm text-gray-600 mt-1">Mood</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-800 mb-2">Trending Topics</h4>
            <div className="flex flex-wrap gap-2">
              {communityMood.popularTopics.map((topic, index) => (
                <Badge key={index} variant="outline" className="bg-white">
                  #{topic.replace(' ', '')}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Connections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            Your Connections
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {connections.map(connection => (
            <div key={connection.userId} className="p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {connection.name.charAt(0)}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      connection.status === 'online' ? 'bg-green-500' :
                      connection.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-medium">{connection.name}</h4>
                    <p className="text-sm text-gray-600">{getTimeAgo(connection.lastInteraction)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${getConnectionStrengthColor(connection.connectionStrength)}`}>
                    {connection.connectionStrength}%
                  </div>
                  <div className="text-xs text-gray-500">{connection.conversationHistory} chats</div>
                </div>
              </div>
              
              <div className="mb-2">
                <Progress value={connection.connectionStrength} className="h-2" />
              </div>
              
              <div className="flex flex-wrap gap-1 mb-2">
                {connection.sharedInterests.map((interest, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
              
              <Button size="sm" variant="outline" className="w-full">
                <MessageCircle className="h-3 w-3 mr-1" />
                Continue Chat
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Social Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Social Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="font-semibold text-yellow-800">{socialInsights.connectionOpportunities}</div>
              <div className="text-sm text-yellow-600">New Connection Opportunities</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="font-semibold text-purple-800">{socialInsights.influenceScore}</div>
              <div className="text-sm text-purple-600">Community Influence Score</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Your Community Role</h4>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Crown className="h-3 w-3 mr-1" />
              {socialInsights.communityRole}
            </Badge>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Best Time to Connect</h4>
            <div className="flex items-center gap-2">
              <Coffee className="h-4 w-4 text-amber-600" />
              <span className="text-sm">{socialInsights.bestTimeToConnect}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Live Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentEvents.map(event => {
              const EventIcon = getEventIcon(event.type);
              return (
                <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    event.impact === 'high' ? 'bg-red-100' :
                    event.impact === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    <EventIcon className={`h-4 w-4 ${
                      event.impact === 'high' ? 'text-red-600' :
                      event.impact === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{event.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{getTimeAgo(event.timestamp)}</span>
                      {event.participants.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {event.participants.length} people
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
