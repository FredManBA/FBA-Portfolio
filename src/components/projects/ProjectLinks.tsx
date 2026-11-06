import { ArrowUpRight } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import { useLanguage } from '../../hooks/useLanguage';
import type { Project } from '../../types';
import styles from './ProjectLinks.module.css';

/** External links of a project card. Labels collapse to icons on narrow cards. */
export function ProjectLinks({ project }: { project: Project }) {
  const { t } = useLanguage();
  const { demo, github } = project.links;
  const isGame = project.category === 'games';
  const demoLabel = isGame ? t.projects.play : t.projects.demo;
  const accessibleName = isGame
    ? t.projects.playLabel(project.name)
    : t.projects.demoLabel(project.name);

  if (!demo && !github) {
    return null;
  }

  return (
    <div className={styles.links}>
      {demo && (
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
      )}
      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
          title={t.projects.github}
          aria-label={`${t.projects.githubLabel(project.name)} ${t.projects.newTab}`}
        >
          <SiGithub size={15} aria-hidden="true" />
          <span className={styles.label}>{t.projects.github}</span>
        </a>
      )}
    </div>
  );
}
