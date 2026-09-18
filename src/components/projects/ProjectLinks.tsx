import { ArrowUpRight } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import { useLanguage } from '../../hooks/useLanguage';
import type { Project } from '../../types';
import styles from './ProjectLinks.module.css';

/** External links of a project card. Labels collapse to icons on narrow cards. */
export function ProjectLinks({ project }: { project: Project }) {
  const { t } = useLanguage();
  const { demo, repository } = project.links;

  if (!demo && repository.visibility === 'private') {
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
          title={t.projects.demo}
          aria-label={`${t.projects.demoLabel(project.name)} ${t.projects.newTab}`}
        >
          <ArrowUpRight size={16} aria-hidden="true" />
          <span className={styles.label}>{t.projects.demo}</span>
        </a>
      )}
      {repository.visibility === 'public' && (
        <a
          href={repository.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
          title={t.projects.repository}
          aria-label={`${t.projects.repositoryLabel(project.name)} ${t.projects.newTab}`}
        >
          <SiGithub size={15} aria-hidden="true" />
          <span className={styles.label}>{t.projects.repository}</span>
        </a>
      )}
    </div>
  );
}
