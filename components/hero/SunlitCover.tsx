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
            top: '11%',
            right: '15%',
            width: 'clamp(14px, 1.4vw, 22px)',
            height: 'clamp(14px, 1.4vw, 22px)',
            background: '#B3543A',
            boxShadow: '0 0 44px 14px rgba(179,84,58,0.35)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: '14.5%',
            right: '18.5%',
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

      <p
        className="relative pt-8 sm:pt-10 text-center"
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

      <div className="relative pb-8 sm:pb-10 flex flex-col items-center gap-5">
        <p
          className="text-center px-6"
          style={{
            fontFamily: DISPLAY,
            fontSize: '0.95rem',
            color: 'rgba(20,49,58,0.85)',
          }}
        >
          <em style={{ fontFamily: DISPLAY_ITALIC, fontStyle: 'italic' }}>
            Emmy and Ambie Award-winning
          </em>{' '}
          showrunner and executive producer.
        </p>
        <nav aria-label="Chapters" className="flex flex-wrap justify-center items-baseline gap-x-6 gap-y-1 px-4">
          {[
            { id: 'productions', label: 'Productions' },
            { id: 'labs', label: 'Ghost Mode Labs' },
            { id: 'about', label: 'About' },
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectChapter(c.id)}
              className="hero-utility-link inline-flex min-h-8 items-center"
              style={navStyle}
            >
              {c.label}
            </button>
          ))}
          <a href="mailto:iamjeanine@me.com" className="hero-utility-link inline-flex min-h-8 items-center" style={navStyle}>
            iamjeanine@me.com
          </a>
        </nav>
      </div>
    </section>
  );
};
