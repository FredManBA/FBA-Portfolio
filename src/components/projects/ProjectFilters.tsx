import { m } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import type { ProjectFilterId, ProjectFilterOption } from '../../utils/projects';
import styles from './ProjectFilters.module.css';

interface ProjectFiltersProps {
  filters: readonly ProjectFilterOption[];
  active: ProjectFilterId;
  onChange: (filter: ProjectFilterId) => void;
}

export function ProjectFilters({ filters, active, onChange }: ProjectFiltersProps) {
  const { t } = useLanguage();

  return (
    <div role="group" aria-label={t.projects.filterLabel} className={styles.filters}>
      {filters.map(({ id, count }) => {
        const selected = id === active;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={selected}
            className={styles.filter}
            onClick={() => onChange(id)}
          >
            {selected && (
              <m.span
                layoutId="project-filter-indicator"
                className={styles.indicator}
                transition={{ type: 'spring', stiffness: 480, damping: 38 }}
              />
            )}
            <span className={styles.label}>{t.projects.filters[id]}</span>
            <span className={styles.count} aria-hidden="true">
              {count}
            </span>
            <span className="sr-only">, {t.projects.projectCount(count)}</span>
          </button>
        );
      })}
    </div>
  );
}
