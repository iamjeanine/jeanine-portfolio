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
  'M 210 -330 C 290 -318 336 -258 342 -178 C 347 -114 340 -52 328 -4 C 315 42 300 90 290 138 C 286 152 276 158 273 170 C 268 186 244 240 228 276 C 222 288 220 298 228 303 C 238 310 250 308 252 318 C 253 328 248 332 250 340 C 262 346 269 354 264 366 C 259 375 253 379 256 388 C 267 394 274 403 268 417 C 262 428 257 435 262 447 C 272 464 286 476 295 492 C 310 520 330 536 358 550 C 370 560 375 574 376 594 C 379 640 375 692 385 736 C 393 760 407 772 427 780';

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
      {/* Sized so the crown shows above the headline, the band breaks the
          line, and the face itself sits fully below on real viewports. */}
      {/* The pen starts after the name has set itself: type first, then
          the hand. */}
      <svg
        className={`${cls} absolute right-[2%] top-[9%] h-[89%] w-[46%] min-w-[320px]`}
        viewBox="0 -400 600 1300"
        preserveAspectRatio="xMidYMin meet"
      >
        <Path d={PROFILE_D} delay={1.9} duration={3.2} />
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
