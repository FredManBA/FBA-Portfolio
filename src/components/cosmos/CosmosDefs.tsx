/**
 * Shared SVG filters for the planets and fluid surfaces (rendered once, referenced by CSS
 * through `filter: url(#id)`). Turbulence-driven displacement turns plain stripes into the
 * marbled, fluid look of the brand; the filtered elements only ever slide (the planet spin), so
 * the filter renders once.
 * CSS modules reference these ids directly (e.g. `filter: url("#nf-marble-sm")`).
 */
const COSMOS_FILTERS = {
  marbleSmall: 'nf-marble-sm',
  marbleLarge: 'nf-marble-lg',
  marbleWide: 'nf-marble-xl',
  bandsSmall: 'nf-bands-sm',
  bandsLarge: 'nf-bands-lg',
} as const;

export function CosmosDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
      <filter id={COSMOS_FILTERS.marbleSmall} x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves={2} seed={4} result="n" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="n"
          scale={16}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
      <filter id={COSMOS_FILTERS.marbleLarge} x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.011 0.016"
          numOctaves={3}
          seed={4}
          result="n"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="n"
          scale={90}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
      <filter id={COSMOS_FILTERS.marbleWide} x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.004 0.007"
          numOctaves={3}
          seed={11}
          result="n"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="n"
          scale={160}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
      <filter id={COSMOS_FILTERS.bandsSmall} x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.02 0.18"
          numOctaves={2}
          seed={2}
          result="n"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="n"
          scale={6}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
      <filter id={COSMOS_FILTERS.bandsLarge} x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.004 0.045"
          numOctaves={3}
          seed={2}
          result="n"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="n"
          scale={34}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}
