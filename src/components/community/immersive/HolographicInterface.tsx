
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  MicOff, 
  Users, 
  Star, 
  Coffee, 
  Settings, 
  Trophy,
  Heart,
  Zap,
  MessageCircle
} from 'lucide-react';

interface HolographicInterfaceProps {
  userReputation: number;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
}

export const HolographicInterface = ({
  userReputation,
  voiceEnabled,
  onToggleVoice
}: HolographicInterfaceProps) => {
  const [nearbyUsers, setNearbyUsers] = useState(3);
  const [currentMood, setCurrentMood] = useState("☕ Caffeinated");
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Sarah joined your table", type: "social" },
    { id: 2, text: "+50 reputation earned!", type: "achievement" }
  ]);

  useEffect(() => {
    // Simulate dynamic updates
    const interval = setInterval(() => {
      setNearbyUsers(Math.floor(Math.random() * 8) + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const moods = [
    "☕ Caffeinated", "💼 Working", "🎵 Vibing", "💬 Chatty", 
    "📚 Studying", "🧘 Zen Mode", "🎨 Creative", "🎉 Celebrating"
  ];

  return (
    <>
      {/* Top Left HUD */}
      <div className="absolute top-6 left-6 z-30 space-y-4">
        {/* User Status Card */}
        <Card className="bg-black/40 backdrop-blur-xl border border-cyan-400/30 shadow-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                <Coffee className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">Coffee Explorer</h3>
                <p className="text-cyan-300 text-sm">{currentMood}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-white">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>{userReputation.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Users className="h-4 w-4 text-green-400" />
                <span>{nearbyUsers} nearby</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voice Control */}
        <Card className="bg-black/40 backdrop-blur-xl border border-cyan-400/30">
          <CardContent className="p-3">
            <Button
              onClick={onToggleVoice}
              variant="ghost"
              className={`w-full ${voiceEnabled 
                ? 'text-green-400 hover:bg-green-400/20' 
                : 'text-red-400 hover:bg-red-400/20'
              }`}
            >
              {voiceEnabled ? (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Voice Active
                </>
              ) : (
                <>
                  <MicOff className="h-4 w-4 mr-2" />
                  Voice Muted
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Top Right Notifications */}
      <div className="absolute top-6 right-6 z-30 space-y-2 max-w-sm">
        {notifications.map((notification) => (
          <Card 
            key={notification.id}
            className="bg-black/40 backdrop-blur-xl border border-purple-400/30 animate-fade-in"
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                {notification.type === 'social' && <Users className="h-4 w-4 text-blue-400" />}
                {notification.type === 'achievement' && <Trophy className="h-4 w-4 text-yellow-400" />}
                <span className="text-white text-sm">{notification.text}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Center Quick Actions */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
        <Card className="bg-black/40 backdrop-blur-xl border border-cyan-400/30">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              {/* Mood Selector */}
              <select
                value={currentMood}
                onChange={(e) => setCurrentMood(e.target.value)}
                className="bg-transparent text-white text-sm border-none focus:outline-none cursor-pointer"
              >
                {moods.map((mood) => (
                  <option key={mood} value={mood} className="bg-black">
                    {mood}
                  </option>
                ))}
              </select>

              <div className="w-px h-6 bg-white/20"></div>

              {/* Quick Actions */}
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 p-2">
                <MessageCircle className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 p-2">
                <Heart className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 p-2">
                <Zap className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 p-2">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating UI Elements */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {/* Ambient Particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-80"></div>
        <div className="absolute bottom-1/4 left-1/2 w-3 h-3 bg-yellow-400 rounded-full animate-bounce opacity-40"></div>
        
        {/* Holographic Grid Lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(cyan 1px, transparent 1px),
              linear-gradient(90deg, cyan 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Corner Reputation Display */}
      <div className="absolute bottom-6 right-6 z-30">
        <Card className="bg-black/40 backdrop-blur-xl border border-yellow-400/30">
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{userReputation.toLocaleString()}</div>
            <div className="text-yellow-300 text-xs">Café Reputation</div>
            <Badge className="mt-2 bg-yellow-400/20 text-yellow-300 border-yellow-400/30">
              Coffee Connoisseur
            </Badge>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
