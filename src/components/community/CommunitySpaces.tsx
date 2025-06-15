
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Coffee, Wifi, Volume2, BookOpen } from 'lucide-react';

interface CommunitySpace {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  capacity: number;
  currentUsers: number;
  features: string[];
  atmosphere: 'quiet' | 'social' | 'focused' | 'creative';
}

const SPACES: CommunitySpace[] = [
  {
    id: 'main-hall',
    name: 'Main Hall',
    description: 'The heart of our community - perfect for meeting new people',
    icon: <Coffee className="h-6 w-6" />,
    capacity: 50,
    currentUsers: 23,
    features: ['General Chat', 'Music', 'Events'],
    atmosphere: 'social'
  },
  {
    id: 'study-lounge',
    name: 'Study Lounge',
    description: 'Quiet space for focused work and study sessions',
    icon: <BookOpen className="h-6 w-6" />,
    capacity: 20,
    currentUsers: 8,
    features: ['Quiet Zone', 'Study Groups', 'Focus Timer'],
    atmosphere: 'quiet'
  },
  {
    id: 'creative-corner',
    name: 'Creative Corner',
    description: 'For artists, writers, and creative collaborations',
    icon: <Users className="h-6 w-6" />,
    capacity: 15,
    currentUsers: 12,
    features: ['Project Sharing', 'Feedback', 'Inspiration'],
    atmosphere: 'creative'
  },
  {
    id: 'coworking-space',
    name: 'Co-working Space',
    description: 'Professional environment for remote workers',
    icon: <Wifi className="h-6 w-6" />,
    capacity: 30,
    currentUsers: 15,
    features: ['Video Calls OK', 'Business Chat', 'Networking'],
    atmosphere: 'focused'
  }
];

export const CommunitySpaces = () => {
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);

  const getAtmosphereColor = (atmosphere: string) => {
    switch (atmosphere) {
      case 'quiet': return 'bg-blue-100 text-blue-800';
      case 'social': return 'bg-green-100 text-green-800';
      case 'focused': return 'bg-purple-100 text-purple-800';
      case 'creative': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOccupancyColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage < 50) return 'text-green-600';
    if (percentage < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#8B4513] mb-2">Community Spaces</h2>
        <p className="text-gray-600">Choose your perfect spot in our virtual café</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SPACES.map((space) => (
          <Card 
            key={space.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedSpace === space.id ? 'ring-2 ring-[#8B4513] shadow-lg' : ''
            }`}
            onClick={() => setSelectedSpace(space.id)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#8B4513]/10 rounded-lg text-[#8B4513]">
                    {space.icon}
                  </div>
                  <span className="text-[#8B4513]">{space.name}</span>
                </div>
                <Badge className={getAtmosphereColor(space.atmosphere)}>
                  {space.atmosphere}
                </Badge>
              </CardTitle>
              <p className="text-gray-600 text-sm">{space.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className={`font-medium ${getOccupancyColor(space.currentUsers, space.capacity)}`}>
                    {space.currentUsers}/{space.capacity}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {Math.round((space.currentUsers / space.capacity) * 100)}% full
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {space.features.map((feature) => (
                  <Badge key={feature} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>

              <Button 
                className={`w-full ${
                  selectedSpace === space.id 
                    ? 'bg-[#8B4513] text-white' 
                    : 'bg-gray-100 text-[#8B4513] hover:bg-[#8B4513]/10'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSpace(space.id);
                }}
              >
                {selectedSpace === space.id ? 'You\'re Here' : 'Join Space'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedSpace && (
        <Card className="bg-[#8B4513]/5 border-[#8B4513]/20">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-bold text-[#8B4513] mb-2">
                Welcome to {SPACES.find(s => s.id === selectedSpace)?.name}!
              </h3>
              <p className="text-gray-600 mb-4">
                You're now connected to this space. Start chatting with other members!
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Volume2 className="h-4 w-4" />
                  <span>Ambient sounds available</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>Virtual location active</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
