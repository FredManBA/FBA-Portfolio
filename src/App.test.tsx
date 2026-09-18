import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('language', () => {
  it('starts in Spanish and switches to English without reloading', async () => {
    const user = userEvent.setup();
    render(<App />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Desarrollador de Software');
    expect(screen.getByRole('link', { name: 'Ver proyectos' })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('es');

    await user.click(screen.getByRole('button', { name: 'English' }));

    expect(heading).toHaveTextContent('Software Developer');
    expect(screen.getByRole('link', { name: 'View projects' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement.lang).toBe('en');
    expect(document.title).toBe('Fredman Bolívar Alfaro | Software Developer');
    expect(window.localStorage.getItem('fba:language')).toBe('en');
  });

  it('restores the saved language preference', () => {
    window.localStorage.setItem('fba:language', 'en');
    render(<App />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Software Developer');
  });

  it('ignores an invalid saved preference', () => {
    window.localStorage.setItem('fba:language', 'fr');
    render(<App />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Desarrollador de Software',
    );
  });
});
