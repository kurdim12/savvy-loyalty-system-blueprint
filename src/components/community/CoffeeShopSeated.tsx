
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, MessageCircle, Music, Settings, Gamepad2, ArrowLeft } from 'lucide-react';
import { SeatedPerspectiveView } from './enhanced/SeatedPerspectiveView';
import { AvatarCustomizer } from './AvatarCustomizer';
import { CafeMinigames } from './CafeMinigames';

interface CoffeeShopSeatedProps {
  seatId: string;
  onLeave: () => void;
}

export const CoffeeShopSeated = ({ seatId, onLeave }: CoffeeShopSeatedProps) => {
  const [showEnhancedView, setShowEnhancedView] = useState(true);
  const [activeTab, setActiveTab] = useState<'customize' | 'games'>('customize');
  const [userMood, setUserMood] = useState('😊');
  const [userActivity, setUserActivity] = useState('Enjoying coffee');

  // Enhanced view is the default experience
  if (showEnhancedView) {
    return (
      <SeatedPerspectiveView 
        seatId={seatId} 
        tableId={`table-${seatId}`}
        onStandUp={onLeave}
      />
    );
  }

  // Fallback to original view (kept for compatibility)
  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-[#8B4513]/10 to-[#D2B48C]/20">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div>
          <h2 className="text-2xl font-bold text-[#8B4513] mb-2">Seated Experience</h2>
          <Badge className="bg-[#8B4513]/10 text-[#8B4513]">
            Classic View • {seatId}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => setShowEnhancedView(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Enhanced View
          </Button>
          <Button
            onClick={onLeave}
            variant="outline"
            className="border-[#8B4513] text-[#8B4513]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Stand Up
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 px-6 mb-6">
        {[
          { key: 'customize', label: 'Avatar', icon: Settings },
          { key: 'games', label: 'Games', icon: Gamepad2 }
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            onClick={() => setActiveTab(key as any)}
            variant={activeTab === key ? 'default' : 'outline'}
            size="sm"
            className={
              activeTab === key
                ? 'bg-[#8B4513] text-white hover:bg-[#8B4513]/90'
                : 'border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513]/10'
            }
          >
            <Icon className="h-4 w-4 mr-2" />
            {label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="px-6 pb-6 h-full overflow-auto">
        {activeTab === 'customize' && (
          <AvatarCustomizer
            currentMood={userMood}
            currentActivity={userActivity}
            onMoodChange={setUserMood}
            onActivityChange={setUserActivity}
          />
        )}

        {activeTab === 'games' && (
          <CafeMinigames />
        )}
      </div>
    </div>
  );
};
