import { m, useIsPresent, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Check, Lock, X } from 'lucide-react';
import { useEffect, useRef, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { SiGithub } from 'react-icons/si';
import { getTechnology } from '../../data/technologies';
import { useLanguage } from '../../hooks/useLanguage';
import { useModalBehavior } from '../../hooks/useModalBehavior';
import type { Project } from '../../types';
import { EASE_OUT, MEDIA_TRANSITION } from '../motion/easing';
import { TechIcon } from '../technologies/TechIcon';
import button from '../ui/button.module.css';
import styles from './ProjectDialog.module.css';
import { ProjectImage } from './ProjectImage';

const DIALOG_IMAGE_SIZES = '(min-width: 1040px) 976px, calc(100vw - 40px)';

interface ProjectDialogProps {
  project: Project;
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
}

export function ProjectDialog({ project, onClose, returnFocusRef }: ProjectDialogProps) {
  const { t, language } = useLanguage();
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isPresent = useIsPresent();
  const reduceMotion = useReducedMotion();
  useModalBehavior(dialogRef, { active: isPresent, onClose, returnFocusRef });

  // Clicking the dimmed area around the panel closes it (Escape and the close button do too).
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }
    const handleClick = (event: MouseEvent) => {
      if (event.target === scroller) {
        onClose();
      }
    };
    scroller.addEventListener('click', handleClick);
    return () => scroller.removeEventListener('click', handleClick);
  }, [onClose]);

  const idPrefix = `project-dialog-${project.id}`;
  const { demo, repository } = project.links;

  return createPortal(
    <div className={styles.root}>
      <m.div
        className={styles.backdrop}
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.05 } }}
        transition={{ duration: 0.3 }}
      />
      <m.div ref={scrollerRef} className={styles.scroller} layoutScroll>
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${idPrefix}-title`}
          aria-describedby={`${idPrefix}-description`}
          tabIndex={-1}
          className={styles.panel}
        >
          <m.div
            className={styles.surface}
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
          />

          <m.div
            // With reduced motion the screenshot does not travel from the card; the dialog fades.
            layoutId={reduceMotion ? undefined : `project-media-${project.id}`}
            layoutCrossfade={false}
            className={styles.media}
            style={{ borderRadius: 16 }}
            transition={MEDIA_TRANSITION}
          >
            <ProjectImage
              file={project.screenshot.file}
              alt={project.screenshot.alt[language]}
              sizes={DIALOG_IMAGE_SIZES}
              loading="eager"
              className={styles.image}
              style={{ objectPosition: project.screenshot.focus }}
            />
          </m.div>

          <m.button
            type="button"
            className={styles.close}
            aria-label={t.dialog.close}
            onClick={onClose}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.2, duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
          >
            <X size={20} aria-hidden="true" />
          </m.button>

          <m.div
            className={styles.content}
            initial={{ opacity: 0, y: 18 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.14, duration: 0.5, ease: EASE_OUT },
            }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
          >
            <div className={styles.summary}>
              <p className={styles.meta}>
                <span className={styles.category}>{t.projects.categories[project.category]}</span>
                {project.status === 'upcoming' && (
                  <span className={styles.badge}>{t.projects.upcoming}</span>
                )}
              </p>
              <h2 id={`${idPrefix}-title`} className={styles.title}>
                {project.name}
              </h2>
              <p className={styles.tagline}>{project.tagline[language]}</p>
              <p id={`${idPrefix}-description`} className={styles.description}>
                {project.description[language]}
              </p>

              <div className={styles.actions}>
                {demo && (
                  <a
                    href={demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${button.button} ${button.primary}`}
                  >
                    {t.dialog.viewDemo} <span className="sr-only">{t.projects.newTab}</span>
                    <ArrowUpRight size={18} className={button.arrow} aria-hidden="true" />
                  </a>
                )}
                {repository.visibility === 'public' ? (
                  <a
                    href={repository.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${button.button} ${button.secondary}`}
                  >
                    <SiGithub size={17} aria-hidden="true" />
                    {t.dialog.viewCode} <span className="sr-only">{t.projects.newTab}</span>
                  </a>
                ) : (
                  <span className={styles.private}>
                    <Lock size={16} aria-hidden="true" />
                    {t.projects.privateCode}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.details}>
              <div>
                <h3 className={styles.detailTitle}>{t.dialog.features}</h3>
                <ul role="list" className={styles.features}>
                  {project.features[language].map((feature) => (
                    <li key={feature}>
                      <Check size={16} strokeWidth={2.4} aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className={styles.detailTitle}>{t.dialog.technologies}</h3>
                <ul role="list" className={styles.techs}>
                  {project.technologies.map((id) => (
                    <li key={id}>
                      <TechIcon id={id} size={16} />
                      {getTechnology(id).name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </m.div>
        </div>
      </m.div>
    </div>,
    document.body,
  );
}
