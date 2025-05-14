
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Database } from '@/integrations/supabase/types';
import { debounce } from '@/lib/utils';

// Define allowed tier types
const allowedTiers = ["bronze", "silver", "gold"] as const;
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

  // Ensure we have a valid tier value
  const tier: MembershipTier | undefined = 
    allowedTiers.includes(currentRank as any) ? currentRank : undefined;

  // Handle tier change
  const handleRankChange = (value: string) => {
    if (allowedTiers.includes(value as any)) {
      debouncedRankChange(value as MembershipTier);
    }
  };

  return (
    <Select value={tier} onValueChange={handleRankChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue>
          {tier ? (
            <Badge className="capitalize" variant={
              tier === 'gold' ? 'default' :
              tier === 'silver' ? 'outline' : 'secondary'
            }>
              {tier}
            </Badge>
          ) : (
            "Select"
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {allowedTiers.map((t) => (
          <SelectItem key={t} value={t}>
            <Badge variant={
              t === 'gold' ? 'default' :
              t === 'silver' ? 'outline' : 'secondary'
            } className="capitalize">
              {t}
            </Badge>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default RankChanger;
