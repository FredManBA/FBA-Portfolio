import { useEffect, type RefObject } from 'react';
import { FINE_POINTER_QUERY, REDUCED_MOTION_QUERY } from './useMediaQuery';

/** Writes the pointer position over the hero as --px/--py (-0.5..0.5) for layered parallax. */
export function useHeroParallax(heroRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) {
      return;
    }
    const finePointer = window.matchMedia(FINE_POINTER_QUERY);
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    let frame = 0;
    const handleMove = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches) {
        return;
      }
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = hero.getBoundingClientRect();
        hero.style.setProperty(
          '--px',
          ((event.clientX - bounds.left) / bounds.width - 0.5).toFixed(3),
        );
        hero.style.setProperty(
          '--py',
          ((event.clientY - bounds.top) / bounds.height - 0.5).toFixed(3),
        );
      });
    };
    hero.addEventListener('pointermove', handleMove);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener('pointermove', handleMove);
    };
  }, [heroRef]);
}
