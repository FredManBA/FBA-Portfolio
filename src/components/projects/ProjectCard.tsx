import { m, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowRight, Lock } from 'lucide-react';
import { useRef, type MouseEvent } from 'react';
import { getTechnology } from '../../data/technologies';
import { useLanguage } from '../../hooks/useLanguage';
import { clearPointerTilt, usePointerTilt } from '../../hooks/usePointerTilt';
import type { Project } from '../../types';
import { preloadScreenshot } from '../../utils/screenshots';
import { EASE_OUT, MEDIA_TRANSITION } from '../motion/easing';
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

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project, trigger: HTMLElement) => void;
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const { t, language } = useLanguage();
  const cardRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  usePointerTilt(cardRef, { maxTilt: 4 });

  const titleId = `project-${project.id}-title`;
  const isPrivate = project.links.repository.visibility === 'private';
  const preload = () => preloadScreenshot(project.screenshot.file);

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    // Measure the untilted card so the shared transition starts from its resting position.
    if (cardRef.current) {
      clearPointerTilt(cardRef.current);
    }
    onOpen(project, event.currentTarget);
  };

  return (
    <m.li layout variants={cardVariants} exit="exit" className={styles.item}>
      <article
        ref={cardRef}
        className={styles.card}
        aria-labelledby={titleId}
        onPointerEnter={preload}
        onFocus={preload}
      >
        <div className={styles.mediaFrame}>
          <m.div
            layoutId={reduceMotion ? undefined : `project-media-${project.id}`}
            className={styles.media}
            style={{ borderRadius: 14 }}
            transition={MEDIA_TRANSITION}
          >
            <ProjectImage
              file={project.screenshot.file}
              alt={project.screenshot.alt[language]}
              sizes={CARD_IMAGE_SIZES}
              className={styles.image}
              style={{ objectPosition: project.screenshot.focus }}
            />
          </m.div>
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
            <button type="button" className={styles.open} onClick={handleOpen}>
              {t.projects.viewProject} <span className="sr-only">{project.name}</span>
              <ArrowRight size={17} aria-hidden="true" />
            </button>
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
