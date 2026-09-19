# FBA Portfolio

Portafolio profesional de **Fredman Bolívar Alfaro**, desarrollador de software. Presenta proyectos reales con capturas, detalles y tecnologías, en español e inglés.

**Sitio público:** https://fredmanfba.pages.dev

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

### Formulario de contacto

La sección de contacto es una demostración visual: el formulario valida los campos, pero no envía ni guarda información.

## Calidad y pruebas

```sh
npm run typecheck
npm run lint
npm run format:check
npm test            # Vitest: idioma, filtros, detalle, tecnologías, formulario y datos
npm run test:e2e    # Playwright: humo en escritorio (1440px) y móvil (375px)
```

Playwright usa su Chromium (`npx playwright install chromium`). Con `PW_CHANNEL=chrome npm run test:e2e` usa Google Chrome instalado.

## Build y despliegue

```sh
npm run build       # genera dist/
npm run deploy      # build + wrangler pages deploy (proyecto fredmanfba, rama main)
```

`npm run deploy` necesita una sesión de Wrangler (`npx wrangler login`) o la variable `CLOUDFLARE_API_TOKEN`. El sitio es estático: no usa Workers, Functions ni bases de datos. `public/_headers` define las cabeceras de seguridad y la caché.

## Añadir un proyecto

1. Guarda una captura real en `assets/screenshots/<id>.png`.
2. Ejecuta `npm run images` para generar las versiones AVIF/WebP en `public/projects/`.
3. Añade un objeto en `src/data/projects.ts` con sus textos en ES/EN, tecnologías y enlaces.

Los filtros «Videojuegos» y «Próximamente» aparecen solos cuando exista un proyecto de esa categoría (`category: 'games'`) o estado (`status: 'upcoming'`).

## Estructura

```
src/
  components/   secciones y componentes de la interfaz
  data/         proyectos, tecnologías, traducciones y contacto
  hooks/        idioma, tilt, modal, secciones activas
  i18n/         proveedor de idioma
  styles/       tokens y estilos globales
  types/        tipos compartidos
  utils/        filtros, imágenes, formulario y foco
scripts/        generación de capturas optimizadas y assets de marca
e2e/            pruebas de navegador
```

El favicon, los iconos y la imagen social se generan con `npm run brand` a partir del wordmark FBA provisional (`src/components/brand/Wordmark.tsx`).
