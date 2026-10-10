import { SECTION_IDS } from '../../data/site';
import { COUPLE, TEAM } from '../../data/team';
import { useLanguage } from '../../hooks/useLanguage';
import { Planet } from '../cosmos/Planet';
import { Reveal } from '../ui/Reveal';
import styles from './TeamSection.module.css';

/** Where the constellation's columns sit, in the units of its viewBox (300 × 100). */
const columnX = (index: number) => 37.5 + index * 75;

// The couple sit side by side; the trail runs along the arc of the constellation between them,
// which bows up after even columns and down after odd ones.
const BOND_FROM = TEAM.findIndex((member) => member.name === COUPLE[0]);
const BOND_PATH = `M${columnX(BOND_FROM)} 30 Q ${columnX(BOND_FROM) + 37.5} ${
  BOND_FROM % 2 ? 54 : 6
} ${columnX(BOND_FROM + 1)} 30`;

/**
 * The studio's four members as a small constellation, each one drawn as a planet. A glowing
 * trail, pink to green, joins the couple, with a spark that travels between them.
 */
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
            <defs>
              <linearGradient
                id="team-bond"
                gradientUnits="userSpaceOnUse"
                x1={columnX(BOND_FROM)}
                y1="0"
                x2={columnX(BOND_FROM + 1)}
                y2="0"
              >
                <stop offset="0" stopColor="#ff6fae" />
                <stop offset="1" stopColor="#5ff0a0" />
              </linearGradient>
            </defs>
            <path
              d="M37.5 30 Q 75 6 112.5 30 T 187.5 30 T 262.5 30"
              vectorEffect="non-scaling-stroke"
            />
            <path className={styles.bondGlow} d={BOND_PATH} vectorEffect="non-scaling-stroke" />
            <path className={styles.bond} d={BOND_PATH} vectorEffect="non-scaling-stroke" />
            <path
              className={styles.bondSpark}
              d={BOND_PATH}
              pathLength={100}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <ul role="list" className={styles.list}>
            {TEAM.map((member, index) => (
              <li
                key={member.name}
                className={styles.member}
                data-bond={index === BOND_FROM ? '' : undefined}
              >
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
