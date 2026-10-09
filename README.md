# Needy Friends

Web de **Needy Friends**, un estudio creativo independiente de tres personas que hace videojuegos, sitios web y herramientas digitales. Presenta los proyectos del estudio por áreas, con capturas reales, detalles y tecnologías, en español e inglés.

**Sitio público:** https://needyfriends.pages.dev (proyecto de Cloudflare Pages `needyfriends`).

## Dirección visual

Universo cósmico y juguetón: el logo es la estrella del hero y cada área (videojuegos, webs, herramientas) es un planeta que lo orbita. Los planetas giran sobre su eje al hacer scroll (animación CSS ligada al scroll; quietos con movimiento reducido o en navegadores sin `animation-timeline`), y el header se esconde al bajar y vuelve al subir. Morados profundos como atmósfera, naranja para luz y acciones, lavanda para lo interactivo y crema para el texto. Tipografías Unbounded (titulares) y Figtree (texto). Toda la decoración es programática (CSS, SVG y canvas); las imágenes son capturas reales de los proyectos.

El logo actual es **provisional**: un recorte del arte original (`src/assets/brand/needyfriends-logo.webp`).

## Stack

React 19, TypeScript (strict), Vite, Framer Motion, CSS Modules, React Icons y Lucide. Fuentes locales con Fontsource. Pruebas con Vitest, Testing Library y Playwright. Despliegue estático en Cloudflare Pages con Wrangler.

## Requisitos

- Node.js 22.12 o superior (se recomienda 24, ver `.node-version`)
- npm

## Instalación y desarrollo

```sh
npm ci
npm run dev
```

### Contacto

El formulario no envía nada: con el nombre y el mensaje prepara un correo en la aplicación de correo del visitante, dirigido a `needyfriends.service@gmail.com` (`STUDIO_EMAIL` en `src/data/site.ts`). La dirección también se muestra con un botón para copiarla, por si no se abre ninguna aplicación. Así la web no recoge ni guarda datos personales ni depende de servicios de formularios; una nota bajo el formulario explica para qué se usa el mensaje y cómo pedir que se borre.

## Calidad y pruebas

```sh
npm run typecheck
npm run lint
npm run format:check
npm test            # Vitest: marca, idioma, áreas y filtros, detalle, formulario y datos
npm run test:e2e    # Playwright: humo en escritorio (1440px) y móvil (375px)
```

Playwright usa su Chromium (`npx playwright install chromium`). Con `PW_CHANNEL=chrome npm run test:e2e` usa Google Chrome instalado.

## Build y despliegue

```sh
npm run build       # genera dist/
npm run deploy      # build + wrangler pages deploy (proyecto needyfriends, rama main)
```

`npm run deploy` necesita una sesión de Wrangler (`npx wrangler login`) o la variable `CLOUDFLARE_API_TOKEN`. El sitio es estático: no usa Workers, Functions, bases de datos, cookies ni analítica.

La build genera `dist/third-party-licenses.txt` (`scripts/third-party-licenses.mjs`) con las licencias de los paquetes que llegan al navegador, enlazado desde el pie; se actualiza solo cuando cambian las dependencias.

## Añadir un proyecto

1. Guarda una captura real en `assets/screenshots/<id>.png`.
2. Ejecuta `npm run images` para generar las versiones AVIF/WebP en `public/projects/`.
3. Añade un objeto en `src/data/projects.ts` con su área (`category: 'games' | 'web' | 'software'`; `software` se muestra como «Herramientas»), su estado (`'live'`, `'development'` o `'in-use'` para herramientas privadas ya en uso), su orden dentro del área, sus textos en ES/EN, tecnologías y, si tiene, su demo pública (`links.demo`). La web nunca enlaza al código fuente de los proyectos.

Un juego publicado se muestra como «Jugable» y su enlace como «Jugar».

## Equipo

`src/data/team.ts` lista a los tres integrantes (Mariana, DilanOv y FreDe), cada uno con su planeta, nombre y rol, sin enlaces. Son los nombres con los que aparecen en la web, no necesariamente los reales. No inventar nombres, cargos ni biografías.

## Estructura

```
src/
  assets/       logo provisional
  components/   secciones (hero, projects, team, contact), cosmos (planetas, estrellas), layout, ui
  data/         proyectos, equipo, tecnologías, traducciones y secciones
  hooks/        idioma, tilt, parallax, modal, secciones activas
  i18n/         proveedor de idioma
  styles/       tokens y estilos globales
  types/        tipos compartidos
  utils/        áreas y filtros, imágenes, formulario y foco
scripts/        capturas optimizadas y assets de marca
e2e/            pruebas de navegador
```

El favicon, los iconos y la imagen social se generan con `npm run brand`: el icono es el planeta con anillo de la marca y la imagen social reproduce el hero con el logo.
