
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CrownIcon, Award, TrendingUp } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type MembershipTier = Database['public']['Enums']['membership_tier'];

interface RankBenefitsProps {
  currentPoints: number;
  membershipTier: MembershipTier;
}

const RankBenefits: React.FC<RankBenefitsProps> = ({ 
  currentPoints, 
  membershipTier 
}) => {
  const [rankThresholds, setRankThresholds] = useState({
    silver: 200,
    gold: 550
  });

  // Fetch current rank thresholds from settings
  const { data: thresholdSettings } = useQuery({
    queryKey: ['rankThresholds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('setting_value')
        .eq('setting_name', 'rank_thresholds')
        .maybeSingle();
      
      if (error || !data) {
        console.error('Error fetching rank thresholds:', error);
        return { silver: 200, gold: 550 };
      }
      
      return data.setting_value as {silver: number, gold: number};
    },
    staleTime: 60000 // Cache for 1 minute
  });

  useEffect(() => {
    if (thresholdSettings) {
      setRankThresholds(thresholdSettings);
    }
  }, [thresholdSettings]);

  // Calculate rank progression
  let nextTier = '';
  let pointsToNextTier = 0;
  let progress = 0;
  
  if (membershipTier === 'bronze') {
    nextTier = 'silver';
    pointsToNextTier = Math.max(0, rankThresholds.silver - currentPoints);
    progress = currentPoints > 0 ? Math.min((currentPoints / rankThresholds.silver) * 100, 100) : 0;
  } else if (membershipTier === 'silver') {
    nextTier = 'gold';
    pointsToNextTier = Math.max(0, rankThresholds.gold - currentPoints);
    progress = Math.min(((currentPoints - rankThresholds.silver) / (rankThresholds.gold - rankThresholds.silver)) * 100, 100);
  } else {
    nextTier = 'gold';
    pointsToNextTier = 0;
    progress = 100;
  }
  
  // Get benefit information with updated cupping scores
  const tierBenefits = {
    bronze: {
      icon: <Badge className="h-8 w-8 rounded-full p-1 bg-amber-100 text-amber-700 border-amber-300">B</Badge>,
      points: `0-${rankThresholds.silver - 1}`,
      discount: '10%',
      color: 'bg-amber-100',
      textColor: 'text-amber-700',
      list: [
        '10% discount on all drinks', 
        'Access to 87+ cupping score coffee rewards',
        'Member-only promotions'
      ]
    },
    silver: {
      icon: <Badge className="h-8 w-8 rounded-full p-1 bg-gray-200 text-gray-700 border-gray-400">S</Badge>,
      points: `${rankThresholds.silver}-${rankThresholds.gold - 1}`,
      discount: '15%',
      color: 'bg-gray-100',
      textColor: 'text-gray-700',
      list: [
        '15% discount on all drinks', 
        'Access to 87+ cupping score premium beans',
        'Early access to new coffees', 
        'Exclusive tasting events'
      ]
    },
    gold: {
      icon: <CrownIcon className="h-6 w-6 text-yellow-500" />,
      points: `${rankThresholds.gold}+`,
      discount: '25%',
      color: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      list: [
        '25% discount on all drinks', 
        'Access to 90+ cupping score exclusive beans',
        'Free monthly coffee sample', 
        'Priority barista service', 
        'Exclusive gold member events', 
        'Personalized coffee recommendations'
      ]
    }
  };
  
  // Display current tier benefits
  const currentTierInfo = tierBenefits[membershipTier];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-700" />
          Rank Benefits
        </CardTitle>
        <CardDescription>Your current membership tier and benefits</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentTierInfo.icon}
            <div>
              <p className="font-semibold capitalize">{membershipTier} Tier</p>
              <p className="text-sm text-muted-foreground">{currentTierInfo.points} points</p>
            </div>
          </div>
          <Badge className="bg-amber-100 text-amber-900 capitalize">
            {currentTierInfo.discount} discount
          </Badge>
        </div>

        <div className="flex items-center justify-between bg-amber-50 rounded-md p-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-amber-700" />
            <span className="font-medium">Current Balance</span>
          </div>
          <span className="text-lg font-bold text-amber-800">{currentPoints} points</span>
        </div>
        
        {/* Benefits list */}
        <div className="mt-3 space-y-1">
          <p className="font-medium">Your Benefits:</p>
          <ul className="list-disc list-inside space-y-1 text-sm pl-2">
            {currentTierInfo.list.map((benefit, index) => (
              <li key={index} className={currentTierInfo.textColor}>{benefit}</li>
            ))}
          </ul>
        </div>
        
        {/* Progress to next tier */}
        {membershipTier !== 'gold' && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1 text-sm">
              <span>Progress to {nextTier}</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-2" 
              indicatorClassName={membershipTier === 'bronze' ? 'bg-amber-500' : 'bg-gray-500'}
            />
            <p className="text-xs mt-2 text-amber-700">
              {pointsToNextTier > 0 ? 
                `${pointsToNextTier} more points needed for ${nextTier}` : 
                'You\'ve reached the highest tier!'}
            </p>
          </div>
        )}
        
        {/* Tier comparison */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t">
          <div className={`text-center p-2 rounded-md transition-colors ${
            membershipTier === 'bronze' ? 'bg-amber-100 ring-1 ring-amber-300' : 'bg-gray-50 hover:bg-gray-100'
          }`}>
            <p className="font-medium text-sm">Bronze</p>
            <p className="text-xs">10% off</p>
          </div>
          <div className={`text-center p-2 rounded-md transition-colors ${
            membershipTier === 'silver' ? 'bg-gray-200 ring-1 ring-gray-300' : 'bg-gray-50 hover:bg-gray-100'
          }`}>
            <p className="font-medium text-sm">Silver</p>
            <p className="text-xs">15% off</p>
          </div>
          <div className={`text-center p-2 rounded-md transition-colors ${
            membershipTier === 'gold' ? 'bg-yellow-100 ring-1 ring-yellow-300' : 'bg-gray-50 hover:bg-gray-100'
          }`}>
            <p className="font-medium text-sm">Gold</p>
            <p className="text-xs">25% off</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RankBenefits;
