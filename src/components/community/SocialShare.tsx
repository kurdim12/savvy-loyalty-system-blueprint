
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Share2, Trophy, Users, Star, Gift, Crown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ReferralLeader {
  id: string;
  name: string;
  avatar?: string;
  referrals: number;
  pointsEarned: number;
  rank: number;
  badge?: string;
}

interface SocialShareProps {
  referralCode: string;
  totalReferrals: number;
  pointsFromReferrals: number;
  leaderboard: ReferralLeader[];
  userRank?: number;
}

export const SocialShare = ({ 
  referralCode, 
  totalReferrals, 
  pointsFromReferrals, 
  leaderboard,
  userRank 
}: SocialShareProps) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const shareText = `Join me at Raw Smith Coffee! Use my code ${referralCode} and we both get bonus points! ☕️ #RawSmithCoffee`;
  const shareUrl = `${window.location.origin}?ref=${referralCode}`;

  const handleShare = (platform: string) => {
    let url = '';
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        return;
    }
    window.open(url, '_blank', 'width=600,height=400');
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Trophy className="h-5 w-5 text-gray-400" />;
      case 3: return <Trophy className="h-5 w-5 text-amber-600" />;
      default: return <Star className="h-5 w-5 text-concrete" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Social Share Section */}
      <Card className="bg-gradient-to-r from-black to-concrete text-white border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Share2 className="h-6 w-6" />
            Share & Earn
          </CardTitle>
          <CardDescription className="text-white/80">
            Invite friends and climb the referral leaderboard
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">{totalReferrals}</div>
              <div className="text-sm text-white/80">Total Referrals</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">{pointsFromReferrals}</div>
              <div className="text-sm text-white/80">Points Earned</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">#{userRank || '--'}</div>
              <div className="text-sm text-white/80">Your Rank</div>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-sm text-white/80 mb-2">Your Referral Code</div>
            <div className="text-xl font-mono font-bold">{referralCode}</div>
          </div>
          
          <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-white/90 transition-colors duration-200"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share Now
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-black">Share Your Code</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => handleShare('twitter')}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Twitter
                </Button>
                <Button 
                  onClick={() => handleShare('facebook')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Facebook
                </Button>
                <Button 
                  onClick={() => handleShare('whatsapp')}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  WhatsApp
                </Button>
                <Button 
                  onClick={() => handleShare('copy')}
                  variant="outline"
                  className="border-concrete text-black hover:bg-black hover:text-white"
                >
                  Copy Link
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Referral Leaderboard */}
      <Card className="border-2 border-concrete/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-black flex items-center gap-2">
            <Trophy className="h-6 w-6 text-concrete" />
            Referral Champions
          </CardTitle>
          <CardDescription className="text-concrete">
            Top coffee ambassadors this month
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {leaderboard.slice(0, 10).map((leader) => (
              <div 
                key={leader.id} 
                className={`
                  flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200
                  ${leader.rank <= 3 
                    ? 'border-black bg-black/5 hover:bg-black/10' 
                    : 'border-concrete/20 hover:border-concrete/40'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getRankIcon(leader.rank)}
                    <span className="font-bold text-lg text-black">#{leader.rank}</span>
                  </div>
                  
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={leader.avatar} />
                    <AvatarFallback className="bg-concrete text-black">
                      {leader.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="font-medium text-black">{leader.name}</div>
                    <div className="text-sm text-concrete">
                      {leader.referrals} referrals • {leader.pointsEarned} points
                    </div>
                  </div>
                </div>
                
                {leader.badge && (
                  <Badge 
                    className={`
                      ${leader.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                        leader.rank === 2 ? 'bg-gray-100 text-gray-800' :
                        leader.rank === 3 ? 'bg-amber-100 text-amber-800' :
                        'bg-concrete/20 text-black'}
                    `}
                  >
                    {leader.badge}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
