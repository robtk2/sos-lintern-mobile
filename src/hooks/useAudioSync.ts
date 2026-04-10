import { useEffect } from 'react';
import { SoundService } from '@services/SoundService';

/**
 * Hook to synchronize the SOS audio playback with the application state.
 * 
 * @param sosActive Whether the SOS signal is currently active.
 * @param soundEnabled Whether the user has enabled audio feedback.
 */
export const useAudioSync = (sosActive: boolean, soundEnabled: boolean) => {
  useEffect(() => {
    if (sosActive && soundEnabled) {
      SoundService.playSOS();
    } else {
      SoundService.stopSOS();
    }

    // Ensure audio stops if the component using this hook unmounts
    return () => {
      SoundService.stopSOS();
    };
  }, [sosActive, soundEnabled]);
};
