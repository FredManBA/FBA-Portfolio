import { describe, expect, it } from 'vitest';
import { getScreenshotMeta, screenshotUrl } from '../utils/screenshots';
import { PROJECTS } from './projects';
import { TECHNOLOGIES } from './technologies';

const publicFiles = new Set(
  Object.keys(import.meta.glob('/public/projects/*')).map((path) => path.replace('/public', '')),
);

describe('project data', () => {
  it('uses unique ids, and unique orders inside each area', () => {
    expect(new Set(PROJECTS.map((p) => p.id)).size).toBe(PROJECTS.length);
    expect(new Set(PROJECTS.map((p) => `${p.category}:${p.order}`)).size).toBe(PROJECTS.length);
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

    it('links to a public https demo, and to GitHub only for the studio’s public tools', () => {
      expect(Object.keys(project.links).every((key) => key === 'demo' || key === 'github')).toBe(
        true,
      );
      if (project.links.demo) {
        expect(project.links.demo).toMatch(/^https:\/\//);
        expect(project.links.demo).not.toMatch(/github\.com/);
      }
      if (project.links.github) {
        expect(project.category).toBe('software');
        expect(project.links.github).toMatch(/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/);
      }
    });

    it('includes its cover in its gallery, with every screenshot translated', () => {
      if (!project.gallery) {
        return;
      }
      expect(project.gallery.length).toBeGreaterThan(1);
      expect(project.gallery.map((shot) => shot.file)).toContain(project.screenshot.file);
      expect(new Set(project.gallery.map((shot) => shot.file)).size).toBe(project.gallery.length);
      for (const shot of project.gallery) {
        expect(shot.alt.es.trim()).not.toBe('');
        expect(shot.alt.en.trim()).not.toBe('');
      }
    });

    it('has every generated screenshot variant', () => {
      for (const { file } of [project.screenshot, ...(project.gallery ?? [])]) {
        for (const width of getScreenshotMeta(file).widths) {
          expect(publicFiles).toContain(screenshotUrl(file, width, 'avif'));
          expect(publicFiles).toContain(screenshotUrl(file, width, 'webp'));
        }
      }
    });
  });
});
