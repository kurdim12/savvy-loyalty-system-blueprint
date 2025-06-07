
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Coin, Crown, Award, Medal } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

export const LivePointsDisplay = () => {
  const { user } = useAuth();
  const [realtimePoints, setRealtimePoints] = useState<number | null>(null);

  // Fetch user profile data
  const { data: profile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('current_points, membership_tier, first_name')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
    refetchInterval: 10000, // Refetch every 10 seconds as backup
  });

  // Set up real-time subscription for points updates
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('user-transactions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Refetch profile when new transaction is added
          console.log('🔄 New transaction detected, refreshing points...');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  if (!profile) return null;

  const points = realtimePoints ?? profile.current_points;
  const tier = profile.membership_tier;

  const getTierConfig = (tier: string) => {
    switch (tier) {
      case 'gold':
        return {
          icon: <Crown className="h-4 w-4" />,
          color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
          textColor: 'text-yellow-100',
          label: 'Gold'
        };
      case 'silver':
        return {
          icon: <Award className="h-4 w-4" />,
          color: 'bg-gradient-to-r from-gray-400 to-gray-500',
          textColor: 'text-gray-100',
          label: 'Silver'
        };
      default:
        return {
          icon: <Medal className="h-4 w-4" />,
          color: 'bg-gradient-to-r from-amber-600 to-amber-700',
          textColor: 'text-amber-100',
          label: 'Bronze'
        };
    }
  };

  const tierConfig = getTierConfig(tier);

  return (
    <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-[#8B4513]/10">
      {/* Points Display */}
      <div className="flex items-center gap-2">
        <Coin className="h-4 w-4 text-[#8B4513]" />
        <span className="font-bold text-[#8B4513] text-sm">
          {points.toLocaleString()}
        </span>
      </div>
      
      {/* Divider */}
      <div className="w-px h-4 bg-[#8B4513]/20" />
      
      {/* Tier Badge */}
      <Badge className={`${tierConfig.color} ${tierConfig.textColor} text-xs font-medium`}>
        {tierConfig.icon}
        <span className="ml-1">{tierConfig.label}</span>
      </Badge>
    </div>
  );
};
