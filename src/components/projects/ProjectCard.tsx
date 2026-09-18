import { m, type Variants } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useRef } from 'react';
import { getTechnology } from '../../data/technologies';
import { useLanguage } from '../../hooks/useLanguage';
import { usePointerTilt } from '../../hooks/usePointerTilt';
import type { Project } from '../../types';
import { EASE_OUT } from '../motion/easing';
import { TechIcon } from '../technologies/TechIcon';
import styles from './ProjectCard.module.css';
import { ProjectImage } from './ProjectImage';
import { ProjectLinks } from './ProjectLinks';

const MAX_CARD_TECHNOLOGIES = 4;
const CARD_IMAGE_SIZES = '(min-width: 1200px) 384px, (min-width: 768px) 50vw, 100vw';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.25, ease: EASE_OUT } },
};

export function ProjectCard({ project }: { project: Project }) {
  const { t, language } = useLanguage();
  const cardRef = useRef<HTMLElement>(null);
  usePointerTilt(cardRef, { maxTilt: 4 });

  const titleId = `project-${project.id}-title`;
  const isPrivate = project.links.repository.visibility === 'private';

  return (
    <m.li layout variants={cardVariants} exit="exit" className={styles.item}>
      <article ref={cardRef} className={styles.card} aria-labelledby={titleId}>
        <div className={styles.mediaFrame}>
          <div className={styles.media}>
            <ProjectImage
              file={project.screenshot.file}
              alt={project.screenshot.alt[language]}
              sizes={CARD_IMAGE_SIZES}
              className={styles.image}
              style={{ objectPosition: project.screenshot.focus }}
            />
          </div>
          <span className={styles.corners} aria-hidden="true" />
        </div>

        <div className={styles.body}>
          <div className={styles.meta}>
            <span className={styles.category}>{t.projects.categories[project.category]}</span>
            {project.status === 'upcoming' && (
              <span className={styles.badge}>{t.projects.upcoming}</span>
            )}
            {isPrivate && (
              <span className={styles.private}>
                <Lock size={13} aria-hidden="true" />
                {t.projects.privateCode}
              </span>
            )}
          </div>

          <h3 id={titleId} className={styles.title}>
            {project.name}
          </h3>
          <p className={styles.tagline}>{project.tagline[language]}</p>
          <p className={styles.description}>{project.description[language]}</p>

          <ul role="list" className={styles.techs} aria-label={t.projects.technologies}>
            {project.cardTechnologies.slice(0, MAX_CARD_TECHNOLOGIES).map((id) => (
              <li key={id} className={styles.tech}>
                <TechIcon id={id} size={14} />
                {getTechnology(id).name}
              </li>
            ))}
          </ul>

          <div className={styles.footer}>
            <div className={styles.linksSlot}>
              <ProjectLinks project={project} />
            </div>
          </div>
        </div>

        <span className={styles.glare} aria-hidden="true" />
      </article>
    </m.li>
  );
}
