import { renderHook } from '@testing-library/react-native';
import { useServiceLifecycle } from '../useServiceLifecycle';
import { BatteryService } from '@services/BatteryService';
import { LocationService } from '@services/LocationService';
import { SoundService } from '@services/SoundService';
import { useKeepAwake } from 'expo-keep-awake';

// Mock Services
jest.mock('@services/BatteryService', () => ({
  BatteryService: {
    startMonitoring: jest.fn(),
    stopMonitoring: jest.fn(),
  },
}));

jest.mock('@services/LocationService', () => ({
  LocationService: {
    updateCurrentLocation: jest.fn(),
  },
}));

jest.mock('@services/SoundService', () => ({
  SoundService: {
    preload: jest.fn(),
    unload: jest.fn(),
  },
}));

// Mock expo-keep-awake
jest.mock('expo-keep-awake', () => ({
  useKeepAwake: jest.fn(),
}));

describe('useServiceLifecycle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should start all services on mount', () => {
    renderHook(() => useServiceLifecycle());

    expect(useKeepAwake).toHaveBeenCalled();
    expect(BatteryService.startMonitoring).toHaveBeenCalled();
    expect(LocationService.updateCurrentLocation).toHaveBeenCalled();
    expect(SoundService.preload).toHaveBeenCalled();
  });

  it('should clean up services on unmount', () => {
    const { unmount } = renderHook(() => useServiceLifecycle());

    unmount();

    expect(BatteryService.stopMonitoring).toHaveBeenCalled();
    expect(SoundService.unload).toHaveBeenCalled();
  });
});
