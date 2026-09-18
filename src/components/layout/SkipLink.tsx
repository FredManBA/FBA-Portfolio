import { useLanguage } from '../../hooks/useLanguage';

export const MAIN_CONTENT_ID = 'contenido';

export function SkipLink() {
  const { t } = useLanguage();

  return (
    <a className="skip-link" href={`#${MAIN_CONTENT_ID}`}>
      {t.skipToContent}
    </a>
  );
}
