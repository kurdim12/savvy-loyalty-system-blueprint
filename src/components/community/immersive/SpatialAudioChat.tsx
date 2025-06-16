
import { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, Radio } from 'lucide-react';
import { toast } from 'sonner';

interface SpatialAudioChatProps {
  enabled: boolean;
  userPosition: [number, number, number];
}

export const SpatialAudioChat = ({ enabled, userPosition }: SpatialAudioChatProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [nearbyUsers, setNearbyUsers] = useState([
    { id: 1, name: "Alex", position: [2, 0, 1], volume: 0.8, speaking: false },
    { id: 2, name: "Sam", position: [-1, 0, 3], volume: 0.4, speaking: true },
    { id: 3, name: "Jordan", position: [4, 0, -2], volume: 0.2, speaking: false }
  ]);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const audioNodesRef = useRef<Map<number, GainNode>>(new Map());

  useEffect(() => {
    if (enabled && !audioContext) {
      // Initialize Web Audio API for spatial audio
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(context);
      
      toast("🎧 Spatial audio initialized", {
        description: "You can now hear people based on their distance"
      });
    }
  }, [enabled, audioContext]);

  useEffect(() => {
    if (!audioContext || !enabled) return;

    // Calculate spatial audio for nearby users
    nearbyUsers.forEach(user => {
      const distance = Math.sqrt(
        Math.pow(user.position[0] - userPosition[0], 2) +
        Math.pow(user.position[2] - userPosition[2], 2)
      );
      
      // Volume decreases with distance
      const volume = Math.max(0, 1 - (distance / 10));
      user.volume = volume;

      // Update audio node if it exists
      const audioNode = audioNodesRef.current.get(user.id);
      if (audioNode) {
        audioNode.gain.value = volume;
      }
    });

    setNearbyUsers([...nearbyUsers]);
  }, [userPosition, audioContext, enabled]);

  const startListening = async () => {
    if (!enabled) {
      toast("Enable voice chat first to start listening");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsListening(true);
      
      // Simulate voice activity detection
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const detectSpeech = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        
        setIsSpeaking(average > 50); // Threshold for speech detection
        
        if (isListening) {
          requestAnimationFrame(detectSpeech);
        }
      };
      
      detectSpeech();
      
      toast("🎤 Listening started", {
        description: "Others can now hear you based on proximity"
      });
    } catch (error) {
      toast("❌ Could not access microphone");
    }
  };

  const stopListening = () => {
    setIsListening(false);
    setIsSpeaking(false);
    toast("🔇 Stopped listening");
  };

  if (!enabled) {
    return (
      <div className="absolute bottom-20 left-6 z-30">
        <Card className="bg-red-900/40 backdrop-blur-xl border border-red-400/30">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-red-300">
              <VolumeX className="h-4 w-4" />
              <span className="text-sm">Voice chat disabled</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="absolute bottom-20 left-6 z-30 space-y-3">
      {/* Voice Controls */}
      <Card className="bg-black/40 backdrop-blur-xl border border-green-400/30">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <Button
              onClick={isListening ? stopListening : startListening}
              variant="ghost"
              className={`${
                isListening
                  ? 'text-green-400 hover:bg-green-400/20'
                  : 'text-gray-400 hover:bg-gray-400/20'
              }`}
            >
              {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>
            
            {/* Speaking Indicator */}
            {isSpeaking && (
              <div className="flex items-center gap-1">
                <Radio className="h-4 w-4 text-green-400 animate-pulse" />
                <span className="text-green-300 text-sm">Speaking</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Nearby Users Audio */}
      <Card className="bg-black/40 backdrop-blur-xl border border-blue-400/30">
        <CardContent className="p-3">
          <div className="text-white text-sm mb-2 flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            Nearby Audio
          </div>
          
          <div className="space-y-2">
            {nearbyUsers.filter(user => user.volume > 0.1).map(user => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    user.speaking ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-white text-xs">{user.name}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <div className="w-8 bg-gray-600 rounded-full h-1">
                    <div 
                      className="bg-blue-400 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${user.volume * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-blue-300">
                    {Math.round(user.volume * 100)}%
                  </span>
                </div>
              </div>
            ))}
            
            {nearbyUsers.filter(user => user.volume > 0.1).length === 0 && (
              <div className="text-gray-400 text-xs">No one nearby</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Audio Range Indicator */}
      <Card className="bg-black/40 backdrop-blur-xl border border-purple-400/30">
        <CardContent className="p-2">
          <div className="text-center">
            <div className="text-purple-300 text-xs mb-1">Audio Range</div>
            <div className="text-white text-sm font-bold">10m radius</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
