import { SECTION_IDS } from '../../data/site';
import { useLanguage } from '../../hooks/useLanguage';
import { Logo } from '../brand/Logo';
import styles from './Footer.module.css';

const YEAR = new Date().getFullYear();

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <a href={`#${SECTION_IDS.home}`} className={styles.brand} aria-label={t.header.homeLabel}>
          <Logo className={styles.logo} loading="lazy" />
        </a>
        <p className={styles.legal}>
          © {YEAR} Needy Friends. {t.footer.tagline}{' '}
          <a href="/third-party-licenses.txt" className={styles.licenses}>
            {t.footer.licenses}
          </a>
        </p>
      </div>
    </footer>
  );
}
