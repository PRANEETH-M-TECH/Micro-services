import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Landing from './Landing';

describe('Landing', () => {
  it('shows the Enter Community call to action', () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    );
    expect(screen.getByText('Enter Community')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Communa' })).toBeInTheDocument();
  });
});
