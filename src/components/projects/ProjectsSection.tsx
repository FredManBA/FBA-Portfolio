import { AnimatePresence, m, type Variants } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';
import { PROJECTS } from '../../data/projects';
import { SECTION_IDS } from '../../data/site';
import { useLanguage } from '../../hooks/useLanguage';
import type { Project } from '../../types';
import {
  filterProjects,
  getAvailableFilters,
  sortProjects,
  type ProjectFilterId,
} from '../../utils/projects';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { ProjectCard } from './ProjectCard';
import { ProjectDialog } from './ProjectDialog';
import { ProjectFilters } from './ProjectFilters';
import styles from './ProjectsSection.module.css';

const SORTED_PROJECTS = sortProjects(PROJECTS);
const FILTERS = getAvailableFilters(SORTED_PROJECTS);

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export function ProjectsSection() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<ProjectFilterId>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const visibleProjects = filterProjects(SORTED_PROJECTS, filter);
  const selectedProject = SORTED_PROJECTS.find((project) => project.id === selectedId);

  const openProject = useCallback((project: Project, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setSelectedId(project.id);
  }, []);
  const closeProject = useCallback(() => setSelectedId(null), []);

  return (
    <section id={SECTION_IDS.projects} className={styles.section} aria-labelledby="projects-title">
      <div className="container">
        <div className={styles.header}>
          <SectionHeading id="projects-title" title={t.projects.title} intro={t.projects.intro} />
          <Reveal delay={0.1}>
            <ProjectFilters filters={FILTERS} active={filter} onChange={setFilter} />
          </Reveal>
        </div>

        <m.ul
          role="list"
          className={styles.grid}
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onOpen={openProject} />
            ))}
          </AnimatePresence>
        </m.ul>
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
