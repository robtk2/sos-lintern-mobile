import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

jest.mock('@theme', () => ({
  useTheme: () => ({
    colors: {
      primary: '#007AFF',
      text: '#FFFFFF',
      textSecondary: '#8E8E93',
    },
  }),
}));

describe('Button', () => {
  it('renders primary variant correctly', () => {
    const { getByText } = render(<Button label="Test" onPress={() => {}} />);
    expect(getByText('Test')).toBeTruthy();
  });

  it('renders icon variant correctly', () => {
    const { getByTestId } = render(<Button icon="flashlight" variant="icon" onPress={() => {}} testID="btn" />);
    expect(getByTestId('btn')).toBeTruthy();
  });

  it('renders ghost variant correctly', () => {
    const { getByText } = render(<Button label="Ghost" variant="ghost" onPress={() => {}} />);
    expect(getByText('Ghost')).toBeTruthy();
  });

  it('calls onPress when clicked', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button label="Click" onPress={onPress} />);
    fireEvent.press(getByText('Click'));
    expect(onPress).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button label="Disabled" onPress={onPress} disabled />);
    fireEvent.press(getByText('Disabled'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
