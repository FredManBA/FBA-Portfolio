// Generates the favicon, app icons and Open Graph image from code and the provisional logo.
// The icon is the brand's ringed planet (the logo is too detailed for 16px); the social image
// is the hero composition: nebula, orbits and the logo at its centre.
// Usage: npm run brand
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const COLORS = {
  space: '#170420',
  plum: '#220C2C',
  nebula: '#421451',
  electric: '#8033AC',
  lavender: '#B779E4',
  orange: '#F28C52',
  gold: '#FFBC70',
  ember: '#C2275F',
};

const LOGO_PATH = 'src/assets/brand/needyfriends-logo.webp';

/** A ringed orange planet on a deep purple tile. Only the near half of the ring crosses it. */
function iconSvg(size, { rounded }) {
  const c = size / 2;
  const r = size * 0.27;
  const radius = rounded ? size * 0.22 : 0;
  const ring = (clip) =>
    `<ellipse cx="${c}" cy="${c}" rx="${size * 0.42}" ry="${size * 0.11}" fill="none" stroke="${COLORS.gold}" stroke-width="${Math.max(1, size * 0.035)}" transform="rotate(-16 ${c} ${c})"${clip ? ' clip-path="url(#front)"' : ''}/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${COLORS.nebula}"/><stop offset="1" stop-color="${COLORS.space}"/></linearGradient>
  <linearGradient id="planet" x1="0.2" y1="0.1" x2="0.8" y2="0.9"><stop offset="0" stop-color="${COLORS.gold}"/><stop offset="0.45" stop-color="${COLORS.orange}"/><stop offset="1" stop-color="${COLORS.ember}"/></linearGradient>
  <radialGradient id="shade" cx="0.34" cy="0.3" r="0.75"><stop offset="0.5" stop-color="${COLORS.space}" stop-opacity="0"/><stop offset="1" stop-color="${COLORS.space}" stop-opacity="0.7"/></radialGradient>
  <clipPath id="front"><rect x="0" y="${c}" width="${size}" height="${c}" transform="rotate(-16 ${c} ${c})"/></clipPath>
</defs>
<rect width="${size}" height="${size}" rx="${radius}" fill="url(#bg)"/>
${ring(false)}
<circle cx="${c}" cy="${c}" r="${r}" fill="url(#planet)"/>
<circle cx="${c}" cy="${c}" r="${r}" fill="url(#shade)"/>
${ring(true)}
</svg>`;
}

function ellipsePath(cx, cy, rx, ry, tilt) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" transform="rotate(${tilt} ${cx} ${cy})"/>`;
}

/** Social card background: nebula light, a few stars, orbits, planets and the horizon. */
function ogBackgroundSvg(width, height) {
  let seed = 7;
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const stars = Array.from({ length: 140 }, () => {
    const r = random() ** 3 * 1.6 + 0.4;
    return `<circle cx="${(random() * width).toFixed(1)}" cy="${(random() * height).toFixed(1)}" r="${r.toFixed(2)}" fill="#FDF8F2" fill-opacity="${(0.3 + random() * 0.6).toFixed(2)}"/>`;
  }).join('');
  const cx = width / 2;
  const cy = height * 0.45;
  const planet = (x, y, r, from, to) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#p-${from}-${to})"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#shade)"/>`;
  const planetGradient = (from, to) =>
    `<linearGradient id="p-${from}-${to}" x1="0.2" y1="0.1" x2="0.8" y2="0.9"><stop offset="0" stop-color="${COLORS[from]}"/><stop offset="1" stop-color="${COLORS[to]}"/></linearGradient>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<defs>
  <linearGradient id="base" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="${COLORS.plum}"/><stop offset="0.62" stop-color="${COLORS.space}"/></linearGradient>
  <radialGradient id="violet" cx="0.14" cy="0.22" r="0.5"><stop offset="0" stop-color="${COLORS.electric}" stop-opacity="0.6"/><stop offset="1" stop-color="${COLORS.electric}" stop-opacity="0"/></radialGradient>
  <radialGradient id="warm" cx="0.84" cy="0.8" r="0.5"><stop offset="0" stop-color="${COLORS.orange}" stop-opacity="0.5"/><stop offset="1" stop-color="${COLORS.orange}" stop-opacity="0"/></radialGradient>
  <radialGradient id="shade" cx="0.34" cy="0.3" r="0.75"><stop offset="0.5" stop-color="${COLORS.space}" stop-opacity="0"/><stop offset="1" stop-color="${COLORS.space}" stop-opacity="0.75"/></radialGradient>
  ${planetGradient('gold', 'ember')}${planetGradient('lavender', 'nebula')}${planetGradient('gold', 'orange')}
</defs>
<rect width="${width}" height="${height}" fill="url(#base)"/>
<rect width="${width}" height="${height}" fill="url(#violet)"/>
<rect width="${width}" height="${height}" fill="url(#warm)"/>
${stars}
<g stroke="${COLORS.lavender}" stroke-opacity="0.35" stroke-width="1.5">
  ${ellipsePath(cx, cy, 330, 140, -9)}${ellipsePath(cx, cy, 430, 190, 5)}${ellipsePath(cx, cy, 520, 240, -4)}
</g>
${planet(cx - 318, cy + 30, 26, 'gold', 'ember')}
${planet(cx + 420, cy - 70, 32, 'lavender', 'nebula')}
${planet(cx - 150, cy + 228, 22, 'gold', 'orange')}
<circle cx="${cx}" cy="${height + 1500}" r="1610" fill="${COLORS.plum}" stroke="${COLORS.gold}" stroke-width="2"/>
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

await writeFile('public/favicon.svg', `${iconSvg(64, { rounded: true })}\n`);

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

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const LOGO_WIDTH = 560;
const logo = await sharp(LOGO_PATH).resize({ width: LOGO_WIDTH }).png().toBuffer();
const { height: logoHeight = 0 } = await sharp(logo).metadata();
await sharp(Buffer.from(ogBackgroundSvg(OG_WIDTH, OG_HEIGHT)))
  .composite([
    {
      input: logo,
      left: Math.round((OG_WIDTH - LOGO_WIDTH) / 2),
      top: Math.round(OG_HEIGHT * 0.45 - logoHeight / 2),
    },
  ])
  .png({ compressionLevel: 9 })
  .toFile('public/og-image.png');

console.log('Brand assets written to public/.');
