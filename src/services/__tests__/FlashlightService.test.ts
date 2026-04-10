import { Camera } from 'expo-camera';
import { FlashlightService } from '../FlashlightService';

jest.mock('expo-camera', () => ({
  Camera: {
    requestCameraPermissionsAsync: jest.fn(),
    getCameraPermissionsAsync: jest.fn(),
  },
}));

describe('FlashlightService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requestPermissions', () => {
    it('should return true when permission is granted', async () => {
      (Camera.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
      const result = await FlashlightService.requestPermissions();
      expect(result).toBe(true);
      expect(Camera.requestCameraPermissionsAsync).toHaveBeenCalled();
    });

    it('should return false when permission is denied', async () => {
      (Camera.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
      const result = await FlashlightService.requestPermissions();
      expect(result).toBe(false);
    });

    it('should return false and log error on failure', async () => {
      const consoleSpacer = jest.spyOn(console, 'error').mockImplementation();
      (Camera.requestCameraPermissionsAsync as jest.Mock).mockRejectedValue(new Error('Test Error'));
      
      const result = await FlashlightService.requestPermissions();
      expect(result).toBe(false);
      expect(consoleSpacer).toHaveBeenCalled();
      consoleSpacer.mockRestore();
    });
  });

  describe('checkPermissions', () => {
    it('should return true when status is granted', async () => {
      (Camera.getCameraPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
      const result = await FlashlightService.checkPermissions();
      expect(result).toBe(true);
    });

    it('should return false when status is not granted', async () => {
      (Camera.getCameraPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'undetermined' });
      const result = await FlashlightService.checkPermissions();
      expect(result).toBe(false);
    });

    it('should return false and log error on failure', async () => {
      const consoleSpacer = jest.spyOn(console, 'error').mockImplementation();
      (Camera.getCameraPermissionsAsync as jest.Mock).mockRejectedValue(new Error('Check Error'));
      
      const result = await FlashlightService.checkPermissions();
      expect(result).toBe(false);
      expect(consoleSpacer).toHaveBeenCalled();
      consoleSpacer.mockRestore();
    });
  });
});
