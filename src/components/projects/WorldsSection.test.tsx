import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/render';
import { WorldsSection } from './WorldsSection';

function getFilters() {
  return within(screen.getByRole('group', { name: 'Mostrar áreas' }));
}

function projectNames(area: HTMLElement) {
  return within(area)
    .getAllByRole('heading', { level: 4 })
    .map((heading) => heading.textContent);
}

describe('studio areas', () => {
  it('groups the projects into games, web and tools, in order', () => {
    renderWithProviders(<WorldsSection />);

    const areas = screen.getAllByRole('article', { name: /Videojuegos|Webs|Herramientas/ });
    expect(areas.map((area) => area.id)).toEqual(['videojuegos', 'webs', 'herramientas']);

    expect(projectNames(screen.getByRole('article', { name: 'Videojuegos' }))).toEqual([
      'Tiny Kingdoms',
      'Phosphor',
      'retroM',
    ]);
    expect(projectNames(screen.getByRole('article', { name: 'Webs' }))).toEqual([
      'Costa Rica 360',
      'Pastelería Mis Consentidos',
      'Code To Go',
      'CUT ELITE',
    ]);
    expect(projectNames(screen.getByRole('article', { name: 'Herramientas' }))).toEqual([
      'Editor 360',
      'TechBuilder',
      'Gestión Política',
    ]);
  });

  it('offers one filter per area with its project count', () => {
    renderWithProviders(<WorldsSection />);

    const filters = getFilters();
    expect(filters.getByRole('button', { name: 'Todo, 10 proyectos' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(filters.getByRole('button', { name: 'Videojuegos, 3 proyectos' })).toBeInTheDocument();
    expect(filters.getByRole('button', { name: 'Webs, 4 proyectos' })).toBeInTheDocument();
    expect(filters.getByRole('button', { name: 'Herramientas, 3 proyectos' })).toBeInTheDocument();
  });

  it('narrows the page to the selected area', async () => {
    const user = userEvent.setup();
    renderWithProviders(<WorldsSection />);

    await user.click(getFilters().getByRole('button', { name: /^Herramientas/ }));

    expect(getFilters().getByRole('button', { name: /^Herramientas/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.queryByRole('article', { name: 'Webs' })).not.toBeInTheDocument();
    expect(projectNames(screen.getByRole('article', { name: 'Herramientas' }))).toHaveLength(3);
  });

  it('labels released games as playable and unreleased ones as in development', () => {
    renderWithProviders(<WorldsSection />);

    const tinyKingdoms = screen.getByRole('article', { name: 'Tiny Kingdoms' });
    expect(within(tinyKingdoms).getByText('Jugable')).toBeInTheDocument();
    expect(
      within(tinyKingdoms).getByRole('link', { name: /^Jugar Tiny Kingdoms/ }),
    ).toHaveTextContent('Jugar');

    const phosphor = screen.getByRole('article', { name: 'Phosphor' });
    expect(within(phosphor).getByText('En desarrollo')).toBeInTheDocument();
    expect(within(phosphor).getByText('Todavía sin demo pública')).toBeInTheDocument();
    expect(within(phosphor).queryByRole('link')).not.toBeInTheDocument();
  });

  it('marks private tools as in use, without links', () => {
    renderWithProviders(<WorldsSection />);

    const workbook = screen.getByRole('article', { name: 'Gestión Política' });
    expect(within(workbook).getByText('En uso')).toBeInTheDocument();
    expect(within(workbook).getByText('Proyecto privado')).toBeInTheDocument();
    expect(within(workbook).queryByRole('link')).not.toBeInTheDocument();
  });

  it('opens demos in a new tab and never links to source code', () => {
    renderWithProviders(<WorldsSection />);

    expect(screen.queryByRole('link', { name: /GitHub|código/i })).not.toBeInTheDocument();

    const codeToGo = screen.getByRole('article', { name: 'Code To Go' });
    const demo = within(codeToGo).getByRole('link', { name: /^Demo de Code To Go/ });
    expect(demo).toHaveAttribute('href', 'https://code-to-go.vercel.app/');
    expect(demo).toHaveAttribute('target', '_blank');
    expect(demo).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
