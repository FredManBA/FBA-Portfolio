import { useSyncExternalStore } from 'react';

function subscribe(onScroll: () => void) {
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}

/** True once the page has scrolled past `threshold` pixels. Re-renders only when that flips. */
export function useScrolled(threshold = 8): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > threshold,
    () => false,
  );
}
