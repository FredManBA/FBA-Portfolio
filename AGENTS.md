# AGENTS.md — Needy Friends

## Proyecto

- **Nombre:** Needy Friends (repositorio `FBA-Portfolio`, antes portafolio personal de Fredman Bolívar Alfaro).
- **Propósito:** web del estudio indie Needy Friends (tres personas): presenta sus videojuegos, webs y herramientas con capturas reales, detalles y tecnologías, en español e inglés.
- **Estado:** rebranding en la rama `rebrand/needyfriends` (2026-10-09). Destino: Cloudflare Pages, proyecto `needyfriends` (https://needyfriends.pages.dev), ya publicado. El sitio anterior sigue en https://fredmanfba.pages.dev. El contacto prepara un correo en la aplicación del visitante (`mailto:`) y muestra la dirección del estudio: la web no recoge datos personales, no usa cookies ni analítica, y nunca enlaza al código de los proyectos.
- **Logo:** provisional, recortado del arte original. No reconstruirlo con una fuente.
- **Equipo:** Mariana, DilanOv y FreDe (nombres de la web, no necesariamente reales), rol «Dev», sin enlaces. No inventar cargos ni biografías.

## Stack

- React 19, TypeScript (strict) y Vite.
- Framer Motion, CSS Modules, React Icons, Lucide y fuentes locales con Fontsource (Unbounded y Figtree).
- Pruebas con Vitest, Testing Library (jsdom) y Playwright (e2e).
- ESLint (con jsx-a11y) y Prettier.
- Despliegue estático en Cloudflare Pages con Wrangler.
- Node.js >= 22.12 (`.node-version`: 24) y npm (`package-lock.json`).

## Estructura

```
src/
  components/   secciones: brand, contact, cosmos, hero, layout, motion, projects, team, technologies (iconos), ui
  data/         proyectos, equipo, tecnologías, traducciones, secciones
  hooks/  i18n/  styles/  types/  utils/
scripts/        optimización de capturas y generación de assets de marca
e2e/            pruebas Playwright
assets/         capturas y marca originales
public/         estáticos, _headers, imágenes de proyectos generadas
```

Documentación principal: `README.md`. Incluye cómo añadir un proyecto nuevo.

## Reglas del proyecto

- Revisar el código existente antes de modificar la arquitectura.
- Mantener la compatibilidad con el stack (SPA estática React + Vite en Cloudflare Pages).
- Evitar dependencias innecesarias.
- No guardar secretos.
- No ejecutar `npm run deploy` sin autorización explícita.
- Preferir cambios pequeños y verificables.
- Seguir las convenciones y la documentación existentes.
- Mantener la información específica del proyecto dentro de este repositorio.
- Consultar Fredman-Brain solo para el contexto global.

## Herramientas

Antes de instalar herramientas nuevas, consultar `C:\Dev\Fredman-Brain\01_Profile\TOOLING.md`. Usar las herramientas existentes cuando ya resuelvan la necesidad.

## Skills

Cuando aporten valor, se pueden usar las skills globales `find-docs`, `playwright-cli`, `emil-design-eng` y `find-skills`. No forzarlas si no aportan nada.

Considerar `emil-design-eng` solo cuando se trabaje específicamente en diseño o UI.

## Validación

Scripts definidos en `package.json`. Esta integración no los ejecutó.

| Acción     | Comando                                               |
| ---------- | ----------------------------------------------------- |
| Instalar   | `npm ci`                                              |
| Desarrollo | `npm run dev`                                         |
| Lint       | `npm run lint` (`--max-warnings 0`)                   |
| Format     | `npm run format` / `npm run format:check`             |
| Typecheck  | `npm run typecheck`                                   |
| Test       | `npm test` (Vitest) / `npm run test:e2e` (Playwright) |
| Build      | `npm run build`                                       |
| Assets     | `npm run images`, `npm run brand`                     |

## OpenSpec

Inicializado en `openspec/` (`config.yaml`, esquema `spec-driven`). Los comandos `/opsx:*` están en `.claude/`.

## Memoria global

`C:\Dev\Fredman-Brain` contiene preferencias, tooling, conocimiento transversal, decisiones y problemas ya resueltos. Consultar solo lo relevante y no leer todo el vault automáticamente.
