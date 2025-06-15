
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageSquare, Users, Hash } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  space: string;
}

const SAMPLE_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    user: 'Sarah M.',
    message: 'Hey everyone! Just joined the study lounge. Anyone working on React projects?',
    timestamp: new Date(Date.now() - 300000),
    space: 'study-lounge'
  },
  {
    id: '2',
    user: 'Alex K.',
    message: 'Welcome Sarah! I\'m here working on a Next.js app. Happy to help!',
    timestamp: new Date(Date.now() - 240000),
    space: 'study-lounge'
  },
  {
    id: '3',
    user: 'Emma L.',
    message: 'The jazz playlist today is perfect for coding ☕',
    timestamp: new Date(Date.now() - 180000),
    space: 'main-hall'
  }
];

export const CommunityChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(SAMPLE_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [selectedSpace, setSelectedSpace] = useState('main-hall');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const spaces = [
    { id: 'main-hall', name: 'Main Hall', users: 23 },
    { id: 'study-lounge', name: 'Study Lounge', users: 8 },
    { id: 'creative-corner', name: 'Creative Corner', users: 12 },
    { id: 'coworking-space', name: 'Co-working Space', users: 15 }
  ];

  const filteredMessages = messages.filter(msg => msg.space === selectedSpace);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [filteredMessages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      user: user.email?.split('@')[0] || 'You',
      message: newMessage.trim(),
      timestamp: new Date(),
      space: selectedSpace
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
      {/* Space Selection Sidebar */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-[#8B4513] text-lg">Spaces</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {spaces.map((space) => (
            <Button
              key={space.id}
              variant={selectedSpace === space.id ? "default" : "ghost"}
              className={`w-full justify-between text-left ${
                selectedSpace === space.id 
                  ? 'bg-[#8B4513] text-white' 
                  : 'hover:bg-[#8B4513]/10'
              }`}
              onClick={() => setSelectedSpace(space.id)}
            >
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                <span className="text-sm">{space.name}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {space.users}
              </Badge>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="lg:col-span-3 flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-[#8B4513]">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <span>{spaces.find(s => s.id === selectedSpace)?.name}</span>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <Users className="h-3 w-3 mr-1" />
              {spaces.find(s => s.id === selectedSpace)?.users} online
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col gap-4">
          {/* Messages */}
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {filteredMessages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium mb-2">No messages yet</p>
                  <p className="text-sm">Be the first to start a conversation!</p>
                </div>
              ) : (
                filteredMessages.map((message) => (
                  <div key={message.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-[#8B4513] rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {message.user.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-[#8B4513]">{message.user}</span>
                        <span className="text-xs text-gray-500">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{message.message}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="flex gap-2 border-t pt-4">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message ${spaces.find(s => s.id === selectedSpace)?.name}...`}
              className="flex-1 border-[#8B4513]/20 focus:border-[#8B4513]"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={!user}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || !user}
              className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {!user && (
            <div className="text-center text-gray-500 text-sm">
              Please sign in to join the conversation
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
