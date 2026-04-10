import { renderHook, act } from '@testing-library/react-native';
import { useSOSEngine } from '../useSOSEngine';
import { useSOSStore } from '@store/useSOSStore';

// Mock useSOSStore correctly as a function (hook) and object (getState)
// Variable MUST be prefixed with 'mock' to be used in hoisted jest.mock
const mockStoreState = {
  sosActive: false,
  endTime: null,
  setSosActive: jest.fn(),
};

jest.mock('@store/useSOSStore', () => {
  const hookMock = jest.fn(() => ({
    sosActive: mockStoreState.sosActive,
    endTime: mockStoreState.endTime,
    setSosActive: mockStoreState.setSosActive,
  }));
  
  (hookMock as any).getState = jest.fn(() => mockStoreState);
  (hookMock as any).setState = jest.fn((newState: any) => Object.assign(mockStoreState, newState));

  return {
    useSOSStore: hookMock,
  };
});

describe('useSOSEngine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-10T12:00:00Z'));
    
    // Reset the mock store state
    mockStoreState.sosActive = false;
    mockStoreState.endTime = null;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with torchState false and 0 remainingTime', () => {
    const { result } = renderHook(() => useSOSEngine());
    expect(result.current.torchState).toBe(false);
    expect(result.current.remainingTime).toBe(0);
  });

  it('should start SOS cycle when sosActive becomes true', async () => {
    mockStoreState.sosActive = true;
    const { result, rerender } = renderHook(() => useSOSEngine());
    
    rerender();

    // Advance 10ms to let the useEffect start the cycle
    await act(async () => {
      jest.advanceTimersByTime(10);
    });
    
    // Pulse starts: setTorchState(true)
    expect(result.current.torchState).toBe(true);

    // After DOT (250ms)
    await act(async () => {
      jest.advanceTimersByTime(250);
    });
    
    expect(result.current.torchState).toBe(false);
  });

  it('should handle countdown and auto-stop', async () => {
    const startTime = Date.now();
    const endTime = startTime + 5000;
    mockStoreState.sosActive = true;
    mockStoreState.endTime = endTime;

    const { result } = renderHook(() => useSOSEngine());

    expect(result.current.remainingTime).toBe(5);

    await act(async () => {
      jest.advanceTimersByTime(2000);
      jest.setSystemTime(new Date(startTime + 2000));
    });

    // Remaning time should update because the hook uses Date.now()
    expect(result.current.remainingTime).toBe(3);

    await act(async () => {
      jest.advanceTimersByTime(3100); // Pass the 5s mark
      jest.setSystemTime(new Date(startTime + 5100));
    });

    expect(mockStoreState.setSosActive).toHaveBeenCalledWith(false);
  });

  it('should stop cycles and clear state when sosActive becomes false', async () => {
    mockStoreState.sosActive = true;
    const { result, rerender } = renderHook(() => useSOSEngine());

    await act(async () => {
      jest.advanceTimersByTime(10);
    });
    expect(result.current.torchState).toBe(true);

    // Deactivate
    mockStoreState.sosActive = false;
    rerender();

    expect(result.current.torchState).toBe(false);
    
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    // Should stay false
    expect(result.current.torchState).toBe(false);
  });

  it('should repeat the cycle after SEQUENCE_GAP', async () => {
    mockStoreState.sosActive = true;
    const { result } = renderHook(() => useSOSEngine());

    // Advance 8 seconds in chunks to let async cycles process
    for (let i = 0; i < 4; i++) {
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
    }

    // Small extra padding to ensure the recursive call and setTorchState(true) hit
    await act(async () => {
      jest.advanceTimersByTime(100);
      await Promise.resolve();
    });

    // Should have started the second cycle
    expect(result.current.torchState).toBe(true);
  });

  it('should stop SOS cycle immediately if sosActive is set to false during pulse', async () => {
    mockStoreState.sosActive = true;
    const { result, rerender } = renderHook(() => useSOSEngine());

    await act(async () => {
      // Start cycle
      jest.advanceTimersByTime(100);
    });

    // Toggle off
    mockStoreState.sosActive = false;
    rerender();

    await act(async () => {
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.torchState).toBe(false);
  });
});
