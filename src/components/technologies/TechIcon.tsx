import type { CSSProperties } from 'react';
import { getTechnology, type TechnologyId } from '../../data/technologies';
import styles from './TechIcon.module.css';

interface TechIconProps {
  id: TechnologyId;
  size?: number;
  className?: string;
}

/** Official logo when available, neutral monogram otherwise. Always decorative. */
export function TechIcon({ id, size = 16, className }: TechIconProps) {
  const technology = getTechnology(id);

  if (technology.icon) {
    const Icon = technology.icon;
    return <Icon size={size} className={className} aria-hidden="true" />;
  }

  return (
    <span
      className={className ? `${styles.monogram} ${className}` : styles.monogram}
      style={{ '--icon-size': `${size}px` } as CSSProperties}
      data-length={technology.monogram.length}
      aria-hidden="true"
    >
      {technology.monogram}
    </span>
  );
}
