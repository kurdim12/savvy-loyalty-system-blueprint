
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Users, Coffee, Laptop, BookOpen, Heart, Music, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  seatId: string;
  purpose: string;
}

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  memberCount: number;
}

const CHAT_ROOMS: ChatRoom[] = [
  {
    id: 'work',
    name: 'Work & Study Zone',
    description: 'For people working or studying',
    icon: <Laptop className="h-4 w-4" />,
    color: 'bg-blue-500',
    memberCount: 5
  },
  {
    id: 'social',
    name: 'Social Hub',
    description: 'Meet new people and chat',
    icon: <Users className="h-4 w-4" />,
    color: 'bg-green-500',
    memberCount: 8
  },
  {
    id: 'relax',
    name: 'Chill Lounge',
    description: 'Relaxing and unwinding',
    icon: <Heart className="h-4 w-4" />,
    color: 'bg-purple-500',
    memberCount: 3
  },
  {
    id: 'read',
    name: 'Reading Corner',
    description: 'Book lovers and quiet discussions',
    icon: <BookOpen className="h-4 w-4" />,
    color: 'bg-orange-500',
    memberCount: 2
  },
  {
    id: 'coffee',
    name: 'Coffee Enthusiasts',
    description: 'Discuss coffee and café culture',
    icon: <Coffee className="h-4 w-4" />,
    color: 'bg-amber-600',
    memberCount: 4
  },
  {
    id: 'music',
    name: 'Music Lovers',
    description: 'Share and discuss music',
    icon: <Music className="h-4 w-4" />,
    color: 'bg-pink-500',
    memberCount: 6
  }
];

export const PhysicalCafeChat = () => {
  const { user } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState<string>('social');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Sarah M.',
      message: 'Anyone here working on JavaScript? Could use some help with React hooks!',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      seatId: 'T1',
      purpose: 'work'
    },
    {
      id: '2',
      userId: '2',
      userName: 'Alex K.',
      message: 'Hey! I\'m at table T4 if anyone wants to chat about coffee brewing methods 😊',
      timestamp: new Date(Date.now() - 240000).toISOString(),
      seatId: 'T4',
      purpose: 'social'
    },
    {
      id: '3',
      userId: '3',
      userName: 'Emma L.',
      message: 'This book recommendation is amazing! Anyone else reading "The Coffee Art"?',
      timestamp: new Date(Date.now() - 180000).toISOString(),
      seatId: 'B2',
      purpose: 'read'
    },
    {
      id: '4',
      userId: '4',
      userName: 'Jordan P.',
      message: 'The acoustic playlist today is perfect for studying! 🎵',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      seatId: 'T7',
      purpose: 'music'
    }
  ]);

  const [nearbyMessages, setNearbyMessages] = useState<ChatMessage[]>([
    {
      id: 'nearby1',
      userId: '5',
      userName: 'Maya (T3)',
      message: 'Hey T1 and T2! Anyone want to grab a refill together?',
      timestamp: new Date(Date.now() - 60000).toISOString(),
      seatId: 'T3',
      purpose: 'social'
    }
  ]);

  const selectedRoomData = CHAT_ROOMS.find(room => room.id === selectedRoom);
  const roomMessages = messages.filter(msg => msg.purpose === selectedRoom);

  const handleSendMessage = () => {
    if (!message.trim() || !user) return;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      userId: user.id,
      userName: user.email?.split('@')[0] || 'You',
      message: message.trim(),
      timestamp: new Date().toISOString(),
      seatId: 'T5', // This would come from user's current seat
      purpose: selectedRoom
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTimeAgo = (timestamp: string) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 min ago';
    if (minutes < 60) return `${minutes} mins ago`;
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  return (
    <div className="space-y-6">
      {/* Nearby People Chat */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-700 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Nearby Tables Chat
            <Badge className="bg-green-500 text-white">Local</Badge>
          </CardTitle>
          <p className="text-sm text-green-600">Chat with people sitting near you in the café</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <ScrollArea className="h-32">
            {nearbyMessages.map((msg) => (
              <div key={msg.id} className="mb-3 p-2 bg-white/70 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-green-700 text-sm">{msg.userName}</span>
                  <span className="text-xs text-green-600">{getTimeAgo(msg.timestamp)}</span>
                </div>
                <p className="text-sm text-gray-700">{msg.message}</p>
              </div>
            ))}
          </ScrollArea>
          
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message nearby tables..."
              className="flex-1 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button 
              onClick={handleSendMessage}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={!message.trim()}
            >
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Purpose-Based Chat Rooms */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#8B4513] flex items-center gap-2">
            <Users className="h-5 w-5" />
            Connect by Purpose
          </CardTitle>
          <p className="text-sm text-gray-600">Join conversations with people who share your café purpose</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Room Selection */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {CHAT_ROOMS.map((room) => (
              <Button
                key={room.id}
                variant={selectedRoom === room.id ? "default" : "outline"}
                className={`justify-start gap-2 p-3 h-auto ${
                  selectedRoom === room.id 
                    ? `${room.color} text-white` 
                    : 'border-gray-200 hover:border-[#8B4513]'
                }`}
                onClick={() => setSelectedRoom(room.id)}
              >
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-1">
                    {room.icon}
                    <span className="text-xs font-medium">{room.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">
                    {room.memberCount} online
                  </Badge>
                </div>
              </Button>
            ))}
          </div>

          {/* Selected Room Chat */}
          {selectedRoomData && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-full ${selectedRoomData.color} text-white`}>
                    {selectedRoomData.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-[#8B4513]">{selectedRoomData.name}</h4>
                    <p className="text-xs text-gray-600">{selectedRoomData.description}</p>
                  </div>
                </div>
                <Badge className={`${selectedRoomData.color} text-white`}>
                  {selectedRoomData.memberCount} online
                </Badge>
              </div>

              {/* Messages */}
              <ScrollArea className="h-48 mb-3">
                <div className="space-y-3 pr-3">
                  {roomMessages.map((msg) => (
                    <div key={msg.id} className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[#8B4513] text-sm">{msg.userName}</span>
                          <Badge variant="outline" className="text-[10px]">
                            {msg.seatId}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{msg.message}</p>
                    </div>
                  ))}
                  
                  {roomMessages.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No messages yet. Start the conversation!</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Message the ${selectedRoomData.name}...`}
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button 
                  onClick={handleSendMessage}
                  className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white"
                  disabled={!message.trim() || !user}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {!user && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Please sign in to join the conversation
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
