import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { MotionGlobalConfig } from 'framer-motion';
import { afterEach } from 'vitest';

// Animations resolve instantly so tests assert on final states.
MotionGlobalConfig.skipAnimations = true;

// jsdom does not implement these browser APIs. Tests run with reduced motion, which also
// covers that mode: layout animations never settle in jsdom because every box measures 0.
Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  writable: true,
  value: (query: string): MediaQueryList => ({
    matches: query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  }),
});

class IntersectionObserverStub {
  readonly root = null;
  readonly rootMargin = '0px';
  readonly thresholds = [0];
  observe = () => undefined;
  unobserve = () => undefined;
  disconnect = () => undefined;
  takeRecords = () => [];
}

window.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver;
window.scrollTo = () => undefined;
Element.prototype.scrollIntoView = () => undefined;

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
