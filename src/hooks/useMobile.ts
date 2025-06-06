
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isNative, setIsNative] = useState(false);
  const [platform, setPlatform] = useState<'web' | 'ios' | 'android'>('web');

  useEffect(() => {
    // Check if running in Capacitor (native app)
    setIsNative(Capacitor.isNativePlatform());
    setPlatform(Capacitor.getPlatform() as 'web' | 'ios' | 'android');
    
    // Check if mobile browser
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileDevice = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      setIsMobile(isMobileDevice || window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return {
    isMobile,
    isNative,
    platform,
    isIOS: platform === 'ios',
    isAndroid: platform === 'android',
    isWeb: platform === 'web'
  };
};
