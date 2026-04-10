import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TimeWheelPicker } from '../TimeWheelPicker';

// Mock Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

describe('TimeWheelPicker', () => {
  it('renders correctly with default values', () => {
    const { getByText, getAllByText } = render(
      <TimeWheelPicker onTimeChange={() => {}} />
    );
    
    expect(getByText('H')).toBeTruthy();
    expect(getByText('M')).toBeTruthy();
    expect(getByText('S')).toBeTruthy();
    
    const zeroZeros = getAllByText('00');
    expect(zeroZeros.length).toBeGreaterThanOrEqual(3);
  });

  it('triggers onTimeChange when a wheel is scrolled', () => {
    const onTimeChange = jest.fn();
    const { getByTestId } = render(
      <TimeWheelPicker onTimeChange={onTimeChange} />
    );

    // Get the Seconds wheel (wheel-s)
    const wheelS = getByTestId('wheel-s');
    // ScrollView is the first child of the wheelWrapper View
    const scrollView = wheelS.findByType('RCTScrollView');

    // Simulate scroll to update scrollY
    fireEvent.scroll(scrollView, {
      nativeEvent: {
        contentOffset: { y: 25 * 3 },
      },
    });

    // Simulate momentum scroll end to index 5 (5 seconds)
    // ITEM_HEIGHT is 25 (from TimeWheelPicker.tsx)
    fireEvent(scrollView, 'momentumScrollEnd', {
      nativeEvent: {
        contentOffset: { y: 25 * 5 },
      },
    });

    expect(onTimeChange).toHaveBeenCalledWith(0, 0, 5);
  });
});
