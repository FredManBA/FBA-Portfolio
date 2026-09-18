import { createContext } from 'react';
import type { Translation } from '../data/translations';
import type { Language } from '../types';

export interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translation;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LANGUAGE_STORAGE_KEY = 'fba:language';

export function isLanguage(value: unknown): value is Language {
  return value === 'es' || value === 'en';
}
