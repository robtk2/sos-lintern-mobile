import React from 'react';
import { render } from '@testing-library/react-native';
import { PermissionError } from '../PermissionError';

describe('PermissionError', () => {
  it('renders the camera permission required message', () => {
    const { getByText } = render(<PermissionError />);
    expect(getByText(/Camera permission is required/)).toBeTruthy();
  });
});
