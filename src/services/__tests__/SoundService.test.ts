import { Audio } from 'expo-av';
import { SoundService } from '../SoundService';

// Mocking Audio.Sound
// Note: Variable must start with 'mock' to be used in jest.mock factory
const mockSoundInstance = {
  playAsync: jest.fn(),
  stopAsync: jest.fn(),
  unloadAsync: jest.fn(),
  getStatusAsync: jest.fn().mockResolvedValue({ isLoaded: true }),
};

jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn().mockImplementation(() => 
        Promise.resolve({ sound: mockSoundInstance })
      ),
    },
  },
}));

// Mock the asset require with the correct relative path from this test file
jest.mock('../../../assets/sounds/sos.mp3', () => 1);

describe('SoundService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Ensure the mock implementation is reset to default success
    (Audio.Sound.createAsync as jest.Mock).mockImplementation(() => 
      Promise.resolve({ sound: mockSoundInstance })
    );
    SoundService.sound = null;
    SoundService.isLoaded = false;
  });

  describe('preload', () => {
    it('should load sound and set isLoaded to true', async () => {
      await SoundService.preload();
      expect(Audio.Sound.createAsync).toHaveBeenCalled();
      expect(SoundService.isLoaded).toBe(true);
      expect(SoundService.sound).toBe(mockSoundInstance);
    });

    it('should not load if already loaded', async () => {
      SoundService.isLoaded = true;
      await SoundService.preload();
      expect(Audio.Sound.createAsync).not.toHaveBeenCalled();
    });

    it('should stop sound correctly and reset state', async () => {
      const mockSound = {
        getStatusAsync: jest.fn().mockResolvedValue({ isLoaded: true }),
        playAsync: jest.fn().mockResolvedValue({}),
        stopAsync: jest.fn().mockResolvedValue({}),
        unloadAsync: jest.fn().mockResolvedValue({}),
      };
      (Audio.Sound.createAsync as jest.Mock).mockResolvedValue({ sound: mockSound });
      
      await SoundService.playSOS();
      expect(Audio.Sound.createAsync).toHaveBeenCalled();

      await SoundService.stopSOS();
      expect(mockSound.stopAsync).toHaveBeenCalled();
    });

    it('should handle errors during preload', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (Audio.Sound.createAsync as jest.Mock).mockRejectedValue(new Error('Load Error'));
      
      await SoundService.preload();
      expect(consoleSpy).toHaveBeenCalled();
      expect(SoundService.isLoaded).toBe(false);
      consoleSpy.mockRestore();
    });
  });

  describe('playSOS', () => {
    it('should call preload if not loaded and then play', async () => {
      const preloadSpy = jest.spyOn(SoundService, 'preload');
      await SoundService.playSOS();
      expect(preloadSpy).toHaveBeenCalled();
      expect(mockSoundInstance.playAsync).toHaveBeenCalled();
    });

    it('should play directly if already loaded', async () => {
      SoundService.isLoaded = true;
      SoundService.sound = mockSoundInstance as any;
      
      await SoundService.playSOS();
      expect(mockSoundInstance.playAsync).toHaveBeenCalled();
    });
  });

  describe('stopSOS', () => {
    it('should call stopAsync if loaded', async () => {
      SoundService.isLoaded = true;
      SoundService.sound = mockSoundInstance as any;
      
      await SoundService.stopSOS();
      expect(mockSoundInstance.getStatusAsync).toHaveBeenCalled();
      expect(mockSoundInstance.stopAsync).toHaveBeenCalled();
    });

    it('should do nothing if not loaded', async () => {
      await SoundService.stopSOS();
      expect(mockSoundInstance.stopAsync).not.toHaveBeenCalled();
    });
  });

  describe('unload', () => {
    it('should unload sound and clear references', async () => {
      SoundService.isLoaded = true;
      SoundService.sound = mockSoundInstance as any;

      await SoundService.unload();
      expect(mockSoundInstance.unloadAsync).toHaveBeenCalled();
      expect(SoundService.sound).toBeNull();
      expect(SoundService.isLoaded).toBe(false);
    });

    it('should handle errors during playSOS', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      SoundService.isLoaded = true;
      SoundService.sound = mockSoundInstance as any;
      mockSoundInstance.playAsync.mockRejectedValueOnce(new Error('Play Error'));

      await SoundService.playSOS();
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error playing SOS'), expect.anything());
      consoleSpy.mockRestore();
    });

    it('should handle errors during stopSOS', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      SoundService.isLoaded = true;
      SoundService.sound = mockSoundInstance as any;
      mockSoundInstance.getStatusAsync.mockRejectedValueOnce(new Error('Status Error'));

      await SoundService.stopSOS();
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Warning stopping SOS'), expect.anything());
      consoleSpy.mockRestore();
    });

    it('should handle errors during unload', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      SoundService.isLoaded = true;
      SoundService.sound = mockSoundInstance as any;
      mockSoundInstance.getStatusAsync.mockRejectedValueOnce(new Error('Unload Error'));

      await SoundService.unload();
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error unloading sound'), expect.anything());
      consoleSpy.mockRestore();
    });
  });
});
