import * as Location from 'expo-location';
import { LocationService } from '../LocationService';
import { useSOSStore } from '@store/useSOSStore';

// Mocking expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  Accuracy: { Balanced: 3 },
}));

describe('LocationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSOSStore.setState({ latitude: null, longitude: null });
  });

  describe('requestPermissions', () => {
    it('should return true when granted', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
      const result = await LocationService.requestPermissions();
      expect(result).toBe(true);
    });

    it('should return false when denied', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
      const result = await LocationService.requestPermissions();
      expect(result).toBe(false);
    });
  });

  describe('updateCurrentLocation', () => {
    it('should update store with location if granted', async () => {
      (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
      (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
        coords: { latitude: 40.4168, longitude: -3.7038 }
      });

      await LocationService.updateCurrentLocation();

      expect(Location.getCurrentPositionAsync).toHaveBeenCalledWith({
        accuracy: Location.Accuracy.Balanced,
      });
      expect(useSOSStore.getState().latitude).toBe(40.4168);
      expect(useSOSStore.getState().longitude).toBe(-3.7038);
    });

    it('should do nothing if permissions are not granted', async () => {
      (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
      
      await LocationService.updateCurrentLocation();
      expect(Location.getCurrentPositionAsync).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
      (Location.getCurrentPositionAsync as jest.Mock).mockRejectedValue(new Error('GPS Error'));

      await LocationService.updateCurrentLocation();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
