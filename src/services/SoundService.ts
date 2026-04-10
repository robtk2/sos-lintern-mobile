import { Audio } from 'expo-av';

/**
 * Service to manage the SOS audio signaling.
 * Uses a local high-quality Morse CW sequence to ensure offline availability.
 * Follows a singleton pattern for resource management.
 */
export const SoundService = {
  sound: null as Audio.Sound | null,
  isLoaded: false,

  /**
   * Pre-loads the SOS sound into memory to reduce latency during activation.
   */
  async preload() {
    if (this.isLoaded) return;

    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/sos.mp3'),
        { shouldPlay: false, isLooping: true, volume: 1.0 }
      );
      this.sound = sound;
      this.isLoaded = true;
    } catch (error) {
      console.error('[SoundService] Failed to preload sound:', error);
    }
  },

  /**
   * Starts playing the SOS sequence.
   * Ensures sound is loaded before playing.
   */
  async playSOS() {
    try {
      if (!this.isLoaded) {
        await this.preload();
      }
      
      if (this.sound) {
        await this.sound.playAsync();
      }
    } catch (error) {
      console.error('[SoundService] Error playing SOS:', error);
    }
  },

  /**
   * Stops the SOS sound playback.
   */
  async stopSOS() {
    if (!this.sound || !this.isLoaded) return;

    try {
      const status = await this.sound.getStatusAsync();
      if (status.isLoaded) {
        await this.sound.stopAsync();
      }
    } catch (error) {
      // Silence errors if the sound was already being handled elsewhere
      console.warn('[SoundService] Warning stopping SOS:', error);
    }
  },

  /**
   * Unloads the sound from memory.
   */
  async unload() {
    if (!this.sound) return;
    
    try {
      const status = await this.sound.getStatusAsync();
      if (status.isLoaded) {
        await this.sound.unloadAsync();
      }
      this.sound = null;
      this.isLoaded = false;
    } catch (error) {
      console.error('[SoundService] Error unloading sound:', error);
    }
  }
};
