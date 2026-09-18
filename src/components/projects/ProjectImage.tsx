import type { CSSProperties } from 'react';
import { getScreenshotMeta, screenshotSrcSet, screenshotUrl } from '../../utils/screenshots';

interface ProjectImageProps {
  file: string;
  alt: string;
  sizes: string;
  className?: string;
  style?: CSSProperties;
  loading?: 'lazy' | 'eager';
}

/** Real project screenshot served as AVIF/WebP with responsive widths. */
export function ProjectImage({
  file,
  alt,
  sizes,
  className,
  style,
  loading = 'lazy',
}: ProjectImageProps) {
  const { width, height } = getScreenshotMeta(file);

  return (
    <picture>
      <source type="image/avif" srcSet={screenshotSrcSet(file, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={screenshotSrcSet(file, 'webp')} sizes={sizes} />
      <img
        src={screenshotUrl(file, width, 'webp')}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={loading}
        decoding="async"
        className={className}
        style={style}
      />
    </picture>
  );
}
