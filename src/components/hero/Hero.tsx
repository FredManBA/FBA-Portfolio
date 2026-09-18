import { ArrowRight } from 'lucide-react';
import { useRef, type CSSProperties } from 'react';
import { SECTION_IDS } from '../../data/site';
import { useLanguage } from '../../hooks/useLanguage';
import { usePointerTilt } from '../../hooks/usePointerTilt';
import button from '../ui/button.module.css';
import { CodeWindow } from './CodeWindow';
import styles from './Hero.module.css';

const revealOrder = (order: number) => ({ '--order': order }) as CSSProperties;

export function Hero() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  usePointerTilt(visualRef, { trackRef: sectionRef, maxTilt: 3 });

  return (
    <section
      id={SECTION_IDS.home}
      ref={sectionRef}
      className={styles.hero}
      aria-labelledby="hero-title"
    >
      <div className={styles.backdrop} aria-hidden="true">
        <span className={styles.grid} />
        <span className={styles.glow} />
      </div>

      <div className={`container ${styles.layout}`}>
        <div className={styles.copy}>
          <h1 id="hero-title" className={styles.title}>
            <span className={`${styles.name} ${styles.reveal}`} style={revealOrder(0)}>
              {t.hero.name}
            </span>
            <span className="sr-only">, </span>
            <span className={`${styles.role} ${styles.reveal}`} style={revealOrder(1)}>
              {t.hero.role}
            </span>
          </h1>

          <p className={`${styles.quote} ${styles.reveal}`} style={revealOrder(2)}>
            {t.hero.quote.lead}
            <span className={styles.accent}>{t.hero.quote.accent}</span>
            {t.hero.quote.tail}
          </p>

          <p className={`${styles.intro} ${styles.reveal}`} style={revealOrder(3)}>
            {t.hero.intro}
          </p>

          <div className={`${styles.actions} ${styles.reveal}`} style={revealOrder(4)}>
            <a href={`#${SECTION_IDS.projects}`} className={`${button.button} ${button.primary}`}>
              {t.hero.primaryAction}
              <ArrowRight size={18} className={button.arrow} aria-hidden="true" />
            </a>
            <a href={`#${SECTION_IDS.contact}`} className={`${button.button} ${button.secondary}`}>
              {t.hero.secondaryAction}
            </a>
          </div>
        </div>

        <div ref={visualRef} className={styles.visual} aria-hidden="true">
          <span className={styles.visualGlow} />
          <CodeWindow />
        </div>
      </div>
    </section>
  );
}
