import type { ProjectCategory } from '../types';

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

export const NAV_ITEMS = ['games', 'web', 'software', 'team', 'contact'] as const;

/** The studio inbox. Shown on the page: the contact form prepares an email to it. */
export const STUDIO_EMAIL = 'needyfriends.service@gmail.com';
