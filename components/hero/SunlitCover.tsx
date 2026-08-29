import React, { useRef, useState } from 'react';
import { GRAIN_URI } from '../chapter';
import { useFitName } from './useFitName';

/**
 * The Sunlit comp: full daylight, and one thing quietly wrong. The name
 * stands on an implied waterline; its reflection ripples below like pool
 * light and will not hold still. That reflection is the ghost, which makes
 * GHOST MODE STUDIO legible as an idea, not just a label. In-between
 * worlds in full sun, after the Night Shift sensibility, nothing archival.
 *
 * Deliberately sparse chrome after the busy-strip feedback: studio line,
 * name, one credential line, one nav row. Nothing else.
 */

/** Bottom of the sky gradient, for the ColorBridge below the cover. */
export const SUNLIT_BRIDGE_FROM = '#EFE8D6';

const INK = '#14313A';
const DISPLAY = "'HeroDisplay', Georgia, serif";
const DISPLAY_ITALIC = "'HeroDisplayItalic', Georgia, serif";
const MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

const NameLines: React.FC<{
  h1?: boolean;
  refs: {
    h1Ref: React.RefObject<HTMLHeadingElement | null>;
    l1Ref: React.RefObject<HTMLSpanElement | null>;
    l2Ref: React.RefObject<HTMLSpanElement | null>;
  };
}> = ({ h1 = false, refs }) => {
  const Tag = h1 ? 'h1' : 'div';
  return (
    <Tag
      ref={refs.h1Ref as React.RefObject<HTMLHeadingElement>}
      aria-hidden={h1 ? undefined : true}
      className="text-center whitespace-nowrap max-sm:whitespace-normal"
      style={{ lineHeight: 0.92, color: INK }}
    >
      <span ref={refs.l1Ref} className="max-sm:block max-sm:w-max max-sm:mx-auto" style={{ fontFamily: DISPLAY }}>
        Jeanine Emilia
      </span>
      <span className="hidden sm:inline">&nbsp;</span>
      <span
        ref={refs.l2Ref}
        className="max-sm:block max-sm:w-max max-sm:mx-auto"
        style={{ fontFamily: DISPLAY_ITALIC, fontStyle: 'italic' }}
      >
        Cornillot
      </span>
    </Tag>
  );
};

export const SunlitCover: React.FC<{ onSelectChapter: (id: string) => void }> = ({
  onSelectChapter,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const upright = {
    h1Ref: useRef<HTMLHeadingElement>(null),
    l1Ref: useRef<HTMLSpanElement>(null),
    l2Ref: useRef<HTMLSpanElement>(null),
  };
  const ghost = {
    h1Ref: useRef<HTMLHeadingElement>(null),
    l1Ref: useRef<HTMLSpanElement>(null),
    l2Ref: useRef<HTMLSpanElement>(null),
  };
  useFitName(sectionRef, upright.h1Ref, upright.l1Ref, upright.l2Ref);
  useFitName(sectionRef, ghost.h1Ref, ghost.l1Ref, ghost.l2Ref);

  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const navStyle: React.CSSProperties = {
    fontFamily: MONO,
    fontSize: '0.66rem',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'rgba(20,49,58,0.72)',
  };

  return (
    <section
      ref={sectionRef}
      id="cover"
      className="relative min-h-[100dvh] flex flex-col overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, #9FC6D6 0%, #C3DAE0 38%, #E3E2D4 72%, #EFE8D6 100%)',
      }}
    >
      {/* The ripple displacement for the reflection. SMIL keeps it
          drifting; reduced motion renders the filter without the drift. */}
      <svg aria-hidden="true" width="0" height="0" style={{ position: 'absolute' }}>
        <filter id="hero-ripple">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.09" numOctaves="2" result="n">
            {!reduced && (
              <animate
                attributeName="baseFrequency"
                dur="16s"
                values="0.012 0.09;0.017 0.12;0.012 0.09"
                repeatCount="indefinite"
              />
            )}
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="14" />
        </filter>
      </svg>

      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {/* The studio's terra dot as a small sun, with a fainter ghost
            echo beside it: the brand mark presiding, and the one thing
            quietly wrong in the sky. */}
        <div
          className="absolute rounded-full"
          style={{
            top: '17%',
            right: '9%',
            width: 'clamp(14px, 1.4vw, 22px)',
            height: 'clamp(14px, 1.4vw, 22px)',
            background: '#B3543A',
            boxShadow: '0 0 44px 14px rgba(179,84,58,0.35)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: '20.5%',
            right: '12%',
            width: 'clamp(14px, 1.4vw, 22px)',
            height: 'clamp(14px, 1.4vw, 22px)',
            background: 'rgba(179,84,58,0.3)',
            filter: 'blur(2px)',
          }}
        />
        <div
          className="absolute inset-0 mix-blend-overlay"
          style={{ backgroundImage: GRAIN_URI, opacity: 0.04 }}
        />
      </div>

      <div className="relative pt-8 sm:pt-10 text-center">
        <p
          style={{
            fontFamily: MONO,
            fontSize: '0.7rem',
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            color: INK,
          }}
        >
          Ghost Mode Studio
        </p>
        <p
          className="mt-3 px-6"
          style={{
            fontFamily: DISPLAY,
            fontSize: '0.9rem',
            color: 'rgba(20,49,58,0.78)',
          }}
        >
          <em style={{ fontFamily: DISPLAY_ITALIC, fontStyle: 'italic' }}>
            Emmy and Ambie Award-winning
          </em>{' '}
          showrunner and executive producer.
        </p>
      </div>

      {/* The name stands on the waterline just below center; everything
          under it is reflection. */}
      <div className="relative flex-1 flex flex-col justify-center px-4 sm:px-8">
        <NameLines h1 refs={upright} />
        <div
          aria-hidden="true"
          className="select-none pointer-events-none"
          style={{
            transform: 'scaleY(-1)',
            filter: 'url(#hero-ripple) blur(1.5px)',
            opacity: 0.28,
            maskImage: 'linear-gradient(0deg, black 0%, transparent 78%)',
            WebkitMaskImage: 'linear-gradient(0deg, black 0%, transparent 78%)',
            marginTop: '0.5rem',
          }}
        >
          <NameLines refs={ghost} />
        </div>
      </div>

      {/* The chapters as three objects standing in the shallows, each
          already wearing its chapter's ground color and casting its own
          rippled reflection. The hero is the site's map: surface above,
          the body of work beneath. Real raised objects with labels and a
          hover lift, so navigation reads as things to press, not floating
          caps. */}
      <nav
        aria-label="Chapters"
        className="relative pb-8 sm:pb-10 flex justify-center items-end gap-[clamp(28px,5vw,72px)] px-4"
      >
        {[
          {
            id: 'productions',
            index: '01',
            label: 'Productions',
            face: 'linear-gradient(165deg, #A0522D 0%, #8a3d1c 100%)',
            tall: 'clamp(96px, 13dvh, 150px)',
            ink: '#F6EFE7',
          },
          {
            id: 'labs',
            index: '02',
            label: 'Ghost Mode Labs',
            face: 'linear-gradient(165deg, #241a12 0%, #120C08 100%)',
            tall: 'clamp(82px, 11dvh, 128px)',
            ink: '#E8A672',
          },
          {
            id: 'about',
            index: '03',
            label: 'About',
            face: 'linear-gradient(165deg, #F3EEE3 0%, #E2DBC9 100%)',
            tall: 'clamp(70px, 9.5dvh, 110px)',
            ink: '#2b2118',
          },
        ].map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelectChapter(c.id)}
            className="hero-stone group relative flex flex-col items-center"
          >
            <span
              className="relative flex items-start justify-center pt-2.5"
              style={{
                width: 'clamp(66px, 8.5vw, 108px)',
                height: c.tall,
                background: c.face,
                borderRadius: '3px 3px 1px 1px',
                boxShadow: '0 10px 28px -12px rgba(20,49,58,0.45)',
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: '0.62rem',
                  letterSpacing: '0.2em',
                  color: c.ink,
                }}
              >
                {c.index}
              </span>
            </span>
            {/* The stone's reflection in the shallows. */}
            {/* Fixed reflection and label heights so every stone's base
                sits on the same ground line under items-end. */}
            <span
              aria-hidden="true"
              className="pointer-events-none"
              style={{
                width: 'clamp(66px, 8.5vw, 108px)',
                height: '46px',
                background: c.face,
                transform: 'scaleY(-1)',
                filter: 'url(#hero-ripple) blur(1.5px)',
                opacity: 0.26,
                maskImage: 'linear-gradient(0deg, black 0%, transparent 85%)',
                WebkitMaskImage: 'linear-gradient(0deg, black 0%, transparent 85%)',
                marginTop: '2px',
              }}
            />
            <span
              className="mt-2 text-center"
              style={{
                ...navStyle,
                fontSize: '0.58rem',
                letterSpacing: '0.14em',
                maxWidth: 'clamp(96px, 12vw, 150px)',
                lineHeight: 1.5,
                minHeight: '1.8rem',
                color: 'rgba(20,49,58,0.85)',
              }}
            >
              {c.label}
            </span>
          </button>
        ))}
      </nav>

      <a
        href="mailto:iamjeanine@me.com"
        className="hero-utility-link absolute bottom-3 left-4"
        style={{ ...navStyle, fontSize: '0.6rem', color: 'rgba(20,49,58,0.55)' }}
      >
        iamjeanine@me.com
      </a>
    </section>
  );
};
