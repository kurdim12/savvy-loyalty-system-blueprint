import { useState } from 'react';
import { Download, X, Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePWA } from '@/hooks/usePWA';
import { toast } from 'sonner';

export const InstallPrompt = () => {
  const { isInstallable, isInstalled, isIOS, installApp } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isInstallable || isInstalled || isDismissed) {
    return null;
  }

  const handleInstall = async () => {
    if (isIOS) {
      toast.info('To install on iPhone/iPad: Tap the Share button in Safari, then "Add to Home Screen"');
      return;
    }
    
    const success = await installApp();
    if (success) {
      toast.success('🎉 App installed successfully! You can now access Raw Smith from your device.');
    } else {
      toast.error('Installation was cancelled or failed.');
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 relative overflow-hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDismiss}
        className="absolute top-2 right-2 h-6 w-6 p-0 text-amber-600 hover:text-amber-700"
      >
        <X className="h-4 w-4" />
      </Button>
      
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex gap-2 flex-shrink-0">
            <div className="p-1.5 sm:p-2 bg-amber-200 rounded-lg">
              <Monitor className="h-4 w-4 sm:h-5 sm:w-5 text-amber-700" />
            </div>
            <div className="p-1.5 sm:p-2 bg-amber-200 rounded-lg">
              <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-amber-700" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-amber-900 mb-2 text-sm sm:text-base">
              Install Raw Smith Coffee App
            </h3>
            <p className="text-xs sm:text-sm text-amber-700 mb-3 sm:mb-4 leading-relaxed">
              Add our app to your home screen for quick access to your loyalty rewards, 
              points, and exclusive coffee deals. Works offline too!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={handleInstall}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm"
                size="sm"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Install App
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDismiss}
                size="sm"
                className="border-amber-300 text-amber-700 hover:bg-amber-100 text-xs sm:text-sm"
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};