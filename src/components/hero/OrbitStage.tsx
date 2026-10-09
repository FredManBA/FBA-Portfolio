import { useEffect, useRef, type CSSProperties } from 'react';
import { AREA_ORDER, SECTION_IDS } from '../../data/site';
import { useLanguage } from '../../hooks/useLanguage';
import { REDUCED_MOTION_QUERY } from '../../hooks/useMediaQuery';
import type { ProjectCategory } from '../../types';
import { Logo } from '../brand/Logo';
import { Planet } from '../cosmos/Planet';
import styles from './OrbitStage.module.css';

interface Orbit {
  /** Radii as a fraction of the stage width (rx) and height (ry). */
  rx: number;
  ry: number;
  /** Narrow stages use tighter radii so the planets clear the logo. */
  narrow: { rx: number; ry: number };
  tilt: number;
  /** Seconds per revolution: slow enough to stay ambient. */
  period: number;
  /** Starting angle in degrees; also the resting angle with reduced motion. */
  angle: number;
  planetSize: number;
}

const ORBITS: Record<ProjectCategory, Orbit> = {
  games: {
    rx: 0.335,
    ry: 0.27,
    narrow: { rx: 0.4, ry: 0.26 },
    tilt: -9,
    period: 96,
    angle: 196,
    planetSize: 58,
  },
  web: {
    rx: 0.415,
    ry: 0.37,
    narrow: { rx: 0.45, ry: 0.35 },
    tilt: 5,
    period: 128,
    angle: 338,
    planetSize: 66,
  },
  software: {
    rx: 0.485,
    ry: 0.455,
    narrow: { rx: 0.49, ry: 0.43 },
    tilt: -4,
    period: 164,
    angle: 104,
    planetSize: 50,
  },
};

const NARROW_STAGE = 600;
const PATH_STEPS = 72;

interface Geometry {
  width: number;
  height: number;
  rx: number;
  ry: number;
  tilt: number;
}

function geometry(orbit: Orbit, width: number, height: number): Geometry {
  const radii = width < NARROW_STAGE ? orbit.narrow : orbit;
  return {
    width,
    height,
    rx: radii.rx * width,
    ry: radii.ry * height,
    tilt: (orbit.tilt * Math.PI) / 180,
  };
}

function pointOn(g: Geometry, theta: number): [number, number] {
  const x = g.rx * Math.cos(theta);
  const y = g.ry * Math.sin(theta);
  return [
    g.width / 2 + x * Math.cos(g.tilt) - y * Math.sin(g.tilt),
    g.height / 2 + x * Math.sin(g.tilt) + y * Math.cos(g.tilt),
  ];
}

function arcPath(g: Geometry, from: number, to: number): string {
  let d = '';
  for (let step = 0; step <= PATH_STEPS; step++) {
    const [x, y] = pointOn(g, from + ((to - from) * step) / PATH_STEPS);
    d += `${step ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

/**
 * The hero centrepiece: the logo is the star and each studio area orbits it as a planet that
 * links to its section. The near half of every orbit is drawn over the logo, so planets pass
 * in front of it and behind it. Motion is ambient (minutes per revolution), pauses while a
 * planet is hovered or focused, stops off screen and is static with reduced motion.
 */
export function OrbitStage() {
  const { t } = useLanguage();
  const stageRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<SVGSVGElement>(null);
  const frontRef = useRef<SVGSVGElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const planetRefs = useRef<Partial<Record<ProjectCategory, HTMLAnchorElement | null>>>({});

  useEffect(() => {
    const stage = stageRef.current;
    const back = backRef.current;
    const front = frontRef.current;
    const logo = logoRef.current?.querySelector('img');
    if (!stage || !back || !front || !logo) {
      return;
    }

    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    const angles: Record<ProjectCategory, number> = {
      games: ORBITS.games.angle,
      web: ORBITS.web.angle,
      software: ORBITS.software.angle,
    };
    const paused = new Set<ProjectCategory>();
    let width = 0;
    let height = 0;

    const placePlanets = () => {
      const logoHalfWidth = logo.offsetWidth / 2 + 30;
      const logoHalfHeight = logo.offsetHeight / 2 + 20;
      for (const area of AREA_ORDER) {
        const planet = planetRefs.current[area];
        if (!planet) {
          continue;
        }
        const g = geometry(ORBITS[area], width, height);
        const theta = (angles[area] * Math.PI) / 180;
        const [x, y] = pointOn(g, theta);
        // +1 is the near side of the orbit (bottom of the ellipse), -1 the far side.
        const depth = Math.sin(theta);
        const scale = 0.82 + 0.26 * ((depth + 1) / 2);
        planet.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale.toFixed(3)})`;
        planet.style.zIndex = depth > 0 ? '4' : '1';
        // The label fades while its planet passes behind the logo instead of being clipped.
        // On narrow stages the logo spans almost the full width, so any far-side label hides.
        const hidden =
          depth < 0 &&
          (width < NARROW_STAGE ||
            (Math.abs(x - width / 2) < logoHalfWidth && Math.abs(y - height / 2) < logoHalfHeight));
        planet.toggleAttribute('data-hidden', hidden);
      }
    };

    const layout = () => {
      width = stage.clientWidth;
      height = stage.clientHeight;
      const viewBox = `0 0 ${width} ${height}`;
      back.setAttribute('viewBox', viewBox);
      front.setAttribute('viewBox', viewBox);
      const shapes = AREA_ORDER.map((area) => geometry(ORBITS[area], width, height));
      back.innerHTML = shapes.map((g) => `<path d="${arcPath(g, 0, Math.PI * 2)}"/>`).join('');
      front.innerHTML = shapes.map((g) => `<path d="${arcPath(g, 0, Math.PI)}"/>`).join('');
      for (const path of stage.querySelectorAll<SVGPathElement>('path')) {
        path.style.setProperty('--length', String(Math.ceil(path.getTotalLength?.() ?? 4000)));
      }
      placePlanets();
    };

    let frame = 0;
    let last = 0;
    let visible = true;
    const tick = (now: number) => {
      const elapsed = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      for (const area of AREA_ORDER) {
        if (!paused.has(area)) {
          angles[area] = (angles[area] + (360 / ORBITS[area].period) * elapsed) % 360;
        }
      }
      placePlanets();
      frame = requestAnimationFrame(tick);
    };
    const syncLoop = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (!reducedMotion.matches && visible && !document.hidden) {
        frame = requestAnimationFrame(tick);
      }
    };

    const cleanups: Array<() => void> = [];
    for (const area of AREA_ORDER) {
      const planet = planetRefs.current[area];
      if (!planet) {
        continue;
      }
      const pause = () => paused.add(area);
      const resume = () => paused.delete(area);
      planet.addEventListener('pointerenter', pause);
      planet.addEventListener('focus', pause);
      planet.addEventListener('pointerleave', resume);
      planet.addEventListener('blur', resume);
      cleanups.push(() => {
        planet.removeEventListener('pointerenter', pause);
        planet.removeEventListener('focus', pause);
        planet.removeEventListener('pointerleave', resume);
        planet.removeEventListener('blur', resume);
      });
    }

    layout();
    syncLoop();

    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(layout);
    resizeObserver?.observe(stage);
    logo.addEventListener('load', layout);
    const intersectionObserver =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            visible = entry?.isIntersecting ?? true;
            syncLoop();
          });
    intersectionObserver?.observe(stage);
    document.addEventListener('visibilitychange', syncLoop);
    reducedMotion.addEventListener('change', syncLoop);

    return () => {
      cancelAnimationFrame(frame);
      cleanups.forEach((cleanup) => cleanup());
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      logo.removeEventListener('load', layout);
      document.removeEventListener('visibilitychange', syncLoop);
      reducedMotion.removeEventListener('change', syncLoop);
    };
  }, []);

  return (
    <div ref={stageRef} className={styles.stage}>
      <svg ref={backRef} className={`${styles.orbits} ${styles.back}`} aria-hidden="true" />
      <h1 ref={logoRef} id="hero-title" className={styles.title}>
        <Logo alt="Needy Friends" className={styles.logo} />
      </h1>
      <svg ref={frontRef} className={`${styles.orbits} ${styles.front}`} aria-hidden="true" />

      {AREA_ORDER.map((area) => (
        <a
          key={area}
          ref={(element) => {
            planetRefs.current[area] = element;
          }}
          href={`#${SECTION_IDS[area]}`}
          className={styles.orbiter}
          style={{ '--orbiter-size': `${ORBITS[area].planetSize}px` } as CSSProperties}
        >
          <Planet kind={area} size={`${ORBITS[area].planetSize}px`} className={styles.planet} />
          <span className={styles.tag}>{t.nav[area]}</span>
        </a>
      ))}
    </div>
  );
}
