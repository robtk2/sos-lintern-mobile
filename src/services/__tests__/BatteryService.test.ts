import * as Battery from 'expo-battery';
import { BatteryService } from '../BatteryService';
import { useSOSStore } from '@store/useSOSStore';

// Mocking expo-battery
jest.mock('expo-battery', () => ({
  getBatteryLevelAsync: jest.fn(),
  addBatteryLevelListener: jest.fn(),
}));

describe('BatteryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSOSStore.setState({
      batteryLevel: 1,
      batteryThreshold: 0.1,
      sosActive: false,
      trackingStartTime: null,
      trackingStartBattery: null,
      burnRate: null,
    });
  });

  describe('startMonitoring', () => {
    it('should get initial battery level and set up listener', async () => {
      (Battery.getBatteryLevelAsync as jest.Mock).mockResolvedValue(0.85);
      const mockRemove = jest.fn();
      (Battery.addBatteryLevelListener as jest.Mock).mockReturnValue({ remove: mockRemove });

      await BatteryService.startMonitoring();

      expect(Battery.getBatteryLevelAsync).toHaveBeenCalled();
      expect(useSOSStore.getState().batteryLevel).toBe(0.85);
      expect(Battery.addBatteryLevelListener).toHaveBeenCalled();
      expect(BatteryService.subscription).toBeDefined();
    });

    it('should handle errors during initial level capture', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (Battery.getBatteryLevelAsync as jest.Mock).mockRejectedValueOnce(new Error('Battery Error'));
      
      await BatteryService.startMonitoring();
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to get initial battery level'), expect.anything());
      consoleSpy.mockRestore();
    });
  });

  describe('handleLevelChange', () => {
    it('should update battery level in store', () => {
      BatteryService.handleLevelChange(0.5);
      expect(useSOSStore.getState().batteryLevel).toBe(0.5);
    });

    it('should trigger calibration', () => {
      const calibrateSpy = jest.spyOn(BatteryService, 'calibrateHeuristics');
      BatteryService.handleLevelChange(0.8);
      expect(calibrateSpy).toHaveBeenCalled();
    });
  });

  describe('calibrateHeuristics', () => {
    it('should not calibrate if SOS is not active', () => {
      const setBurnRate = jest.fn();
      const mockStore = { 
        sosActive: false, 
        trackingStartTime: Date.now(), 
        trackingStartBattery: 0.9,
        setBurnRate 
      };
      
      BatteryService.calibrateHeuristics(0.8, mockStore);
      expect(setBurnRate).not.toHaveBeenCalled();
    });

    it('should calculate burn rate when drop is >= 1%', () => {
      const startTime = Date.now() - 60000; // 1 minute ago
      const mockStore = {
        sosActive: true,
        trackingStartTime: startTime,
        trackingStartBattery: 0.9,
        setBurnRate: jest.fn(),
      };

      BatteryService.calibrateHeuristics(0.88, mockStore); // 2% drop
      expect(mockStore.setBurnRate).toHaveBeenCalled();
      
      const setBurnRateArgs = (mockStore.setBurnRate as jest.Mock).mock.calls[0][0];
      // elapsed = 60000ms. drop = 0.02. drop*100 = 2. rate = 60000 / 2 = 30000
      expect(setBurnRateArgs).toBeCloseTo(30000, 0);
    });

    it('should not calculate if drop is too small (<1%)', () => {
      const mockStore = {
        sosActive: true,
        trackingStartTime: Date.now(),
        trackingStartBattery: 0.9,
        setBurnRate: jest.fn(),
      };

      BatteryService.calibrateHeuristics(0.895, mockStore); // 0.5% drop
      expect(mockStore.setBurnRate).not.toHaveBeenCalled();
    });
  });

  describe('isBatterySufficient', () => {
    it('should return true if level > threshold', async () => {
      (Battery.getBatteryLevelAsync as jest.Mock).mockResolvedValue(0.5);
      useSOSStore.setState({ batteryThreshold: 0.2 });
      
      const result = await BatteryService.isBatterySufficient();
      expect(result).toBe(true);
    });

    it('should return false if level <= threshold', async () => {
      (Battery.getBatteryLevelAsync as jest.Mock).mockResolvedValue(0.15);
      useSOSStore.setState({ batteryThreshold: 0.2 });
      
      const result = await BatteryService.isBatterySufficient();
      expect(result).toBe(false);
    });
  });

  describe('stopMonitoring', () => {
    it('should remove subscription', () => {
      const mockRemove = jest.fn();
      BatteryService.subscription = { remove: mockRemove } as any;
      
      BatteryService.stopMonitoring();
      expect(mockRemove).toHaveBeenCalled();
      expect(BatteryService.subscription).toBeNull();
    });
  });
});
