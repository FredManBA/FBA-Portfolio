import { AnimatePresence, m, type Variants } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PROJECTS } from '../../data/projects';
import { AREA_ORDER, SECTION_IDS } from '../../data/site';
import { useLanguage } from '../../hooks/useLanguage';
import type { Project, ProjectCategory } from '../../types';
import {
  filterProjects,
  getAvailableFilters,
  sortProjects,
  type ProjectFilterId,
} from '../../utils/projects';
import { Planet } from '../cosmos/Planet';
import { EASE_OUT } from '../motion/easing';
import { Reveal } from '../ui/Reveal';
import { ProjectCard } from './ProjectCard';
import { ProjectDialog } from './ProjectDialog';
import { ProjectFilters } from './ProjectFilters';
import styles from './WorldsSection.module.css';

const SORTED_PROJECTS = sortProjects(PROJECTS);
const FILTERS = getAvailableFilters(SORTED_PROJECTS);
const AREAS = AREA_ORDER.filter((area) => filterProjects(SORTED_PROJECTS, area).length > 0);
const AREA_BY_ID = new Map<string, ProjectCategory>(AREAS.map((area) => [SECTION_IDS[area], area]));

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const worldVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: EASE_OUT } },
};

/**
 * "Three worlds, one studio": each area is its own planet with its projects underneath.
 * The filter narrows the page to one area; following a link to a hidden area shows all again.
 */
export function WorldsSection() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<ProjectFilterId>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const selectedProject = SORTED_PROJECTS.find((project) => project.id === selectedId);
  const visibleAreas = filter === 'all' ? AREAS : AREAS.filter((area) => area === filter);

  const openProject = useCallback((project: Project, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setSelectedId(project.id);
  }, []);
  const closeProject = useCallback(() => setSelectedId(null), []);

  // Navigation (header, hero planets) targets an area anchor; make sure it is on the page.
  useEffect(() => {
    const handleHashChange = () => {
      const area = AREA_BY_ID.get(window.location.hash.slice(1));
      if (!area || document.getElementById(SECTION_IDS[area])) {
        return;
      }
      setFilter('all');
      requestAnimationFrame(() => document.getElementById(SECTION_IDS[area])?.scrollIntoView());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <section id={SECTION_IDS.worlds} className={styles.section} aria-labelledby="worlds-title">
      <div className="container">
        <div className={styles.intro}>
          <Reveal>
            <h2 id="worlds-title" className={styles.title}>
              {t.worlds.title}
            </h2>
          </Reveal>
          <Reveal delay={0.08} className={styles.introSide}>
            <p className={styles.lede}>{t.worlds.intro}</p>
            <ProjectFilters filters={FILTERS} active={filter} onChange={setFilter} />
          </Reveal>
        </div>

        <AnimatePresence mode="popLayout" initial={false}>
          {visibleAreas.map((area) => {
            const projects = filterProjects(SORTED_PROJECTS, area);
            const titleId = `${SECTION_IDS[area]}-title`;
            return (
              <m.article
                key={area}
                id={SECTION_IDS[area]}
                className={styles.world}
                data-area={area}
                data-count={projects.length}
                aria-labelledby={titleId}
                layout="position"
                variants={worldVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className={styles.visual}>
                  <Planet kind={area} size="min(78%, 300px)" large />
                </div>
                <div className={styles.head}>
                  <h3 id={titleId} className={styles.areaTitle}>
                    {t.worlds.areas[area].title}
                    <span className={styles.dot} aria-hidden="true" />
                  </h3>
                  <p className={styles.areaBody}>{t.worlds.areas[area].body}</p>
                </div>

                <m.ul
                  role="list"
                  className={styles.grid}
                  variants={gridVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                >
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} onOpen={openProject} />
                  ))}
                </m.ul>
              </m.article>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectDialog
            key={selectedProject.id}
            project={selectedProject}
            onClose={closeProject}
            returnFocusRef={triggerRef}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
