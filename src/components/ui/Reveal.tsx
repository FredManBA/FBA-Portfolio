import { m } from 'framer-motion';
import type { ReactNode } from 'react';
import { EASE_OUT } from '../motion/easing';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/** Fades content up once when it enters the viewport. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, delay, ease: EASE_OUT }}
    >
      {children}
    </m.div>
  );
}
