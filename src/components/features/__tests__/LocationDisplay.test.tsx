import React from 'react';
import { render } from '@testing-library/react-native';
import { LocationDisplay } from '../LocationDisplay';
import { useSOSStore } from '@store/useSOSStore';
import { usePermissions } from '@hooks/usePermissions';

// Mock store
jest.mock('@store/useSOSStore', () => ({
  useSOSStore: jest.fn(),
}));

// Mock permissions hook
jest.mock('@hooks/usePermissions', () => ({
  usePermissions: jest.fn(),
}));

const mockPermissionsGranted = {
  permissions: { camera: true, location: true },
  requestPermissions: jest.fn(),
};

describe('LocationDisplay', () => {
  beforeEach(() => {
    (usePermissions as jest.Mock).mockReturnValue(mockPermissionsGranted);
  });

  it('shows permission denied message when location permission is missing', () => {
    (usePermissions as jest.Mock).mockReturnValue({
      permissions: { camera: true, location: false },
      requestPermissions: jest.fn(),
    });
    (useSOSStore as unknown as jest.Mock).mockReturnValue({
      latitude: null,
      longitude: null,
    });
    const { getByText } = render(<LocationDisplay />);
    expect(getByText(/Location permission required/)).toBeTruthy();
  });

  it('shows waiting message when permission granted but coords not yet available', () => {
    (useSOSStore as unknown as jest.Mock).mockReturnValue({
      latitude: null,
      longitude: null,
    });
    const { getByText } = render(<LocationDisplay />);
    expect(getByText(/WAITING FOR SIGNAL/)).toBeTruthy();
    expect(getByText(/GPS STATUS/)).toBeTruthy();
  });

  it('renders coordinates correctly when available', () => {
    (useSOSStore as unknown as jest.Mock).mockReturnValue({
      latitude: 40.4168,
      longitude: -3.7038,
    });
    const { getByText } = render(<LocationDisplay />);
    expect(getByText(/40\.4168/)).toBeTruthy();
    expect(getByText(/-3\.7038/)).toBeTruthy();
  });
});
