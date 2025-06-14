
import { useState } from 'react';
import { CafeOfficialSeatingPlan } from './CafeOfficialSeatingPlan';
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

  return (
    <div className="w-full h-full">
      <CafeOfficialSeatingPlan 
        onSeatSelect={handleSeatSelect}
        selectedSeat={selectedSeat}
        hideHeader={true}
        onlineUsers={onlineUsers}
      />
    </div>
  );
};
