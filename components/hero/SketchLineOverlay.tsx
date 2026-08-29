import React, { useState } from 'react';

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

/* One continuous contour line, a profile facing into the page. */
const PROFILE_D =
  'M 258 6 C 244 60 228 120 224 168 C 222 190 214 198 213 210 C 212 220 206 232 197 248 C 190 260 186 268 190 274 C 196 282 204 284 205 292 C 206 300 200 304 201 312 C 209 318 213 322 210 330 C 207 338 200 344 203 354 C 210 368 222 378 228 392 C 238 414 262 428 292 438 C 316 446 330 464 336 492 C 342 522 338 558 348 588 C 362 622 398 640 452 652 C 520 636 548 480 536 380 C 528 300 500 200 450 130 C 420 88 380 40 348 10';

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

export const SketchLineOverlay: React.FC<{ kind: SketchKind }> = ({ kind }) => {
  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const cls = `hero-sketch${reduced ? '' : ' hero-sketch--animate'}`;

  if (kind === 'profile') {
    return (
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className={`${cls} absolute right-0 top-0 h-full w-[46%] min-w-[320px]`}
          viewBox="0 0 600 900"
          preserveAspectRatio="xMidYMid meet"
        >
          <Path d={PROFILE_D} />
        </svg>
      </div>
    );
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
