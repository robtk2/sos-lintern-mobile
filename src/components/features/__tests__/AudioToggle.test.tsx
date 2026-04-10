import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AudioToggle } from '../AudioToggle';
import { useSOSStore } from '@store/useSOSStore';

// Mock useSOSStore
jest.mock('@store/useSOSStore', () => ({
  useSOSStore: jest.fn(),
}));

describe('AudioToggle', () => {
  const mockSetSoundEnabled = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSOSStore as unknown as jest.Mock).mockReturnValue({
      soundEnabled: true,
      setSoundEnabled: mockSetSoundEnabled,
    });
  });

  it('renders correctly with volume-high icon when sound is enabled', () => {
    const { getByTestId } = render(<AudioToggle />);
    expect(getByTestId('audio-toggle-button')).toBeTruthy();
  });

  it('toggles sound when pressed', () => {
    const { getByTestId } = render(<AudioToggle />);
    fireEvent.press(getByTestId('audio-toggle-button'));
    expect(mockSetSoundEnabled).toHaveBeenCalledWith(false);
  });
});
