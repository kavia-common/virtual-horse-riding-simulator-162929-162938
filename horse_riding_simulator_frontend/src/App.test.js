import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app shell with topbar and sidebar', () => {
  render(<App />);
  expect(screen.getByLabelText(/Horse Riding Simulator Shell/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Sidebar Controls and Tutorials/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Main Simulation Area/i)).toBeInTheDocument();
});
