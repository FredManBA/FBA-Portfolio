import { LazyMotion, MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

// Animation features (including shared layout) load in a separate chunk after first paint.
const loadFeatures = () => import('./motionFeatures').then((module) => module.default);

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
