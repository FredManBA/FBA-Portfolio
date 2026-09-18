import type { Project } from '../types';

export type ProjectFilterId = 'all' | 'web' | 'games' | 'upcoming';

export interface ProjectFilterOption {
  id: ProjectFilterId;
  count: number;
}

const FILTER_MATCHERS: Record<ProjectFilterId, (project: Project) => boolean> = {
  all: () => true,
  web: (project) => project.category === 'web',
  games: (project) => project.category === 'games',
  upcoming: (project) => project.status === 'upcoming',
};

const FILTER_ORDER: readonly ProjectFilterId[] = ['all', 'web', 'games', 'upcoming'];

export function sortProjects(projects: readonly Project[]): Project[] {
  return [...projects].sort((a, b) => a.order - b.order);
}

export function filterProjects(projects: readonly Project[], filter: ProjectFilterId): Project[] {
  return projects.filter(FILTER_MATCHERS[filter]);
}

/** Filters with at least one project. "All" is listed whenever there is any project. */
export function getAvailableFilters(projects: readonly Project[]): ProjectFilterOption[] {
  return FILTER_ORDER.map((id) => ({ id, count: filterProjects(projects, id).length })).filter(
    ({ count }) => count > 0,
  );
}
