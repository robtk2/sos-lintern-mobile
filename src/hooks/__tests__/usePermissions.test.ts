import { renderHook, waitFor, act } from '@testing-library/react-native';
import { usePermissions } from '../usePermissions';
import { FlashlightService } from '@services/FlashlightService';
import { LocationService } from '@services/LocationService';

// Mock Services
jest.mock('@services/FlashlightService', () => ({
  FlashlightService: {
    requestPermissions: jest.fn(),
  },
}));

jest.mock('@services/LocationService', () => ({
  LocationService: {
    requestPermissions: jest.fn(),
  },
}));

describe('usePermissions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true if services grant permissions', async () => {
    (FlashlightService.requestPermissions as jest.Mock).mockResolvedValue(true);
    (LocationService.requestPermissions as jest.Mock).mockResolvedValue(true);

    const { result } = renderHook(() => usePermissions());
    
    await waitFor(() => {
      expect(result.current.permissions.camera).toBe(true);
      expect(result.current.permissions.location).toBe(true);
    });
  });

  it('should handle mixed permissions', async () => {
    (FlashlightService.requestPermissions as jest.Mock).mockResolvedValue(true);
    (LocationService.requestPermissions as jest.Mock).mockResolvedValue(false);

    const { result } = renderHook(() => usePermissions());
    
    await waitFor(() => {
      expect(result.current.permissions.camera).toBe(true);
      expect(result.current.permissions.location).toBe(false);
    });
  });

  it('should update state and return boolean when requestPermissions is called manually', async () => {
    // Initial mount check returns false
    (FlashlightService.requestPermissions as jest.Mock).mockResolvedValue(false);
    (LocationService.requestPermissions as jest.Mock).mockResolvedValue(false);
    
    const { result } = renderHook(() => usePermissions());
    
    await waitFor(() => expect(result.current.permissions.camera).toBe(false));

    // Manual call returns true
    (FlashlightService.requestPermissions as jest.Mock).mockResolvedValueOnce(true);
    (LocationService.requestPermissions as jest.Mock).mockResolvedValueOnce(true);
    
    let allGranted: boolean = false;
    await act(async () => {
       allGranted = await result.current.requestPermissions();
    });

    expect(allGranted).toBe(true);
    expect(result.current.permissions.camera).toBe(true);
    expect(result.current.permissions.location).toBe(true);
  });
});
