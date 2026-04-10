import React from 'react';
import { render } from '@testing-library/react-native';
import { HomeScreen } from '../HomeScreen';
import { useHomeLogic } from '@hooks/useHomeLogic';
import { usePermissions } from '@hooks/usePermissions';

// Mock dependencies
jest.mock('@hooks/useHomeLogic', () => ({
  useHomeLogic: jest.fn(),
}));

jest.mock('@hooks/usePermissions', () => ({
  usePermissions: jest.fn(),
}));

// Mock all sub-components to focus on HomeScreen logic
jest.mock('@components/features/AppHeader', () => ({ AppHeader: () => null }));
jest.mock('@components/features/SOSActionButton', () => ({ SOSActionButton: () => null }));
jest.mock('@components/features/TimeWheelPicker', () => ({ TimeWheelPicker: () => null }));
jest.mock('@components/features/BatteryStatus', () => ({ BatteryStatus: () => null }));
jest.mock('@components/features/LocationDisplay', () => ({ LocationDisplay: () => null }));
jest.mock('@components/features/AudioToggle', () => ({ AudioToggle: () => null }));
jest.mock('@components/features/SOSCountdown', () => ({ SOSCountdown: () => null }));
jest.mock('@components/features/PermissionError', () => ({ PermissionError: () => null }));
jest.mock('@components/features/BatteryWarning', () => ({ BatteryWarning: () => null }));

// Mock Expo Camera
jest.mock('expo-camera', () => ({
  CameraView: () => null,
}));

describe('HomeScreen', () => {
  const mockLogic = {
    sosActive: false,
    torchState: false,
    toggleSOS: jest.fn(),
    handleTimeChange: jest.fn(),
  };

  const mockPermissions = {
    permissions: { camera: true, location: true },
    requestPermissions: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useHomeLogic as jest.Mock).mockReturnValue(mockLogic);
    (usePermissions as jest.Mock).mockReturnValue(mockPermissions);
  });

  it('renders the PermissionError screen when camera permission is false', () => {
    (usePermissions as jest.Mock).mockReturnValue({
      ...mockPermissions,
      permissions: { camera: false, location: true },
    });

    const { toJSON } = render(<HomeScreen />);
    expect(toJSON()).toBeNull(); // PermissionError is mocked to null
  });

  it('renders the main screen when camera permission is true', () => {
    const { toJSON } = render(<HomeScreen />);
    expect(toJSON()).not.toBeNull();
  });
});
