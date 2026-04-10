import { renderHook, act } from '@testing-library/react-native';
import { useAudioSync } from '../useAudioSync';
import { SoundService } from '@services/SoundService';

// Mock SoundService
jest.mock('@services/SoundService', () => ({
  SoundService: {
    playSOS: jest.fn(),
    stopSOS: jest.fn(),
  },
}));

describe('useAudioSync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should start sound when sosActive and soundEnabled are true', () => {
    renderHook(() => useAudioSync(true, true));
    expect(SoundService.playSOS).toHaveBeenCalled();
  });

  it('should stop sound when sosActive becomes false', () => {
    const { rerender } = renderHook(
      ({ active, enabled }) => useAudioSync(active, enabled),
      { initialProps: { active: true, enabled: true } }
    );
    
    expect(SoundService.playSOS).toHaveBeenCalled();

    rerender({ active: false, enabled: true });
    expect(SoundService.stopSOS).toHaveBeenCalled();
  });

  it('should stop sound when soundEnabled becomes false', () => {
    const { rerender } = renderHook(
      ({ active, enabled }) => useAudioSync(active, enabled),
      { initialProps: { active: true, enabled: true } }
    );
    
    rerender({ active: true, enabled: false });
    expect(SoundService.stopSOS).toHaveBeenCalled();
  });
});
