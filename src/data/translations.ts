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
    viewProject: 'Ver proyecto',
    demo: 'Demo',
    demoLabel: (name: string) => `Abrir la demo de ${name}`,
    repository: 'GitHub',
    repositoryLabel: (name: string) => `Ver el código de ${name} en GitHub`,
    privateCode: 'Código privado',
    newTab: '(se abre en una pestaña nueva)',
  },
  dialog: {
    close: 'Cerrar',
    features: 'Características',
    technologies: 'Tecnologías',
    viewDemo: 'Ver demo',
    viewCode: 'Ver código',
  },
  technologies: {
    title: 'Tecnologías',
    intro: 'Herramientas y tecnologías con las que desarrollo.',
    showAll: 'Ver todas',
    showLess: 'Ver menos',
  },
  about: {
    title: 'Sobre mí',
    text: 'Desarrollador de software enfocado en convertir ideas en soluciones funcionales, visuales y fáciles de usar. Me gusta explorar nuevas tecnologías y crear proyectos que combinan lógica, diseño e interacción.',
  },
  contact: {
    title: 'Hablemos',
    intro: 'Ejemplo de una interfaz de contacto integrada en una experiencia web.',
    form: {
      label: 'Formulario de contacto',
      name: 'Nombre',
      email: 'Correo',
      message: 'Mensaje',
      submit: 'Enviar mensaje',
      demoNotice: 'Demo visual — este formulario no realiza envíos.',
      errors: {
        nameRequired: 'Escribe tu nombre.',
        nameTooShort: 'El nombre debe tener al menos 2 caracteres.',
        nameTooLong: 'El nombre no puede superar los 100 caracteres.',
        emailRequired: 'Escribe tu correo.',
        emailInvalid: 'Escribe un correo válido, por ejemplo nombre@dominio.com.',
        emailTooLong: 'El correo no puede superar los 254 caracteres.',
        messageRequired: 'Escribe tu mensaje.',
        messageTooShort: 'El mensaje debe tener al menos 10 caracteres.',
        messageTooLong: 'El mensaje no puede superar los 4000 caracteres.',
      },
    },
  },
  footer: {
    source: 'Código fuente del portafolio',
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
    viewProject: 'View project',
    demo: 'Demo',
    demoLabel: (name: string) => `Open the ${name} demo`,
    repository: 'GitHub',
    repositoryLabel: (name: string) => `View the ${name} code on GitHub`,
    privateCode: 'Private code',
    newTab: '(opens in a new tab)',
  },
  dialog: {
    close: 'Close',
    features: 'Features',
    technologies: 'Technologies',
    viewDemo: 'View demo',
    viewCode: 'View code',
  },
  technologies: {
    title: 'Technologies',
    intro: 'Tools and technologies I build with.',
    showAll: 'View all',
    showLess: 'Show less',
  },
  about: {
    title: 'About me',
    text: 'Software developer focused on turning ideas into functional, visual and easy-to-use solutions. I enjoy exploring new technologies and building projects that combine logic, design and interaction.',
  },
  contact: {
    title: "Let's talk",
    intro: 'Example of a contact interface integrated into a web experience.',
    form: {
      label: 'Contact form',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      submit: 'Send message',
      demoNotice: 'Visual demo — this form does not send messages.',
      errors: {
        nameRequired: 'Please enter your name.',
        nameTooShort: 'Your name must be at least 2 characters long.',
        nameTooLong: 'Your name cannot exceed 100 characters.',
        emailRequired: 'Please enter your email.',
        emailInvalid: 'Please enter a valid email, for example name@domain.com.',
        emailTooLong: 'Your email cannot exceed 254 characters.',
        messageRequired: 'Please enter your message.',
        messageTooShort: 'Your message must be at least 10 characters long.',
        messageTooLong: 'Your message cannot exceed 4000 characters.',
      },
    },
  },
  footer: {
    source: 'Portfolio source code',
  },
};

export const translations: Record<Language, Translation> = { es, en };

export const LANGUAGES: readonly Language[] = ['es', 'en'];

export const DEFAULT_LANGUAGE: Language = 'es';

export const LANGUAGE_NAMES: Record<Language, string> = {
  es: 'Español',
  en: 'English',
};
