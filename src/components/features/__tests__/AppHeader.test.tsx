import React from 'react';
import { render } from '@testing-library/react-native';
import { AppHeader } from '../AppHeader';

describe('AppHeader', () => {
  it('renders title and tagline', () => {
    const { getByText } = render(<AppHeader />);
    expect(getByText('SOS LINTERN')).toBeTruthy();
    expect(getByText('RESCUE NODE ALPHA')).toBeTruthy();
  });
});
