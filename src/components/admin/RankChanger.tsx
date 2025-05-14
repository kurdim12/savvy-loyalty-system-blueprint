
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Database } from '@/integrations/supabase/types';
import { debounce } from '@/lib/utils';

type MembershipTier = Database['public']['Enums']['membership_tier'];

interface RankChangerProps {
  currentRank: MembershipTier;
  customerId: string;
  onRankChange: (customerId: string, newRank: MembershipTier) => void;
}

const RankChanger = ({ currentRank, customerId, onRankChange }: RankChangerProps) => {
  // Use debounce to avoid multiple quick rank changes
  const debouncedRankChange = debounce((value: MembershipTier) => {
    onRankChange(customerId, value);
  }, 300);

  const handleRankChange = (value: string) => {
    debouncedRankChange(value as MembershipTier);
  };

  return (
    <Select defaultValue={currentRank} onValueChange={handleRankChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue>
          <Badge className="capitalize" variant={
            currentRank === 'gold' ? 'default' :
            currentRank === 'silver' ? 'outline' : 'secondary'
          }>
            {currentRank}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="bronze">
          <Badge variant="secondary" className="capitalize">Bronze</Badge>
        </SelectItem>
        <SelectItem value="silver">
          <Badge variant="outline" className="capitalize">Silver</Badge>
        </SelectItem>
        <SelectItem value="gold">
          <Badge className="capitalize">Gold</Badge>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default RankChanger;
