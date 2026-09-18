import type { Language } from '../types';

const es = {
  meta: {
    title: 'Fredman Bolívar Alfaro | Desarrollador de Software',
    description:
      'Portafolio de Fredman Bolívar Alfaro: desarrollo web, software y experiencias interactivas.',
  },
  skipToContent: 'Saltar al contenido',
  header: {
    homeLabel: 'FBA, ir al inicio',
    navLabel: 'Navegación principal',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    languageLabel: 'Idioma',
  },
  nav: {
    projects: 'Proyectos',
    technologies: 'Tecnologías',
    contact: 'Contacto',
  },
  hero: {
    name: 'Fredman Bolívar Alfaro',
    role: 'Desarrollador de Software',
    quote: {
      lead: 'Nada es imposible, solo aún no lo he ',
      accent: 'programado',
      tail: '.',
    },
    intro:
      'Desarrollo web, software y experiencias interactivas para convertir ideas en soluciones reales.',
    primaryAction: 'Ver proyectos',
    secondaryAction: 'Contactar',
  },
  projects: {
    title: 'Proyectos',
    intro: 'Aplicaciones reales, soluciones funcionales.',
    filterLabel: 'Filtrar proyectos',
    filters: {
      all: 'Todos',
      web: 'Web',
      games: 'Videojuegos',
      upcoming: 'Próximamente',
    },
    categories: {
      web: 'Web',
      games: 'Videojuego',
    },
    upcoming: 'Próximamente',
    projectCount: (count: number) => (count === 1 ? '1 proyecto' : `${count} proyectos`),
    technologies: 'Tecnologías',
    demo: 'Demo',
    demoLabel: (name: string) => `Abrir la demo de ${name}`,
    repository: 'GitHub',
    repositoryLabel: (name: string) => `Ver el código de ${name} en GitHub`,
    privateCode: 'Código privado',
    newTab: '(se abre en una pestaña nueva)',
  },
};

export type Translation = typeof es;

const en: Translation = {
  meta: {
    title: 'Fredman Bolívar Alfaro | Software Developer',
    description:
      "Fredman Bolívar Alfaro's portfolio: web development, software and interactive experiences.",
  },
  skipToContent: 'Skip to content',
  header: {
    homeLabel: 'FBA, go to top',
    navLabel: 'Main navigation',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    languageLabel: 'Language',
  },
  nav: {
    projects: 'Projects',
    technologies: 'Technologies',
    contact: 'Contact',
  },
  hero: {
    name: 'Fredman Bolívar Alfaro',
    role: 'Software Developer',
    quote: {
      lead: "Nothing is impossible; I just haven't ",
      accent: 'programmed',
      tail: ' it yet.',
    },
    intro: 'I build web, software and interactive experiences that turn ideas into real solutions.',
    primaryAction: 'View projects',
    secondaryAction: 'Contact',
  },
  projects: {
    title: 'Projects',
    intro: 'Real applications, functional solutions.',
    filterLabel: 'Filter projects',
    filters: {
      all: 'All',
      web: 'Web',
      games: 'Games',
      upcoming: 'Coming soon',
    },
    categories: {
      web: 'Web',
      games: 'Game',
    },
    upcoming: 'Coming soon',
    projectCount: (count: number) => (count === 1 ? '1 project' : `${count} projects`),
    technologies: 'Technologies',
    demo: 'Demo',
    demoLabel: (name: string) => `Open the ${name} demo`,
    repository: 'GitHub',
    repositoryLabel: (name: string) => `View the ${name} code on GitHub`,
    privateCode: 'Private code',
    newTab: '(opens in a new tab)',
  },
};

export const translations: Record<Language, Translation> = { es, en };

export const LANGUAGES: readonly Language[] = ['es', 'en'];

export const DEFAULT_LANGUAGE: Language = 'es';

export const LANGUAGE_NAMES: Record<Language, string> = {
  es: 'Español',
  en: 'English',
};
