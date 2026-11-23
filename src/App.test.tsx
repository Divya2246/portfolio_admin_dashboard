import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './app/App';

test('renders portfolio admin dashboard', () => {
  render(<App />);
  const heading = screen.getByText(/portfolio admin dashboard/i);
  expect(heading).toBeInTheDocument();
});
