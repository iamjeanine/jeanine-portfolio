import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { GRAIN_URI, useElementVisible, useMotionPaused } from '../chapter';
import { SignalEngine, makeSeed } from './signalEngine';
import type { HeroVariant } from './heroVariant';

/**
 * The Signal hero (hero-explorations branch): one glowing frame of treated
 * archival footage on a near-black ground, the name set across the frame's
 * full width with its baseline cropped by the frame edge, a whisper of a
 * tagline top center, and a monospace utility strip along the bottom.
 *
 * The glow is a low-resolution copy of the live frame, blurred and scaled
 * behind it, so the ambient light always reflects what the media is
 * showing rather than a hardcoded shadow color. The treatment itself lives
 * in signalEngine.ts and is driven by a per-visit seed, shown in the strip.
 */

/* The Num and Tom mugshot (the two men from the Unstill archive), chosen
   over the face footage because the face read as a portrait of Jeanine
   herself. The engine's seeded pan, zoom, and decay make the light move
   continuously, so a still carries the live treatment; if an animated
   version of this portrait is uploaded to the video bucket later, its URL
   can drop in here and the engine takes video sources unchanged. */
const SOURCE_URL = '/hero-signal-source.jpg';
const INK = '#F2EDE2';
const DISPLAY = "'HeroDisplay', Georgia, serif";
const DISPLAY_ITALIC = "'HeroDisplayItalic', Georgia, serif";
const MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

const formatTime = () =>
  new Date()
    .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    .replace(':', '.');

const useLocalTime = () => {
  const [time, setTime] = useState(formatTime);
  useEffect(() => {
    const id = window.setInterval(() => setTime(formatTime()), 30000);
    return () => window.clearInterval(id);
  }, []);
  return time;
};

export const SignalHero: React.FC<{
  variant: Exclude<HeroVariant, 'off'>;
  onSelectChapter: (id: string) => void;
}> = ({ variant, onSelectChapter }) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const displayRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLCanvasElement>(null);
  const sourceRef = useRef<HTMLImageElement | null>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const engineRef = useRef<SignalEngine | null>(null);
  const hasRunLiveRef = useRef(false);

  const [seed] = useState(makeSeed);
  const [accent, setAccent] = useState(INK);
  const time = useLocalTime();
  const paused = useMotionPaused();
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const visible = useElementVisible('cover');
  const live = variant === 'signal' && !paused && !reduced;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /* Name fitting: measured, not clamped, because the display face is a
     drop-in slot (HeroDisplay) whose metrics are unknown until a trial
     font lands in /public/fonts. Measured at 100px, then scaled so the
     line spans ~95% of the frame. Below 640px the name breaks after
     "Emilia" and each line fits the width on its own. */
  const applyFit = () => {
    const frame = frameRef.current;
    const h1 = h1Ref.current;
    const l1 = line1Ref.current;
    const l2 = line2Ref.current;
    if (!frame || !h1 || !l1 || !l2) return;
    const w = frame.clientWidth;
    if (!w) return;
    const target = w * 0.95;
    h1.style.fontSize = '100px';
    l1.style.fontSize = '';
    l2.style.fontSize = '';
    if (window.innerWidth < 640) {
      /* 0.93, not 0.95: the italic line's terminal overhang otherwise
         kisses the frame edge at 390px. */
      const w1 = l1.getBoundingClientRect().width;
      const w2 = l2.getBoundingClientRect().width;
      if (w1) l1.style.fontSize = `${((100 * w * 0.93) / w1).toFixed(2)}px`;
      if (w2) l2.style.fontSize = `${((100 * w * 0.93) / w2).toFixed(2)}px`;
    } else {
      const total = h1.scrollWidth;
      if (total) h1.style.fontSize = `${((100 * target) / total).toFixed(2)}px`;
    }
  };

  useLayoutEffect(() => {
    const engine = new SignalEngine(displayRef.current!, glowRef.current!, seed);
    engineRef.current = engine;
    setAccent(engine.accent);
    const frame = frameRef.current!;
    const ro = new ResizeObserver(() => {
      engine.resize(frame.clientWidth, frame.clientHeight);
      applyFit();
    });
    ro.observe(frame);
    engine.resize(frame.clientWidth, frame.clientHeight);
    applyFit();
    if ('fonts' in document) {
      document.fonts.ready.then(applyFit).catch(() => {});
    }
    return () => {
      ro.disconnect();
      engine.destroy();
      engineRef.current = null;
    };
  }, [seed]);

  const [sourceReady, setSourceReady] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = SOURCE_URL;
    sourceRef.current = img;
    if (img.complete) setSourceReady(true);
    else img.onload = () => setSourceReady(true);
    return () => {
      img.onload = null;
    };
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    const img = sourceRef.current;
    if (!engine || !img || !sourceReady) return;
    if (live && visible) {
      hasRunLiveRef.current = true;
      engine.setSource(img);
      engine.start();
      return () => engine.freeze();
    }
    /* Frozen (reduced motion, Pause Motion before playback started, or the
       plate variant): one treated frame. A pause mid-play instead keeps
       the live frame the loop stopped on. */
    if (variant === 'plate' || !hasRunLiveRef.current) engine.renderStill(img);
  }, [live, visible, variant, sourceReady]);

  /* Entrance: one short beat, ease-out, interruptible. Reduced motion
     starts shown so no transition property ever applies. */
  const [shown, setShown] = useState(reduced);
  useEffect(() => {
    if (reduced) {
      setShown(true);
      return;
    }
    const raf = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(raf);
  }, [reduced]);
  const entrance = (delay: number): React.CSSProperties =>
    reduced
      ? {}
      : {
          opacity: shown ? 1 : 0,
          transform: shown ? 'none' : 'translateY(8px)',
          transition: `opacity 260ms cubic-bezier(0.23,1,0.32,1) ${delay}ms, transform 260ms cubic-bezier(0.23,1,0.32,1) ${delay}ms`,
        };

  const frozen = !(live && visible);
  const stripStyle: React.CSSProperties = {
    fontFamily: MONO,
    fontSize: '0.62rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'rgba(242,237,226,0.66)',
  };

  return (
    <section
      id="cover"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
      style={{ background: '#0a0a0a' }}
    >
      <div className="relative w-full flex justify-center px-0 sm:px-10 py-0 sm:py-10">
        <div className="relative w-full sm:w-[84vw] max-w-[1600px]">
          <canvas
            ref={glowRef}
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              left: '-7%',
              top: '-7%',
              width: '114%',
              height: '114%',
              filter: 'blur(72px) saturate(1.4)',
              opacity: 0.85,
            }}
          />

          <div
            ref={frameRef}
            className="relative overflow-hidden h-[72dvh] sm:h-[74dvh] min-h-[420px]"
            style={{ background: '#050505' }}
          >
            <canvas
              ref={displayRef}
              className="absolute inset-0 w-full h-full"
              style={{
                filter: 'brightness(1.35) contrast(1.14) saturate(1.22)',
                animation: frozen ? 'hero-breathe 9s linear infinite alternate' : undefined,
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none mix-blend-overlay"
              style={{ backgroundImage: GRAIN_URI, opacity: 0.07 }}
            />

            <p
              className="absolute top-5 sm:top-7 left-0 right-0 text-center px-6"
              style={{
                fontFamily: DISPLAY,
                fontSize: '0.82rem',
                letterSpacing: '0.02em',
                color: 'rgba(242,237,226,0.78)',
                ...entrance(80),
              }}
            >
              <em style={{ fontFamily: DISPLAY_ITALIC, fontStyle: 'italic' }}>
                <span style={{ color: accent }}>Emmy and Ambie</span> Award-winning
              </em>{' '}
              showrunner and executive producer.
            </p>

            <h1
              ref={h1Ref}
              className="absolute bottom-0 left-0 right-0 text-center whitespace-nowrap translate-y-[14%] max-sm:whitespace-normal max-sm:text-left max-sm:px-3 max-sm:translate-y-[7%]"
              style={{ lineHeight: 0.8, color: INK, ...entrance(0) }}
            >
              <span
                ref={line1Ref}
                className="max-sm:block max-sm:w-max"
                style={{ fontFamily: DISPLAY }}
              >
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
          </div>

          <div
            className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 pt-2 pb-3 px-4 sm:px-0"
            style={entrance(160)}
          >
            <div className="flex items-baseline gap-x-5" style={stripStyle}>
              <span>
                Philadelphia {time}
              </span>
              <span>Seed {seed}</span>
            </div>
            <div className="flex items-baseline gap-x-5" style={stripStyle}>
              <a
                href="mailto:iamjeanine@me.com"
                className="hero-utility-link inline-flex min-h-8 items-center"
              >
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
      </div>
    </section>
  );
};
