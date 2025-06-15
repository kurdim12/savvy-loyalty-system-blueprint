import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, Users, Zap, Crown, Sparkles, Globe, Camera, Mic } from 'lucide-react';
import { ImmersiveWebGL3DCafe } from './immersive/ImmersiveWebGL3DCafe';
import { AvatarCustomizationHub } from './immersive/AvatarCustomizationHub';
import { SpatialAudioChat } from './immersive/SpatialAudioChat';
import { HolographicInterface } from './immersive/HolographicInterface';
import { AIAtmosphereController } from './immersive/AIAtmosphereController';
import { CommunityGameification } from './immersive/CommunityGameification';
import { GameStudioCafeExperience } from './immersive/GameStudioCafeExperience';
import { toast } from 'sonner';

export const CinematicCommunityHub = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'customization' | 'cafe3d' | 'gameStudio'>('landing');
  const [userAvatar, setUserAvatar] = useState(null);
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [userReputation, setUserReputation] = useState(1250);

  useEffect(() => {
    // Initialize immersive experience
    const initializeExperience = () => {
      toast("🎭 Welcome to the future of coffee communities!", {
        description: "Prepare for an extraordinary experience...",
        duration: 3000
      });
    };

    initializeExperience();
  }, []);

  const handleEnterCafe = async () => {
    if (!userAvatar) {
      setCurrentView('customization');
      return;
    }
    
    toast("🚀 Entering the cinematic café world...", {
      description: "Loading your immersive experience",
      duration: 2000
    });
    
    setTimeout(() => {
      setCurrentView('cafe3d');
      setImmersiveMode(true);
    }, 2000);
  };

  const handleEnterGameStudioExperience = () => {
    if (!userAvatar) {
      setCurrentView('customization');
      return;
    }
    
    toast("🎮 Launching Game Studio Experience...", {
      description: "Prepare for the ultimate café simulation",
      duration: 3000
    });
    
    setTimeout(() => {
      setCurrentView('gameStudio');
    }, 3000);
  };

  const enableVoiceChat = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setVoiceEnabled(true);
      toast("🎤 Spatial voice chat enabled!", {
        description: "You can now talk to people near your avatar"
      });
    } catch (error) {
      toast("❌ Microphone access required for voice chat");
    }
  };

  if (currentView === 'customization') {
    return (
      <AvatarCustomizationHub
        onAvatarCreated={(avatar) => {
          setUserAvatar(avatar);
          setCurrentView('cafe3d');
          setImmersiveMode(true);
        }}
        onBack={() => setCurrentView('landing')}
      />
    );
  }

  if (currentView === 'cafe3d') {
    return (
      <div className="relative w-full h-screen overflow-hidden">
        <ImmersiveWebGL3DCafe
          userAvatar={userAvatar}
          voiceEnabled={voiceEnabled}
          immersiveMode={immersiveMode}
          onExitCafe={() => {
            setCurrentView('landing');
            setImmersiveMode(false);
          }}
        />
        
        <HolographicInterface
          userReputation={userReputation}
          voiceEnabled={voiceEnabled}
          onToggleVoice={enableVoiceChat}
        />
        
        <AIAtmosphereController />
        
        <SpatialAudioChat
          enabled={voiceEnabled}
          userPosition={[0, 0, 0]}
        />
        
        <CommunityGameification
          reputation={userReputation}
          onReputationChange={setUserReputation}
        />
      </div>
    );
  }

  if (currentView === 'gameStudio') {
    return (
      <GameStudioCafeExperience
        onExitExperience={() => setCurrentView('landing')}
        userAvatar={userAvatar}
        voiceEnabled={voiceEnabled}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
            <span className="text-white font-medium">The Future of Coffee Communities</span>
            <Crown className="h-5 w-5 text-gold-400" />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 mb-6 animate-fade-in">
            RAW SMITH
          </h1>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 animate-fade-in animation-delay-500">
            Immersive Café Experience
          </h2>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12 animate-fade-in animation-delay-1000">
            Step into a revolutionary 3D coffee world where AI meets community. 
            Create your avatar, explore stunning environments, and connect with coffee lovers worldwide.
          </p>
        </div>

        {/* Feature Showcase */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105">
            <CardContent className="p-8 text-center">
              <Globe className="h-16 w-16 text-blue-400 mx-auto mb-4 animate-spin-slow" />
              <h3 className="text-2xl font-bold text-white mb-4">3D WebGL World</h3>
              <p className="text-white/70">
                Explore a photorealistic café with real-time lighting, shadows, and physics
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105">
            <CardContent className="p-8 text-center">
              <Users className="h-16 w-16 text-purple-400 mx-auto mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold text-white mb-4">Avatar Interactions</h3>
              <p className="text-white/70">
                Custom 3D avatars with facial expressions, gestures, and spatial voice chat
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105">
            <CardContent className="p-8 text-center">
              <Zap className="h-16 w-16 text-yellow-400 mx-auto mb-4 animate-pulse" />
              <h3 className="text-2xl font-bold text-white mb-4">AI Atmosphere</h3>
              <p className="text-white/70">
                Dynamic weather, mood-responsive lighting, and intelligent ambient sounds
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats & Social Proof */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl">
            <div className="text-4xl font-black text-yellow-400 mb-2">2.5k+</div>
            <div className="text-white/70">Active Avatars</div>
          </div>
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl">
            <div className="text-4xl font-black text-purple-400 mb-2">98%</div>
            <div className="text-white/70">Mind-Blown Rate</div>
          </div>
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl">
            <div className="text-4xl font-black text-blue-400 mb-2">24/7</div>
            <div className="text-white/70">Live Experience</div>
          </div>
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl">
            <div className="text-4xl font-black text-pink-400 mb-2">∞</div>
            <div className="text-white/70">Possibilities</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
            <Button
              onClick={handleEnterGameStudioExperience}
              size="lg"
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-12 py-6 text-xl font-bold rounded-full transform hover:scale-110 transition-all duration-300 shadow-2xl animate-pulse"
            >
              <Coffee className="h-8 w-8 mr-3" />
              Enter Game Studio Experience
              <Sparkles className="h-8 w-8 ml-3" />
            </Button>
            
            <Button
              onClick={handleEnterCafe}
              variant="outline"
              className="border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 px-8 py-4 text-lg"
            >
              Classic 3D Experience
            </Button>
            
            <div className="flex gap-3">
              <Button
                onClick={enableVoiceChat}
                variant="outline"
                className="border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 px-6 py-3"
              >
                <Mic className="h-5 w-5 mr-2" />
                Enable Voice
              </Button>
              
              <Button
                variant="outline"
                className="border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 px-6 py-3"
              >
                <Camera className="h-5 w-5 mr-2" />
                Photo Mode
              </Button>
            </div>
          </div>
          
          <p className="text-white/60 text-sm mt-6 max-w-2xl mx-auto">
            🎮 Move with WASD • 🖱️ Look around with mouse • 💬 Voice chat with proximity • 
            ✨ Click objects to interact • 🎨 Customize everything
          </p>
        </div>
      </div>
    </div>
  );
};
