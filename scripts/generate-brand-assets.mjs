// Generates the favicon, app icons and Open Graph image from code, using the site fonts.
// Text is converted to SVG paths so the output does not depend on installed fonts.
// Usage: npm run brand
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import opentype from 'opentype.js';
import sharp from 'sharp';

const COLORS = {
  bg: '#080C0F',
  surface: '#0E1418',
  border: '#26323A',
  text: '#F4F6F8',
  text2: '#A0AAB2',
  muted: '#7D8890',
  primary: '#FF7A1A',
  steel: '#8FB3C4',
};

async function loadFont(path) {
  const buffer = await readFile(path);
  return opentype.parse(
    buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength),
  );
}

const sora800 = await loadFont('node_modules/@fontsource/sora/files/sora-latin-800-normal.woff');
const sora700 = await loadFont('node_modules/@fontsource/sora/files/sora-latin-700-normal.woff');
const inter500 = await loadFont('node_modules/@fontsource/inter/files/inter-latin-500-normal.woff');

/** Serializes path commands. opentype.js' toPathData emits NaN for some coordinates. */
function pathData(commands) {
  const n = (value) => String(Number(value.toFixed(2)));
  return commands
    .map((c) => {
      switch (c.type) {
        case 'M':
        case 'L':
          return `${c.type}${n(c.x)} ${n(c.y)}`;
        case 'Q':
          return `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`;
        case 'C':
          return `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`;
        default:
          return 'Z';
      }
    })
    .join('');
}

/**
 * Lays out text with kerning and tracking (in em) and returns one path per glyph.
 * Characters map straight to glyphs: plain Latin text needs no contextual shaping.
 */
function textGlyphs(font, text, x, baseline, size, tracking = 0) {
  const scale = size / font.unitsPerEm;
  const glyphs = [...text].map((char) => font.charToGlyph(char));
  const paths = [];
  let cursor = x;
  glyphs.forEach((glyph, index) => {
    paths.push(pathData(glyph.getPath(cursor, baseline, size).commands));
    cursor += glyph.advanceWidth * scale;
    const next = glyphs[index + 1];
    if (next) {
      cursor += font.getKerningValue(glyph, next) * scale + tracking * size;
    }
  });
  return { paths, width: cursor - x };
}

function textWidth(font, text, size, tracking = 0) {
  return textGlyphs(font, text, 0, 0, size, tracking).width;
}

function capHeight(font, size) {
  return (font.tables.os2.sCapHeight / font.unitsPerEm) * size;
}

/** FBA wordmark: FB in light text, A in orange, same tracking as the site header. */
function wordmark(x, baseline, size) {
  const { paths } = textGlyphs(sora800, 'FBA', x, baseline, size, -0.05);
  return `<path fill="${COLORS.text}" d="${paths[0]}${paths[1]}"/><path fill="${COLORS.primary}" d="${paths[2]}"/>`;
}

function iconSvg(size, { rounded }) {
  const textSize = size * 0.4;
  const width = textWidth(sora800, 'FBA', textSize, -0.05);
  const x = (size - width) / 2;
  const baseline = size / 2 + capHeight(sora800, textSize) / 2;
  const radius = rounded ? size * 0.22 : 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
<rect width="${size}" height="${size}" rx="${radius}" fill="${COLORS.surface}"/>
${wordmark(x, baseline, textSize)}
</svg>`;
}

function codeWindow(x, y) {
  const width = 300;
  const height = 196;
  const rows = [
    [
      0,
      [
        [COLORS.primary, 34],
        [COLORS.steel, 44],
        ['#6F7B83', 14],
      ],
    ],
    [
      16,
      [
        ['#C8D1D7', 58],
        ['#6F7B83', 8],
        [COLORS.steel, 40],
      ],
    ],
    [
      16,
      [
        ['#C8D1D7', 44],
        ['#6F7B83', 8],
        [COLORS.steel, 52],
      ],
    ],
    [0, [['#6F7B83', 14]]],
    [
      0,
      [
        [COLORS.primary, 96],
        [COLORS.text, 44],
        ['#6F7B83', 26],
      ],
    ],
    [
      16,
      [
        [COLORS.primary, 38],
        [COLORS.text, 54],
        ['#6F7B83', 22],
      ],
    ],
  ];
  const bars = rows
    .map(([indent, segments], row) => {
      let cursor = x + 44 + indent;
      const top = y + 64 + row * 20;
      return segments
        .map(([color, length]) => {
          const bar = `<rect x="${cursor}" y="${top}" width="${length}" height="7" rx="3.5" fill="${color}" fill-opacity="0.9"/>`;
          cursor += length + 7;
          return bar;
        })
        .join('');
    })
    .join('');
  const lineNumbers = rows
    .map(
      (_, row) =>
        `<rect x="${x + 18}" y="${y + 64 + row * 20}" width="10" height="7" rx="3.5" fill="#3D4A52"/>`,
    )
    .join('');
  return `<g>
<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="16" fill="url(#panel)" stroke="${COLORS.border}" stroke-width="1.5"/>
<path d="M${x + 16} ${y}h${width - 32}a16 16 0 0 1 16 16v22h-${width}v-22a16 16 0 0 1 16-16z" fill="#0B1115"/>
<circle cx="${x + 22}" cy="${y + 19}" r="4.5" fill="#27323A"/>
<circle cx="${x + 37}" cy="${y + 19}" r="4.5" fill="#27323A"/>
<circle cx="${x + 52}" cy="${y + 19}" r="4.5" fill="#27323A"/>
<rect x="${x + 72}" y="${y + 36}" width="70" height="2" fill="${COLORS.primary}"/>
${lineNumbers}${bars}
<rect x="${x}" y="${y + 64 + 6 * 20 - 5}" width="2" height="17" fill="${COLORS.primary}"/>
<rect x="${x + 44}" y="${y + 64 + 6 * 20 - 5}" width="2" height="17" fill="${COLORS.primary}"/>
</g>`;
}

function ogSvg() {
  const W = 1200;
  const H = 630;
  const margin = 96;
  const nameSize = 64;
  const nameWidth = textWidth(sora700, 'Fredman Bolívar Alfaro', nameSize, -0.02);
  const fittedName = Math.min(nameSize, (nameSize * (W - margin * 2)) / nameWidth);
  const name = textGlyphs(sora700, 'Fredman Bolívar Alfaro', margin, 452, fittedName, -0.02);
  const role = textGlyphs(
    inter500,
    'Desarrollador de Software · Software Developer',
    margin,
    506,
    30,
  );
  const url = textGlyphs(inter500, 'fredmanfba.pages.dev', margin, 566, 22);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
<pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
<path d="M60 0H0V60" fill="none" stroke="#FFFFFF" stroke-opacity="0.06" stroke-width="1"/>
</pattern>
<radialGradient id="fade" cx="0.74" cy="0.3" r="0.7">
<stop offset="0" stop-color="#FFFFFF"/>
<stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
</radialGradient>
<mask id="grid-mask"><rect width="${W}" height="${H}" fill="url(#fade)"/></mask>
<radialGradient id="glow" cx="0.82" cy="0.28" r="0.5">
<stop offset="0" stop-color="${COLORS.primary}" stop-opacity="0.24"/>
<stop offset="1" stop-color="${COLORS.primary}" stop-opacity="0"/>
</radialGradient>
<linearGradient id="panel" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#141C22"/>
<stop offset="1" stop-color="#0E1418"/>
</linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="${COLORS.bg}"/>
<rect width="${W}" height="${H}" fill="url(#grid)" mask="url(#grid-mask)"/>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
${codeWindow(804, 78)}
${wordmark(margin, 150, 72)}
<rect x="${margin}" y="366" width="56" height="4" rx="2" fill="${COLORS.primary}"/>
<path fill="${COLORS.text}" d="${name.paths.join('')}"/>
<path fill="${COLORS.text2}" d="${role.paths.join('')}"/>
<path fill="${COLORS.muted}" d="${url.paths.join('')}"/>
</svg>`;
}

/** Packs PNG images into a .ico container. */
function createIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + images.length * 16;
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map(({ data }) => data)]);
}

const png = (svg, size) =>
  sharp(Buffer.from(svg)).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

await mkdir('assets/brand', { recursive: true });

const favicon = iconSvg(64, { rounded: true });
await writeFile('public/favicon.svg', `${favicon}\n`);

const icoImages = await Promise.all(
  [16, 32, 48].map(async (size) => ({
    size,
    data: await png(iconSvg(size, { rounded: true }), size),
  })),
);
await writeFile('public/favicon.ico', createIco(icoImages));

await writeFile('public/apple-touch-icon.png', await png(iconSvg(180, { rounded: false }), 180));
await writeFile('public/icon-192.png', await png(iconSvg(192, { rounded: true }), 192));
await writeFile('public/icon-512.png', await png(iconSvg(512, { rounded: true }), 512));

const og = ogSvg();
if (/NaN|undefined|Infinity/.test(og)) {
  throw new Error('The Open Graph SVG contains invalid coordinates.');
}
await writeFile('assets/brand/og-image.svg', `${og}\n`);
await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile('public/og-image.png');

console.log('Brand assets generated.');
