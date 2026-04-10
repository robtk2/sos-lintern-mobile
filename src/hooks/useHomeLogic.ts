import { useCallback, useEffect } from 'react';
import { useSOSStore } from '@store/useSOSStore';
import { useSOSEngine } from '@hooks/useSOSEngine';
import { usePermissions } from './usePermissions';
import { useAudioSync } from './useAudioSync';
import { useServiceLifecycle } from './useServiceLifecycle';

/**
 * Main orchestrator hook for the HomeScreen.
 * Manages event handlers and high-level state synchronization.
 */
export const useHomeLogic = () => {
  const { 
    sosActive, 
    setSosActive,
    soundEnabled,
    setTimerDuration,
    batteryLevel,
    burnRate,
    endTime,
    setBatteryWarningActive
  } = useSOSStore();
  
  const { torchState } = useSOSEngine();
  const { hasPermission, requestPermissions } = usePermissions();

  // Initialize background services (Battery, Location, KeepAwake)
  useServiceLifecycle();
  
  // Synchronize audio output
  useAudioSync(sosActive, soundEnabled);

  // Monitor battery versus timer
  useEffect(() => {
    if (sosActive && endTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        const remainingSeconds = Math.max(0, (endTime - now) / 1000);
        
        // Use learned burnRate or default (120s per 1%)
        const effectiveBurnRate = burnRate || 120000;
        const estimatedBatterySeconds = batteryLevel * (effectiveBurnRate / 10) ; // burnRate is per 1%, so total is level * rate * 100 / 1000 = level * rate / 10
        
        if (remainingSeconds > estimatedBatterySeconds) {
          setBatteryWarningActive(true);
        } else {
          setBatteryWarningActive(false);
        }
      }, 2000); // Check every 2 seconds

      return () => clearInterval(interval);
    } else {
      setBatteryWarningActive(false);
    }
  }, [sosActive, endTime, batteryLevel, burnRate, setBatteryWarningActive]);

  /**
   * Toggle the SOS signaling state.
   */
  const handleSOSToggle = useCallback(async () => {
    if (!hasPermission) {
      const granted = await requestPermissions();
      if (!granted) return;
    }
    setSosActive(!sosActive);
  }, [sosActive, hasPermission, requestPermissions, setSosActive]);

  /**
   * Handle changes to the timer duration.
   */
  const handleTimeChange = useCallback((h: number, m: number, s: number) => {
    const totalSeconds = h * 3600 + m * 60 + s;
    setTimerDuration(totalSeconds);
  }, [setTimerDuration]);

  return {
    sosActive,
    torchState,
    hasPermission,
    handleSOSToggle,
    handleTimeChange,
  };
};
