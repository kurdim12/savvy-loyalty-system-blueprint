
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Music, AlertTriangle, CheckCircle, ExternalLink, RefreshCw, Smartphone } from 'lucide-react';
import { useSpotify } from '@/hooks/useSpotify';
import { toast } from 'sonner';

export const SpotifyTroubleshooter = () => {
  const { isAuthenticated, authenticate, isLoading } = useSpotify();
  const [troubleshootingStep, setTroubleshootingStep] = useState(0);

  const troubleshootingSteps = [
    {
      title: "Check Spotify App",
      description: "Make sure Spotify is open on at least one device",
      action: "Open Spotify app on your phone or computer",
      icon: <Smartphone className="h-5 w-5" />
    },
    {
      title: "Premium Account",
      description: "Spotify Web API requires a Premium subscription",
      action: "Verify you have Spotify Premium",
      icon: <CheckCircle className="h-5 w-5" />
    },
    {
      title: "Clear Browser Cache",
      description: "Sometimes cached data can interfere with connections",
      action: "Clear your browser cache and cookies",
      icon: <RefreshCw className="h-5 w-5" />
    },
    {
      title: "Check Permissions",
      description: "Ensure the app has permission to control Spotify",
      action: "Review permissions in your Spotify account settings",
      icon: <ExternalLink className="h-5 w-5" />
    }
  ];

  const handleRetryConnection = async () => {
    try {
      setTroubleshootingStep(0);
      await authenticate();
      toast.success('Attempting to connect to Spotify...');
    } catch (error) {
      toast.error('Connection failed. Please try the troubleshooting steps.');
    }
  };

  return (
    <Card className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border-red-400/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-200">
          <AlertTriangle className="h-6 w-6 text-red-400" />
          Spotify Connection Troubleshooter
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert className="bg-red-900/20 border-red-400/30">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-200">
            Having trouble connecting to Spotify? Let's fix this together!
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <h4 className="font-semibold text-white">Common Solutions:</h4>
          
          {troubleshootingSteps.map((step, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                troubleshootingStep === index
                  ? 'bg-orange-900/30 border-orange-400/50'
                  : 'bg-white/5 border-white/20 hover:bg-white/10'
              }`}
              onClick={() => setTroubleshootingStep(index)}
            >
              <div className="flex items-center gap-3">
                <div className="text-orange-400">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-white">{step.title}</h5>
                  <p className="text-white/70 text-sm">{step.description}</p>
                  {troubleshootingStep === index && (
                    <p className="text-orange-300 text-sm mt-1 font-medium">
                      → {step.action}
                    </p>
                  )}
                </div>
                <Badge className={`
                  ${troubleshootingStep === index 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-white/20 text-white/70'
                  }
                `}>
                  Step {index + 1}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 pt-4 border-t border-white/20">
          <h4 className="font-semibold text-white">Quick Fixes:</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={handleRetryConnection}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Music className="h-4 w-4 mr-2" />
                  Retry Connection
                </>
              )}
            </Button>
            
            <Button
              onClick={() => window.open('https://accounts.spotify.com/en/status', '_blank')}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Check Spotify Status
            </Button>
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
          <h5 className="font-medium text-blue-200 mb-2">💡 Pro Tip</h5>
          <p className="text-blue-100 text-sm">
            For the best experience, make sure you have Spotify Premium and the app is actively 
            running on your device. The Web API requires an active Spotify session to control playback.
          </p>
        </div>

        <div className="text-center space-y-2">
          <p className="text-white/60 text-sm">
            Still having issues? The café music will continue playing even without your personal Spotify connection.
          </p>
          <Badge className="bg-purple-600/20 text-purple-200 border-purple-400/30">
            🎵 Community music is always available
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
