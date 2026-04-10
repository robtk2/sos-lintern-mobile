import * as Battery from 'expo-battery';
import { useSOSStore } from '@store/useSOSStore';

/**
 * Service to monitor and manage battery state.
 * Syncs battery level with useSOSStore and handles "Live Learning" calibration.
 */
export const BatteryService = {
  subscription: null as Battery.Subscription | null,
  pollingInterval: null as ReturnType<typeof setInterval> | null,
  POLLING_INTERVAL_MS: 60_000, // Re-calibrate every 60 seconds while SOS is active

  /**
   * Starts monitoring battery level and state.
   */
  async startMonitoring() {
    // Initial level capture
    try {
      const level = await Battery.getBatteryLevelAsync();
      useSOSStore.getState().setBatteryLevel(level);
    } catch (error) {
      console.error('[BatteryService] Failed to get initial battery level:', error);
    }

    // Subscribe to real-time level changes (fires on ~1% drops)
    this.subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      this.handleLevelChange(batteryLevel);
    });

    // Active polling: re-calibrate burn rate while SOS is running.
    // The event listener alone is not reliable enough since drops are infrequent.
    this.pollingInterval = setInterval(async () => {
      const store = useSOSStore.getState();
      if (!store.sosActive) return; // Skip polling when idle; saves battery

      try {
        const level = await Battery.getBatteryLevelAsync();
        store.setBatteryLevel(level);
        this.calibrateHeuristics(level, store);
      } catch (error) {
        console.error('[BatteryService] Polling failed:', error);
      }
    }, this.POLLING_INTERVAL_MS);
  },

  /**
   * Handles battery level updates and triggers heuristic calibration.
   */
  handleLevelChange(level: number) {
    const store = useSOSStore.getState();
    
    // Update global state
    store.setBatteryLevel(level);

    // Call heuristic engine for live learning
    this.calibrateHeuristics(level, store);
  },

  /**
   * Calibrates the burn rate based on actual battery drop during SOS.
   * This allows the app to provide highly accurate "Time Remaining" estimates.
   */
  calibrateHeuristics(currentLevel: number, store: any) {
    const { sosActive, trackingStartTime, trackingStartBattery } = store;

    if (!sosActive || !trackingStartTime || !trackingStartBattery) return;

    // Only calculate if there's a measurable drop (at least 1%) to avoid polling noise
    const drop = trackingStartBattery - currentLevel;
    
    if (drop >= 0.01) {
      const elapsedMs = Date.now() - trackingStartTime;
      const msPerPercent = elapsedMs / (drop * 100);
      
      // Update burn rate for better future estimations
      store.setBurnRate(msPerPercent);
    }
  },

  /**
   * Checks if battery is currently sufficient based on safety thresholds.
   */
  async isBatterySufficient(): Promise<boolean> {
    const level = await Battery.getBatteryLevelAsync();
    const threshold = useSOSStore.getState().batteryThreshold;
    return level > threshold;
  },

  /**
   * Fetches the current battery level and updates the store.
   * Used for periodic UI refresh independent of SOS state.
   */
  async refreshLevel() {
    try {
      const level = await Battery.getBatteryLevelAsync();
      useSOSStore.getState().setBatteryLevel(level);
    } catch (error) {
      console.error('[BatteryService] Failed to refresh battery level:', error);
    }
  },

  /**
   * Cleanup battery listeners.
   */
  stopMonitoring() {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
};
