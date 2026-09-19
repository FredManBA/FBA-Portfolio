import { m, type Variants } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useRef, useState, type CSSProperties, type TransitionEvent } from 'react';
import { SECTION_IDS } from '../../data/site';
import { getTechnology, SHOWCASE_TECHNOLOGIES } from '../../data/technologies';
import { useLanguage } from '../../hooks/useLanguage';
import { REDUCED_MOTION_QUERY } from '../../hooks/useMediaQuery';
import { EASE_OUT } from '../motion/easing';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './TechnologiesSection.module.css';
import { TechIcon } from './TechIcon';

const MORE_ID = 'technologies-more';

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const tileVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

export function TechnologiesSection() {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // After collapsing, keep the toggle in view if the page ended up below it.
  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (!expanded && event.target === event.currentTarget) {
      const behavior = window.matchMedia(REDUCED_MOTION_QUERY).matches ? 'auto' : 'smooth';
      toggleRef.current?.scrollIntoView({ block: 'nearest', behavior });
    }
  };

  return (
    <section
      id={SECTION_IDS.technologies}
      className={styles.section}
      aria-labelledby="technologies-title"
    >
      <div className="container">
        <SectionHeading
          id="technologies-title"
          title={t.technologies.title}
          intro={t.technologies.intro}
        />

        <m.ul
          role="list"
          className={`${styles.grid} ${styles.featured}`}
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {SHOWCASE_TECHNOLOGIES.featured.map((id) => (
            <m.li key={id} className={styles.tile} variants={tileVariants}>
              <TechIcon id={id} size={22} className={styles.icon} />
              {getTechnology(id).name}
            </m.li>
          ))}
        </m.ul>

        <div
          id={MORE_ID}
          className={styles.more}
          data-expanded={expanded}
          aria-hidden={!expanded}
          inert={!expanded}
          onTransitionEnd={handleTransitionEnd}
        >
          <div className={styles.moreInner}>
            <ul role="list" className={styles.grid}>
              {SHOWCASE_TECHNOLOGIES.more.map((id, index) => (
                <li key={id} className={styles.tile} style={{ '--index': index } as CSSProperties}>
                  <TechIcon id={id} size={22} className={styles.icon} />
                  {getTechnology(id).name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.toggleRow}>
          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-expanded={expanded}
            aria-controls={MORE_ID}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? t.technologies.showLess : t.technologies.showAll}
            <ChevronDown size={18} className={styles.chevron} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
