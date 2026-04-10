import * as Location from 'expo-location';
import { useSOSStore } from '@store/useSOSStore';

/**
 * Service to handle GPS location fetching.
 * Optimized for battery efficiency by using Balanced accuracy.
 */
export const LocationService = {
  /**
   * Request location permissions from the OS.
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('[LocationService] Failed to request permissions:', error);
      return false;
    }
  },

  /**
   * Fetch current coordinates and update the store.
   * Assumes permissions are handled by the orchestrator but provides safety check.
   */
  async updateCurrentLocation() {
    try {
      // Check current status before expensive GPS operation
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      useSOSStore.getState().setLocation(
        location.coords.latitude,
        location.coords.longitude
      );
    } catch (error) {
      console.error('[LocationService] Failed to get location:', error);
    }
  }
};
