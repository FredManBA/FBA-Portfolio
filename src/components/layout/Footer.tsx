import { SiGithub } from 'react-icons/si';
import { CONTACT } from '../../data/contact';
import { useLanguage } from '../../hooks/useLanguage';
import { Wordmark } from '../brand/Wordmark';
import styles from './Footer.module.css';

const YEAR = new Date().getFullYear();

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Wordmark className={styles.wordmark} />
          <p>© {YEAR} Fredman Bolívar Alfaro</p>
        </div>
        <a
          href={CONTACT.portfolioRepository}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.source}
        >
          <SiGithub size={16} aria-hidden="true" />
          {t.footer.source} <span className="sr-only">{t.projects.newTab}</span>
        </a>
      </div>
    </footer>
  );
}
