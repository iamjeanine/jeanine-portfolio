import React, { useLayoutEffect, useRef, useState } from 'react';

/**
 * A single thin sketch line over the untouched production Cover: the hand
 * touching the official record, the gesture already living in the Kylie
 * key art's scribbled crown and in Visual Audiobooks' written-by-hand,
 * drawn-by-code. The line draws itself once on arrival (machine-drawn),
 * then holds still. Reduced motion renders it fully drawn.
 *
 * The paths are a stand-in hand: any real pen line of Jeanine's can
 * replace them by swapping the path data, no other code changes.
 */

export type SketchKind = 'profile' | 'emerging' | 'duet';

/* One continuous contour line, a profile facing into the page.
   Front contour only, in the iconic-silhouette register: few curves,
   drawn once, no back-of-head loop. */
const PROFILE_D =
  'M 318 -10 C 296 70 272 150 264 218 C 261 236 252 244 250 254 C 248 262 236 292 226 312 C 222 320 220 328 226 332 C 234 338 244 337 246 344 C 247 352 242 356 243 362 C 252 366 258 372 255 380 C 252 388 246 392 248 400 C 256 406 262 412 259 422 C 256 432 250 438 253 448 C 262 462 274 472 280 486 C 292 512 310 526 336 538 C 352 546 360 562 364 584 C 370 620 366 664 376 700 C 382 724 394 738 412 748';

/* A wandering line that only becomes a face at its end. */
const MEANDER_D =
  'M -20 470 C 120 440 210 500 330 468 C 450 436 540 502 660 470 C 740 448 800 470 860 452';

const Path: React.FC<{ d: string; delay?: number; duration?: number }> = ({
  d,
  delay = 0.6,
  duration = 2.6,
}) => (
  <path
    d={d}
    pathLength={1}
    style={{ animationDelay: `${delay}s`, animationDuration: `${duration}s` }}
  />
);

/* The profile breaks where the name crosses it: the line stops at the
   headline's band and resumes beneath it, so the type always wins. The
   band is measured from the section's own h1, not guessed. */
const ProfileOverlay: React.FC<{ cls: string }> = ({ cls }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [band, setBand] = useState<[number, number] | null>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const section = wrap?.closest('section');
    const h1 = section?.querySelector('h1');
    if (!wrap || !section || !h1) return;
    const measure = () => {
      const s = section.getBoundingClientRect();
      const n = h1.getBoundingClientRect();
      const pad = 18;
      setBand([Math.max(0, n.top - s.top - pad), n.bottom - s.top + pad]);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(section);
    ro.observe(h1);
    return () => ro.disconnect();
  }, []);

  const mask = band
    ? `linear-gradient(180deg, black 0, black ${band[0]}px, transparent ${band[0]}px, transparent ${band[1]}px, black ${band[1]}px, black 100%)`
    : undefined;

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      <svg
        className={`${cls} absolute right-0 bottom-0 h-[82%] w-[46%] min-w-[320px]`}
        viewBox="0 0 600 900"
        preserveAspectRatio="xMidYMax meet"
      >
        <Path d={PROFILE_D} />
      </svg>
    </div>
  );
};

export const SketchLineOverlay: React.FC<{ kind: SketchKind }> = ({ kind }) => {
  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const cls = `hero-sketch${reduced ? '' : ' hero-sketch--animate'}`;

  if (kind === 'profile') {
    return <ProfileOverlay cls={cls} />;
  }

  if (kind === 'emerging') {
    return (
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className={`${cls} absolute inset-0 h-full w-full`}
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMid meet"
        >
          <Path d={MEANDER_D} delay={0.6} duration={1.3} />
          <g transform="translate(830, 120) scale(0.78)">
            <Path d={PROFILE_D} delay={1.9} duration={2.4} />
          </g>
        </svg>
      </div>
    );
  }

  /* duet: two profiles facing each other, drawn one after the other. */
  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        className={`${cls} absolute right-[4%] top-[6%] h-[64%] w-[54%] min-w-[360px]`}
        viewBox="0 0 1300 900"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform="translate(600, 60) scale(-0.9, 0.9)">
          <Path d={PROFILE_D} delay={0.6} duration={2.2} />
        </g>
        <g transform="translate(700, 60) scale(0.9)">
          <Path d={PROFILE_D} delay={2.4} duration={2.2} />
        </g>
      </svg>
    </div>
  );
};
