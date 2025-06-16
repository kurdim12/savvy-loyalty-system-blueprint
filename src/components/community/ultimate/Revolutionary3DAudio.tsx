
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX, Headphones, Radio } from 'lucide-react';

interface AudioZone {
  id: string;
  name: string;
  position: [number, number, number];
  radius: number;
  audioUrl: string;
  volume: number;
  type: 'ambient' | 'music' | 'conversation' | 'effects';
}

interface SpatialAudioProps {
  userPosition: [number, number, number];
  audioZones: AudioZone[];
  onVolumeChange: (zoneId: string, volume: number) => void;
}

export const Revolutionary3DAudio = ({ userPosition, audioZones, onVolumeChange }: SpatialAudioProps) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [masterVolume, setMasterVolume] = useState([0.7]);
  const audioNodesRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    // Initialize Web Audio API
    if (typeof window !== 'undefined') {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(context);
    }
  }, []);

  useEffect(() => {
    if (!audioContext || !isEnabled) return;

    // Create spatial audio for each zone
    audioZones.forEach(zone => {
      const distance = calculateDistance(userPosition, zone.position);
      const maxDistance = zone.radius;
      
      if (distance <= maxDistance) {
        createSpatialAudio(zone, distance, maxDistance);
      } else {
        removeAudioNode(zone.id);
      }
    });
  }, [userPosition, audioZones, audioContext, isEnabled]);

  const calculateDistance = (pos1: [number, number, number], pos2: [number, number, number]) => {
    const dx = pos1[0] - pos2[0];
    const dy = pos1[1] - pos2[1];
    const dz = pos1[2] - pos2[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  };

  const createSpatialAudio = (zone: AudioZone, distance: number, maxDistance: number) => {
    if (!audioContext) return;

    if (!audioNodesRef.current.has(zone.id)) {
      // Create audio nodes for this zone
      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audio.loop = true;
      
      // Use placeholder audio for demo
      audio.src = '/placeholder-audio.mp3'; // In real app, use zone.audioUrl
      
      const source = audioContext.createMediaElementSource(audio);
      const panner = audioContext.createPanner();
      const gainNode = audioContext.createGain();

      // Configure 3D panner
      panner.panningModel = 'HRTF';
      panner.distanceModel = 'exponential';
      panner.refDistance = 1;
      panner.maxDistance = maxDistance;
      panner.rolloffFactor = 2;

      // Set position
      panner.positionX.setValueAtTime(zone.position[0], audioContext.currentTime);
      panner.positionY.setValueAtTime(zone.position[1], audioContext.currentTime);
      panner.positionZ.setValueAtTime(zone.position[2], audioContext.currentTime);

      // Connect audio graph
      source.connect(panner);
      panner.connect(gainNode);
      gainNode.connect(audioContext.destination);

      audioNodesRef.current.set(zone.id, {
        audio,
        source,
        panner,
        gainNode
      });

      audio.play().catch(console.error);
    }

    // Update volume based on distance and zone settings
    const nodes = audioNodesRef.current.get(zone.id);
    if (nodes) {
      const falloff = Math.max(0, 1 - (distance / maxDistance));
      const volume = zone.volume * falloff * masterVolume[0];
      nodes.gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    }
  };

  const removeAudioNode = (zoneId: string) => {
    const nodes = audioNodesRef.current.get(zoneId);
    if (nodes) {
      nodes.audio.pause();
      nodes.source.disconnect();
      nodes.panner.disconnect();
      nodes.gainNode.disconnect();
      audioNodesRef.current.delete(zoneId);
    }
  };

  const toggleAudio = () => {
    setIsEnabled(!isEnabled);
    if (!isEnabled) {
      audioNodesRef.current.forEach((nodes, zoneId) => {
        removeAudioNode(zoneId);
      });
    }
  };

  const getZoneIcon = (type: string) => {
    switch (type) {
      case 'music': return Radio;
      case 'conversation': return Headphones;
      case 'ambient': return Volume2;
      default: return Volume2;
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Headphones className="h-5 w-5" />
          3D Spatial Audio System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Audio Engine</span>
          <Button
            variant={isEnabled ? "default" : "outline"}
            size="sm"
            onClick={toggleAudio}
          >
            {isEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            {isEnabled ? 'Enabled' : 'Disabled'}
          </Button>
        </div>

        <div>
          <label className="text-sm font-medium">Master Volume</label>
          <Slider
            value={masterVolume}
            onValueChange={setMasterVolume}
            max={1}
            min={0}
            step={0.1}
            className="mt-2"
          />
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Active Audio Zones</h4>
          {audioZones.map(zone => {
            const distance = calculateDistance(userPosition, zone.position);
            const isInRange = distance <= zone.radius;
            const ZoneIcon = getZoneIcon(zone.type);
            
            return (
              <div 
                key={zone.id}
                className={`p-3 rounded-lg border ${isInRange ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ZoneIcon className="h-4 w-4" />
                    <span className="font-medium">{zone.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {distance.toFixed(1)}m away
                  </span>
                </div>
                <Slider
                  value={[zone.volume]}
                  onValueChange={(value) => onVolumeChange(zone.id, value[0])}
                  max={1}
                  min={0}
                  step={0.1}
                  disabled={!isInRange}
                />
              </div>
            );
          })}
        </div>

        <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
          💡 Move around the café to experience 3D positional audio. Each zone has unique soundscapes that change based on your location.
        </div>
      </CardContent>
    </Card>
  );
};
