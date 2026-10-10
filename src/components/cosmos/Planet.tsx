import type { CSSProperties } from 'react';
import type { MemberPlanet, PlanetKind } from '../../types';
import styles from './Planet.module.css';

interface PlanetProps {
  kind: PlanetKind;
  /**
   * Any CSS length that does not depend on the planet's own box (px, vw, cqi…): the planet lays
   * out its moons, pixels and partner in fractions of it.
   */
  size: string;
  /** Close-up version: the planet on a square stage, with its light behind it. */
  large?: boolean;
  /**
   * How it moves: on its own (`auto`), or as the page scrolls (`scroll`). Surfaces turn, the pair
   * circles and FreDev's moons orbit either way; AigenDev's world always floats on its own.
   */
  motion?: Motion;
  className?: string;
}

type Motion = 'auto' | 'scroll';

/**
 * Loose pixels around AigenDev's planet, each drifting a pixel or two and back: position in % of
 * the planet, size and drift in pixels of the sprite, and how long one drift takes.
 */
const SPECKS = [
  { x: 88, y: -14, size: 1, tone: 'ice', dx: 1, dy: -1, time: 5 },
  { x: 104, y: 4, size: 1, tone: 'ice', dx: 1, dy: 1, time: 6.5 },
  { x: -16, y: 8, size: 1, tone: 'ember', dx: -1, dy: -1, time: 4.5 },
  { x: -22, y: 30, size: 1, tone: 'ember', dx: -1, dy: 1, time: 6 },
  { x: -10, y: -4, size: 1, tone: 'rose', dx: -1, dy: 0, time: 5.5 },
  { x: 108, y: 58, size: 1, tone: 'moss', dx: 1, dy: 0, time: 7 },
  { x: 96, y: 92, size: 1, tone: 'rose', dx: 1, dy: 1, time: 5 },
  { x: 18, y: 108, size: 1, tone: 'ice', dx: 0, dy: 1, time: 6 },
  { x: 62, y: 112, size: 1, tone: 'ember', dx: 1, dy: 1, time: 4.8 },
] as const;

const sized = (size: string) => ({ '--planet-size': size }) as CSSProperties;

interface SphereProps {
  kind: MemberPlanet;
  size: string;
  glowing?: boolean;
}

/** A gas planet: a vector surface that turns on its axis as the page scrolls (see the CSS). */
function GasSphere({ kind, size, glowing = false }: SphereProps) {
  return (
    <span
      className={`${styles.planet} ${styles[kind]} ${glowing ? styles.glowing : ''}`}
      style={sized(size)}
    >
      <span className={styles.surface} />
    </span>
  );
}

interface PartProps {
  size: string;
  className?: string;
}

/** The classes for a planet's outermost element. */
const rootClass = (motion: Motion, ...classes: Array<string | undefined>) =>
  [...classes, motion === 'auto' ? styles.auto : ''].filter(Boolean).join(' ');

/** FreDev's planet between its two orbits and moons: a small white one, a large swirled one. */
function FredevSystem({ size, className }: PartProps) {
  return (
    <span
      className={`${styles.system} ${styles.fredevSystem} ${className ?? ''}`}
      style={sized(size)}
      aria-hidden="true"
    >
      <span className={styles.orbit} />
      <span className={`${styles.orbit} ${styles.orbitOuter}`} />
      <GasSphere kind="fredev" size={size} />
      <span className={`${styles.orbit} ${styles.orbitFront}`} />
      <span className={`${styles.orbit} ${styles.orbitOuter} ${styles.orbitFront}`} />
      {/* The small white moon stands for FreDev's dog; the larger one, for FreDev's partner. */}
      <span className={`${styles.moon} ${styles.moonDog}`} />
      <span className={`${styles.moon} ${styles.moonPartner}`} />
    </span>
  );
}

/**
 * AigenDev's world: a hand-composed pixel-art sprite (npm run planets) in four layers, the back
 * of its orbit, the planet, the glow of its cracks and the front of the orbit, plus loose pixels.
 * It does not turn: the planet floats, the orbit sways, the lava breathes and the pixels drift.
 */
function PixelWorld({ size, className }: PartProps) {
  return (
    <span className={`${styles.system} ${className ?? ''}`} style={sized(size)} aria-hidden="true">
      <span className={`${styles.pixelLayer} ${styles.pixelOrbitBack}`} />
      <span className={styles.pixelFloat}>
        <span className={`${styles.pixelLayer} ${styles.pixelBody}`} />
        <span className={`${styles.pixelLayer} ${styles.pixelGlow}`} />
      </span>
      <span className={`${styles.pixelLayer} ${styles.pixelOrbitFront}`} />
      {SPECKS.map((speck, index) => (
        <i
          key={index}
          className={`${styles.speck} ${styles[speck.tone]}`}
          style={
            {
              '--x': `${speck.x}%`,
              '--y': `${speck.y}%`,
              '--s': speck.size,
              '--dx': speck.dx,
              '--dy': speck.dy,
              '--time': `${speck.time}s`,
              '--delay': `${-index * 0.7}s`,
            } as CSSProperties
          }
        />
      ))}
    </span>
  );
}

/**
 * Mariana and DilanOv, a couple, as a binary pair: two glowing planets that circle each other on
 * one tilted orbit as the page scrolls, passing in front of each other.
 */
function Couple({ size, className }: PartProps) {
  return (
    <span className={`${styles.couple} ${className ?? ''}`} style={sized(size)} aria-hidden="true">
      <span className={styles.coupleLight} />
      <span className={styles.coupleOrbit} />
      <span className={`${styles.partner} ${styles.partnerMariana}`}>
        <GasSphere kind="mariana" size="var(--partner-size)" glowing />
      </span>
      <span className={`${styles.partner} ${styles.partnerDilanov}`}>
        <GasSphere kind="dilanov" size="var(--partner-size)" glowing />
      </span>
    </span>
  );
}

function render(kind: PlanetKind, size: string, motion: Motion, className?: string) {
  const classes = rootClass(motion, className);
  switch (kind) {
    case 'aigen':
      return <PixelWorld size={size} className={classes} />;
    case 'fredev':
      return <FredevSystem size={size} className={classes} />;
    case 'couple':
      return <Couple size={size} className={classes} />;
    default:
      return (
        <span className={classes} aria-hidden="true">
          <GasSphere kind={kind} size={size} />
        </span>
      );
  }
}

/**
 * Decorative planet: a team member's planet, or Mariana and DilanOv's pair. Purely visual:
 * always hidden from assistive technology.
 */
export function Planet({ kind, size, large = false, motion = 'auto', className }: PlanetProps) {
  if (!large) return render(kind, size, motion, className);
  return (
    <span className={`${styles.scene} ${className ?? ''}`} data-kind={kind} aria-hidden="true">
      {render(kind, size, motion)}
    </span>
  );
}
