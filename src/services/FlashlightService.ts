import { Camera } from 'expo-camera';

/**
 * Service to control the device's physical flashlight (Torch).
 * Optimized for managed Expo environments.
 */
export const FlashlightService = {
  /**
   * Request camera permissions needed for flashlight control.
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('[FlashlightService] Failed to request permissions:', error);
      return false;
    }
  },

  /**
   * Check current permission status.
   */
  async checkPermissions(): Promise<boolean> {
    try {
      const { status } = await Camera.getCameraPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('[FlashlightService] Failed to check permissions:', error);
      return false;
    }
  }
};
