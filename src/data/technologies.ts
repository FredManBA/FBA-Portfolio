import type { IconType } from 'react-icons';
import {
  SiAngular,
  SiAstro,
  SiCloudflare,
  SiCloudflarepages,
  SiCloudflareworkers,
  SiCss,
  SiDrizzle,
  SiExpress,
  SiFramer,
  SiGit,
  SiGithubactions,
  SiHtml5,
  SiJavascript,
  SiMapbox,
  SiMongodb,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiTailwindcss,
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
  angular: { name: 'Angular', icon: SiAngular },
  astro: { name: 'Astro', icon: SiAstro },
  typescript: { name: 'TypeScript', icon: SiTypescript },
  javascript: { name: 'JavaScript', icon: SiJavascript },
  html: { name: 'HTML5', icon: SiHtml5 },
  css: { name: 'CSS3', icon: SiCss },
  tailwind: { name: 'Tailwind CSS', icon: SiTailwindcss },
  node: { name: 'Node.js', icon: SiNodedotjs },
  express: { name: 'Express', icon: SiExpress },
  mongodb: { name: 'MongoDB', icon: SiMongodb },
  postgresql: { name: 'PostgreSQL', icon: SiPostgresql },
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
  git: { name: 'Git', icon: SiGit },
  'github-actions': { name: 'GitHub Actions', icon: SiGithubactions },
} satisfies Record<string, TechnologyDefinition>;

export type TechnologyId = keyof typeof TECHNOLOGIES;

export function getTechnology(id: TechnologyId): TechnologyDefinition {
  return TECHNOLOGIES[id];
}
