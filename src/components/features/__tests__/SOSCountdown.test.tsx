import React from 'react';
import { render } from '@testing-library/react-native';
import { SOSCountdown } from '../SOSCountdown';
import { useSOSStore } from '@store/useSOSStore';
import { useSOSEngine } from '@hooks/useSOSEngine';

// Mock dependecies
jest.mock('@store/useSOSStore', () => ({
  useSOSStore: jest.fn(),
}));

jest.mock('@hooks/useSOSEngine', () => ({
  useSOSEngine: jest.fn(),
}));

describe('SOSCountdown', () => {
  it('renders nothing when not active', () => {
    (useSOSStore as unknown as jest.Mock).mockReturnValue({ sosActive: false });
    (useSOSEngine as unknown as jest.Mock).mockReturnValue({ remainingTime: 0 });

    const { toJSON } = render(<SOSCountdown />);
    expect(toJSON()).toBeNull();
  });

  it('renders correctly when active with time remaining', () => {
    (useSOSStore as unknown as jest.Mock).mockReturnValue({ sosActive: true });
    (useSOSEngine as unknown as jest.Mock).mockReturnValue({ remainingTime: 125 }); // 00:02:05

    const { getByText } = render(<SOSCountdown />);
    expect(getByText('00:02:05')).toBeTruthy();
    expect(getByText('SIGNAL ENDING')).toBeTruthy();
  });
});
