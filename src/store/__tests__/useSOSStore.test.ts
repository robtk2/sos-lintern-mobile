import { useSOSStore } from '../useSOSStore';

describe('useSOSStore', () => {
  beforeEach(() => {
    useSOSStore.getState().resetSOS();
    // Setting defaults for tests
    useSOSStore.setState({
      batteryLevel: 0.8,
      batteryThreshold: 0.1,
      timerDuration: 0,
      sosActive: false,
    });
  });

  describe('setSosActive', () => {
    it('should activate SOS and set tracking data', () => {
      useSOSStore.getState().setSosActive(true);
      const state = useSOSStore.getState();
      expect(state.sosActive).toBe(true);
      expect(state.trackingStartBattery).toBe(0.8);
      expect(state.trackingStartTime).not.toBeNull();
    });

    it('should calculate endTime if timerDuration is set', () => {
      useSOSStore.setState({ timerDuration: 60 });
      useSOSStore.getState().setSosActive(true);
      expect(useSOSStore.getState().endTime).toBeGreaterThan(Date.now());
    });

    it('should NOT activate if battery is below threshold', () => {
      useSOSStore.setState({ batteryLevel: 0.05, batteryThreshold: 0.1 });
      useSOSStore.getState().setSosActive(true);
      expect(useSOSStore.getState().sosActive).toBe(false);
    });

    it('should clear tracking data when deactivating', () => {
      useSOSStore.getState().setSosActive(true);
      useSOSStore.getState().setSosActive(false);
      const state = useSOSStore.getState();
      expect(state.sosActive).toBe(false);
      expect(state.trackingStartBattery).toBeNull();
      expect(state.trackingStartTime).toBeNull();
    });
  });

  describe('setBatteryLevel', () => {
    it('should update level and check low battery', () => {
      useSOSStore.getState().setBatteryLevel(0.05);
      const state = useSOSStore.getState();
      expect(state.batteryLevel).toBe(0.05);
      expect(state.isLowBattery).toBe(true);
      expect(state.sosActive).toBe(false);
    });

    it('should stop SOS if battery becomes too low', () => {
      useSOSStore.setState({ batteryLevel: 0.8, sosActive: true });
      useSOSStore.getState().setBatteryLevel(0.05);
      expect(useSOSStore.getState().sosActive).toBe(false);
    });
  });

  describe('setTimerDuration', () => {
    it('should update duration', () => {
      useSOSStore.getState().setTimerDuration(120);
      expect(useSOSStore.getState().timerDuration).toBe(120);
    });

    it('should update endTime if SOS is already active', () => {
      useSOSStore.setState({ sosActive: true });
      useSOSStore.getState().setTimerDuration(300);
      expect(useSOSStore.getState().endTime).not.toBeNull();
    });
  });

  describe('setLocation', () => {
    it('should update coordinates', () => {
      useSOSStore.getState().setLocation(10, 20);
      expect(useSOSStore.getState().latitude).toBe(10);
      expect(useSOSStore.getState().longitude).toBe(20);
    });
  });

  describe('setBatteryThreshold', () => {
    it('should update threshold and check status', () => {
      useSOSStore.setState({ batteryLevel: 0.15, batteryThreshold: 0.1 });
      useSOSStore.getState().setBatteryThreshold(0.2);
      const state = useSOSStore.getState();
      expect(state.batteryThreshold).toBe(0.2);
      expect(state.isLowBattery).toBe(true);
      expect(state.sosActive).toBe(false);
    });
  });

  describe('setTimerEnabled', () => {
    it('should update state', () => {
      useSOSStore.getState().setTimerEnabled(true);
      expect(useSOSStore.getState().timerEnabled).toBe(true);
    });
  });

  describe('setSoundEnabled', () => {
    it('should update state', () => {
      useSOSStore.getState().setSoundEnabled(true);
      expect(useSOSStore.getState().soundEnabled).toBe(true);
    });
  });

  describe('setBurnRate', () => {
    it('should update state', () => {
      useSOSStore.getState().setBurnRate(150000);
      expect(useSOSStore.getState().burnRate).toBe(150000);
    });
  });

  describe('resetSOS', () => {
    it('should reset core state', () => {
      useSOSStore.setState({
        sosActive: true,
        latitude: 1,
        longitude: 2,
      });
      useSOSStore.getState().resetSOS();
      const state = useSOSStore.getState();
      expect(state.sosActive).toBe(false);
      expect(state.latitude).toBeNull();
      expect(state.longitude).toBeNull();
    });
  });
});
