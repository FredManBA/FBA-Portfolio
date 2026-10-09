import { describe, expect, it } from 'vitest';
import type { Project } from '../types';
import { filterProjects, getAvailableFilters, getStatusLabel, sortProjects } from './projects';

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
    links: {},
    screenshot: { file: 'sample', alt: { es: 'Muestra', en: 'Sample' } },
    ...overrides,
  };
}

const web = makeProject({ id: 'web', order: 2 });
const game = makeProject({ id: 'game', category: 'games', order: 3 });
const gameInDevelopment = makeProject({
  id: 'game-in-development',
  category: 'games',
  status: 'development',
  order: 1,
});
const tool = makeProject({ id: 'tool', category: 'software', order: 1 });

describe('project filters', () => {
  it('only offers filters that have projects', () => {
    expect(getAvailableFilters([web])).toEqual([
      { id: 'all', count: 1 },
      { id: 'web', count: 1 },
    ]);
  });

  it('lists the areas in page order: games, web, software', () => {
    expect(getAvailableFilters([tool, web, game, gameInDevelopment])).toEqual([
      { id: 'all', count: 4 },
      { id: 'games', count: 2 },
      { id: 'web', count: 1 },
      { id: 'software', count: 1 },
    ]);
  });

  it('offers no filters when there are no projects', () => {
    expect(getAvailableFilters([])).toEqual([]);
  });

  it('filters by area', () => {
    const projects = [web, game, gameInDevelopment, tool];
    expect(filterProjects(projects, 'all')).toHaveLength(4);
    expect(filterProjects(projects, 'web').map((p) => p.id)).toEqual(['web']);
    expect(filterProjects(projects, 'games').map((p) => p.id)).toEqual([
      'game',
      'game-in-development',
    ]);
    expect(filterProjects(projects, 'software').map((p) => p.id)).toEqual(['tool']);
  });

  it('sorts by the order field without mutating the input', () => {
    const input = [web, game, gameInDevelopment];
    expect(sortProjects(input).map((p) => p.id)).toEqual(['game-in-development', 'web', 'game']);
    expect(input.map((p) => p.id)).toEqual(['web', 'game', 'game-in-development']);
  });
});

describe('status label', () => {
  it('reads released games as playable and keeps every other status', () => {
    expect(getStatusLabel(game)).toBe('playable');
    expect(getStatusLabel(gameInDevelopment)).toBe('development');
    expect(getStatusLabel(web)).toBe('live');
    expect(getStatusLabel(tool)).toBe('live');
  });
});
