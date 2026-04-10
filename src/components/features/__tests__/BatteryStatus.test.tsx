import React from 'react';
import { render } from '@testing-library/react-native';
import { BatteryStatus } from '../BatteryStatus';
import { useSOSStore } from '@store/useSOSStore';
import { theme } from '@theme';

// Mock useSOSStore
jest.mock('@store/useSOSStore', () => ({
  useSOSStore: jest.fn(),
}));

// Mock Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

describe('BatteryStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with normal battery level', () => {
    (useSOSStore as unknown as jest.Mock).mockReturnValue({
      batteryLevel: 0.85,
      isLowBattery: false,
      batteryThreshold: 0.15,
      sosActive: false,
      burnRate: null,
    });

    const { getByText } = render(<BatteryStatus />);
    
    expect(getByText('BATTERY LEVEL')).toBeTruthy();
    expect(getByText('85%')).toBeTruthy();
    expect(getByText(/Est\..*remaining/)).toBeTruthy();
  });

  it('renders correctly with low battery level', () => {
    (useSOSStore as unknown as jest.Mock).mockReturnValue({
      batteryLevel: 0.10,
      isLowBattery: true,
      batteryThreshold: 0.15,
      sosActive: false,
      burnRate: null,
    });

    const { getByText } = render(<BatteryStatus />);
    
    expect(getByText('LOW BATTERY - AUTO STOP ENABLED')).toBeTruthy();
    expect(getByText('10%')).toBeTruthy();
  });

  it('shows calibrated status when burnRate is available', () => {
    (useSOSStore as unknown as jest.Mock).mockReturnValue({
      batteryLevel: 0.50,
      isLowBattery: false,
      batteryThreshold: 0.15,
      sosActive: true,
      burnRate: 60000, // 1 min per 1%
    });

    const { getByText } = render(<BatteryStatus />);
    
    expect(getByText(/Calibrated/)).toBeTruthy();
    expect(getByText(/Est\..*50m remaining/)).toBeTruthy();
  });
});
