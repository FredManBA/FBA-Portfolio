import { useEffect, type RefObject } from 'react';
import { clamp } from '../utils/math';
import { FINE_POINTER_QUERY, REDUCED_MOTION_QUERY } from './useMediaQuery';

interface PointerTiltOptions {
  /** Maximum rotation in degrees on each axis. */
  maxTilt?: number;
  /** Element that receives pointer events. Defaults to the target itself. */
  trackRef?: RefObject<HTMLElement | null>;
}

const TILT_PROPERTIES = ['--pointer-x', '--pointer-y', '--tilt-x', '--tilt-y'] as const;

/** Removes the tilt state from an element, for example right before a layout animation. */
export function clearPointerTilt(element: HTMLElement): void {
  delete element.dataset.tilt;
  TILT_PROPERTIES.forEach((property) => element.style.removeProperty(property));
}

/**
 * Writes pointer position and tilt angles as CSS custom properties on the target, so the
 * visual effect lives in CSS. Only active for mouse pointers when motion is allowed.
 * Bounds are cached per hover to avoid forcing layout on every pointer move.
 */
export function usePointerTilt(
  targetRef: RefObject<HTMLElement | null>,
  { maxTilt = 6, trackRef }: PointerTiltOptions = {},
): void {
  useEffect(() => {
    const target = targetRef.current;
    const track = trackRef?.current ?? target;

    if (!target || !track) {
      return;
    }

    const finePointer = window.matchMedia(FINE_POINTER_QUERY);
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    let bounds: DOMRect | null = null;
    let frame = 0;

    const invalidateBounds = () => {
      bounds = null;
    };

    const reset = () => {
      cancelAnimationFrame(frame);
      bounds = null;
      clearPointerTilt(target);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !finePointer.matches || reducedMotion.matches) {
        return;
      }

      bounds ??= track.getBoundingClientRect();
      const x = clamp((event.clientX - bounds.left) / bounds.width);
      const y = clamp((event.clientY - bounds.top) / bounds.height);

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        target.dataset.tilt = 'active';
        target.style.setProperty('--pointer-x', x.toFixed(3));
        target.style.setProperty('--pointer-y', y.toFixed(3));
        target.style.setProperty('--tilt-x', `${((0.5 - y) * 2 * maxTilt).toFixed(2)}deg`);
        target.style.setProperty('--tilt-y', `${((x - 0.5) * 2 * maxTilt).toFixed(2)}deg`);
      });
    };

    track.addEventListener('pointermove', handlePointerMove);
    track.addEventListener('pointerleave', reset);
    window.addEventListener('scroll', invalidateBounds, { passive: true });
    window.addEventListener('resize', invalidateBounds);

    return () => {
      reset();
      track.removeEventListener('pointermove', handlePointerMove);
      track.removeEventListener('pointerleave', reset);
      window.removeEventListener('scroll', invalidateBounds);
      window.removeEventListener('resize', invalidateBounds);
    };
  }, [targetRef, trackRef, maxTilt]);
}
