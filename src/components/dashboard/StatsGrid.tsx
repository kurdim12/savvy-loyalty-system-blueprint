import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  Award, 
  TrendingUp, 
  Coffee, 
  Crown, 
  Star,
  Zap,
  Gift
} from 'lucide-react';
import { getDiscountRate } from '@/integrations/supabase/functions';

interface StatsGridProps {
  currentPoints: number;
  membershipTier: string;
  visits: number;
  pendingRedemptions: number;
}

export const StatsGrid = ({ 
  currentPoints, 
  membershipTier, 
  visits, 
  pendingRedemptions 
}: StatsGridProps) => {
  const discountRate = getDiscountRate(membershipTier as 'bronze' | 'silver' | 'gold');

  const stats = [
    {
      title: 'Available Points',
      value: currentPoints.toLocaleString(),
      icon: Wallet,
      gradient: 'from-amber-500 to-orange-500',
      bg: 'from-amber-50 to-orange-50',
      textColor: 'text-amber-900',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600'
    },
    {
      title: 'Membership Tier',
      value: membershipTier.charAt(0).toUpperCase() + membershipTier.slice(1),
      icon: membershipTier === 'gold' ? Crown : Award,
      gradient: membershipTier === 'gold' ? 'from-yellow-500 to-amber-500' : 
                membershipTier === 'silver' ? 'from-slate-400 to-slate-500' : 
                'from-amber-600 to-amber-700',
      bg: membershipTier === 'gold' ? 'from-yellow-50 to-amber-50' : 
          membershipTier === 'silver' ? 'from-slate-50 to-slate-100' : 
          'from-amber-50 to-amber-100',
      textColor: membershipTier === 'gold' ? 'text-yellow-900' : 
                 membershipTier === 'silver' ? 'text-slate-900' : 
                 'text-amber-900',
      iconBg: membershipTier === 'gold' ? 'bg-yellow-100' : 
              membershipTier === 'silver' ? 'bg-slate-100' : 
              'bg-amber-100',
      iconColor: membershipTier === 'gold' ? 'text-yellow-600' : 
                 membershipTier === 'silver' ? 'text-slate-600' : 
                 'text-amber-600'
    },
    {
      title: 'Discount Rate',
      value: `${discountRate}%`,
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500',
      bg: 'from-green-50 to-emerald-50',
      textColor: 'text-green-900',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Total Visits',
      value: visits.toString(),
      icon: Coffee,
      gradient: 'from-purple-500 to-indigo-500',
      bg: 'from-purple-50 to-indigo-50',
      textColor: 'text-purple-900',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index} 
            className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${stat.bg}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`} />
            <CardContent className="p-4 lg:p-6 relative">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs lg:text-sm font-medium opacity-70">
                    {stat.title}
                  </p>
                  <p className={`text-xl lg:text-3xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-2 lg:p-3 ${stat.iconBg} rounded-xl`}>
                  <Icon className={`h-4 w-4 lg:h-6 lg:w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};