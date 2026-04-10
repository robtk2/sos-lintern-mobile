import React from 'react';
import { render } from '@testing-library/react-native';
import { BatteryWarning } from '../BatteryWarning';
import { useSOSStore } from '@store/useSOSStore';
import { useTheme } from '@theme';

// Mock store
jest.mock('@store/useSOSStore', () => ({
  useSOSStore: jest.fn(),
}));

describe('BatteryWarning', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render null when batteryWarningActive is false', () => {
    (useSOSStore as unknown as jest.Mock).mockReturnValue({
      batteryWarningActive: false,
      burnRate: null,
    });

    const { queryByText } = render(<BatteryWarning />);
    expect(queryByText(/RISK/)).toBeNull();
  });

  it('should render learning message when burnRate is null', () => {
    (useSOSStore as unknown as jest.Mock).mockReturnValue({
      batteryWarningActive: true,
      burnRate: null,
    });

    const { getByText } = render(<BatteryWarning />);
    expect(getByText(/Learning in progress/)).toBeTruthy();
  });

  it('should render depletion message when burnRate is assigned', () => {
    (useSOSStore as unknown as jest.Mock).mockReturnValue({
      batteryWarningActive: true,
      burnRate: 120000,
    });

    const { getByText } = render(<BatteryWarning />);
    expect(getByText(/Timer exceeds battery life/)).toBeTruthy();
  });
});
