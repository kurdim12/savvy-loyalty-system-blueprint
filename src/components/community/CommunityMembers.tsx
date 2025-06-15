
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Search, MessageSquare, UserPlus, Coffee, Star } from 'lucide-react';

interface CommunityMember {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  currentSpace?: string;
  joinedDate: string;
  points: number;
  badges: string[];
  bio?: string;
}

const SAMPLE_MEMBERS: CommunityMember[] = [
  {
    id: '1',
    name: 'Sarah Martinez',
    status: 'online',
    currentSpace: 'Study Lounge',
    joinedDate: '2024-01-15',
    points: 1250,
    badges: ['Early Adopter', 'Coffee Enthusiast'],
    bio: 'Frontend developer passionate about React and coffee'
  },
  {
    id: '2',
    name: 'Alex Chen',
    status: 'online',
    currentSpace: 'Main Hall',
    joinedDate: '2024-02-01',
    points: 980,
    badges: ['Helper', 'Music Lover'],
    bio: 'Full-stack dev, always happy to help others'
  },
  {
    id: '3',
    name: 'Emma Thompson',
    status: 'away',
    currentSpace: 'Creative Corner',
    joinedDate: '2024-01-20',
    points: 1560,
    badges: ['Artist', 'Community Star'],
    bio: 'UX Designer creating beautiful experiences'
  },
  {
    id: '4',
    name: 'Jordan Williams',
    status: 'online',
    currentSpace: 'Co-working Space',
    joinedDate: '2024-03-05',
    points: 760,
    badges: ['Newcomer'],
    bio: 'Data scientist exploring new technologies'
  }
];

export const CommunityMembers = () => {
  const [members, setMembers] = useState<CommunityMember[]>(SAMPLE_MEMBERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'away' | 'busy'>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const onlineCount = members.filter(m => m.status === 'online').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#8B4513]">Community Members</h2>
          <p className="text-gray-600">
            {onlineCount} of {members.length} members online
          </p>
        </div>
        <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
          <Users className="h-4 w-4 mr-2" />
          {onlineCount} Online
        </Badge>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search members..."
                  className="pl-10 border-[#8B4513]/20"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {['all', 'online', 'away', 'busy'].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(status as any)}
                  className={filterStatus === status ? 'bg-[#8B4513] text-white' : ''}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="bg-[#8B4513] text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#8B4513]">{member.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{member.status}</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {member.currentSpace && (
                <div className="text-sm text-gray-600">
                  📍 Currently in <span className="font-medium">{member.currentSpace}</span>
                </div>
              )}

              {member.bio && (
                <p className="text-sm text-gray-600">{member.bio}</p>
              )}

              <div className="flex items-center gap-2">
                <Coffee className="h-4 w-4 text-[#8B4513]" />
                <span className="text-sm font-medium">{member.points} points</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {member.badges.map((badge) => (
                  <Badge key={badge} variant="outline" className="text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    {badge}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1 bg-[#8B4513] hover:bg-[#8B4513]/90 text-white">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Chat
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <UserPlus className="h-3 w-3 mr-1" />
                  Follow
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No members found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
