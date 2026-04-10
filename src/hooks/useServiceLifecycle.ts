import { useEffect } from 'react';
import { useKeepAwake } from 'expo-keep-awake';
import { BatteryService } from '@services/BatteryService';
import { LocationService } from '@services/LocationService';
import { SoundService } from '@services/SoundService';

/**
 * Hook to manage the lifecycle of secondary background services.
 * Handles battery monitoring, location updates and keeps the screen awake.
 */
export const useServiceLifecycle = () => {
  // Prevent the screen from sleeping while the app is active
  useKeepAwake();

  useEffect(() => {
    // Warm up services
    BatteryService.startMonitoring();
    LocationService.updateCurrentLocation();
    SoundService.preload(); // Pre-load audio asset for instant response

    return () => {
      // Clean up background resources
      BatteryService.stopMonitoring();
      SoundService.unload(); // Free up audio resources on unmount
    };
  }, []);
};
