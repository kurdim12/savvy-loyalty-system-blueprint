import { Award, Star, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface RewardsHeaderProps {
  currentPoints: number;
  membershipTier: 'bronze' | 'silver' | 'gold';
  pendingRedemptions: number;
}

const tierThresholds = {
  bronze: { min: 0, max: 199, next: 'silver', nextThreshold: 200 },
  silver: { min: 200, max: 549, next: 'gold', nextThreshold: 550 },
  gold: { min: 550, max: Infinity, next: null, nextThreshold: null }
} as const;

const tierColors = {
  bronze: { bg: 'bg-[#CD7F32]', text: 'text-[#CD7F32]', border: 'border-[#CD7F32]' },
  silver: { bg: 'bg-[#C0C0C0]', text: 'text-[#C0C0C0]', border: 'border-[#C0C0C0]' },
  gold: { bg: 'bg-[#D4AF37]', text: 'text-[#D4AF37]', border: 'border-[#D4AF37]' }
} as const;

export function RewardsHeader({ currentPoints, membershipTier, pendingRedemptions }: RewardsHeaderProps) {
  const tierInfo = tierThresholds[membershipTier];
  const tierColor = tierColors[membershipTier];
  
  const progressPercentage = tierInfo.next 
    ? ((currentPoints - tierInfo.min) / (tierInfo.nextThreshold! - tierInfo.min)) * 100
    : 100;
  
  const pointsToNext = tierInfo.next 
    ? tierInfo.nextThreshold! - currentPoints
    : 0;

  return (
    <div className="space-y-4">
      {/* Main Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rewards Catalog</h1>
        <p className="text-gray-600">Discover and redeem exclusive rewards with your loyalty points</p>
      </div>

      {/* Points & Progress Card */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Points Balance */}
            <div className="flex items-center gap-4">
              <div className={`p-3 ${tierColor.bg} rounded-full`}>
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Your Balance</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">{currentPoints}</span>
                  <span className="text-gray-600">points</span>
                </div>
              </div>
            </div>

            {/* Tier Progress */}
            <div className="flex-1 min-w-0 max-w-md">
              <div className="flex items-center justify-between mb-2">
                <Badge className={`${tierColor.bg} text-white font-medium`}>
                  <Trophy className="h-3 w-3 mr-1" />
                  {membershipTier.charAt(0).toUpperCase() + membershipTier.slice(1)} Member
                </Badge>
                
                {tierInfo.next && (
                  <span className="text-sm text-gray-600">
                    {pointsToNext} points to {tierInfo.next.charAt(0).toUpperCase() + tierInfo.next.slice(1)}
                  </span>
                )}
              </div>
              
              <Progress 
                value={progressPercentage} 
                className="h-2"
              />
              
              {tierInfo.next && (
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{tierInfo.min}</span>
                  <span>{tierInfo.nextThreshold}</span>
                </div>
              )}
            </div>

            {/* Pending Status */}
            {pendingRedemptions > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-orange-600 border-orange-300">
                  <Star className="h-3 w-3 mr-1" />
                  {pendingRedemptions} Pending
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tier Benefits Info */}
      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Trophy className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Tier Benefits</h4>
              <p className="text-sm text-gray-600">
                You can redeem rewards for your current tier ({membershipTier}) and below. 
                {tierInfo.next && ` Reach ${tierInfo.nextThreshold} points to unlock ${tierInfo.next} tier rewards.`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}