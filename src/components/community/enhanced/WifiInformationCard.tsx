
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Wifi, Eye, EyeOff, Copy, CheckCircle, Power, Printer, Video, Monitor, Users } from 'lucide-react';
import { toast } from 'sonner';

interface WifiInformationCardProps {
  location: 'table' | 'seated';
}

export const WifiInformationCard = ({ location }: WifiInformationCardProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [connectionStatus] = useState('connected');
  const [dataUsage] = useState({ used: 250, limit: 1000 });
  const [workMode, setWorkMode] = useState(false);

  const wifiInfo = {
    networkName: 'CafeConnect',
    password: 'coffee2024',
    speed: '100 Mbps',
    connectedUsers: 23,
    signalStrength: 'Excellent'
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(wifiInfo.password);
      setPasswordCopied(true);
      toast.success('WiFi password copied to clipboard!');
      setTimeout(() => setPasswordCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy password');
    }
  };

  const getSignalBars = () => {
    const strength = wifiInfo.signalStrength.toLowerCase();
    const barCount = strength === 'excellent' ? 4 : strength === 'good' ? 3 : strength === 'fair' ? 2 : 1;
    return Array.from({ length: 4 }, (_, i) => i < barCount);
  };

  return (
    <div className="space-y-4">
      {/* Main WiFi Card */}
      <Card className="bg-white/95 backdrop-blur-sm border-white/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-[#8B4513]">
            <div className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              <span>Free WiFi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {getSignalBars().map((active, index) => (
                  <div
                    key={index}
                    className={`w-1 h-3 rounded-full ${
                      active ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                    style={{ height: `${(index + 1) * 4 + 4}px` }}
                  />
                ))}
              </div>
              <Badge className={`${connectionStatus === 'connected' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {connectionStatus === 'connected' ? 'Connected' : 'Connecting...'}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Network Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Network:</span>
                <span className="text-sm font-bold text-[#8B4513]">{wifiInfo.networkName}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Password:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-[#8B4513]">
                    {showPassword ? wifiInfo.password : '••••••••'}
                  </span>
                  <Button
                    onClick={() => setShowPassword(!showPassword)}
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                  >
                    {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                  <Button
                    onClick={copyPassword}
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                  >
                    {passwordCopied ? <CheckCircle className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Speed:</span>
                <span className="text-sm font-bold text-[#8B4513]">{wifiInfo.speed}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Signal:</span>
                <span className="text-sm font-bold text-green-600">{wifiInfo.signalStrength}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Users Online:</span>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-[#8B4513]" />
                  <span className="text-sm font-bold text-[#8B4513]">{wifiInfo.connectedUsers}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Data Used:</span>
                <span className="text-sm font-bold text-[#8B4513]">
                  {dataUsage.used}MB / {dataUsage.limit}MB
                </span>
              </div>
            </div>
          </div>

          {/* Data Usage Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Today's Usage</span>
              <span className="text-xs text-gray-500">
                {Math.round((dataUsage.used / dataUsage.limit) * 100)}%
              </span>
            </div>
            <Progress 
              value={(dataUsage.used / dataUsage.limit) * 100} 
              className="h-2 bg-gray-200"
            />
          </div>

          {/* Work Mode Toggle */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <div className="font-medium text-blue-800">Work Mode</div>
              <div className="text-xs text-blue-600">Prioritize bandwidth for productivity</div>
            </div>
            <Button
              onClick={() => setWorkMode(!workMode)}
              size="sm"
              className={workMode ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-300'}
            >
              {workMode ? 'ON' : 'OFF'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Digital Amenities */}
      <Card className="bg-white/95 backdrop-blur-sm border-white/50">
        <CardHeader>
          <CardTitle className="text-[#8B4513] text-lg">Digital Work Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Power className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">Power Outlets</div>
                <div className="text-xs text-gray-600">Every table</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Printer className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">Free Printing</div>
                <div className="text-xs text-gray-600">5 pages/day</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Video className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">Video Calls</div>
                <div className="text-xs text-gray-600">Quiet zones</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Monitor className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">Standing Desks</div>
                <div className="text-xs text-gray-600">Health focused</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connection Tips */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-800 text-lg">Pro Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-sm text-amber-700">Best signal strength near windows</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-sm text-amber-700">Video calls work best in booth seats</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-sm text-amber-700">Heavy downloads? Try early morning hours</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-sm text-amber-700">Ethernet available at bar counter</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
