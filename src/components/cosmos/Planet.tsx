import type { CSSProperties } from 'react';
import type { ProjectCategory } from '../../types';
import styles from './Planet.module.css';

interface PlanetProps {
  /** Each studio area is a planet: marbled games, gridded web, banded software. */
  kind: ProjectCategory;
  /** Any CSS length. */
  size: string;
  /** Close-up version: stronger surface detail plus the area's ring, grid orbit or moons. */
  large?: boolean;
  className?: string;
}

/** Great circles through the poles of the web planet, 30° apart. */
const MERIDIANS = [0, 1, 2, 3, 4, 5];

/**
 * Decorative planet. Its surface turns on the planet's axis as the page scrolls (see the CSS).
 * Purely visual: always hidden from assistive technology.
 */
export function Planet({ kind, size, large = false, className }: PlanetProps) {
  const sphere = (
    <span
      className={`${styles.planet} ${styles[kind]} ${large ? styles.large : ''}`}
      style={{ '--planet-size': size } as CSSProperties}
    >
      <span className={styles.surface}>
        {kind === 'web' &&
          MERIDIANS.map((index) => <i key={index} style={{ '--i': index } as CSSProperties} />)}
      </span>
    </span>
  );

  if (!large) {
    return (
      <span className={className} aria-hidden="true">
        {sphere}
      </span>
    );
  }

  return (
    <span className={`${styles.scene} ${className ?? ''}`} data-kind={kind} aria-hidden="true">
      {kind === 'games' && <span className={`${styles.ring} ${styles.ringBack}`} />}
      {kind === 'web' && <span className={styles.gridOrbit} />}
      {kind === 'software' && (
        <span className={styles.moons}>
          <i />
          <i />
        </span>
      )}
      {sphere}
      {kind === 'games' && <span className={`${styles.ring} ${styles.ringFront}`} />}
    </span>
  );
}
