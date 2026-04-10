import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PermissionError } from '../PermissionError';

jest.mock('@hooks/usePermissions', () => ({
  usePermissions: jest.fn(() => ({
    permissions: { camera: false, location: false },
    requestPermissions: jest.fn(),
  })),
}));

describe('PermissionError', () => {
  it('renders the provided message in full-screen mode', () => {
    const { getByText } = render(
      <PermissionError message="Camera permission is required for emergency signals." />
    );
    expect(getByText(/Camera permission is required/)).toBeTruthy();
  });

  it('renders in inline mode without wrapping Screen', () => {
    const { getByText } = render(
      <PermissionError
        isInline
        message="Location permission required for rescue coordinates."
      />
    );
    expect(getByText(/Location permission required/)).toBeTruthy();
  });

  it('calls onRetry when TAP TO RETRY is pressed', () => {
    const mockRetry = jest.fn();
    const { getByText } = render(
      <PermissionError
        message="Camera permission is required."
        onRetry={mockRetry}
      />
    );
    fireEvent.press(getByText('TAP TO RETRY'));
    expect(mockRetry).toHaveBeenCalled();
  });

  it('does not render retry button when onRetry is not provided', () => {
    const { queryByText } = render(
      <PermissionError message="Permission needed." />
    );
    expect(queryByText('TAP TO RETRY')).toBeNull();
  });
});
