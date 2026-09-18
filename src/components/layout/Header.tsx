import { AnimatePresence, m } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { NAV_ITEMS, SECTION_IDS } from '../../data/site';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useLanguage } from '../../hooks/useLanguage';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useScrolled } from '../../hooks/useScrolled';
import { Wordmark } from '../brand/Wordmark';
import styles from './Header.module.css';
import { LanguageSwitch } from './LanguageSwitch';

const NAV_SECTION_IDS = NAV_ITEMS.map((item) => SECTION_IDS[item]);
const MOBILE_MENU_ID = 'mobile-menu';

export function Header() {
  const { t } = useLanguage();
  const scrolled = useScrolled(12);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const activeSection = useActiveSection(NAV_SECTION_IDS);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuVisible = menuOpen && !isDesktop;

  useEffect(() => {
    if (!menuVisible) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [menuVisible]);

  const renderLinks = (linkClassName: string | undefined) =>
    NAV_ITEMS.map((item) => {
      const id = SECTION_IDS[item];
      const active = activeSection === id;
      return (
        <li key={item}>
          <a
            href={`#${id}`}
            className={linkClassName}
            data-active={active}
            aria-current={active ? 'true' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {t.nav[item]}
          </a>
        </li>
      );
    });

  return (
    <header ref={headerRef} className={styles.header} data-elevated={scrolled || menuVisible}>
      <div className={`container ${styles.inner}`}>
        <a href={`#${SECTION_IDS.home}`} className={styles.brand} aria-label={t.header.homeLabel}>
          <Wordmark />
        </a>

        <div className={styles.actions}>
          <nav aria-label={t.header.navLabel} className={styles.desktopNav}>
            <ul role="list" className={styles.navList}>
              {renderLinks(styles.navLink)}
            </ul>
          </nav>
          <span className={styles.divider} aria-hidden="true" />
          <LanguageSwitch />
          <button
            ref={menuButtonRef}
            type="button"
            className={styles.menuButton}
            aria-expanded={menuVisible}
            aria-controls={menuVisible ? MOBILE_MENU_ID : undefined}
            aria-label={menuVisible ? t.header.closeMenu : t.header.openMenu}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuVisible ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuVisible && (
          <m.div
            id={MOBILE_MENU_ID}
            className={styles.mobilePanel}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav aria-label={t.header.navLabel}>
              <ul role="list" className={styles.mobileList}>
                {renderLinks(styles.mobileLink)}
              </ul>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
