import React, { useEffect, useState } from 'react';
import { setMotionPaused, useMotionPaused } from './motionPreference';

/**
 * The site's one motion control, satisfying WCAG 2.2.2 for the Labs
 * chapter's autoplaying cover videos. One global toggle rather than nine
 * per-video controls: it meets the requirement with a single affordance and
 * keeps the chapter's frames free of player chrome, which the design brief
 * treats as the media boundary dissolving.
 *
 * Hidden entirely when the visitor already has an OS-level reduced-motion
 * preference, since nothing autoplays in that case and the control would
 * have nothing to pause.
 *
 * Styling matches ChapterRail: plain text, no pill or glass, inverted via
 * mix-blend-mode so it stays legible over paper, the Labs ink-black, and
 * Productions' saturated fields alike.
 */
export const MotionToggle: React.FC = () => {
  const paused = useMotionPaused();
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  if (reduced) return null;

  return (
    <button
      type="button"
      onClick={() => setMotionPaused(!paused)}
      /* No aria-pressed: the visible label already carries the state, and
         a toggle whose label flips would otherwise be announced as
         "Play motion, pressed" while motion is stopped, which contradicts
         itself. The label alone is unambiguous. */
      className="fixed left-4 bottom-4 z-40 chapter-label chapter-rail-btn chapter-rail-hit chapter-rail-invert transition-opacity duration-300 hover:opacity-70"
    >
      {paused ? 'Play motion' : 'Pause motion'}
    </button>
  );
};
