import { renderHook, act } from '@testing-library/react-native';
import { useHomeLogic } from '../useHomeLogic';
import { useSOSStore } from '@store/useSOSStore';
import { useSOSEngine } from '@hooks/useSOSEngine';
import { usePermissions } from '../usePermissions';

// Mock dependecies
jest.mock('@store/useSOSStore', () => ({
  useSOSStore: jest.fn(),
}));

jest.mock('@hooks/useSOSEngine', () => ({
  useSOSEngine: jest.fn(),
}));

jest.mock('../usePermissions', () => ({
  usePermissions: jest.fn(),
}));

jest.mock('../useAudioSync', () => ({
  useAudioSync: jest.fn(),
}));

jest.mock('../useServiceLifecycle', () => ({
  useServiceLifecycle: jest.fn(),
}));

describe('useHomeLogic', () => {
  const mockSetSosActive = jest.fn();
  const mockSetTimerDuration = jest.fn();
  const mockSetBatteryWarningActive = jest.fn();
  const mockRequestPermissions = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useSOSStore as unknown as jest.Mock).mockReturnValue({
      sosActive: false,
      setSosActive: mockSetSosActive,
      soundEnabled: true,
      setTimerDuration: mockSetTimerDuration,
      setBatteryWarningActive: mockSetBatteryWarningActive,
      batteryLevel: 1.0,
      burnRate: null,
      endTime: null,
    });

    (useSOSEngine as unknown as jest.Mock).mockReturnValue({
      torchState: false,
    });

    (usePermissions as unknown as jest.Mock).mockReturnValue({
      hasPermission: true,
      requestPermissions: mockRequestPermissions,
    });
  });

  it('should toggle SOS when permissions are granted', async () => {
    const { result } = renderHook(() => useHomeLogic());
    
    await act(async () => {
      await result.current.handleSOSToggle();
    });

    expect(mockSetSosActive).toHaveBeenCalledWith(true);
  });

  it('should request permissions if not granted before toggle', async () => {
    (usePermissions as unknown as jest.Mock).mockReturnValue({
      hasPermission: false,
      requestPermissions: mockRequestPermissions.mockResolvedValue(true),
    });

    const { result } = renderHook(() => useHomeLogic());
    
    await act(async () => {
      await result.current.handleSOSToggle();
    });

    expect(mockRequestPermissions).toHaveBeenCalled();
    expect(mockSetSosActive).toHaveBeenCalledWith(true);
  });

  it('should handle time changes correctly', () => {
    const { result } = renderHook(() => useHomeLogic());
    
    act(() => {
      result.current.handleTimeChange(1, 30, 0); // 1h 30m
    });

    // 1h (3600) + 30m (1800) = 5400s
    expect(mockSetTimerDuration).toHaveBeenCalledWith(5400);
  });

  it('should NOT toggle SOS if permissions are denied after request', async () => {
    (usePermissions as unknown as jest.Mock).mockReturnValue({
      hasPermission: false,
      requestPermissions: mockRequestPermissions.mockResolvedValue(false),
    });

    const { result } = renderHook(() => useHomeLogic());
    
    await act(async () => {
      await result.current.handleSOSToggle();
    });

    expect(mockRequestPermissions).toHaveBeenCalled();
    expect(mockSetSosActive).not.toHaveBeenCalled();
  });

  it('should trigger battery warning if timer exceeds battery estimate', () => {
    // We override for this specific test
    const localMockSetWarning = jest.fn();
    (useSOSStore as unknown as jest.Mock).mockReturnValue({
      sosActive: true,
      endTime: Date.now() + 600000, // 10 minutes remaining
      batteryLevel: 0.1, // 10% battery
      burnRate: 30000, // 30s per 1% = 300s total = 5 minutes
      setBatteryWarningActive: localMockSetWarning,
      soundEnabled: true,
      setTimerDuration: mockSetTimerDuration,
      setSosActive: mockSetSosActive,
    });

    jest.useFakeTimers();
    renderHook(() => useHomeLogic());

    act(() => {
      jest.advanceTimersByTime(2100);
    });

    // 600s remaining > 300s battery estimate -> warning should be true
    expect(localMockSetWarning).toHaveBeenCalledWith(true);
    jest.useRealTimers();
  });

  it('should disable battery warning when SOS is inactive', () => {
    const localMockSetWarning = jest.fn();
    (useSOSStore as unknown as jest.Mock).mockReturnValue({
      sosActive: false,
      endTime: null,
      setBatteryWarningActive: localMockSetWarning,
      soundEnabled: true,
      setTimerDuration: mockSetTimerDuration,
      setSosActive: mockSetSosActive,
    });

    renderHook(() => useHomeLogic());
    expect(localMockSetWarning).toHaveBeenCalledWith(false);
  });
});
