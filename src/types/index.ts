export type Language = 'es' | 'en';

export type Localized<T = string> = Record<Language, T>;
