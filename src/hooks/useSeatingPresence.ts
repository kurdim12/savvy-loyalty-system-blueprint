
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UserPresence {
  seatId: string;
  name: string;
  mood: string;
  activity: string;
  joinedAt: string;
}

export const useSeatingPresence = (currentSeat?: string) => {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase.channel('cafe-seating-presence');

    // Track user presence when they select a seat
    if (currentSeat) {
      const userStatus: UserPresence = {
        seatId: currentSeat,
        name: user.email?.split('@')[0] || 'Anonymous',
        mood: '😊',
        activity: 'Having coffee',
        joinedAt: new Date().toISOString()
      };

      channel.track(userStatus);
    }

    // Listen for presence changes
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users: UserPresence[] = [];
        
        Object.values(state).forEach((presences: any) => {
          presences.forEach((presence: UserPresence) => {
            users.push(presence);
          });
        });
        
        setOnlineUsers(users);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left:', leftPresences);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, currentSeat]);

  const joinSeat = async (seatId: string) => {
    setIsJoining(true);
    // Simulate joining animation
    setTimeout(() => setIsJoining(false), 500);
  };

  const leaveSeat = () => {
    // User will automatically leave when component unmounts
  };

  return {
    onlineUsers,
    isJoining,
    joinSeat,
    leaveSeat
  };
};
