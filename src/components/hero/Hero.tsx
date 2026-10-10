import { useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useRef } from 'react';
import { SECTION_IDS } from '../../data/site';
import { useHeroParallax } from '../../hooks/useHeroParallax';
import { useLanguage } from '../../hooks/useLanguage';
import { StarField } from '../cosmos/StarField';
import button from '../ui/button.module.css';
import styles from './Hero.module.css';
import { OrbitStage } from './OrbitStage';

export function Hero() {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  useHeroParallax(heroRef);

  const showCopy = () =>
    copyRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });

  return (
    <section
      id={SECTION_IDS.home}
      ref={heroRef}
      className={styles.hero}
      aria-labelledby="hero-title"
    >
      <div className={styles.sky} aria-hidden="true">
        <span className={`${styles.blob} ${styles.blobViolet}`} />
        <span className={`${styles.blob} ${styles.blobEmber}`} />
        <StarField className={styles.stars} />
      </div>
      <div className={styles.grain} aria-hidden="true" />

      <div className="container">
        {/* On desktop the logo and its orbits fill the first screen; the copy starts below it. */}
        <div className={styles.stageArea}>
          <OrbitStage />
          <button
            type="button"
            className={styles.scrollCue}
            onClick={showCopy}
            aria-label={t.hero.scrollCue}
          >
            <ChevronDown size={22} aria-hidden="true" />
          </button>
        </div>

        <div ref={copyRef} className={styles.copy}>
          <p className={styles.statement}>{t.hero.statement}</p>
          <div className={styles.side}>
            <p className={styles.intro}>{t.hero.intro}</p>
            <div className={styles.actions}>
              <a href={`#${SECTION_IDS.worlds}`} className={`${button.button} ${button.primary}`}>
                <span className={button.dot} aria-hidden="true" />
                {t.hero.primaryAction}
              </a>
              <a href={`#${SECTION_IDS.team}`} className={`${button.button} ${button.secondary}`}>
                {t.hero.secondaryAction}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* The hero ends on the curve of a planet; the next section lives on its surface. */}
      <div className={styles.horizon} aria-hidden="true" />
    </section>
  );
}
