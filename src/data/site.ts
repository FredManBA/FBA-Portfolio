import type { PlanetKind, ProjectCategory } from '../types';

/** Section anchors. They are visible in the URL, so they stay in Spanish and without hyphens. */
export const SECTION_IDS = {
  home: 'inicio',
  worlds: 'universo',
  games: 'videojuegos',
  web: 'webs',
  software: 'herramientas',
  team: 'equipo',
  contact: 'contacto',
} as const;

/** The three studio areas, in the order they orbit the logo and appear on the page. */
export const AREA_ORDER: readonly ProjectCategory[] = ['games', 'web', 'software'];

/**
 * Each area is shown as members' planets: AigenDev's for games, FreDev's for web, and the pair
 * Mariana and DilanOv make, a couple, for tools.
 */
export const AREA_PLANETS: Record<ProjectCategory, PlanetKind> = {
  games: 'aigen',
  web: 'fredev',
  software: 'couple',
};

export const NAV_ITEMS = ['games', 'web', 'software', 'team', 'contact'] as const;

/** The studio inbox. Shown on the page: the contact form prepares an email to it. */
export const STUDIO_EMAIL = 'needyfriends.service@gmail.com';
