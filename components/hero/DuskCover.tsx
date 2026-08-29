import React from 'react';
import { GRAIN_URI } from '../chapter';
import { HeroChrome } from './HeroChrome';

/**
 * The Dusk comp, "the in-between hour": neither the cream daylight the
 * site opens on today nor a premium-dark screen. Blue hour falling to an
 * amber afterglow at the base of the viewport, so the scroll out of the
 * cover brightens into the Productions chapter like dawn into the working
 * day. Ghost Mode as threshold, not darkness.
 */

/** Bottom edge of the ground gradient, for the ColorBridge below. */
export const DUSK_BRIDGE_FROM = '#9c6a3c';

export const DuskCover: React.FC<{ onSelectChapter: (id: string) => void }> = ({
  onSelectChapter,
}) => (
  <HeroChrome
    ground="linear-gradient(180deg, #1b2242 0%, #262a52 40%, #473250 66%, #7c4f30 88%, #9c6a3c 100%)"
    accent="#F2C56B"
    onSelectChapter={onSelectChapter}
    media={
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div
          className="hero-ambient absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 45% at 50% 96%, rgba(238,168,92,0.5) 0%, transparent 65%)',
            animation: 'hero-breathe 18s linear infinite alternate',
          }}
        />
        <div
          className="hero-ambient absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 18% 8%, rgba(96,140,196,0.28) 0%, transparent 60%)',
            animation: 'hero-breathe 26s linear infinite alternate-reverse',
          }}
        />
        <div
          className="absolute inset-0 mix-blend-overlay"
          style={{ backgroundImage: GRAIN_URI, opacity: 0.05 }}
        />
      </div>
    }
  />
);
