import * as Battery from 'expo-battery';
import { useSOSStore } from '@store/useSOSStore';

/**
 * Service to monitor and manage battery state.
 * Syncs battery level with useSOSStore and handles "Live Learning" calibration.
 */
export const BatteryService = {
  subscription: null as Battery.Subscription | null,

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

    // Subscribe to real-time level changes
    this.subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      this.handleLevelChange(batteryLevel);
    });
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
   * Cleanup battery listeners.
   */
  stopMonitoring() {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
  }
};
