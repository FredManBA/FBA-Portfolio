import type { Project, ProjectCategory } from '../types';

export type ProjectFilterId = 'all' | ProjectCategory;

export interface ProjectFilterOption {
  id: ProjectFilterId;
  count: number;
}

export type ProjectStatusLabel = 'live' | 'playable' | 'development' | 'in-use';

const FILTER_ORDER: readonly ProjectFilterId[] = ['all', 'games', 'web', 'software'];

export function sortProjects(projects: readonly Project[]): Project[] {
  return [...projects].sort((a, b) => a.order - b.order);
}

export function filterProjects(projects: readonly Project[], filter: ProjectFilterId): Project[] {
  return filter === 'all'
    ? [...projects]
    : projects.filter((project) => project.category === filter);
}

/** Filters with at least one project. "All" is listed whenever there is any project. */
export function getAvailableFilters(projects: readonly Project[]): ProjectFilterOption[] {
  return FILTER_ORDER.map((id) => ({ id, count: filterProjects(projects, id).length })).filter(
    ({ count }) => count > 0,
  );
}

/** A released game reads as "playable"; everything else uses its own status. */
export function getStatusLabel(project: Project): ProjectStatusLabel {
  if (project.status === 'live' && project.category === 'games') {
    return 'playable';
  }
  return project.status;
}
