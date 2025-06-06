
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.7e9db916bdbe40b8bce9f7655948780c',
  appName: 'Raw Smith Loyalty',
  webDir: 'dist',
  server: {
    url: 'https://7e9db916-bdbe-40b8-bce9-f7655948780c.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#FAF6F0',
      showSpinner: false
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#FAF6F0'
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  },
  ios: {
    scheme: 'Raw Smith Loyalty'
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
