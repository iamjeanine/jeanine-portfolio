import React from 'react';
import { GRAIN_URI } from '../chapter';
import { HeroChrome } from './HeroChrome';

/**
 * The Gel Rack comp: a dark warm-ink room where the only color is a rack
 * of light gels, one per Productions spread, glowing in each show's actual
 * field palette. The chapter colors the visitor will scroll through are
 * previewed here as light; each strip routes into Productions.
 */

export const GELS_GROUND = '#161009';

const GELS: { title: string; field: string; glow: string; duration: string; len: number }[] = [
  { title: 'Scamfluencers', field: 'linear-gradient(175deg, #9F481C, #893710)', glow: '#933D14', duration: '7s', len: 0.86 },
  { title: 'Dying for Sex', field: 'linear-gradient(175deg, #F7E1DB, #EFCCC5)', glow: '#F3D5CE', duration: '9s', len: 1.04 },
  { title: 'The Last City', field: 'linear-gradient(175deg, #2B3A55, #131A30)', glow: '#33456a', duration: '11s', len: 0.92 },
  { title: 'Born This Way', field: 'linear-gradient(175deg, #EDEAE1, #DED7C5)', glow: '#E6E1D4', duration: '8s', len: 1.12 },
  { title: 'No Passport Required', field: 'linear-gradient(175deg, #943322, #6C2315)', glow: '#7E2A1B', duration: '10s', len: 0.8 },
  { title: 'Life of Kylie', field: 'linear-gradient(175deg, #3d1a49, #120616)', glow: '#502560', duration: '12s', len: 1.18 },
  { title: 'Hollywood and Crime', field: 'linear-gradient(175deg, #E8EBEF, #DBDFE2)', glow: '#E4E8EB', duration: '8.5s', len: 0.96 },
];

export const GelRackCover: React.FC<{ onSelectChapter: (id: string) => void }> = ({
  onSelectChapter,
}) => (
  <HeroChrome
    ground={GELS_GROUND}
    accent="#E8A672"
    onSelectChapter={onSelectChapter}
    media={
      <>
        {/* Gels hang from a rail at varied lengths, like sheets pulled from
            a lighting kit, so the rack reads as objects in a room rather
            than a bar chart. */}
        <div className="absolute inset-x-0 top-[16dvh] sm:top-[14dvh] flex justify-center">
          <div className="relative flex items-start gap-[clamp(10px,2.2vw,28px)]">
            <div
              aria-hidden="true"
              className="absolute left-[-5%] right-[-5%] -top-3 h-px"
              style={{ background: 'rgba(244,238,228,0.22)' }}
            />
            {GELS.map((g, i) => (
            <button
              key={g.title}
              type="button"
              aria-label={`${g.title} in Productions`}
              title={g.title}
              onClick={() => onSelectChapter('productions')}
              className="hero-gel relative"
              style={{
                height: `calc(clamp(150px, 32dvh, 330px) * ${g.len})`,
                width: 'clamp(16px, 2.8vw, 34px)',
              }}
            >
              <span
                aria-hidden="true"
                className="hero-ambient absolute inset-0"
                style={{
                  background: g.glow,
                  filter: 'blur(26px)',
                  transform: 'scale(1.9, 1.25)',
                  opacity: 0.4,
                  animation: `hero-breathe ${g.duration} linear infinite alternate`,
                  animationDelay: `${i * -1.7}s`,
                }}
              />
              <span
                aria-hidden="true"
                className="hero-ambient absolute inset-0"
                style={{
                  background: g.field,
                  borderRadius: '2px',
                  opacity: 0.94,
                  boxShadow: 'inset 0 0 18px rgba(255,255,255,0.16), inset 0 -40px 60px rgba(0,0,0,0.25)',
                  animation: `hero-breathe ${g.duration} linear infinite alternate`,
                  animationDelay: `${i * -1.7}s`,
                }}
              />
            </button>
            ))}
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: GRAIN_URI, opacity: 0.06 }}
        />
      </>
    }
  />
);
