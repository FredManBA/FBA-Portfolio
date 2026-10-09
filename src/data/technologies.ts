import type { IconType } from 'react-icons';
import {
  SiAstro,
  SiCloudflare,
  SiCloudflarepages,
  SiCloudflareworkers,
  SiDrizzle,
  SiFramer,
  SiGodotengine,
  SiGithubactions,
  SiMapbox,
  SiPwa,
  SiReact,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVite,
  SiVitest,
  SiXyflow,
  SiZod,
} from 'react-icons/si';

/**
 * A technology shows its official logo when Simple Icons has one; otherwise it shows a
 * neutral monogram instead of an invented logo.
 */
export type TechnologyDefinition =
  | { name: string; icon: IconType; monogram?: never }
  | { name: string; monogram: string; icon?: never };

export const TECHNOLOGIES = {
  react: { name: 'React', icon: SiReact },
  astro: { name: 'Astro', icon: SiAstro },
  typescript: { name: 'TypeScript', icon: SiTypescript },
  tailwind: { name: 'Tailwind CSS', icon: SiTailwindcss },
  cloudflare: { name: 'Cloudflare', icon: SiCloudflare },
  'cloudflare-workers': { name: 'Cloudflare Workers', icon: SiCloudflareworkers },
  'cloudflare-pages': { name: 'Cloudflare Pages', icon: SiCloudflarepages },
  'cloudflare-d1': { name: 'Cloudflare D1', monogram: 'D1' },
  'cloudflare-r2': { name: 'Cloudflare R2', monogram: 'R2' },
  drizzle: { name: 'Drizzle ORM', icon: SiDrizzle },
  zustand: { name: 'Zustand', monogram: 'Zu' },
  'react-flow': { name: 'React Flow', icon: SiXyflow },
  dagre: { name: 'Dagre', monogram: 'Dg' },
  mapbox: { name: 'Mapbox', icon: SiMapbox },
  'mapbox-gl': { name: 'Mapbox GL', icon: SiMapbox },
  'photo-sphere-viewer': { name: 'Photo Sphere Viewer', monogram: 'PSV' },
  'framer-motion': { name: 'Framer Motion', icon: SiFramer },
  vite: { name: 'Vite', icon: SiVite },
  vitest: { name: 'Vitest', icon: SiVitest },
  zod: { name: 'Zod', icon: SiZod },
  godot: { name: 'Godot', icon: SiGodotengine },
  gdscript: { name: 'GDScript', monogram: 'GD' },
  shaders: { name: 'Shaders', monogram: 'Sh' },
  threejs: { name: 'Three.js', icon: SiThreedotjs },
  canvas: { name: 'Canvas 2D', monogram: 'C2' },
  'web-audio': { name: 'Web Audio', monogram: 'WA' },
  pwa: { name: 'PWA', icon: SiPwa },
  'web-workers': { name: 'Web Workers', monogram: 'WW' },
  indexeddb: { name: 'IndexedDB', monogram: 'IDB' },
  excel: { name: 'Microsoft Excel', monogram: 'XL' },
  'github-actions': { name: 'GitHub Actions', icon: SiGithubactions },
  'durable-objects': { name: 'Durable Objects', monogram: 'DO' },
} satisfies Record<string, TechnologyDefinition>;

export type TechnologyId = keyof typeof TECHNOLOGIES;

export function getTechnology(id: TechnologyId): TechnologyDefinition {
  return TECHNOLOGIES[id];
}
