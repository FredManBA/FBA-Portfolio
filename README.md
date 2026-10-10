# Needy Friends

Web de **Needy Friends**, un estudio creativo independiente de cuatro personas que hace videojuegos, sitios web y herramientas digitales. Presenta los proyectos del estudio por áreas, con capturas reales, detalles y tecnologías, en español e inglés.

**Sitio público:** https://needyfriends.pages.dev (proyecto de Cloudflare Pages `needyfriends`).

## Dirección visual

Universo cósmico y juguetón: el logo es la estrella del hero y cada área orbita a su alrededor con planetas del equipo: el de AigenDev para videojuegos, el de FreDev para webs y los de Mariana y DilanOv, que son pareja, para herramientas (`AREA_PLANETS` en `src/data/site.ts`); los mismos planetas, en grande, abren cada área. En el hero y en el equipo todo gira solo: los planetas gaseosos sobre su eje, las lunas de FreDev sobre su eje y en sus órbitas y la pareja, un sistema binario con su propio brillo, uno alrededor del otro; en las áreas, lo mismo avanza con el scroll (`motion` en `Planet`; animación CSS ligada al scroll, quieta en navegadores sin `animation-timeline`). Todo queda quieto con movimiento reducido. En el equipo, una estela de rosa a verde une a Mariana y DilanOv. El header se esconde al bajar y vuelve al subir. Morados profundos como atmósfera, naranja para luz y acciones, lavanda para lo interactivo y crema para el texto. Tipografías Unbounded (titulares) y Figtree (texto). Toda la decoración es programática (CSS, SVG y canvas); las imágenes son capturas reales de los proyectos.

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

`src/data/team.ts` lista a los cuatro integrantes (Mariana, DilanOv, FreDev y AigenDev), cada uno con su planeta, nombre y rol, sin enlaces. Son los nombres con los que aparecen en la web, no necesariamente los reales. No inventar nombres, cargos ni biografías.

Cada integrante tiene un planeta propio (`src/components/cosmos/Planet.tsx` y `Planet.module.css`), diseñado a partir de la imagen de referencia que eligió: Mariana, una nebulosa ilustrada de bandas rosa, magenta y morado que se enroscan en dos remolinos, con corrientes cian; DilanOv, nubes violeta profundo alrededor de una corriente de energía verde con filamentos menta y remolinos; FreDev, un gigante gaseoso cálido con una gran tormenta, filamentos finos y una hilera de puntos como toque «diseñado», y dos lunas en sus órbitas (la pequeña, de porcelana blanca con vetas de mármol, es su perro; la grande, azul con remolinos, su pareja), que recorren sus órbitas, y AigenDev, un sprite en pixel art compuesto a partir de su referencia: regiones de materiales que chocan (cristal cian, roca cálida, magenta, violeta, púrpura y pequeñas zonas azules), una gran falla de lava con sus ramas, un remolino verde con brazo violeta y otro magenta, fragmentos que se desprenden, píxeles sueltos y una órbita rota. No gira: flota, la órbita se mece, la lava respira y los píxeles se mueven un poco. Las texturas de los planetas gaseosos y las lunas son SVG vectoriales, sin filtros, para que se vean nítidas (`scripts/generate-planet-textures.mjs`); el sprite de AigenDev es un PNG de cuatro capas (`scripts/generate-pixel-planet.mjs`). Todo se genera con `npm run planets` en `src/assets/planets/`.

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
