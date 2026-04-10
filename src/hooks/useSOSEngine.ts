import { useEffect, useRef, useState, useCallback } from 'react';
import { useSOSStore } from '@store/useSOSStore';

// Timing constants (ms)
const DOT = 250;
const DASH = 750;
const ELEMENT_GAP = 250;
const SEQUENCE_GAP = 1750;

// Morse Pattern for SOS: ... --- ...
const SOS_PATTERN = [
  DOT, DOT, DOT,       // S
  DASH, DASH, DASH,    // O
  DOT, DOT, DOT        // S
];

/**
 * Hook that orchestrates the SOS Morse sequence.
 * Controls a local 'torchState' that the UI consumes to toggle the hardware.
 */
export const useSOSEngine = () => {
  const { sosActive, endTime } = useSOSStore();
  const [torchState, setTorchState] = useState(false);
  const sequenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Helper to sleep for a duration.
   */
  const wait = (ms: number) => new Promise<void>(resolve => {
    sequenceTimerRef.current = setTimeout(resolve, ms);
  });

  /**
   * Pulses the light for a specific duration.
   * Returns false if the operation should be aborted.
   */
  const playPulse = useCallback(async (duration: number): Promise<boolean> => {
    if (!useSOSStore.getState().sosActive) return false;
    
    setTorchState(true);
    await wait(duration);
    setTorchState(false);
    
    if (!useSOSStore.getState().sosActive) return false;
    await wait(ELEMENT_GAP);
    
    return useSOSStore.getState().sosActive;
  }, []);

  /**
   * Executes full SOS sequence pattern.
   */
  const runSOSCycle = useCallback(async () => {
    if (!useSOSStore.getState().sosActive) return;

    for (const duration of SOS_PATTERN) {
      const shouldContinue = await playPulse(duration);
      if (!shouldContinue) return;
    }

    // Wait before repeating the sequence
    await wait(SEQUENCE_GAP);
    
    if (useSOSStore.getState().sosActive) {
      runSOSCycle();
    }
  }, [playPulse]);

  /**
   * Derived state for the UI
   */
  const getRemainingTime = useCallback(() => {
    if (!sosActive || !endTime) return 0;
    return Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
  }, [sosActive, endTime]);

  // Effect to manage the SOS light loop
  useEffect(() => {
    if (sosActive) {
      runSOSCycle();
    } else {
      setTorchState(false);
      if (sequenceTimerRef.current) clearTimeout(sequenceTimerRef.current);
    }

    return () => {
      if (sequenceTimerRef.current) clearTimeout(sequenceTimerRef.current);
    };
  }, [sosActive, runSOSCycle]);

  // Effect to manage the countdown timer and automatic auto-stop
  useEffect(() => {
    if (sosActive && endTime) {
      countdownTimerRef.current = setInterval(() => {
        const now = Date.now();
        const diff = Math.max(0, Math.ceil((endTime - now) / 1000));
        
        if (diff <= 0) {
          useSOSStore.getState().setSosActive(false);
          if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
        }
      }, 500);
    } else {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    }

    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [sosActive, endTime]);

  return { torchState, remainingTime: getRemainingTime() };
};
