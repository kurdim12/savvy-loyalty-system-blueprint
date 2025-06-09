import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArtisticBadge } from './ArtisticBadge';
import { Coffee, Users, Star, Trophy, MapPin, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ProfileShowcase = () => {
  const { profile } = useAuth();

  const achievements = [
    { name: 'First Visit', earned: true },
    { name: 'Coffee Connoisseur', earned: profile?.visits && profile.visits > 10 },
    { name: 'Social Butterfly', earned: false }
  ];

  const getMembershipColor = (tier: string) => {
    switch (tier) {
      case 'gold': return 'from-yellow-400 to-amber-500';
      case 'silver': return 'from-slate-300 to-gray-400';
      default: return 'from-amber-500 to-orange-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className={cn(
        'relative overflow-hidden rounded-3xl p-8',
        `bg-gradient-to-br ${getMembershipColor(profile?.membership_tier || 'bronze')}`,
        'text-white shadow-2xl'
      )}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-32 h-32 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-4 right-4 w-24 h-24 bg-white rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          {/* Avatar with Rank Badge */}
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-white/30 shadow-2xl">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-white/20 text-white text-2xl backdrop-blur-sm">
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            
            {/* Rank Badge */}
            <div className="absolute -bottom-2 -right-2">
              <ArtisticBadge 
                type="rank" 
                tier={profile?.membership_tier as 'bronze' | 'silver' | 'gold'} 
                size="lg"
                glowing={profile?.membership_tier === 'gold'}
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-bold mb-2">
              {profile?.first_name} {profile?.last_name}
            </h1>
            
            <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-4">
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                {profile?.membership_tier?.toUpperCase()} Member
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                {profile?.current_points || 0} Points
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                {profile?.visits || 0} Visits
              </Badge>
            </div>

            {profile?.bio && (
              <p className="text-white/90 text-lg max-w-md mb-4">{profile.bio}</p>
            )}

            {/* Current Status */}
            <div className="flex flex-wrap gap-4 text-sm">
              {profile?.current_mood && (
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span>Feeling {profile.current_mood}</span>
                </div>
              )}
              {profile?.current_drink && (
                <div className="flex items-center gap-2">
                  <Coffee className="h-4 w-4" />
                  <span>{profile.current_drink}</span>
                </div>
              )}
              {profile?.time_zone && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.time_zone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Gallery */}
      <Card className="border-[#8B4513]/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="h-6 w-6 text-[#8B4513]" />
            <h2 className="text-xl font-bold text-[#8B4513]">Achievements Gallery</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {achievements.map((achievement, index) => (
              <div key={achievement.name} className="text-center group">
                <div className={cn(
                  'mx-auto mb-3 transition-all duration-300',
                  achievement.earned ? 'hover:scale-110' : 'opacity-30 grayscale'
                )}>
                  <ArtisticBadge
                    type="achievement"
                    achievement={achievement.name}
                    size="lg"
                    glowing={achievement.earned}
                  />
                </div>
                <p className={cn(
                  'text-sm font-medium',
                  achievement.earned ? 'text-[#8B4513]' : 'text-gray-400'
                )}>
                  {achievement.name}
                </p>
                {achievement.earned && (
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Calendar className="h-3 w-3 text-[#6F4E37]" />
                    <span className="text-xs text-[#6F4E37]">
                      Earned recently
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Coffee Journey Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-[#8B4513]/20 text-center">
          <CardContent className="p-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Coffee className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#8B4513] mb-2">{profile?.visits || 0}</h3>
            <p className="text-[#6F4E37]">Café Visits</p>
          </CardContent>
        </Card>

        <Card className="border-[#8B4513]/20 text-center">
          <CardContent className="p-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#8B4513] mb-2">12</h3>
            <p className="text-[#6F4E37]">Connections Made</p>
          </CardContent>
        </Card>

        <Card className="border-[#8B4513]/20 text-center">
          <CardContent className="p-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#8B4513] mb-2">87</h3>
            <p className="text-[#6F4E37]">Coffee Score</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button className="bg-gradient-to-r from-[#8B4513] to-[#6F4E37] hover:from-[#6F4E37] hover:to-[#8B4513]">
          <Coffee className="h-4 w-4 mr-2" />
          Enter Virtual Café
        </Button>
        <Button variant="outline" className="border-[#8B4513]/20 text-[#8B4513]">
          <Users className="h-4 w-4 mr-2" />
          Find Coffee Friends
        </Button>
        <Button variant="outline" className="border-[#8B4513]/20 text-[#8B4513]">
          <Trophy className="h-4 w-4 mr-2" />
          View All Achievements
        </Button>
      </div>
    </div>
  );
};
