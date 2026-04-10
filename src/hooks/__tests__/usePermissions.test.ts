import { renderHook, waitFor, act } from '@testing-library/react-native';
import { usePermissions } from '../usePermissions';
import { FlashlightService } from '@services/FlashlightService';

// Mock FlashlightService
jest.mock('@services/FlashlightService', () => ({
  FlashlightService: {
    requestPermissions: jest.fn(),
  },
}));

describe('usePermissions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true if FlashlightService grants permissions', async () => {
    (FlashlightService.requestPermissions as jest.Mock).mockResolvedValue(true);

    const { result } = renderHook(() => usePermissions());
    
    await waitFor(() => {
      expect(result.current.hasPermission).toBe(true);
    });
  });

  it('should return false if FlashlightService denies permissions', async () => {
    (FlashlightService.requestPermissions as jest.Mock).mockResolvedValue(false);

    const { result } = renderHook(() => usePermissions());
    
    await waitFor(() => {
      expect(result.current.hasPermission).toBe(false);
    });
  });

  it('should update state and return boolean when requestPermissions is called manually', async () => {
    // Initial mount check returns false
    (FlashlightService.requestPermissions as jest.Mock).mockResolvedValueOnce(false);
    const { result } = renderHook(() => usePermissions());
    
    await waitFor(() => expect(result.current.hasPermission).toBe(false));

    // Manual call returns true
    (FlashlightService.requestPermissions as jest.Mock).mockResolvedValueOnce(true);
    let granted: boolean = false;
    await act(async () => {
       granted = await result.current.requestPermissions();
    });

    expect(granted).toBe(true);
    expect(result.current.hasPermission).toBe(true);
  });
});
