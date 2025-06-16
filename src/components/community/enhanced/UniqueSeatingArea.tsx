
import { useState } from 'react';
import { UltimateSeatingPlan } from './UltimateSeatingPlan';
import { useSeatingPresence } from '@/hooks/useSeatingPresence';

interface UniqueSeatingAreaProps {
  onSeatSelect: (seatId: string) => void;
  onViewChange: (view: 'interior') => void;
}

export const UniqueSeatingArea = ({ onSeatSelect, onViewChange }: UniqueSeatingAreaProps) => {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const { onlineUsers, joinSeat } = useSeatingPresence(selectedSeat || undefined);

  const handleSeatSelect = async (seatId: string) => {
    setSelectedSeat(seatId);
    await joinSeat(seatId);
    onSeatSelect(seatId);
  };

  // Transform users data to match enhanced format with required id property
  const enhancedUsers = onlineUsers.map((user, index) => {
    // Define allowed status values
    const statusOptions: ('chatting' | 'working' | 'available' | 'focused')[] = ['chatting', 'working', 'available', 'focused'];
    const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    
    return {
      id: `user-${index}-${user.seatId}`, // Add the required id property
      seatId: user.seatId,
      name: user.name,
      mood: user.mood,
      activity: user.activity || 'Enjoying coffee',
      status: randomStatus, // Now properly typed
      drinkType: ['espresso', 'latte', 'cappuccino', 'americano'][Math.floor(Math.random() * 4)] as 'espresso' | 'latte' | 'cappuccino' | 'americano'
    };
  });

  return (
    <div className="w-full h-full">
      <UltimateSeatingPlan 
        onSeatSelect={handleSeatSelect}
        selectedSeat={selectedSeat}
        hideHeader={true}
        onlineUsers={enhancedUsers}
      />
    </div>
  );
};
