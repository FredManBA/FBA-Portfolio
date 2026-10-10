// Generates AigenDev's planet as a pixel-art sprite in the spirit of the reference: a world of
// clashing materials (cyan crystal, warm rock, magenta, violet and dark purple ground, small blue
// pools) with a large green and violet swirl, a second one and a patch of turbulence, all split
// by a network of glowing orange cracks, with fragments breaking off the edge and a thin broken
// orbit. The layout is composed by hand; noise only roughens the borders and mottles the ground,
// and it is hashed, so running the script again gives the same image.
//
// The PNG stacks four layers of CANVAS_W × CANVAS_H, top to bottom: the back of the orbit, the
// planet, the glow of the cracks and the front of the orbit, so the page can animate them on
// their own (see Planet.module.css).
// Usage: npm run planets
import sharp from 'sharp';

const OUTPUT = 'src/assets/planets/aigen-sprite.png';
/** The planet is 48 pixels across: as wide as the other planets on the page. */
const RADIUS = 24;
const CANVAS_W = 96;
const CANVAS_H = 72;
const [CX, CY] = [CANVAS_W / 2, CANVAS_H / 2];

function hash(x, y, salt = 0) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(salt, 2147483647);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** Smooth value noise in 2D: large, clean clusters rather than speckle. */
function noise(x, y, salt = 0) {
  const [xi, yi] = [Math.floor(x), Math.floor(y)];
  const s = (t) => t * t * (3 - 2 * t);
  const [u, v] = [s(x - xi), s(y - yi)];
  const c = (dx, dy) => hash(xi + dx, yi + dy, salt);
  const top = c(0, 0) + (c(1, 0) - c(0, 0)) * u;
  const bottom = c(0, 1) + (c(1, 1) - c(0, 1)) * u;
  return top + (bottom - top) * v;
}

/** Each material has four tones, from lit to deep shadow. */
const PALETTES = {
  crystal: ['#e8feff', '#8eeaf2', '#3fc6d8', '#2a7fc0'],
  blue: ['#8fc0ff', '#4a7fe0', '#2f55b0', '#22397a'],
  green: ['#c6f06a', '#7fca46', '#4f9a3c', '#2f6a35'],
  swirlCore: ['#ff7ae6', '#d040d0', '#8a2ab8', '#4a1a7a'],
  magenta: ['#ff86cc', '#e040a0', '#b02a7a', '#6e1a50'],
  violet: ['#b896f2', '#8a5ad8', '#6a3fc0', '#43287f'],
  purple: ['#7a4aaa', '#55307f', '#3a1d60', '#26113f'],
  warm: ['#ffd2a2', '#ff9f6a', '#e8743e', '#a8452a'],
  coral: ['#ffb4a0', '#ff7a6e', '#d84a5a', '#922a40'],
};
const LAVA = { crust: '#7a1a24', glow: '#ff7a1a', hot: '#ffb02e', core: '#ffe066' };
const OUTLINE = '#140821';
const ORBIT = ['#9a78d0', '#d6bff8'];

/**
 * Regions, in pixels from the centre of the planet: the nearest centre (scaled by its weight and
 * pushed around by noise) owns each pixel, so the borders come out irregular.
 */
const REGIONS = [
  // A large crystal formation across the top, and a smaller one at the bottom.
  { at: [6, -19], weight: 1.4, material: 'crystal' },
  { at: [15, -14], weight: 1, material: 'crystal' },
  { at: [-3, -21], weight: 0.9, material: 'crystal' },
  { at: [-4, 21], weight: 1, material: 'crystal' },
  // Warm rock and coral in the upper left.
  { at: [-14, -12], weight: 1.15, material: 'warm' },
  { at: [-6, -9], weight: 0.8, material: 'warm' },
  { at: [-21, -2], weight: 0.65, material: 'coral' },
  // Violet down the middle, magenta low on the right, dark purple low on the left.
  { at: [2, -6], weight: 0.85, material: 'violet' },
  { at: [3, 6], weight: 0.8, material: 'violet' },
  { at: [12, 16], weight: 0.95, material: 'magenta' },
  { at: [20, 6], weight: 0.6, material: 'coral' },
  { at: [-11, 16], weight: 0.85, material: 'purple' },
  // Small blue pools.
  { at: [-20, 11], weight: 0.5, material: 'blue' },
  { at: [7, 20], weight: 0.45, material: 'blue' },
];

/**
 * Swirls overrule the regions: a spiral arm of one material winds over a base of another, round
 * an eye; `rim` frames the swirl in a third.
 */
const SWIRLS = [
  // The great green swirl, with a violet arm, on the right.
  { at: [12, 1], radius: 11, turn: 1, base: 'green', arm: 'swirlCore', eye: 'magenta' },
  // A magenta swirl with a dark purple arm and a green rim, on the left.
  {
    at: [-12, 4],
    radius: 7.5,
    turn: -1,
    base: 'magenta',
    arm: 'purple',
    eye: 'swirlCore',
    rim: 'green',
  },
  // A small blue eddy low in the middle.
  { at: [-1, 14], radius: 4, turn: 1, base: 'blue', arm: 'violet', eye: 'purple' },
];

/**
 * Cracks: a great river of lava down the middle (`fault`), thinner lava branches off it, and dark
 * fissures without lava through the warm rock.
 */
const CRACKS = [
  {
    kind: 'fault',
    width: 4,
    path: [
      [-1, -16],
      [2, -9],
      [-1, -3],
      [3, 3],
      [-2, 9],
      [1, 16],
      [-3, 21],
    ],
  },
  {
    kind: 'lava',
    width: 2,
    path: [
      [3, 3],
      [9, -2],
      [15, -9],
      [22, -9],
    ],
  },
  {
    kind: 'lava',
    width: 1,
    path: [
      [-2, 9],
      [-9, 12],
      [-17, 18],
    ],
  },
  {
    kind: 'lava',
    width: 1,
    path: [
      [1, 16],
      [9, 14],
      [15, 21],
    ],
  },
  {
    kind: 'fissure',
    width: 1,
    path: [
      [2, -9],
      [-6, -12],
      [-12, -9],
      [-20, -12],
    ],
  },
  {
    kind: 'fissure',
    width: 1,
    path: [
      [-10, -18],
      [-12, -12],
      [-18, -6],
    ],
  },
];

const LIGHT = (() => {
  const v = [-0.5, -0.62, 0.6];
  const length = Math.hypot(...v);
  return v.map((c) => c / length);
})();

// --- The planet's shape: a slightly unsteady disc, crystal spikes, and loose fragments. ---

/** The edge wobbles by a pixel or so, so the disc never looks drawn with a compass. */
const edgeRadius = (angle) => RADIUS - 0.4 + (noise(angle * 2.2 + 10, 3, 7) - 0.5) * 2.4;

const insideDisc = (u, v) => Math.hypot(u, v) <= edgeRadius(Math.atan2(v, u));

/** Crystal spikes breaking out of the top right and the bottom (angles in degrees). */
const SPIKES = [
  { angle: -72, length: 6, width: 3 },
  { angle: -56, length: 8, width: 3.6 },
  { angle: -40, length: 5, width: 2.8 },
  { angle: -88, length: 3, width: 2.2 },
  { angle: 96, length: 5, width: 3 },
  { angle: 112, length: 3, width: 2.2 },
  { angle: 80, length: 3, width: 2 },
].map((spike) => ({ ...spike, angle: (spike.angle * Math.PI) / 180 }));

function inSpike(u, v) {
  return SPIKES.some((spike) => {
    const [dx, dy] = [Math.cos(spike.angle), Math.sin(spike.angle)];
    const along = u * dx + v * dy - (RADIUS - 2);
    const across = Math.abs(-u * dy + v * dx);
    return along > 0 && along < spike.length && across < spike.width * (1 - along / spike.length);
  });
}

/** Fragments drifting off the edge, a pixel or two apart from it: [u, v, w, h, material]. */
const FRAGMENTS = [
  [-27, -12, 3, 3, 'warm'],
  [-30, -7, 2, 2, 'coral'],
  [-25, -17, 2, 2, 'warm'],
  [21, -26, 3, 3, 'crystal'],
  [26, -22, 2, 2, 'crystal'],
  [17, -30, 2, 2, 'crystal'],
  [24, 15, 3, 2, 'magenta'],
  [-6, 27, 2, 2, 'crystal'],
  [3, 28, 2, 2, 'crystal'],
];

// --- Painting. ---

const layers = {
  orbitBack: new Map(),
  body: new Map(),
  glow: new Map(),
  orbitFront: new Map(),
};
const key = (x, y) => `${x},${y}`;
const paint = (layer, x, y, color) => {
  if (x >= 0 && y >= 0 && x < CANVAS_W && y < CANVAS_H) layer.set(key(x, y), color);
};
const tone = (material, index) => PALETTES[material][Math.max(0, Math.min(3, index))];

function regionAt(u, v) {
  let best = { score: Infinity };
  for (const region of REGIONS) {
    const distance = Math.hypot(u - region.at[0], v - region.at[1]) / region.weight;
    const score = distance + (noise(u * 0.32 + 5, v * 0.32 + 9, 11) - 0.5) * 6;
    if (score < best.score) best = { score, region };
  }
  return best.region.material;
}

/** The material and tone inside a swirl, or null outside every swirl. */
function swirlAt(u, v) {
  for (const swirl of SWIRLS) {
    const [du, dv] = [u - swirl.at[0], v - swirl.at[1]];
    const reach = swirl.radius * (1 + (noise(u * 0.4, v * 0.4, 21) - 0.5) * 0.3);
    const r = Math.hypot(du, dv) / reach;
    if (r > 1) continue;
    if (r < 0.17) return { material: swirl.eye, tone: r < 0.09 ? 0 : 1 };
    if (swirl.rim && r > 0.84) return { material: swirl.rim, tone: 2 };
    // One arm winding in two turns: a stripe of the arm material, a lit edge just behind it.
    const angle = Math.atan2(dv, du);
    const phase = ((((swirl.turn * angle) / (Math.PI * 2) + r * 1.7) % 1) + 1) % 1;
    if (phase < 0.42) return { material: swirl.arm, tone: phase < 0.14 ? 1 : 2 };
    return { material: swirl.base, tone: phase < 0.5 ? 0 : phase > 0.86 ? 2 : 1 };
  }
  return null;
}

/** Crystal facets: broad cells, each one flat, with dark lines between them. */
function crystalTone(u, v) {
  const [w, h] = [8, 6];
  const cell = [Math.floor((u + 40) / w), Math.floor((v + 40) / h)];
  let [first, second, owner] = [Infinity, Infinity, null];
  for (let dx = -1; dx <= 1; dx += 1) {
    for (let dy = -1; dy <= 1; dy += 1) {
      const [cellX, cellY] = [cell[0] + dx, cell[1] + dy];
      const px = cellX * w - 40 + hash(cellX, cellY, 31) * w;
      const py = cellY * h - 40 + hash(cellX, cellY, 37) * h;
      const d = Math.hypot(u - px, v - py);
      if (d < first) [second, first, owner] = [first, d, [cellX, cellY]];
      else if (d < second) second = d;
    }
  }
  if (second - first < 0.6) return 3;
  return Math.floor(hash(owner[0], owner[1], 41) * 3);
}

/** Ground is mottled in clusters: a few lit patches, a few shadows, mostly the base tone. */
function groundTone(u, v, salt) {
  const n = noise(u * 0.28 + salt, v * 0.28, 51);
  return n > 0.66 ? 0 : n > 0.36 ? 1 : 2;
}

/** Light from the upper left, in whole steps of tone. */
function lightShift(u, v) {
  const [x, y] = [u / RADIUS, v / RADIUS];
  const z = Math.sqrt(Math.max(0, 1 - x * x - y * y));
  const lit = x * LIGHT[0] + y * LIGHT[1] + z * LIGHT[2];
  return lit > 0.74 ? -1 : lit > 0.28 ? 0 : lit > -0.1 ? 1 : 2;
}

// The ground, the swirls and the crystal.
const material = new Map();
const swirling = new Set();
for (let y = 0; y < CANVAS_H; y += 1) {
  for (let x = 0; x < CANVAS_W; x += 1) {
    const [u, v] = [x + 0.5 - CX, y + 0.5 - CY];
    const spike = inSpike(u, v);
    if (!insideDisc(u, v) && !spike) continue;
    const swirl = spike ? null : swirlAt(u, v);
    const kind = spike ? 'crystal' : swirl ? swirl.material : regionAt(u, v);
    if (swirl) swirling.add(key(x, y));
    const base = swirl
      ? swirl.tone
      : kind === 'crystal'
        ? crystalTone(u, v)
        : groundTone(u, v, kind.length * 13);
    material.set(key(x, y), kind);
    paint(layers.body, x, y, tone(kind, base + lightShift(u, v)));
  }
}

// Borders between different materials get a darker seam, so each region reads as its own piece.
for (const [position, kind] of material) {
  if (swirling.has(position)) continue;
  const [x, y] = position.split(',').map(Number);
  const differs = [
    [x + 1, y],
    [x, y + 1],
  ].some(([nx, ny]) => {
    const other = material.get(key(nx, ny));
    return other && other !== kind;
  });
  if (differs) paint(layers.body, x, y, tone(kind, 3));
}

// Fragments, each lit on its upper left pixel.
for (const [u0, v0, w, h, kind] of FRAGMENTS) {
  for (let dy = 0; dy < h; dy += 1) {
    for (let dx = 0; dx < w; dx += 1) {
      const shade = dx === 0 && dy === 0 ? 0 : dx + dy > 2 ? 2 : 1;
      paint(layers.body, CX + u0 + dx, CY + v0 + dy, tone(kind, shade));
    }
  }
}

// Cracks: broken lines, jittered between their corners. Each pixel knows how far it is from
// the middle of its crack, so the fault can burn hottest at its core.
function crackPixels({ path, width }) {
  const pixels = [];
  path.slice(1).forEach(([u1, v1], index) => {
    const [u0, v0] = path[index];
    const length = Math.hypot(u1 - u0, v1 - v0);
    const steps = Math.ceil(length * 2);
    const [nx, ny] = [-(v1 - v0) / length, (u1 - u0) / length];
    for (let step = 0; step <= steps; step += 1) {
      const t = step / steps;
      const wobble = Math.sin(t * Math.PI) * (noise(index * 7 + t * 3, 2, 61) - 0.5) * 3;
      const [u, v] = [u0 + (u1 - u0) * t + nx * wobble, v0 + (v1 - v0) * t + ny * wobble];
      for (let k = 0; k < width; k += 1) {
        const offset = k - (width - 1) / 2;
        pixels.push({
          x: Math.round(CX + u - 0.5 + nx * offset),
          y: Math.round(CY + v - 0.5 + ny * offset),
          core: Math.abs(offset) < 1,
        });
      }
    }
  });
  return pixels;
}

const cracks = new Map();
for (const crack of CRACKS) {
  for (const { x, y, core } of crackPixels(crack)) {
    const here = material.get(key(x, y));
    // Cracks run through rock and swirls, never through crystal.
    if (!here || here === 'crystal') continue;
    const previous = cracks.get(key(x, y));
    if (!previous || crack.kind === 'fault') cracks.set(key(x, y), { kind: crack.kind, core });
  }
}
// A dark crust along every lava crack; fissures stay a single dark line.
for (const [position, { kind }] of cracks) {
  if (kind === 'fissure') continue;
  const [x, y] = position.split(',').map(Number);
  for (const [nx, ny] of [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ]) {
    const near = key(nx, ny);
    if (!cracks.has(near) && material.has(near) && material.get(near) !== 'crystal') {
      paint(layers.body, nx, ny, LAVA.crust);
    }
  }
}
for (const [position, { kind, core }] of cracks) {
  const [x, y] = position.split(',').map(Number);
  if (kind === 'fissure') {
    paint(layers.body, x, y, LAVA.crust);
    continue;
  }
  const hot = kind === 'fault' ? core : hash(x, y, 71) > 0.7;
  paint(layers.body, x, y, hot ? LAVA.hot : LAVA.glow);
  // The glow layer lights the hottest pixels; the page lets it breathe.
  if (hot)
    paint(layers.glow, x, y, kind === 'fault' && hash(x, y, 73) > 0.4 ? LAVA.core : LAVA.hot);
}

// A one-pixel outline around the planet and every fragment.
const outline = [];
for (let y = 0; y < CANVAS_H; y += 1) {
  for (let x = 0; x < CANVAS_W; x += 1) {
    if (layers.body.has(key(x, y))) continue;
    const touches = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ].some(([nx, ny]) => layers.body.has(key(nx, ny)));
    if (touches) outline.push([x, y]);
  }
}
for (const [x, y] of outline) paint(layers.body, x, y, OUTLINE);

// A thin, broken orbit, tilted and a little unsteady; its far half passes behind the planet.
const TILT = (-16 * Math.PI) / 180;
for (let step = 0; step < 720; step += 1) {
  const t = (step / 720) * Math.PI * 2;
  // Gaps break it into uneven arcs.
  if (noise(t * 2.4, 5, 81) > 0.82) continue;
  const wobble = (noise(t * 3, 9, 83) - 0.5) * 1.6;
  const [ox, oy] = [(41 + wobble) * Math.cos(t), (10 + wobble * 0.4) * Math.sin(t)];
  const [x, y] = [
    Math.round(CX + ox * Math.cos(TILT) - oy * Math.sin(TILT) - 0.5),
    Math.round(CY + ox * Math.sin(TILT) + oy * Math.cos(TILT) - 0.5),
  ];
  const color = hash(x, y, 87) > 0.8 ? ORBIT[1] : ORBIT[0];
  paint(Math.sin(t) < 0 ? layers.orbitBack : layers.orbitFront, x, y, color);
}

// --- Output: the four layers, stacked top to bottom. ---
const order = [layers.orbitBack, layers.body, layers.glow, layers.orbitFront];
const pixels = Buffer.alloc(CANVAS_W * CANVAS_H * order.length * 4);
order.forEach((layer, index) => {
  for (const [position, color] of layer) {
    const [x, y] = position.split(',').map(Number);
    const offset = ((index * CANVAS_H + y) * CANVAS_W + x) * 4;
    const rgb = [1, 3, 5].map((at) => parseInt(color.slice(at, at + 2), 16));
    pixels.set([...rgb, 255], offset);
  }
});

await sharp(pixels, { raw: { width: CANVAS_W, height: CANVAS_H * order.length, channels: 4 } })
  .png({ palette: true, dither: 0, compressionLevel: 9, effort: 10 })
  .toFile(OUTPUT);
console.log(`Wrote ${OUTPUT}`);
