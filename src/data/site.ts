export const SITE_URL = 'https://fredmanfba.pages.dev';

export const SECTION_IDS = {
  home: 'inicio',
  projects: 'proyectos',
  technologies: 'tecnologias',
  about: 'sobre-mi',
  contact: 'contacto',
} as const;

export const NAV_ITEMS = ['projects', 'technologies', 'contact'] as const;

export type NavItem = (typeof NAV_ITEMS)[number];
