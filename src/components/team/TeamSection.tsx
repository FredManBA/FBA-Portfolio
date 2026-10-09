import { SECTION_IDS } from '../../data/site';
import { TEAM } from '../../data/team';
import { useLanguage } from '../../hooks/useLanguage';
import { Planet } from '../cosmos/Planet';
import { Reveal } from '../ui/Reveal';
import styles from './TeamSection.module.css';

/** The studio's three members as a small constellation, each one drawn as a planet. */
export function TeamSection() {
  const { t, language } = useLanguage();

  return (
    <section id={SECTION_IDS.team} className={styles.section} aria-labelledby="team-title">
      <div className="container">
        <div className={styles.head}>
          <Reveal>
            <h2 id="team-title" className={styles.title}>
              {t.team.title}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className={styles.intro}>{t.team.intro}</p>
          </Reveal>
        </div>

        <div className={styles.crew}>
          <svg
            className={styles.constellation}
            viewBox="0 0 300 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M50 30 Q 100 6 150 30 T 250 30" vectorEffect="non-scaling-stroke" />
          </svg>
          <ul role="list" className={styles.list}>
            {TEAM.map((member) => (
              <li key={member.planet} className={styles.member}>
                <Planet kind={member.planet} size="var(--member-size)" />
                <h3 className={styles.name}>{member.name}</h3>
                <p className={styles.role}>{member.role[language]}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
