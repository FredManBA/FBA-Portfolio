import { SECTION_IDS } from '../../data/site';
import { useLanguage } from '../../hooks/useLanguage';
import { Reveal } from '../ui/Reveal';
import styles from './AboutSection.module.css';

export function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id={SECTION_IDS.about} className={styles.section} aria-labelledby="about-title">
      <div className={`container ${styles.layout}`}>
        <Reveal>
          <h2 id="about-title" className={styles.title}>
            {t.about.title}
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className={styles.text}>{t.about.text}</p>
        </Reveal>
      </div>
    </section>
  );
}
