import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/render';
import { ProjectsSection } from './ProjectsSection';

function getFilters() {
  return within(screen.getByRole('group', { name: 'Filtrar proyectos' }));
}

describe('projects gallery', () => {
  it('lists every project in order and only the filters that have projects', () => {
    renderWithProviders(<ProjectsSection />);

    const titles = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    expect(titles).toEqual(['Costa Rica 360', 'TechBuilder', 'Code To-Go']);

    const filters = getFilters();
    expect(filters.getByRole('button', { name: 'Todos, 3 proyectos' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(filters.getByRole('button', { name: 'Web, 3 proyectos' })).toBeInTheDocument();
    expect(filters.queryByRole('button', { name: /Videojuegos/ })).not.toBeInTheDocument();
    expect(filters.queryByRole('button', { name: /Próximamente/ })).not.toBeInTheDocument();
  });

  it('marks the selected filter and keeps the matching projects', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProjectsSection />);

    await user.click(getFilters().getByRole('button', { name: /^Web/ }));

    expect(getFilters().getByRole('button', { name: /^Web/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(getFilters().getByRole('button', { name: /^Todos/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getAllByRole('article')).toHaveLength(3);
  });

  it('opens external links in a new tab and never links private code', () => {
    renderWithProviders(<ProjectsSection />);

    const codeToGo = screen.getByRole('article', { name: 'Code To-Go' });
    expect(within(codeToGo).getByText('Código privado')).toBeInTheDocument();
    expect(within(codeToGo).queryByRole('link', { name: /GitHub/ })).not.toBeInTheDocument();

    const demo = within(codeToGo).getByRole('link', { name: /Abrir la demo de Code To-Go/ });
    expect(demo).toHaveAttribute('href', 'https://code-to-go.vercel.app/');
    expect(demo).toHaveAttribute('target', '_blank');
    expect(demo).toHaveAttribute('rel', 'noopener noreferrer');

    const techBuilder = screen.getByRole('article', { name: 'TechBuilder' });
    expect(
      within(techBuilder).getByRole('link', { name: /Ver el código de TechBuilder en GitHub/ }),
    ).toHaveAttribute('href', 'https://github.com/FredManBA/TechBuilder');
  });
});
