import React from 'react';
import { render } from '@testing-library/react-native';
import { LocationDisplay } from '../LocationDisplay';
import { useSOSStore } from '@store/useSOSStore';

// Mock useSOSStore
jest.mock('@store/useSOSStore', () => ({
  useSOSStore: jest.fn(),
}));

describe('LocationDisplay', () => {
  it('renders nothing when latitude is null', () => {
    (useSOSStore as unknown as jest.Mock).mockReturnValue({
      latitude: null,
      longitude: null,
    });
    const { queryByText } = render(<LocationDisplay />);
    expect(queryByText(/GPS/)).toBeNull();
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
