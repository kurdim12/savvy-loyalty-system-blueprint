
import { useState, useEffect } from 'react';
import { AdvancedWebGL3DEngine } from './AdvancedWebGL3DEngine';
import { IntelligentSeatingSystem } from './IntelligentSeatingSystem';
import { AdvancedAvatarSystem } from './AdvancedAvatarSystem';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Gamepad2, 
  Sparkles, 
  Users, 
  Camera, 
  Mic,
  Settings,
  Trophy,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface GameStudioCafeExperienceProps {
  onExitExperience: () => void;
  userAvatar: any;
  voiceEnabled: boolean;
}

export const GameStudioCafeExperience = ({
  onExitExperience,
  userAvatar,
  voiceEnabled
}: GameStudioCafeExperienceProps) => {
  const [userPreferences, setUserPreferences] = useState({
    socialLevel: 75,
    noisePreference: 40,
    activityType: 'work',
    workStyle: 'collaborative'
  });

  const [gameMode, setGameMode] = useState<'exploration' | 'social' | 'focus'>('exploration');
  const [achievements, setAchievements] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState(1);
  const [socialCredits, setSocialCredits] = useState(250);

  useEffect(() => {
    // Welcome experience
    toast("🎮 Welcome to the Game Studio Experience!", {
      description: "Prepare for the most advanced café simulation ever created",
      duration: 4000
    });

    // Simulate achievement unlocking
    setTimeout(() => {
      setAchievements(['First Login', 'Explorer']);
      toast("🏆 Achievement Unlocked: Explorer!", {
        description: "You've entered the advanced café experience"
      });
    }, 3000);
  }, []);

  const handleSeatRecommendation = (recommendations: any[]) => {
    console.log('AI Recommendations:', recommendations);
    if (recommendations.length > 0 && recommendations[0].score > 85) {
      toast("🎯 Perfect Match Found!", {
        description: `Seat ${recommendations[0].seatId} is ideal for your preferences`
      });
    }
  };

  const switchGameMode = (mode: 'exploration' | 'social' | 'focus') => {
    setGameMode(mode);
    
    const modeDescriptions = {
      exploration: "Discover hidden areas and interactive elements",
      social: "Enhanced social features and proximity chat",
      focus: "Minimalist UI for deep work sessions"
    };

    toast(`🎮 Mode: ${mode.toUpperCase()}`, {
      description: modeDescriptions[mode]
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Game Studio HUD */}
      <div className="absolute top-0 left-0 right-0 z-40 p-4">
        <div className="flex justify-between items-start">
          {/* Player Stats */}
          <Card className="bg-black/40 backdrop-blur-xl border border-purple-400/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-purple-300 text-xs">Level</div>
                  <div className="text-white font-bold text-lg">{experienceLevel}</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-300 text-xs">Social Credits</div>
                  <div className="text-white font-bold text-lg">{socialCredits}</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-300 text-xs">Achievements</div>
                  <div className="text-white font-bold text-lg">{achievements.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Game Mode Selector */}
          <Card className="bg-black/40 backdrop-blur-xl border border-cyan-400/30">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Gamepad2 className="h-4 w-4 text-cyan-400" />
                <select
                  value={gameMode}
                  onChange={(e) => switchGameMode(e.target.value as any)}
                  className="bg-transparent text-white text-sm border-none focus:outline-none"
                >
                  <option value="exploration" className="bg-black">🔍 Exploration</option>
                  <option value="social" className="bg-black">👥 Social</option>
                  <option value="focus" className="bg-black">🎯 Focus</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Performance Stats */}
          <Card className="bg-black/40 backdrop-blur-xl border border-green-400/30">
            <CardContent className="p-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300">120 FPS</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-yellow-400" />
                  <span className="text-yellow-300">Ultra Quality</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main 3D Experience */}
      <AdvancedWebGL3DEngine
        onExitCafe={onExitExperience}
        userAvatar={userAvatar}
        voiceEnabled={voiceEnabled}
      />

      {/* AI Seating Intelligence */}
      <IntelligentSeatingSystem
        userPreferences={userPreferences}
        onSeatRecommendation={handleSeatRecommendation}
        currentOccupancy={[]}
      />

      {/* Achievement Notifications */}
      <div className="absolute bottom-20 right-6 z-30 space-y-2">
        {achievements.map((achievement, index) => (
          <Card key={index} className="bg-yellow-500/20 backdrop-blur-xl border border-yellow-400/50 animate-fade-in">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-400" />
                <span className="text-yellow-300 text-sm font-semibold">{achievement}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Game Controls */}
      <div className="absolute bottom-6 left-6 z-30">
        <Card className="bg-black/40 backdrop-blur-xl border border-purple-400/30">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-purple-300">🎮 WASD</div>
              <div className="text-white">Movement</div>
              <div className="text-purple-300">🖱️ Mouse</div>
              <div className="text-white">Look Around</div>
              <div className="text-purple-300">🪑 Click</div>
              <div className="text-white">Interact</div>
              <div className="text-purple-300">💬 Proximity</div>
              <div className="text-white">Auto Voice</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Settings Panel */}
      <div className="absolute top-20 left-6 z-30">
        <Card className="bg-black/30 backdrop-blur-xl border border-blue-400/20">
          <CardContent className="p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-400" />
              AI Preferences
            </h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <label className="text-blue-300 block mb-1">Social Level</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={userPreferences.socialLevel}
                  onChange={(e) => setUserPreferences(prev => ({
                    ...prev,
                    socialLevel: parseInt(e.target.value)
                  }))}
                  className="w-full"
                />
                <span className="text-white">{userPreferences.socialLevel}%</span>
              </div>
              
              <div>
                <label className="text-blue-300 block mb-1">Noise Tolerance</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={userPreferences.noisePreference}
                  onChange={(e) => setUserPreferences(prev => ({
                    ...prev,
                    noisePreference: parseInt(e.target.value)
                  }))}
                  className="w-full"
                />
                <span className="text-white">{userPreferences.noisePreference}%</span>
              </div>

              <div>
                <label className="text-blue-300 block mb-1">Activity Type</label>
                <select
                  value={userPreferences.activityType}
                  onChange={(e) => setUserPreferences(prev => ({
                    ...prev,
                    activityType: e.target.value
                  }))}
                  className="w-full bg-black/50 text-white text-sm p-1 rounded border border-white/20"
                >
                  <option value="work">💼 Work</option>
                  <option value="social">👥 Social</option>
                  <option value="study">📚 Study</option>
                  <option value="relaxation">🧘 Relax</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Experience Quality Indicator */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30">
        <Badge className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-2 text-lg font-bold animate-pulse">
          <Sparkles className="h-4 w-4 mr-2" />
          GAME STUDIO QUALITY
          <Sparkles className="h-4 w-4 ml-2" />
        </Badge>
      </div>
    </div>
  );
};
