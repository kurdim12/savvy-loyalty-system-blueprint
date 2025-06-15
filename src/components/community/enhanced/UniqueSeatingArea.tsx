
import { CafeOfficialSeatingPlan } from './CafeOfficialSeatingPlan';

interface UniqueSeatingAreaProps {
  onSeatSelect: (seatId: string) => void;
  onViewChange: (view: 'interior') => void;
}

export const UniqueSeatingArea = ({ onSeatSelect, onViewChange }: UniqueSeatingAreaProps) => {
  return (
    <div className="w-full h-full">
      <CafeOfficialSeatingPlan 
        onSeatSelect={onSeatSelect}
        hideHeader={true}
      />
    </div>
  );
};
