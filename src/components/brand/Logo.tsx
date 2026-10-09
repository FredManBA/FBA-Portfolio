import logoUrl from '../../assets/brand/needyfriends-logo.webp';

/** Intrinsic size of the provisional logo, cut out from the original artwork. */
export const LOGO_WIDTH = 1232;
export const LOGO_HEIGHT = 768;

interface LogoProps {
  /** Empty when a parent element already names the brand (e.g. a labelled link). */
  alt?: string;
  className?: string;
  loading?: 'eager' | 'lazy';
}

/** Needy Friends logo. Provisional artwork until the final logo exists. */
export function Logo({ alt = '', className, loading = 'eager' }: LogoProps) {
  return (
    <img
      src={logoUrl}
      alt={alt}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      loading={loading}
      decoding="async"
      className={className}
    />
  );
}
