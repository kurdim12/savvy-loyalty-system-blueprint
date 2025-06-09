
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Coffee, Users, MessageCircle } from 'lucide-react';
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
}

export const ProfileDiscovery = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user?.id)
        .eq('role', 'customer')
        .limit(20);

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
      profile.primary_topics?.some(topic => topic.toLowerCase().includes(searchLower))
    );
  });

  const getMembershipColor = (tier: string) => {
    switch (tier) {
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  };

  const getAvailabilityColor = (status: string) => {
    if (status?.includes('Open')) return 'bg-green-100 text-green-800';
    if (status?.includes('Focused')) return 'bg-red-100 text-red-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <Card className="border-[#8B4513]/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#8B4513]">
          <Search className="h-5 w-5" />
          Discover Coffee Community
        </CardTitle>
        <CardDescription className="text-[#6F4E37]">
          Find and connect with fellow coffee enthusiasts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Search by name, coffee origin, or interests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-[#8B4513]/20"
          />

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B4513] mx-auto"></div>
              <p className="text-[#6F4E37] mt-2">Loading profiles...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProfiles.map((profile) => (
                <div key={profile.id} className="border rounded-lg p-4 border-[#8B4513]/20 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback className="bg-[#8B4513] text-white">
                        {profile.first_name?.[0]}{profile.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-[#8B4513] truncate">
                          {profile.first_name} {profile.last_name}
                        </h4>
                        <Badge className={getMembershipColor(profile.membership_tier)} variant="secondary">
                          {profile.membership_tier?.toUpperCase()}
                        </Badge>
                      </div>
                      
                      {profile.availability_status && (
                        <Badge className={getAvailabilityColor(profile.availability_status)} variant="outline">
                          {profile.availability_status}
                        </Badge>
                      )}
                      
                      <div className="mt-2 text-sm text-[#6F4E37] space-y-1">
                        {profile.current_mood && (
                          <p>Feeling: {profile.current_mood}</p>
                        )}
                        {profile.current_drink && (
                          <p className="flex items-center gap-1">
                            <Coffee className="h-3 w-3" />
                            {profile.current_drink}
                          </p>
                        )}
                        {profile.favorite_coffee_origin && (
                          <p>Loves: {profile.favorite_coffee_origin} coffee</p>
                        )}
                      </div>
                      
                      {profile.primary_topics && profile.primary_topics.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {profile.primary_topics.slice(0, 3).map((topic, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                          {profile.primary_topics.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{profile.primary_topics.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="text-xs border-[#8B4513]/20 text-[#8B4513]">
                          <Users className="h-3 w-3 mr-1" />
                          Connect
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs border-[#8B4513]/20 text-[#8B4513]">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Chat
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {filteredProfiles.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-[#8B4513]/30 mx-auto mb-4" />
              <p className="text-[#6F4E37]">
                {searchTerm ? 'No profiles match your search.' : 'No profiles found.'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
