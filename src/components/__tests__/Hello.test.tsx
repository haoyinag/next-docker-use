import React from 'react';
import { render, screen } from '@testing-library/react';
import { Hello } from '@/components/Hello';

describe('Hello', () => {
  it('renders default greeting', () => {
    render(<Hello />);
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
  });

  it('renders custom name', () => {
    render(<Hello name="Alice" />);
    expect(screen.getByText('Hello, Alice!')).toBeInTheDocument();
  });
});
