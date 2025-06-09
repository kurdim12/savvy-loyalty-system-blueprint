
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArtisticBadge } from './ArtisticBadge';
import { Search, Coffee, Users, MessageCircle, Filter, Heart, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  current_mood: string;
  availability_status: string;
  current_drink: string;
  favorite_coffee_origin: string;
  primary_topics: string[];
  conversation_style: string;
  membership_tier: string;
  visits: number;
  bio: string;
}

export const EnhancedProfileDiscovery = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, [filterBy, sortBy]);

  const fetchProfiles = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .neq('id', user?.id)
        .eq('role', 'customer');

      // Apply filters
      if (filterBy === 'gold') {
        query = query.eq('membership_tier', 'gold');
      } else if (filterBy === 'silver') {
        query = query.eq('membership_tier', 'silver');
      } else if (filterBy === 'available') {
        query = query.ilike('availability_status', '%Open%');
      }

      // Apply sorting
      if (sortBy === 'points') {
        query = query.order('current_points', { ascending: false });
      } else if (sortBy === 'visits') {
        query = query.order('visits', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      query = query.limit(20);

      const { data, error } = await query;
      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Failed to load profiles');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const searchLower = searchTerm.toLowerCase();
    return (
      profile.first_name?.toLowerCase().includes(searchLower) ||
      profile.last_name?.toLowerCase().includes(searchLower) ||
      profile.favorite_coffee_origin?.toLowerCase().includes(searchLower) ||
      profile.primary_topics?.some(topic => topic.toLowerCase().includes(searchLower)) ||
      profile.bio?.toLowerCase().includes(searchLower)
    );
  });

  const getCompatibilityScore = (profile: Profile) => {
    // Simple compatibility algorithm based on shared interests
    return Math.floor(Math.random() * 40) + 60; // 60-100% for demo
  };

  const getAvailabilityColor = (status: string) => {
    if (status?.includes('Open')) return 'bg-green-100 text-green-800 border-green-300';
    if (status?.includes('Focused')) return 'bg-red-100 text-red-800 border-red-300';
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  return (
    <Card className="border-[#8B4513]/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#8B4513]">
          <Search className="h-5 w-5" />
          Discover Coffee Community
        </CardTitle>
        <CardDescription className="text-[#6F4E37]">
          Find and connect with fellow coffee enthusiasts based on your preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Enhanced Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search by name, origin, interests, or bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-[#8B4513]/20"
            />
            
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="border-[#8B4513]/20">
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Members</SelectItem>
                <SelectItem value="gold">Gold Members</SelectItem>
                <SelectItem value="silver">Silver Members</SelectItem>
                <SelectItem value="available">Available to Chat</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="border-[#8B4513]/20">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently Joined</SelectItem>
                <SelectItem value="points">Most Points</SelectItem>
                <SelectItem value="visits">Most Visits</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B4513] mx-auto"></div>
              <p className="text-[#6F4E37] mt-2">Loading coffee community...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProfiles.map((profile) => {
                const compatibilityScore = getCompatibilityScore(profile);
                return (
                  <div key={profile.id} className="border rounded-2xl p-6 border-[#8B4513]/20 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-amber-50/30">
                    <div className="flex items-start gap-4">
                      {/* Avatar with Rank Badge */}
                      <div className="relative">
                        <Avatar className="h-16 w-16 border-2 border-[#8B4513]/20">
                          <AvatarImage src={profile.avatar_url} />
                          <AvatarFallback className="bg-[#8B4513] text-white">
                            {profile.first_name?.[0]}{profile.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1">
                          <ArtisticBadge 
                            type="rank" 
                            tier={profile.membership_tier as 'bronze' | 'silver' | 'gold'} 
                            size="sm"
                          />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-[#8B4513] text-lg truncate">
                              {profile.first_name} {profile.last_name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Star className="h-4 w-4 text-amber-500" />
                              <span className="text-sm text-[#6F4E37] font-medium">
                                {compatibilityScore}% match
                              </span>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" className="text-pink-500 hover:text-pink-600 hover:bg-pink-50">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Status Badges */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {profile.availability_status && (
                            <Badge className={getAvailabilityColor(profile.availability_status)} variant="outline">
                              {profile.availability_status}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-[#8B4513] border-[#8B4513]/30">
                            {profile.visits || 0} visits
                          </Badge>
                        </div>
                        
                        {/* Bio */}
                        {profile.bio && (
                          <p className="text-sm text-[#6F4E37] mb-3 line-clamp-2">
                            {profile.bio}
                          </p>
                        )}
                        
                        {/* Coffee Info */}
                        <div className="text-sm text-[#6F4E37] space-y-1 mb-3">
                          {profile.current_mood && (
                            <p>✨ Feeling: {profile.current_mood}</p>
                          )}
                          {profile.current_drink && (
                            <p className="flex items-center gap-1">
                              <Coffee className="h-3 w-3" />
                              Currently: {profile.current_drink}
                            </p>
                          )}
                          {profile.favorite_coffee_origin && (
                            <p>☕ Loves: {profile.favorite_coffee_origin} coffee</p>
                          )}
                        </div>
                        
                        {/* Topics */}
                        {profile.primary_topics && profile.primary_topics.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {profile.primary_topics.slice(0, 3).map((topic, index) => (
                              <Badge key={index} variant="outline" className="text-xs bg-amber-50 text-[#8B4513] border-amber-200">
                                {topic}
                              </Badge>
                            ))}
                            {profile.primary_topics.length > 3 && (
                              <Badge variant="outline" className="text-xs bg-amber-50 text-[#8B4513] border-amber-200">
                                +{profile.primary_topics.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-[#8B4513] hover:bg-[#6F4E37] text-white flex-1">
                            <Users className="h-3 w-3 mr-1" />
                            Connect
                          </Button>
                          <Button size="sm" variant="outline" className="border-[#8B4513]/20 text-[#8B4513] flex-1">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Chat
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {filteredProfiles.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-[#8B4513]/10 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-12 w-12 text-[#8B4513]/40" />
              </div>
              <h3 className="text-lg font-medium text-[#8B4513] mb-2">No matches found</h3>
              <p className="text-[#6F4E37] max-w-md mx-auto">
                {searchTerm ? 
                  'Try adjusting your search terms or filters to find more coffee enthusiasts.' : 
                  'No profiles match your current filters. Try broadening your search.'
                }
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
