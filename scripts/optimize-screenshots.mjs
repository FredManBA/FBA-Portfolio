// Converts the real project screenshots in assets/screenshots into responsive AVIF and WebP
// files in public/projects, and writes their dimensions to src/data/screenshots.json.
// Usage: npm run images
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { format, resolveConfig } from 'prettier';
import sharp from 'sharp';

const SOURCE_DIR = 'assets/screenshots';
const OUTPUT_DIR = 'public/projects';
const MANIFEST_PATH = 'src/data/screenshots.json';
const CARD_WIDTH = 800;
const MAX_WIDTH = 1920;
const BACKGROUND = '#080c0f';

const sources = (await readdir(SOURCE_DIR))
  .filter((file) => /\.(png|jpe?g|webp)$/i.test(file))
  .sort();
await mkdir(OUTPUT_DIR, { recursive: true });

const manifest = {};

for (const file of sources) {
  const slug = path.parse(file).name;
  const image = sharp(path.join(SOURCE_DIR, file)).flatten({ background: BACKGROUND });
  const { width: sourceWidth, height: sourceHeight } = await image.metadata();
  const width = Math.min(sourceWidth, MAX_WIDTH);
  const height = Math.round((sourceHeight * width) / sourceWidth);
  const widths = [...new Set([Math.min(CARD_WIDTH, width), width])];

  for (const variantWidth of widths) {
    const suffix = variantWidth === width ? '' : `-${variantWidth}`;
    const output = path.join(OUTPUT_DIR, `${slug}${suffix}`);
    const resized = image.clone().resize({ width: variantWidth, withoutEnlargement: true });
    await resized.clone().avif({ quality: 62, effort: 6 }).toFile(`${output}.avif`);
    await resized.clone().webp({ quality: 84, effort: 6 }).toFile(`${output}.webp`);
  }

  manifest[slug] = { width, height, widths };
  console.log(`${slug}: ${width}x${height} (${widths.join(', ')})`);
}

const prettierConfig = await resolveConfig(MANIFEST_PATH);
await writeFile(
  MANIFEST_PATH,
  await format(JSON.stringify(manifest), { ...prettierConfig, parser: 'json' }),
);
