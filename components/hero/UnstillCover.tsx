import React from 'react';
import { GRAIN_URI } from '../chapter';
import { HeroChrome } from './HeroChrome';

/**
 * The Unstill Cover comp: print-dark umber ground (not screen black), the
 * Num and Tom special photograph duotoned into the site's warm palette,
 * breathing slowly at the right of the frame. Credited in a mono caption
 * so it reads as an artifact from the flagship experiment, not a mystery
 * face. Duotone is CSS only (grayscale + a color-blend wash), so any
 * re-cut animated loop can drop into the same slot later.
 */

export const UNSTILL_GROUND = '#191008';

export const UnstillCover: React.FC<{ onSelectChapter: (id: string) => void }> = ({
  onSelectChapter,
}) => (
  <HeroChrome
    ground={`radial-gradient(ellipse at 68% 38%, #2a1c10 0%, ${UNSTILL_GROUND} 62%)`}
    accent="#E9A45C"
    onSelectChapter={onSelectChapter}
    caption={<>Special photograph · Sydney · 1920s · From Unstill</>}
    media={
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-y-0 right-0 w-full sm:w-[62%]"
          style={{
            maskImage:
              'linear-gradient(90deg, transparent 0%, black 30%), linear-gradient(180deg, black 55%, transparent 96%)',
            maskComposite: 'intersect',
            WebkitMaskImage:
              'linear-gradient(90deg, transparent 0%, black 30%), linear-gradient(180deg, black 55%, transparent 96%)',
            WebkitMaskComposite: 'source-in',
          }}
        >
          <img
            src="/hero-signal-source.jpg"
            alt=""
            className="hero-ambient absolute inset-0 h-full w-full object-cover"
            style={{
              filter: 'grayscale(1) contrast(1.08) brightness(1.02)',
              animation: 'hero-drift 45s linear infinite alternate',
              transformOrigin: '60% 30%',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(165deg, #E9A45C 0%, #B3543A 48%, #34180C 100%)',
              mixBlendMode: 'color',
              opacity: 0.9,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 62% 34%, transparent 30%, rgba(20,11,5,0.55) 100%)',
              mixBlendMode: 'multiply',
            }}
          />
        </div>
        <div
          className="absolute inset-0 mix-blend-overlay"
          style={{ backgroundImage: GRAIN_URI, opacity: 0.06 }}
        />
      </div>
    }
  />
);
