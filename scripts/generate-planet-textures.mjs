// Generates the gas planet surfaces of the team (Mariana, DilanOv, FreDev) and FreDev's moons as
// vector illustrations: flowing bands that curl into vortices, with wisps and bright streams
// along the flow. Only filled shapes and lines, no filters, so the edges stay crisp at any size.
// Planet tiles wrap horizontally, so the planet can turn on its axis as the page scrolls (see
// Planet.module.css). They are seeded: running it again gives the same images. AigenDev's
// pixel-art planet comes from generate-pixel-planet.mjs.
// Usage: npm run planets
import { writeFile } from 'node:fs/promises';

/** One full turn of a planet, in hundredths of its size (the CSS tile is 3.2 × 1.24). */
const PLANET_TILE = 320;
const HEIGHT = 124;
const TAU = Math.PI * 2;

function mulberry32(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (value) => Math.round(value * 10) / 10;
const points = (list) => list.map(([x, y]) => `${round(x)} ${round(y)}`).join('L');
const taper = (max) => (t) => max * Math.sin(Math.PI * t) ** 0.7;

/**
 * Builds one surface.
 * - `tile`: its width; a full turn for a planet, a square for a moon that does not turn.
 * - `bands`: edges from the top of the tile down; each band is painted over the one above it.
 *   `highlight` draws a light line along its upper edge, `lineWidth` thick: the crisp,
 *   illustrated finish (on marble, the veins).
 * - `swirls`: every point near one is turned around its centre, more strongly the closer it is,
 *   so the bands themselves curl into the vortex. `stretch` widens it along the flow.
 * - `streaks`: tapered wisps and streams that follow a band edge (named by its `y`).
 * - `dots`: small round markers in a row along a band edge.
 */
function gasPlanet({
  seed,
  tile = PLANET_TILE,
  bands,
  swirls,
  streaks = [],
  dots = [],
  amplitude = 1.2,
  tongues = 2,
  lineWidth = 0.7,
}) {
  const random = mulberry32(seed);
  const between = (min, max) => min + random() * (max - min);

  /** Signed horizontal distance on the wrapped tile. */
  function wrapDx(a, b) {
    const d = (((a - b) % tile) + tile * 1.5) % tile;
    return d - tile / 2;
  }

  /** A wrapping band edge: harmonics whose period divides the tile, plus tongues of gas. */
  function edge(base) {
    const harmonics = [1, 2, 3, 5].map((k, index) => ({
      k,
      a: amplitude * between(0.5, 1) * [3.2, 2, 1.1, 0.5][index],
      phase: between(0, TAU),
    }));
    const bulges = Array.from({ length: tongues }, () => ({
      x: between(0, tile),
      a: between(4, 9) * (random() < 0.5 ? -1 : 1),
      width: between(12, 26),
    }));
    return (x) =>
      base +
      harmonics.reduce((sum, h) => sum + h.a * Math.sin((TAU * h.k * x) / tile + h.phase), 0) +
      bulges.reduce((sum, b) => sum + b.a * Math.exp(-((wrapDx(x, b.x) / b.width) ** 2)), 0);
  }

  function twist([x, y]) {
    let point = [x, y];
    for (const swirl of swirls) {
      const dx = wrapDx(point[0], swirl.x) / swirl.stretch;
      const dy = point[1] - swirl.y;
      const angle = swirl.turn * Math.exp(-((Math.hypot(dx, dy) / swirl.radius) ** 2));
      const [cos, sin] = [Math.cos(angle), Math.sin(angle)];
      point = [
        point[0] + (dx * cos - dy * sin - dx) * swirl.stretch,
        swirl.y + dx * sin + dy * cos,
      ];
    }
    return point;
  }

  /** Dense samples around the vortices, where the curves wind; sparse ones elsewhere. */
  const xs = [];
  for (let x = -4; x <= tile + 4;) {
    xs.push(x);
    const near = swirls.some(
      (swirl) => Math.abs(wrapDx(x, swirl.x)) < swirl.radius * swirl.stretch * 2.2,
    );
    x += near ? 1 : 4;
  }

  const layers = bands.map((band) => ({
    ...band,
    edge: band.y === undefined ? () => 0 : edge(band.y),
  }));
  const layerAt = (y) => layers.find((layer) => layer.y === y);

  function bandShape(band) {
    const top = xs.map((x) => twist([x, band.edge(x)]));
    return `<path fill="${band.color}" d="M${points(top)}L${tile + 4} ${HEIGHT + 2}L-4 ${HEIGHT + 2}Z"/>`;
  }

  function highlight(band) {
    const top = xs.map((x) => twist([x, band.edge(x) + 0.5]));
    return `<path fill="none" stroke="${band.highlight}" stroke-opacity="0.5" stroke-width="${lineWidth}" d="M${points(top)}"/>`;
  }

  /** A filled ribbon along a centre line, as wide as `width(t)` for t from 0 to 1. */
  function ribbon(centre, width) {
    const left = [];
    const right = [];
    centre.forEach(([x, y], index) => {
      const [px, py] = centre[Math.max(0, index - 1)];
      const [nx, ny] = centre[Math.min(centre.length - 1, index + 1)];
      const length = Math.hypot(nx - px, ny - py) || 1;
      const normal = [-(ny - py) / length, (nx - px) / length];
      const half = width(index / (centre.length - 1)) / 2;
      left.push(twist([x + normal[0] * half, y + normal[1] * half]));
      right.push(twist([x - normal[0] * half, y - normal[1] * half]));
    });
    return `M${points(left)}L${points(right.reverse())}Z`;
  }

  /** Drawn at every horizontal copy that reaches the tile, so it wraps. */
  function streak({ along, x, length, offset = 0, width, color }) {
    const band = layerAt(along);
    return [-tile, 0, tile]
      .map((shift) => {
        const centre = [];
        for (let s = 0; s <= length; s += 2) {
          centre.push([x + s + shift, band.edge(x + s) + offset]);
        }
        // Skip the copies that fall entirely outside the tile (with room for the vortices).
        if (centre.every(([cx]) => cx < -40 || cx > tile + 40)) return '';
        return `<path fill="${color}" d="${ribbon(centre, taper(width))}"/>`;
      })
      .join('');
  }

  function dotRow({ along, x, count, spacing, offset, r, color }) {
    const band = layerAt(along);
    return Array.from({ length: count }, (_, index) => {
      const at = x + index * spacing;
      const [cx, cy] = twist([at, band.edge(at) + offset]);
      return [-tile, 0, tile]
        .map(
          (shift) =>
            `<circle cx="${round(cx + shift)}" cy="${round(cy)}" r="${r}" fill="${color}"/>`,
        )
        .join('');
    }).join('');
  }

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${tile} ${HEIGHT}" preserveAspectRatio="none">`,
    `<rect width="${tile}" height="${HEIGHT}" fill="${layers[0].color}"/>`,
    // Each highlight right after its band, so the bands below cover it where they overlap.
    ...layers.slice(1).map((band) => bandShape(band) + (band.highlight ? highlight(band) : '')),
    ...streaks.map(streak),
    ...dots.map(dotRow),
    '</svg>',
  ].join('');
}

/** Mariana: pink, magenta and deep violet nebula with turquoise streams. */
const MARIANA = gasPlanet({
  seed: 12,
  bands: [
    { color: '#3a0b38' },
    { y: 9, color: '#5c1145' },
    { y: 16, color: '#c8325f' },
    { y: 24, color: '#ff8fb0', highlight: '#ffd0e0' },
    { y: 29, color: '#e85a88' },
    { y: 34, color: '#7a1f63' },
    { y: 45, color: '#2a0828' },
    { y: 56, color: '#e85a88', highlight: '#ffd0e0' },
    { y: 62, color: '#c8325f' },
    { y: 67, color: '#9b2f86' },
    { y: 78, color: '#2a0828' },
    { y: 88, color: '#5c1145' },
    { y: 93, color: '#c8325f' },
    { y: 102, color: '#f590b0', highlight: '#ffd0e0' },
    { y: 108, color: '#7a1f63' },
    { y: 116, color: '#3a0b38' },
  ],
  swirls: [
    { x: 228, y: 64, turn: 2.6 * Math.PI, radius: 13, stretch: 1.9 },
    { x: 92, y: 30, turn: -1.6 * Math.PI, radius: 8, stretch: 1.7 },
  ],
  streaks: [
    // Wisps inside the bands: lighter or darker streaks that follow the flow.
    { along: 16, x: 30, length: 70, offset: 4, width: 2.4, color: '#e85a88' },
    { along: 34, x: 150, length: 90, offset: 6, width: 3, color: '#b04a9a' },
    { along: 45, x: 40, length: 80, offset: 5, width: 2.2, color: '#5c1145' },
    { along: 67, x: 250, length: 60, offset: 6, width: 2.4, color: '#c46ab8' },
    { along: 93, x: 120, length: 100, offset: 4, width: 2.6, color: '#e85a88' },
    // Turquoise streams along the dark bands, each with a pale core.
    { along: 56, x: 150, length: 150, offset: -1.6, width: 2.4, color: '#5fe3ee' },
    { along: 56, x: 175, length: 100, offset: -1.6, width: 0.8, color: '#d2fbff' },
    { along: 78, x: 20, length: 110, offset: 3, width: 1.6, color: '#4fd0e0' },
  ],
});

/**
 * DilanOv: deep violet clouds around one wide current of green energy, with mint filaments,
 * green masses drifting through the dark and a large vortex inside the current.
 */
const DILANOV = gasPlanet({
  seed: 31,
  amplitude: 1.5,
  tongues: 3,
  bands: [
    { color: '#1c0629' },
    { y: 10, color: '#3d0f5c' },
    { y: 21, color: '#6a2aa8' },
    { y: 29, color: '#a970e8', highlight: '#eadcff' },
    { y: 34, color: '#4a1475' },
    { y: 45, color: '#12031d' },
    { y: 53, color: '#1f8a4f' },
    { y: 57, color: '#3fe08a', highlight: '#d4ffe8' },
    { y: 65, color: '#8ff5c0' },
    { y: 68, color: '#2fbf6e' },
    { y: 74, color: '#17603d' },
    { y: 80, color: '#12031d' },
    { y: 92, color: '#5a1f99' },
    { y: 101, color: '#b78af0', highlight: '#eadcff' },
    { y: 106, color: '#3d0f5c' },
    { y: 116, color: '#1c0629' },
  ],
  swirls: [
    { x: 112, y: 62, turn: 2.8 * Math.PI, radius: 15, stretch: 2 },
    { x: 246, y: 36, turn: -2 * Math.PI, radius: 10, stretch: 1.8 },
    { x: 34, y: 98, turn: 1.4 * Math.PI, radius: 7, stretch: 1.6 },
  ],
  streaks: [
    // Violet and lilac wisps in the clouds.
    { along: 21, x: 170, length: 90, offset: 4, width: 2.6, color: '#8b4fd6' },
    { along: 34, x: 20, length: 80, offset: 6, width: 2.4, color: '#6a2aa8' },
    { along: 106, x: 200, length: 100, offset: 4, width: 2.8, color: '#5a1f99' },
    // Green masses drifting through the dark bands.
    { along: 45, x: 200, length: 70, offset: 4, width: 3.4, color: '#1f8a4f' },
    { along: 80, x: 150, length: 80, offset: 6, width: 4, color: '#2fbf6e' },
    { along: 80, x: 165, length: 50, offset: 6, width: 1.4, color: '#8ff5c0' },
    // Mint filaments of energy along the green current.
    { along: 57, x: 60, length: 160, offset: 2.2, width: 1.2, color: '#e2fff0' },
    { along: 68, x: 210, length: 120, offset: 2.5, width: 1, color: '#c8ffe2' },
  ],
});

/**
 * FreDev: a warm gas giant with wide bands, a great storm and a faint mauve shadow, plus a
 * designed touch: hairline filaments along the flow and a short row of dots.
 */
const FREDEV = gasPlanet({
  seed: 47,
  amplitude: 1.1,
  bands: [
    { color: '#d9743c' },
    { y: 9, color: '#f39a55' },
    { y: 17, color: '#ffd59a', highlight: '#fff4e0' },
    { y: 23, color: '#ffc27e' },
    { y: 30, color: '#e8822e' },
    { y: 38, color: '#c8592c' },
    { y: 44, color: '#ffb070' },
    { y: 51, color: '#ffd9a6', highlight: '#fff4e0' },
    { y: 62, color: '#ffb878' },
    { y: 68, color: '#f39a55' },
    { y: 76, color: '#d0612e' },
    { y: 82, color: '#ffd59a', highlight: '#fff4e0' },
    { y: 88, color: '#f7a35e' },
    { y: 96, color: '#c8592c' },
    { y: 102, color: '#bd7378' },
    { y: 108, color: '#e8822e' },
    { y: 116, color: '#b5583a' },
  ],
  swirls: [
    { x: 196, y: 60, turn: 1.9 * Math.PI, radius: 14, stretch: 2.4 },
    { x: 64, y: 90, turn: -1.3 * Math.PI, radius: 8, stretch: 2 },
  ],
  streaks: [
    // Warm wisps inside the bands.
    { along: 9, x: 40, length: 90, offset: 4, width: 2.4, color: '#ffb070' },
    { along: 30, x: 150, length: 100, offset: 4, width: 2.6, color: '#f39a55' },
    { along: 68, x: 230, length: 80, offset: 4, width: 2.4, color: '#ffc27e' },
    { along: 88, x: 120, length: 90, offset: 4, width: 2.2, color: '#e8822e' },
    // Hairline filaments: the planet looks drawn on purpose without losing its gas.
    { along: 51, x: 20, length: 260, offset: 3.2, width: 0.55, color: '#fff6e6' },
    { along: 51, x: 40, length: 200, offset: 5.2, width: 0.45, color: '#fff6e6' },
    { along: 17, x: 160, length: 140, offset: 2.6, width: 0.5, color: '#fff6e6' },
    { along: 82, x: 230, length: 150, offset: 2.6, width: 0.5, color: '#fff6e6' },
  ],
  dots: [{ along: 44, x: 60, count: 7, spacing: 7, offset: 3, r: 0.8, color: '#fff4e0' }],
});

/** FreDev's small moon (the dog): white porcelain with soft grey-lavender marble veins. */
const FREDEV_DOG_MOON = gasPlanet({
  seed: 5,
  tile: 124,
  amplitude: 1.4,
  lineWidth: 2.4,
  bands: [
    { color: '#fffdf9' },
    { y: 22, color: '#f7f2ee', highlight: '#b8a9c6' },
    { y: 48, color: '#fffdf9', highlight: '#cdc1d9' },
    { y: 74, color: '#f4eeea', highlight: '#b8a9c6' },
    { y: 98, color: '#fffdf9', highlight: '#d4cade' },
  ],
  swirls: [{ x: 70, y: 58, turn: 1.3 * Math.PI, radius: 16, stretch: 1.4 }],
  streaks: [{ along: 48, x: 10, length: 70, offset: 7, width: 1.6, color: '#d7cde2' }],
});

/** FreDev's larger moon (the partner): deep, bright and pale blues, full of soft swirls. */
const FREDEV_PARTNER_MOON = gasPlanet({
  seed: 9,
  tile: 124,
  lineWidth: 1.8,
  bands: [
    { color: '#2f4fc0' },
    { y: 14, color: '#4a8fe8' },
    { y: 24, color: '#d6ecff', highlight: '#f2f9ff' },
    { y: 32, color: '#8ec8ff' },
    { y: 44, color: '#5a6fe0' },
    { y: 56, color: '#d6ecff', highlight: '#f2f9ff' },
    { y: 64, color: '#4a8fe8' },
    { y: 74, color: '#2f4fc0' },
    { y: 84, color: '#a8dcff', highlight: '#f2f9ff' },
    { y: 94, color: '#5a6fe0' },
    { y: 106, color: '#4a8fe8' },
  ],
  swirls: [
    { x: 30, y: 40, turn: 2.2 * Math.PI, radius: 9, stretch: 1.3 },
    { x: 88, y: 30, turn: -1.8 * Math.PI, radius: 8, stretch: 1.3 },
    { x: 62, y: 78, turn: 2.4 * Math.PI, radius: 11, stretch: 1.4 },
    { x: 104, y: 92, turn: -1.6 * Math.PI, radius: 7, stretch: 1.2 },
    { x: 20, y: 96, turn: -1.6 * Math.PI, radius: 7, stretch: 1.2 },
  ],
});

for (const [name, svg] of [
  ['mariana-surface', MARIANA],
  ['dilanov-surface', DILANOV],
  ['fredev-surface', FREDEV],
  ['fredev-dog-moon', FREDEV_DOG_MOON],
  ['fredev-partner-moon', FREDEV_PARTNER_MOON],
]) {
  const output = `src/assets/planets/${name}.svg`;
  await writeFile(output, `${svg}\n`);
  console.log(`Wrote ${output}`);
}
