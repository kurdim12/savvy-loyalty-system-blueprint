import { Badge } from '@/components/ui/badge';

interface TierFiltersProps {
  selectedTier: 'all' | 'bronze' | 'silver' | 'gold';
  onTierChange: (tier: 'all' | 'bronze' | 'silver' | 'gold') => void;
  rewardCounts: {
    all: number;
    bronze: number;
    silver: number;
    gold: number;
  };
}

const tierColors = {
  bronze: 'bg-[#CD7F32] hover:bg-[#CD7F32]/80 text-white',
  silver: 'bg-[#C0C0C0] hover:bg-[#C0C0C0]/80 text-white',
  gold: 'bg-[#D4AF37] hover:bg-[#D4AF37]/80 text-white',
  all: 'bg-gray-900 hover:bg-gray-800 text-white'
} as const;

export function TierFilters({ selectedTier, onTierChange, rewardCounts }: TierFiltersProps) {
  const filters = [
    { key: 'all' as const, label: 'All Rewards', count: rewardCounts.all },
    { key: 'bronze' as const, label: 'Bronze', count: rewardCounts.bronze },
    { key: 'silver' as const, label: 'Silver', count: rewardCounts.silver },
    { key: 'gold' as const, label: 'Gold', count: rewardCounts.gold },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isSelected = selectedTier === filter.key;
        const colorClass = tierColors[filter.key];
        
        return (
          <button
            key={filter.key}
            onClick={() => onTierChange(filter.key)}
            className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium 
              transition-all duration-200 border-2
              ${isSelected 
                ? `${colorClass} border-transparent shadow-sm` 
                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400'
              }
            `}
          >
            <span>{filter.label}</span>
            <Badge 
              variant="secondary" 
              className={`text-xs h-5 min-w-5 ${
                isSelected 
                  ? 'bg-white/20 text-white border-white/30' 
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {filter.count}
            </Badge>
          </button>
        );
      })}
    </div>
  );
}