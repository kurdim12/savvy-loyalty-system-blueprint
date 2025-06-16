
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Smartphone, Scan, MapPin, Users, MessageCircle } from 'lucide-react';
import { MobileService } from '@/services/mobileService';

interface ARMarker {
  id: string;
  position: [number, number];
  type: 'user' | 'seat' | 'menu' | 'event' | 'info';
  data: any;
  distance?: number;
}

interface MobileARProps {
  userLocation: [number, number];
  nearbyMarkers: ARMarker[];
  onMarkerSelect: (marker: ARMarker) => void;
}

export const MobileARExperience = ({ userLocation, nearbyMarkers, onMarkerSelect }: MobileARProps) => {
  const [isARActive, setIsARActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Check if running on mobile
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

    // Request device orientation permission on iOS
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission().then((response: string) => {
        if (response === 'granted') {
          startOrientationTracking();
        }
      });
    } else {
      startOrientationTracking();
    }
  }, []);

  const startOrientationTracking = () => {
    window.addEventListener('deviceorientation', handleOrientationChange);
  };

  const handleOrientationChange = (event: DeviceOrientationEvent) => {
    setDeviceOrientation({
      alpha: event.alpha || 0,
      beta: event.beta || 0,
      gamma: event.gamma || 0
    });
  };

  const startARCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Camera access not supported on this device');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsARActive(true);
        setCameraPermission('granted');
        
        // Vibrate on AR start
        await MobileService.vibrate('light');
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      setCameraPermission('denied');
    }
  };

  const stopARCamera = async () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsARActive(false);
    await MobileService.vibrate('light');
  };

  const renderAROverlay = () => {
    if (!canvasRef.current || !isARActive) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render AR markers
    nearbyMarkers.forEach(marker => {
      const screenPos = worldToScreen(marker.position, deviceOrientation);
      if (screenPos) {
        renderMarker(ctx, marker, screenPos);
      }
    });
  };

  const worldToScreen = (worldPos: [number, number], orientation: any): [number, number] | null => {
    // Simplified AR projection (in real app, use proper AR libraries)
    const screenX = (worldPos[0] - userLocation[0]) * 100 + 200;
    const screenY = (worldPos[1] - userLocation[1]) * 100 + 200;
    
    // Apply device orientation
    const rotatedX = screenX * Math.cos(orientation.alpha * Math.PI / 180) - screenY * Math.sin(orientation.alpha * Math.PI / 180);
    const rotatedY = screenX * Math.sin(orientation.alpha * Math.PI / 180) + screenY * Math.cos(orientation.alpha * Math.PI / 180);
    
    return [rotatedX + 160, rotatedY + 160];
  };

  const renderMarker = (ctx: CanvasRenderingContext2D, marker: ARMarker, position: [number, number]) => {
    const [x, y] = position;
    
    // Draw marker background
    ctx.fillStyle = getMarkerColor(marker.type);
    ctx.beginPath();
    ctx.roundRect(x - 30, y - 15, 60, 30, 15);
    ctx.fill();
    
    // Draw marker icon
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(getMarkerIcon(marker.type), x, y + 5);
    
    // Draw distance if available
    if (marker.distance) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.font = '12px Arial';
      ctx.fillText(`${marker.distance.toFixed(0)}m`, x, y + 25);
    }
  };

  const getMarkerColor = (type: string) => {
    const colors = {
      user: '#3B82F6',
      seat: '#10B981',
      menu: '#F59E0B',
      event: '#EF4444',
      info: '#8B5CF6'
    };
    return colors[type as keyof typeof colors] || '#6B7280';
  };

  const getMarkerIcon = (type: string) => {
    const icons = {
      user: '👤',
      seat: '💺',
      menu: '📋',
      event: '🎉',
      info: 'ℹ️'
    };
    return icons[type as keyof typeof icons] || '📍';
  };

  useEffect(() => {
    if (isARActive) {
      const interval = setInterval(renderAROverlay, 100);
      return () => clearInterval(interval);
    }
  }, [isARActive, nearbyMarkers, deviceOrientation]);

  if (!isMobile) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Smartphone className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="font-semibold mb-2">Mobile AR Experience</h3>
          <p className="text-gray-600">
            AR features are available on mobile devices. 
            Switch to your phone or tablet to experience the augmented reality café!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            AR Café Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isARActive ? (
            <div className="text-center space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <div className="font-medium text-blue-800">See People</div>
                  <div className="text-xs text-blue-600">Find nearby café visitors</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <MapPin className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <div className="font-medium text-green-800">Find Seats</div>
                  <div className="text-xs text-green-600">Locate available tables</div>
                </div>
              </div>
              
              <Button 
                onClick={startARCamera}
                className="w-full"
                disabled={cameraPermission === 'denied'}
              >
                <Scan className="h-4 w-4 mr-2" />
                Start AR Camera
              </Button>
              
              {cameraPermission === 'denied' && (
                <p className="text-sm text-red-600">
                  Camera permission denied. Please enable camera access in your browser settings.
                </p>
              )}
            </div>
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full rounded-lg"
                autoPlay
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                width={320}
                height={320}
              />
              
              <div className="absolute top-4 right-4 space-y-2">
                <Badge className="bg-black/50 text-white">
                  AR Active
                </Badge>
                <div className="text-xs text-white bg-black/50 px-2 py-1 rounded">
                  {nearbyMarkers.length} markers
                </div>
              </div>
              
              <Button
                onClick={stopARCamera}
                variant="destructive"
                size="sm"
                className="absolute bottom-4 right-4"
              >
                Stop AR
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AR Markers List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Nearby Markers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {nearbyMarkers.map(marker => (
              <div
                key={marker.id}
                className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => onMarkerSelect(marker)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-lg">{getMarkerIcon(marker.type)}</div>
                  <div>
                    <div className="font-medium capitalize">{marker.type}</div>
                    <div className="text-sm text-gray-600">
                      {marker.data?.name || `${marker.type} marker`}
                    </div>
                  </div>
                </div>
                {marker.distance && (
                  <Badge variant="outline">
                    {marker.distance.toFixed(0)}m
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
