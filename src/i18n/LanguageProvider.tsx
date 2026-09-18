import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_LANGUAGE, translations } from '../data/translations';
import type { Language } from '../types';
import { readStorage, writeStorage } from '../utils/storage';
import { isLanguage, LANGUAGE_STORAGE_KEY, LanguageContext } from './context';

function getInitialLanguage(): Language {
  const stored = readStorage(LANGUAGE_STORAGE_KEY);
  return isLanguage(stored) ? stored : DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    writeStorage(LANGUAGE_STORAGE_KEY, next);
  }, []);

  useEffect(() => {
    const { meta } = translations[language];
    document.documentElement.lang = language;
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  }, [language]);

  const value = useMemo(
    () => ({ language, setLanguage, t: translations[language] }),
    [language, setLanguage],
  );

  return <LanguageContext value={value}>{children}</LanguageContext>;
}
