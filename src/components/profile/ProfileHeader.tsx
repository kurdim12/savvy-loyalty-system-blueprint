
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Camera, MapPin } from 'lucide-react';

export const ProfileHeader = () => {
  const { profile } = useAuth();

  const getMembershipColor = (tier: string) => {
    switch (tier) {
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-orange-100 text-orange-800 border-orange-300';
    }
  };

  const getAvailabilityColor = (status: string) => {
    if (status?.includes('Open')) return 'bg-green-100 text-green-800 border-green-300';
    if (status?.includes('Focused')) return 'bg-red-100 text-red-800 border-red-300';
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  return (
    <div className="relative bg-gradient-to-r from-[#8B4513]/10 to-[#6F4E37]/10 rounded-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="relative">
          <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="bg-[#8B4513] text-white text-xl">
              {profile?.first_name?.[0]}{profile?.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <Button 
            size="sm" 
            variant="secondary"
            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 shadow-sm"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <h1 className="text-2xl font-bold text-[#8B4513]">
              {profile?.first_name} {profile?.last_name}
            </h1>
            <div className="flex gap-2">
              <Badge className={getMembershipColor(profile?.membership_tier || 'bronze')}>
                {profile?.membership_tier?.toUpperCase()} Member
              </Badge>
              <Badge variant="outline" className="text-[#8B4513] border-[#8B4513]/30">
                {profile?.current_points || 0} Points
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {profile?.availability_status && (
              <Badge className={getAvailabilityColor(profile.availability_status)}>
                {profile.availability_status}
              </Badge>
            )}
            {profile?.current_mood && (
              <Badge variant="outline" className="text-[#6F4E37] border-[#6F4E37]/30">
                Feeling {profile.current_mood}
              </Badge>
            )}
          </div>
          
          {profile?.current_drink && (
            <p className="text-[#6F4E37] flex items-center gap-1">
              ☕ Currently enjoying: <span className="font-medium">{profile.current_drink}</span>
            </p>
          )}
          
          {profile?.bio && (
            <p className="text-[#6F4E37] max-w-2xl">{profile.bio}</p>
          )}
          
          {profile?.time_zone && (
            <p className="text-sm text-[#6F4E37] flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {profile.time_zone}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
