import { create } from 'zustand';

interface SOSState {
  // Core Status
  sosActive: boolean;
  soundEnabled: boolean;
  
  // Timer Configuration
  timerEnabled: boolean;
  timerDuration: number; // in seconds
  endTime: number | null; // Timestamp when signal should end
  
  // Battery Protection & Estimation
  batteryLevel: number; // 0.0 - 1.0
  batteryThreshold: number; // 0.0 - 1.0 (Default 0.15)
  isLowBattery: boolean;
  trackingStartBattery: number | null; // Level when SOS started
  trackingStartTime: number | null;    // Time when SOS started
  burnRate: number | null;            // ms per 1% drop
  latitude: number | null;
  longitude: number | null;
  batteryWarningActive: boolean;
  
  // Actions
  setSosActive: (active: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setTimerEnabled: (enabled: boolean) => void;
  setTimerDuration: (seconds: number) => void;
  setBatteryLevel: (level: number) => void;
  setBatteryThreshold: (threshold: number) => void;
  setBurnRate: (msPerPercent: number) => void;
  setLocation: (lat: number, lon: number) => void;
  setBatteryWarningActive: (active: boolean) => void;
  
  // Reset
  resetSOS: () => void;
}

/**
 * Global store for SOS signaling state and configuration.
 * Uses Zustand for high-performance state management.
 */
export const useSOSStore = create<SOSState>((set, get) => ({
  sosActive: false,
  soundEnabled: false,
  
  timerEnabled: false,
  timerDuration: 0,
  endTime: null,
  
  batteryLevel: 1.0,
  batteryThreshold: 0.15,
  isLowBattery: false,
  trackingStartBattery: null,
  trackingStartTime: null,
  burnRate: null,
  latitude: null,
  longitude: null,
  batteryWarningActive: false,
  
  setSosActive: (active) => {
    const state = get();
    // Prevent activation if battery is lower than threshold
    if (active && state.batteryLevel <= state.batteryThreshold) {
      return;
    }
    
    // Calculate endTime if activating with a duration
    let newEndTime = null;
    if (active && state.timerDuration > 0) {
      newEndTime = Date.now() + state.timerDuration * 1000;
    }
    
    set({ 
      sosActive: active, 
      endTime: newEndTime,
      // Initialize tracking if starting, clear if stopping
      trackingStartBattery: active ? state.batteryLevel : null,
      trackingStartTime: active ? Date.now() : null,
      burnRate: active ? state.burnRate : null // Keep last known rate for initial estimate if restarting
    });
  },
  
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
  
  setTimerEnabled: (enabled) => set({ timerEnabled: enabled }),
  
  setTimerDuration: (seconds) => set({ 
    timerDuration: seconds,
    endTime: get().sosActive ? Date.now() + seconds * 1000 : null
  }),

  setBatteryLevel: (level) => {
    const isLow = level <= get().batteryThreshold;
    set({ 
      batteryLevel: level,
      isLowBattery: isLow,
      sosActive: isLow ? false : get().sosActive
    });
  },
  
  setBatteryThreshold: (threshold) => {
    const isLow = get().batteryLevel <= threshold;
    set({ 
      batteryThreshold: threshold,
      isLowBattery: isLow,
      sosActive: isLow ? false : get().sosActive
    });
  },
  
  setBurnRate: (msPerPercent) => set({ burnRate: msPerPercent }),

  setLocation: (lat, lon) => set({ latitude: lat, longitude: lon }),

  setBatteryWarningActive: (active) => set({ batteryWarningActive: active }),

  resetSOS: () => set({
    sosActive: false,
    endTime: null,
    trackingStartTime: null,
    trackingStartBattery: null,
    latitude: null,
    longitude: null,
    batteryWarningActive: false,
  }),
}));
