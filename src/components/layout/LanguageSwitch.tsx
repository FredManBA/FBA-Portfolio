import { m } from 'framer-motion';
import { LANGUAGE_NAMES, LANGUAGES } from '../../data/translations';
import { useLanguage } from '../../hooks/useLanguage';
import styles from './LanguageSwitch.module.css';

export function LanguageSwitch() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div role="group" aria-label={t.header.languageLabel} className={styles.switch}>
      {LANGUAGES.map((option) => {
        const selected = option === language;
        return (
          <button
            key={option}
            type="button"
            lang={option}
            aria-pressed={selected}
            className={styles.option}
            onClick={() => setLanguage(option)}
          >
            {selected && (
              <m.span
                layoutId="language-indicator"
                className={styles.indicator}
                transition={{ type: 'spring', stiffness: 520, damping: 40 }}
              />
            )}
            <span aria-hidden="true" className={styles.code}>
              {option.toUpperCase()}
            </span>
            <span className="sr-only">{LANGUAGE_NAMES[option]}</span>
          </button>
        );
      })}
    </div>
  );
}
