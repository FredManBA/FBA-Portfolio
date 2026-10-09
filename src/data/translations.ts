import type { Language } from '../types';

const es = {
  meta: {
    title: 'Needy Friends | Estudio indie de videojuegos, webs y herramientas',
    description:
      'Needy Friends es un estudio creativo independiente: hacemos videojuegos, sitios web y herramientas digitales con curiosidad, cuidado y ganas de experimentar.',
  },
  skipToContent: 'Saltar al contenido',
  header: {
    homeLabel: 'Needy Friends, ir al inicio',
    navLabel: 'Navegación principal',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    languageLabel: 'Idioma',
    cta: 'Hablemos',
  },
  nav: {
    games: 'Videojuegos',
    web: 'Webs',
    software: 'Herramientas',
    team: 'Equipo',
    contact: 'Contacto',
  },
  hero: {
    statement: 'Un estudio indie que hace videojuegos, webs y herramientas.',
    intro:
      'Somos un equipo de tres. Diseñamos y programamos experiencias digitales con curiosidad, cuidado y muchas ganas de experimentar.',
    primaryAction: 'Ver proyectos',
    secondaryAction: 'Conocer el estudio',
  },
  worlds: {
    title: 'Tres mundos, un mismo estudio',
    intro:
      'Cada área tiene su propio carácter, pero todo sale del mismo lugar: las ganas de construir algo que nos emocione usar.',
    filterLabel: 'Mostrar áreas',
    filters: {
      all: 'Todo',
      games: 'Videojuegos',
      web: 'Webs',
      software: 'Herramientas',
    },
    areas: {
      games: {
        title: 'Videojuegos',
        body: 'El lado más experimental y narrativo del estudio. Mundos, mecánicas e historias que queremos jugar nosotros primero.',
      },
      web: {
        title: 'Webs',
        body: 'Sitios, plataformas y experiencias interactivas, hechas para verse bien y funcionar todavía mejor.',
      },
      software: {
        title: 'Herramientas',
        body: 'Programas a medida que resuelven problemas concretos: editores, sistemas de gestión y hojas de cálculo que trabajan por ti.',
      },
    },
  },
  projects: {
    categories: {
      games: 'Videojuego',
      web: 'Web',
      software: 'Herramienta',
    },
    status: {
      live: 'En línea',
      playable: 'Jugable',
      development: 'En desarrollo',
      'in-use': 'En uso',
    },
    projectCount: (count: number) => (count === 1 ? '1 proyecto' : `${count} proyectos`),
    technologies: 'Tecnologías',
    viewProject: 'Ver detalles',
    demo: 'Demo',
    play: 'Jugar',
    // Accessible names start with the visible word (WCAG 2.5.3, label in name).
    demoLabel: (name: string) => `Demo de ${name}`,
    playLabel: (name: string) => `Jugar ${name}`,
    noPublicDemo: 'Todavía sin demo pública',
    privateProject: 'Proyecto privado',
    newTab: '(se abre en una pestaña nueva)',
  },
  dialog: {
    close: 'Cerrar',
    features: 'Características',
    technologies: 'Tecnologías',
    viewDemo: 'Abrir demo',
    play: 'Jugar ahora',
  },
  team: {
    title: 'Somos tres',
    intro: 'Un estudio pequeño donde cada proyecto pasa por las manos de todos.',
  },
  contact: {
    title: '¿Tienes una idea que necesita amigos?',
    intro:
      'Cuéntanos qué quieres construir: un juego, una web, una herramienta o algo que todavía no tiene nombre.',
    form: {
      label: 'Formulario de contacto',
      name: 'Nombre',
      message: '¿Qué quieres construir?',
      submit: 'Abrir en mi correo',
      subject: (name: string) => `Propuesta de ${name} desde la web de Needy Friends`,
      opened: 'Abrimos tu aplicación de correo con el mensaje listo: solo falta enviarlo.',
      direct: 'También puedes escribirnos a',
      copy: 'Copiar correo',
      copied: 'Correo copiado.',
      copyFailed: 'No se pudo copiar. Selecciona la dirección para copiarla.',
      privacy: (email: string) =>
        `El mensaje sale desde tu propio correo hacia ${email}, la dirección de Needy Friends. Solo lo usamos para responderte; para consultarlo, corregirlo o pedir que lo borremos, escríbenos a esa misma dirección.`,
      errors: {
        nameRequired: 'Escribe tu nombre.',
        nameTooShort: 'El nombre debe tener al menos 2 caracteres.',
        nameTooLong: 'El nombre no puede superar los 100 caracteres.',
        messageRequired: 'Cuéntanos qué quieres construir.',
        messageTooShort: 'El mensaje debe tener al menos 10 caracteres.',
        messageTooLong: 'El mensaje no puede superar los 1000 caracteres.',
      },
    },
  },
  footer: {
    tagline: 'Estudio creativo independiente.',
    licenses: 'Licencias de terceros',
  },
};

export type Translation = typeof es;

const en: Translation = {
  meta: {
    title: 'Needy Friends | Indie studio for games, websites and tools',
    description:
      'Needy Friends is an independent creative studio: we make games, websites and digital tools with curiosity, care and a real appetite for experimenting.',
  },
  skipToContent: 'Skip to content',
  header: {
    homeLabel: 'Needy Friends, go to top',
    navLabel: 'Main navigation',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    languageLabel: 'Language',
    cta: "Let's talk",
  },
  nav: {
    games: 'Games',
    web: 'Web',
    software: 'Tools',
    team: 'Team',
    contact: 'Contact',
  },
  hero: {
    statement: 'An indie studio making games, websites and tools.',
    intro:
      "We're a team of three. We design and build digital experiences with curiosity, care and a real appetite for experimenting.",
    primaryAction: 'See projects',
    secondaryAction: 'Meet the studio',
  },
  worlds: {
    title: 'Three worlds, one studio',
    intro:
      'Each area has its own character, but everything comes from the same place: wanting to build things we are excited to use.',
    filterLabel: 'Show areas',
    filters: {
      all: 'Everything',
      games: 'Games',
      web: 'Web',
      software: 'Tools',
    },
    areas: {
      games: {
        title: 'Games',
        body: 'The most experimental, story-driven side of the studio. Worlds, mechanics and stories we want to play ourselves first.',
      },
      web: {
        title: 'Web',
        body: 'Websites, platforms and interactive experiences, made to look good and work even better.',
      },
      software: {
        title: 'Tools',
        body: 'Custom programs that solve concrete problems: editors, management systems and spreadsheets that do the work for you.',
      },
    },
  },
  projects: {
    categories: {
      games: 'Game',
      web: 'Web',
      software: 'Tool',
    },
    status: {
      live: 'Live',
      playable: 'Playable',
      development: 'In development',
      'in-use': 'In use',
    },
    projectCount: (count: number) => (count === 1 ? '1 project' : `${count} projects`),
    technologies: 'Technologies',
    viewProject: 'View details',
    demo: 'Demo',
    play: 'Play',
    demoLabel: (name: string) => `Demo of ${name}`,
    playLabel: (name: string) => `Play ${name}`,
    noPublicDemo: 'No public demo yet',
    privateProject: 'Private project',
    newTab: '(opens in a new tab)',
  },
  dialog: {
    close: 'Close',
    features: 'Features',
    technologies: 'Technologies',
    viewDemo: 'Open demo',
    play: 'Play now',
  },
  team: {
    title: 'There are three of us',
    intro: 'A small studio where every project passes through everyone’s hands.',
  },
  contact: {
    title: 'Got an idea that needs some friends?',
    intro:
      "Tell us what you want to build: a game, a website, a tool or something that doesn't have a name yet.",
    form: {
      label: 'Contact form',
      name: 'Name',
      message: 'What do you want to build?',
      submit: 'Open in my email',
      subject: (name: string) => `Proposal from ${name} via the Needy Friends website`,
      opened: 'We opened your email app with the message ready: just hit send.',
      direct: 'You can also write to us at',
      copy: 'Copy email',
      copied: 'Email copied.',
      copyFailed: "Couldn't copy it. Select the address to copy it.",
      privacy: (email: string) =>
        `The message goes from your own email to ${email}, the Needy Friends address. We only use it to reply to you; to see it, correct it or ask us to delete it, write to that same address.`,
      errors: {
        nameRequired: 'Please enter your name.',
        nameTooShort: 'Your name must be at least 2 characters long.',
        nameTooLong: 'Your name cannot exceed 100 characters.',
        messageRequired: 'Tell us what you want to build.',
        messageTooShort: 'Your message must be at least 10 characters long.',
        messageTooLong: 'Your message cannot exceed 1000 characters.',
      },
    },
  },
  footer: {
    tagline: 'Independent creative studio.',
    licenses: 'Third-party licenses',
  },
};

export const translations: Record<Language, Translation> = { es, en };

export const LANGUAGES: readonly Language[] = ['es', 'en'];

export const DEFAULT_LANGUAGE: Language = 'es';

export const LANGUAGE_NAMES: Record<Language, string> = {
  es: 'Español',
  en: 'English',
};
