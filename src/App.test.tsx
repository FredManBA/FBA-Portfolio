import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';

const STATEMENT_ES = 'Un estudio indie que hace videojuegos, webs y herramientas.';
const STATEMENT_EN = 'An indie studio making games, websites and tools.';

describe('brand', () => {
  it('names the studio in the main heading through the logo', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: 'Needy Friends' })).toBeInTheDocument();
    expect(screen.queryByText(/Fredman|FBA/)).not.toBeInTheDocument();
  });

  it('links each orbiting planet to its area', () => {
    render(<App />);

    for (const [name, href] of [
      ['Videojuegos', '#videojuegos'],
      ['Webs', '#webs'],
      ['Herramientas', '#herramientas'],
    ]) {
      const links = screen.getAllByRole('link', { name });
      expect(links.some((link) => link.getAttribute('href') === href)).toBe(true);
    }
  });

  it('introduces the three members by name, without links', () => {
    render(<App />);

    const team = screen.getByRole('region', { name: 'Somos tres' });
    expect(
      within(team)
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual(['Mariana', 'DilanOv', 'FreDe']);
    expect(within(team).queryByRole('link')).not.toBeInTheDocument();
  });
});

describe('language', () => {
  it('starts in Spanish and switches to English without reloading', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText(STATEMENT_ES)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver proyectos' })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('es');

    await user.click(screen.getByRole('button', { name: 'English' }));

    expect(screen.getByText(STATEMENT_EN)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'See projects' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement.lang).toBe('en');
    expect(document.title).toBe('Needy Friends | Indie studio for games, websites and tools');
    expect(window.localStorage.getItem('needyfriends:language')).toBe('en');
  });

  it('restores the saved language preference', () => {
    window.localStorage.setItem('needyfriends:language', 'en');
    render(<App />);

    expect(screen.getByText(STATEMENT_EN)).toBeInTheDocument();
  });

  it('ignores an invalid saved preference', () => {
    window.localStorage.setItem('needyfriends:language', 'fr');
    render(<App />);

    expect(screen.getByText(STATEMENT_ES)).toBeInTheDocument();
  });
});
