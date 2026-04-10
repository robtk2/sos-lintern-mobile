import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SOSActionButton } from '../SOSActionButton';
import { theme } from '@theme';

// Mock Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock BlurView
jest.mock('expo-blur', () => ({
  BlurView: ({ children }: any) => <>{children}</>,
}));

describe('SOSActionButton', () => {
  it('renders START SOS when inactive', () => {
    const { getByText } = render(
      <SOSActionButton active={false} onPress={() => {}} />
    );
    expect(getByText('START SOS')).toBeTruthy();
  });

  it('renders STOP SOS when active', () => {
    const { getByText } = render(
      <SOSActionButton active={true} onPress={() => {}} />
    );
    expect(getByText('STOP SOS')).toBeTruthy();
  });

  it('calls onPress when clicked', () => {
    const mockPress = jest.fn();
    const { getByText } = render(
      <SOSActionButton active={false} onPress={mockPress} />
    );
    
    fireEvent.press(getByText('START SOS'));
    expect(mockPress).toHaveBeenCalled();
  });

  it('does not call onPress when disabled', () => {
    const mockPress = jest.fn();
    const { getByText } = render(
      <SOSActionButton active={false} onPress={mockPress} disabled={true} />
    );
    
    fireEvent.press(getByText('START SOS'));
    expect(mockPress).not.toHaveBeenCalled();
  });
});
