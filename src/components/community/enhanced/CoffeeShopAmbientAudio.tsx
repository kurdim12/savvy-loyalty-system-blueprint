
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Volume2, VolumeX, Coffee, Music, Users } from 'lucide-react';

interface AudioLayer {
  id: string;
  name: string;
  volume: number;
  url: string;
  icon: any;
}

export const CoffeeShopAmbientAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [masterVolume, setMasterVolume] = useState(0.5);
  const [showControls, setShowControls] = useState(false);

  const audioLayers: AudioLayer[] = [
    {
      id: 'coffee-machine',
      name: 'Coffee Machine',
      volume: 0.3,
      url: '/audio/coffee-machine.mp3',
      icon: Coffee
    },
    {
      id: 'ambient-chatter',
      name: 'Café Chatter',
      volume: 0.2,
      url: '/audio/cafe-chatter.mp3',
      icon: Users
    },
    {
      id: 'background-music',
      name: 'Jazz Background',
      volume: 0.4,
      url: '/audio/cafe-jazz.mp3',
      icon: Music
    }
  ];

  useEffect(() => {
    // Initialize Web Audio API context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    return () => {
      audioContext.close();
    };
  }, []);

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
    // Audio implementation would go here
    console.log(`Audio ${isPlaying ? 'stopped' : 'started'}`);
  };

  return (
    <div className="relative">
      <Button
        onClick={toggleAudio}
        variant="outline"
        size="sm"
        className="bg-white/90 hover:bg-white text-stone-700 border-stone-300"
      >
        {isPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </Button>

      {showControls && (
        <Card className="absolute top-12 right-0 w-72 bg-white/95 backdrop-blur-sm z-40">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Ambient Audio Controls
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Master Volume</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={masterVolume}
                  onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                  className="w-full mt-1"
                />
              </div>
              
              {audioLayers.map((layer) => (
                <div key={layer.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <layer.icon className="h-4 w-4 text-stone-600" />
                    <span className="text-sm">{layer.name}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    defaultValue={layer.volume}
                    className="w-16"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <Button
        onClick={() => setShowControls(!showControls)}
        variant="ghost"
        size="sm"
        className="ml-2"
      >
        ⚙️
      </Button>
    </div>
  );
};
