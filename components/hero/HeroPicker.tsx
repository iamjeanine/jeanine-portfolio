import React from 'react';
import type { HeroVariant } from './heroVariant';
import { HERO_MONO } from './HeroChrome';

/**
 * Branch-only review chrome: a fixed strip of links for flipping between
 * the hero comps without editing the URL by hand. Remove before any merge
 * to main. Plain anchors on purpose: a variant change is a full reload,
 * which is exactly what the comps expect.
 */
const OPTIONS: { value: HeroVariant; label: string }[] = [
  { value: 'dusk', label: 'Dusk' },
  { value: 'unstill', label: 'Unstill' },
  { value: 'gels', label: 'Gels' },
  { value: 'signal', label: 'Signal' },
  { value: 'off', label: 'Prod' },
];

export const HeroPicker: React.FC<{ current: HeroVariant }> = ({ current }) => (
  <nav
    aria-label="Hero comps"
    className="fixed right-4 bottom-4 max-sm:bottom-auto max-sm:top-3 z-50 flex items-baseline gap-x-4 chapter-rail-invert"
    style={{
      fontFamily: HERO_MONO,
      fontSize: '0.6rem',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
    }}
  >
    {OPTIONS.map((o) => (
      <a
        key={o.value}
        href={`?hero=${o.value}`}
        className="hero-utility-link inline-flex min-h-8 items-center"
        style={{
          opacity: (current === 'plate' ? 'signal' : current) === o.value ? 1 : 0.55,
          textDecoration:
            (current === 'plate' ? 'signal' : current) === o.value ? 'underline' : 'none',
          textUnderlineOffset: '4px',
        }}
      >
        {o.label}
      </a>
    ))}
  </nav>
);
