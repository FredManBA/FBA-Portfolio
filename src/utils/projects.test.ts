import { describe, expect, it } from 'vitest';
import type { Project } from '../types';
import { filterProjects, getAvailableFilters, sortProjects } from './projects';

function makeProject(overrides: Partial<Project>): Project {
  return {
    id: 'sample',
    name: 'Sample',
    category: 'web',
    status: 'live',
    order: 1,
    tagline: { es: 'Muestra', en: 'Sample' },
    description: { es: 'Muestra', en: 'Sample' },
    features: { es: [], en: [] },
    cardTechnologies: ['react'],
    technologies: ['react'],
    links: { repository: { visibility: 'private' } },
    screenshot: { file: 'sample', alt: { es: 'Muestra', en: 'Sample' } },
    ...overrides,
  };
}

const web = makeProject({ id: 'web', order: 2 });
const game = makeProject({ id: 'game', category: 'games', order: 3 });
const upcomingGame = makeProject({
  id: 'upcoming-game',
  category: 'games',
  status: 'upcoming',
  order: 1,
});

describe('project filters', () => {
  it('only offers filters that have projects', () => {
    expect(getAvailableFilters([web])).toEqual([
      { id: 'all', count: 1 },
      { id: 'web', count: 1 },
    ]);
  });

  it('adds games and coming soon automatically when such projects exist', () => {
    expect(getAvailableFilters([web, game, upcomingGame])).toEqual([
      { id: 'all', count: 3 },
      { id: 'web', count: 1 },
      { id: 'games', count: 2 },
      { id: 'upcoming', count: 1 },
    ]);
  });

  it('offers no filters when there are no projects', () => {
    expect(getAvailableFilters([])).toEqual([]);
  });

  it('filters by category and by upcoming status', () => {
    const projects = [web, game, upcomingGame];
    expect(filterProjects(projects, 'all')).toHaveLength(3);
    expect(filterProjects(projects, 'web').map((p) => p.id)).toEqual(['web']);
    expect(filterProjects(projects, 'games').map((p) => p.id)).toEqual(['game', 'upcoming-game']);
    expect(filterProjects(projects, 'upcoming').map((p) => p.id)).toEqual(['upcoming-game']);
  });

  it('sorts by the order field without mutating the input', () => {
    const input = [web, game, upcomingGame];
    expect(sortProjects(input).map((p) => p.id)).toEqual(['upcoming-game', 'web', 'game']);
    expect(input.map((p) => p.id)).toEqual(['web', 'game', 'upcoming-game']);
  });
});
