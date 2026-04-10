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

    // Refresh GPS coordinates every 30 seconds.
    // Critical for prolonged SOS: rescuers need the most recent position.
    const locationInterval = setInterval(() => {
      LocationService.updateCurrentLocation();
    }, 30_000);

    // Refresh battery level every 60 seconds regardless of SOS state.
    // The OS event (addBatteryLevelListener) only fires on ~1% drops,
    // so we poll to keep the BatteryStatus UI always accurate.
    const batteryInterval = setInterval(async () => {
      await BatteryService.refreshLevel();
    }, 60_000);

    return () => {
      // Clean up background resources
      clearInterval(locationInterval);
      clearInterval(batteryInterval);
      BatteryService.stopMonitoring();
      SoundService.unload(); // Free up audio resources on unmount
    };
  }, []);
};
