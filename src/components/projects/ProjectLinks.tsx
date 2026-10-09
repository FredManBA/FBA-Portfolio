import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import type { Project } from '../../types';
import styles from './ProjectLinks.module.css';

/** External links of a project card. Labels collapse to icons on narrow cards. */
export function ProjectLinks({ project }: { project: Project }) {
  const { t } = useLanguage();
  const { demo } = project.links;
  const isGame = project.category === 'games';
  const demoLabel = isGame ? t.projects.play : t.projects.demo;
  const accessibleName = isGame
    ? t.projects.playLabel(project.name)
    : t.projects.demoLabel(project.name);

  if (!demo) {
    return null;
  }

  return (
    <div className={styles.links}>
      <a
        href={demo}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
        title={demoLabel}
        aria-label={`${accessibleName} ${t.projects.newTab}`}
      >
        <ArrowUpRight size={16} aria-hidden="true" />
        <span className={styles.label}>{demoLabel}</span>
      </a>
    </div>
  );
}
