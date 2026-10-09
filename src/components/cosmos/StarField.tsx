import { useEffect, useRef } from 'react';

const TINTS = ['253,248,242', '255,214,170', '214,176,240'] as const;
/** One star every this many square pixels. */
const STAR_DENSITY = 4200;

/**
 * Static star field drawn on a canvas. It is redrawn only when its size changes, with a seeded
 * random so the sky stays the same between renders.
 */
export function StarField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) {
      return;
    }

    const draw = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);

      let seed = 7;
      const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      const count = Math.round((width * height) / STAR_DENSITY);

      for (let index = 0; index < count; index++) {
        const x = random() * width;
        const y = random() * height;
        const radius = random() ** 3 * 1.5 + 0.25;
        const alpha = 0.25 + random() * 0.7;
        const tint = TINTS[index % TINTS.length];
        context.fillStyle = `rgba(${tint},${alpha})`;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();

        // The brightest stars get a soft cross glint, like the nebula reference.
        if (radius > 1.35) {
          context.strokeStyle = `rgba(${tint},${alpha * 0.5})`;
          context.lineWidth = 0.6;
          context.beginPath();
          context.moveTo(x - radius * 4, y);
          context.lineTo(x + radius * 4, y);
          context.moveTo(x, y - radius * 4);
          context.lineTo(x, y + radius * 4);
          context.stroke();
        }
      }
    };

    draw();
    if (typeof ResizeObserver === 'undefined') {
      return;
    }
    let lastWidth = canvas.clientWidth;
    let lastHeight = canvas.clientHeight;
    const observer = new ResizeObserver(() => {
      if (canvas.clientWidth === lastWidth && canvas.clientHeight === lastHeight) {
        return;
      }
      lastWidth = canvas.clientWidth;
      lastHeight = canvas.clientHeight;
      draw();
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
