
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { App } from '@capacitor/app';

export class MobileService {
  static async initializePushNotifications() {
    if (!Capacitor.isNativePlatform()) return;

    try {
      // Request permission for push notifications
      const permission = await PushNotifications.requestPermissions();
      
      if (permission.receive === 'granted') {
        await PushNotifications.register();
        console.log('Push notifications registered successfully');
      }

      // Listen for push notification events
      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration token:', token.value);
        // Send token to your backend here
      });

      PushNotifications.addListener('registrationError', (error) => {
        console.error('Push registration error:', error);
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received:', notification);
        // Handle foreground notification
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action performed:', notification);
        // Handle notification tap
      });
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  }

  static async takePicture(): Promise<string | null> {
    if (!Capacitor.isNativePlatform()) {
      // Fallback for web - trigger file input
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          } else {
            resolve(null);
          }
        };
        input.click();
      });
    }

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt // Let user choose camera or gallery
      });

      return image.dataUrl || null;
    } catch (error) {
      console.error('Error taking picture:', error);
      return null;
    }
  }

  static async vibrate(style: 'light' | 'medium' | 'heavy' = 'medium') {
    if (!Capacitor.isNativePlatform()) return;

    try {
      const impactStyle = style === 'light' ? ImpactStyle.Light :
                         style === 'heavy' ? ImpactStyle.Heavy :
                         ImpactStyle.Medium;
      
      await Haptics.impact({ style: impactStyle });
    } catch (error) {
      console.error('Error with haptic feedback:', error);
    }
  }

  static async getAppInfo() {
    if (!Capacitor.isNativePlatform()) {
      return {
        name: 'Raw Smith Loyalty',
        version: '1.0.0',
        build: '1'
      };
    }

    try {
      const info = await App.getInfo();
      return info;
    } catch (error) {
      console.error('Error getting app info:', error);
      return null;
    }
  }

  static addAppStateListener(callback: (state: { isActive: boolean }) => void) {
    if (!Capacitor.isNativePlatform()) return;

    App.addListener('appStateChange', callback);
  }

  static removeAppStateListener() {
    if (!Capacitor.isNativePlatform()) return;
    
    App.removeAllListeners();
  }
}
