import type { Localized, ProjectCategory } from '../types';

export interface TeamMember {
  /** The name each member goes by on the site (not necessarily their real name). */
  name: string;
  role: Localized;
  /** Each member is drawn as one of the area planets. */
  planet: ProjectCategory;
}

export const TEAM: readonly TeamMember[] = [
  { name: 'Mariana', role: { es: 'Dev', en: 'Dev' }, planet: 'games' },
  { name: 'DilanOv', role: { es: 'Dev', en: 'Dev' }, planet: 'web' },
  { name: 'FreDe', role: { es: 'Dev', en: 'Dev' }, planet: 'software' },
];
