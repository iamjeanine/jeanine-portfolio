import React, { useEffect, useRef, useState } from 'react';
import { useFitName } from './useFitName';

/**
 * Shared chrome for the hero-explorations cover comps: full-bleed section,
 * the fitted name low across the viewport, the tagline whisper, and the
 * monospace utility strip. Each comp supplies its ground and a media layer
 * that renders behind the chrome.
 */

export const HERO_INK = '#F4EEE4';
const DISPLAY = "'HeroDisplay', Georgia, serif";
const DISPLAY_ITALIC = "'HeroDisplayItalic', Georgia, serif";
export const HERO_MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

const formatTime = () =>
  new Date()
    .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    .replace(':', '.');

export const HeroChrome: React.FC<{
  ground: string;
  /** Color for the tagline's highlighted words. */
  accent: string;
  onSelectChapter: (id: string) => void;
  /** Rendered absolutely behind the chrome. */
  media?: React.ReactNode;
  /** Optional mono caption line above the utility strip (e.g. an archive credit). */
  caption?: React.ReactNode;
  ink?: string;
}> = ({ ground, accent, onSelectChapter, media, caption, ink = HERO_INK }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  useFitName(sectionRef, h1Ref, line1Ref, line2Ref);

  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [shown, setShown] = useState(reduced);
  const time = useRef(formatTime());
  const [, forceTick] = useState(0);

  useEffect(() => {
    if (!reduced) {
      const raf = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [reduced]);

  useEffect(() => {
    const id = window.setInterval(() => {
      time.current = formatTime();
      forceTick((n) => n + 1);
    }, 30000);
    return () => window.clearInterval(id);
  }, []);

  const entrance = (delay: number): React.CSSProperties =>
    reduced
      ? {}
      : {
          opacity: shown ? 1 : 0,
          transform: shown ? 'none' : 'translateY(8px)',
          transition: `opacity 260ms cubic-bezier(0.23,1,0.32,1) ${delay}ms, transform 260ms cubic-bezier(0.23,1,0.32,1) ${delay}ms`,
        };

  const stripStyle: React.CSSProperties = {
    fontFamily: HERO_MONO,
    fontSize: '0.62rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'rgba(244,238,228,0.62)',
  };

  return (
    <section
      ref={sectionRef}
      id="cover"
      className="relative min-h-[100dvh] flex flex-col justify-end overflow-hidden"
      style={{ background: ground }}
    >
      {media}

      <p
        className="absolute top-6 sm:top-9 left-0 right-0 text-center px-6"
        style={{
          fontFamily: DISPLAY,
          fontSize: '0.85rem',
          letterSpacing: '0.02em',
          color: 'rgba(244,238,228,0.8)',
          ...entrance(80),
        }}
      >
        <em style={{ fontFamily: DISPLAY_ITALIC, fontStyle: 'italic' }}>
          <span style={{ color: accent }}>Emmy and Ambie</span> Award-winning
        </em>{' '}
        showrunner and executive producer.
      </p>

      <div className="relative px-4 sm:px-8">
        {caption && (
          <p className="mb-3" style={{ ...stripStyle, ...entrance(120) }}>
            {caption}
          </p>
        )}
        <h1
          ref={h1Ref}
          className="text-center whitespace-nowrap max-sm:whitespace-normal max-sm:text-left"
          style={{ lineHeight: 0.84, color: ink, ...entrance(0) }}
        >
          <span ref={line1Ref} className="max-sm:block max-sm:w-max" style={{ fontFamily: DISPLAY }}>
            Jeanine Emilia
          </span>
          <span className="hidden sm:inline">&nbsp;</span>
          <span
            ref={line2Ref}
            className="max-sm:block max-sm:w-max"
            style={{ fontFamily: DISPLAY_ITALIC, fontStyle: 'italic' }}
          >
            Cornillot
          </span>
        </h1>

        <div
          className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 pt-3 pb-4"
          style={entrance(160)}
        >
          <span style={stripStyle}>Philadelphia {time.current}</span>
          <div className="flex items-baseline gap-x-5" style={stripStyle}>
            <a href="mailto:iamjeanine@me.com" className="hero-utility-link inline-flex min-h-8 items-center">
              iamjeanine@me.com
            </a>
            <a
              href="https://www.linkedin.com/in/jcornillot"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-utility-link inline-flex min-h-8 items-center"
            >
              LinkedIn
            </a>
          </div>
          <nav aria-label="Chapters" className="flex items-baseline gap-x-5" style={stripStyle}>
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
                style={{ letterSpacing: 'inherit' }}
              >
                {c.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
};
