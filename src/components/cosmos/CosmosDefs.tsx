/**
 * Shared SVG filter for the fluid surfaces (rendered once, referenced by CSS through
 * `filter: url(#id)`). Turbulence-driven displacement turns plain stripes into the marbled,
 * fluid look of the brand. The planets are illustrations of their own and need no filter.
 * CSS modules reference the id directly (`filter: url("#nf-marble-xl")`).
 */
const COSMOS_FILTERS = {
  marbleWide: 'nf-marble-xl',
} as const;

export function CosmosDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
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
    </svg>
  );
}
