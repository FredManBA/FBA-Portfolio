import { useEffect, useState } from 'react';

/** Pixels of scroll in one direction needed before the state flips, to ignore jitter. */
const DELTA = 8;

/**
 * True while the reader scrolls down past `offset`; false again as soon as they scroll up or
 * return near the top. Used to tuck the header away while reading.
 */
export function useHideOnScroll(offset = 120): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      if (y <= offset) {
        setHidden(false);
        lastY = y;
      } else if (y > lastY + DELTA) {
        setHidden(true);
        lastY = y;
      } else if (y < lastY - DELTA) {
        setHidden(false);
        lastY = y;
      }
    };
    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [offset]);

  return hidden;
}
