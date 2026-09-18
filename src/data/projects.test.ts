import { describe, expect, it } from 'vitest';
import { getScreenshotMeta, screenshotUrl } from '../utils/screenshots';
import { PROJECTS } from './projects';
import { TECHNOLOGIES } from './technologies';

const publicFiles = new Set(
  Object.keys(import.meta.glob('/public/projects/*')).map((path) => path.replace('/public', '')),
);

describe('project data', () => {
  it('uses unique ids and orders', () => {
    expect(new Set(PROJECTS.map((p) => p.id)).size).toBe(PROJECTS.length);
    expect(new Set(PROJECTS.map((p) => p.order)).size).toBe(PROJECTS.length);
  });

  describe.each(PROJECTS.map((project) => [project.name, project] as const))('%s', (_, project) => {
    it('shows between one and four technologies on its card', () => {
      expect(project.cardTechnologies.length).toBeGreaterThan(0);
      expect(project.cardTechnologies.length).toBeLessThanOrEqual(4);
      for (const id of [...project.cardTechnologies, ...project.technologies]) {
        expect(TECHNOLOGIES).toHaveProperty(id);
      }
    });

    it('is translated to Spanish and English', () => {
      for (const text of [project.tagline, project.description, project.screenshot.alt]) {
        expect(text.es.trim()).not.toBe('');
        expect(text.en.trim()).not.toBe('');
      }
      expect(project.features.en).toHaveLength(project.features.es.length);
    });

    it('links only to https URLs', () => {
      const { demo, repository } = project.links;
      const urls = [demo, repository.visibility === 'public' ? repository.url : undefined];
      for (const url of urls.filter(Boolean)) {
        expect(url).toMatch(/^https:\/\//);
      }
    });

    it('has every generated screenshot variant', () => {
      const { file } = project.screenshot;
      for (const width of getScreenshotMeta(file).widths) {
        expect(publicFiles).toContain(screenshotUrl(file, width, 'avif'));
        expect(publicFiles).toContain(screenshotUrl(file, width, 'webp'));
      }
    });
  });
});
