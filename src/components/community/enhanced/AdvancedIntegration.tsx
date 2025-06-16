
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Monitor, 
  Share, 
  Calendar,
  Smartphone,
  Users,
  Settings
} from 'lucide-react';

interface AdvancedIntegrationProps {
  seatId: string;
  nearbyUsers: Array<{
    id: string;
    name: string;
    hasVoiceEnabled: boolean;
    isScreenSharing: boolean;
  }>;
  onVoiceToggle: (enabled: boolean) => void;
  onScreenShare: (enabled: boolean) => void;
}

export const AdvancedIntegration: React.FC<AdvancedIntegrationProps> = ({
  seatId,
  nearbyUsers,
  onVoiceToggle,
  onScreenShare
}) => {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showCalendarSync, setShowCalendarSync] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState<string[]>([]);

  const handleVoiceToggle = () => {
    const newState = !isVoiceEnabled;
    setIsVoiceEnabled(newState);
    onVoiceToggle(newState);
  };

  const handleScreenShare = () => {
    const newState = !isScreenSharing;
    setIsScreenSharing(newState);
    onScreenShare(newState);
  };

  const handleCalendarSync = () => {
    setShowCalendarSync(true);
    // Simulate calendar integration
    setTimeout(() => {
      setShowCalendarSync(false);
    }, 2000);
  };

  const connectMobileApp = () => {
    setConnectedDevices(prev => [...prev, 'Mobile App']);
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Settings className="h-5 w-5" />
          Advanced Features
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Voice Chat Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-blue-700">Voice Chat</h3>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handleVoiceToggle}
              variant={isVoiceEnabled ? "default" : "outline"}
              size="sm"
              className={isVoiceEnabled ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {isVoiceEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              {isVoiceEnabled ? "Voice On" : "Join Voice"}
            </Button>
            
            {isVoiceEnabled && (
              <Button
                onClick={() => setIsMuted(!isMuted)}
                variant="outline"
                size="sm"
                className={isMuted ? "bg-red-100 border-red-300" : ""}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            )}
          </div>

          {isVoiceEnabled && (
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-green-800 mb-2">Voice Chat Active</div>
              <div className="space-y-1">
                {nearbyUsers.filter(user => user.hasVoiceEnabled).map(user => (
                  <div key={user.id} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>{user.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Screen Sharing Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-blue-700">Screen Sharing</h3>
          
          <Button
            onClick={handleScreenShare}
            variant={isScreenSharing ? "default" : "outline"}
            size="sm"
            className={`w-full ${isScreenSharing ? "bg-blue-600 hover:bg-blue-700" : ""}`}
          >
            <Monitor className="h-4 w-4 mr-2" />
            {isScreenSharing ? "Stop Sharing" : "Share Screen"}
          </Button>

          {isScreenSharing && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-800 mb-2">Screen is being shared</div>
              <div className="text-xs text-blue-600">
                Nearby users can see your screen for collaboration
              </div>
            </div>
          )}

          {nearbyUsers.some(user => user.isScreenSharing) && (
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm text-purple-800 mb-2">Available Screens</div>
              {nearbyUsers.filter(user => user.isScreenSharing).map(user => (
                <Button
                  key={user.id}
                  variant="outline"
                  size="sm"
                  className="mr-2 mb-2 border-purple-300 hover:bg-purple-100"
                >
                  <Share className="h-3 w-3 mr-1" />
                  View {user.name}'s Screen
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Calendar Integration */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-blue-700">Calendar Integration</h3>
          
          <Button
            onClick={handleCalendarSync}
            variant="outline"
            size="sm"
            className="w-full"
            disabled={showCalendarSync}
          >
            <Calendar className="h-4 w-4 mr-2" />
            {showCalendarSync ? "Syncing..." : "Sync Calendar"}
          </Button>

          {showCalendarSync && (
            <div className="bg-amber-50 p-3 rounded-lg">
              <div className="text-sm text-amber-800">
                📅 Syncing your calendar for optimal café session scheduling...
              </div>
            </div>
          )}
        </div>

        {/* Mobile App Connection */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-blue-700">Mobile Companion</h3>
          
          <Button
            onClick={connectMobileApp}
            variant="outline"
            size="sm"
            className="w-full"
            disabled={connectedDevices.includes('Mobile App')}
          >
            <Smartphone className="h-4 w-4 mr-2" />
            {connectedDevices.includes('Mobile App') ? "Mobile Connected" : "Connect Mobile App"}
          </Button>

          {connectedDevices.length > 0 && (
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-green-800 mb-2">Connected Devices</div>
              <div className="space-y-1">
                {connectedDevices.map(device => (
                  <div key={device} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{device}</span>
                    <Badge variant="secondary" className="text-xs ml-auto">Active</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-xs text-blue-600 text-center">
            🚀 Advanced features enhance collaboration and productivity
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-800">{nearbyUsers.filter(u => u.hasVoiceEnabled).length}</div>
              <div className="text-xs text-blue-600">In Voice</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-800">{nearbyUsers.filter(u => u.isScreenSharing).length}</div>
              <div className="text-xs text-blue-600">Sharing</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-800">{connectedDevices.length}</div>
              <div className="text-xs text-blue-600">Devices</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
