import manifest from '../data/screenshots.json';

export interface ScreenshotMeta {
  width: number;
  height: number;
  widths: number[];
}

export type ImageFormat = 'avif' | 'webp';

const screenshots: Record<string, ScreenshotMeta> = manifest;

export function getScreenshotMeta(file: string): ScreenshotMeta {
  const meta = screenshots[file];
  if (!meta) {
    throw new Error(`Screenshot "${file}" is missing. Run "npm run images".`);
  }
  return meta;
}

export function screenshotUrl(file: string, width: number, format: ImageFormat): string {
  const { width: fullWidth } = getScreenshotMeta(file);
  const suffix = width === fullWidth ? '' : `-${width}`;
  return `/projects/${file}${suffix}.${format}`;
}

const preloaded = new Set<string>();

/** Warms the cache with the full-size screenshot used by the detail view. */
export function preloadScreenshot(file: string): void {
  const url = screenshotUrl(file, getScreenshotMeta(file).width, 'avif');
  if (preloaded.has(url)) {
    return;
  }
  preloaded.add(url);
  const image = new Image();
  image.decoding = 'async';
  image.src = url;
}

export function screenshotSrcSet(file: string, format: ImageFormat): string {
  return getScreenshotMeta(file)
    .widths.map((width) => `${screenshotUrl(file, width, format)} ${width}w`)
    .join(', ');
}
