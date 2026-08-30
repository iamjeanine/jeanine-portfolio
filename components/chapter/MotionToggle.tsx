import React, { useEffect, useState } from 'react';
import { setMotionPaused, useMotionPaused } from './motionPreference';
import { useAnyElementVisible, useElementVisible } from './useElementVisible';

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
export const MotionToggle: React.FC<{
  hideWhileVisibleIds?: readonly string[];
  /**
   * Inverse gate: when set, the control renders *only* while that element is
   * on screen. The Spine passes the Labs chapter, because that is the only
   * place the looping autoplay this pauses actually exists. Jeanine asked
   * for the control removed as unnecessary, and she was right about most of
   * the site: it was showing across roughly 21 of 22 viewport-heights while
   * the videos it governs live in about 9 of them, so for the whole of
   * Productions and About it was fixed chrome doing nothing.
   *
   * Scoped rather than deleted, because it is not decorative. It is the
   * site's only in-page mechanism to stop seven indefinitely-looping
   * autoplaying videos presented alongside body copy, which is WCAG 2.2.2
   * at Level A. LazyVideo already honours prefers-reduced-motion, but an
   * OS-level preference is not accepted as satisfying 2.2.2: the normative
   * requirement is a mechanism in the content. Deleting it outright would
   * have been a real conformance regression rather than a tidy-up, so the
   * clutter complaint is answered by narrowing where it appears.
   */
  showWhileVisibleId?: string;
}> = ({ hideWhileVisibleIds, showWhileVisibleId }) => {
  const paused = useMotionPaused();
  const [reduced, setReduced] = useState(false);
  // Hidden while any competing surface is on screen. In the spine this is
  // the Labs title card, where nothing is playing yet, and About, where the
  // fixed control would otherwise overlap the colophon during the handoff.
  const suppressed = useAnyElementVisible(hideWhileVisibleIds);
  const gateVisible = useElementVisible(showWhileVisibleId);
  const gatedOut = showWhileVisibleId !== undefined && !gateVisible;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  if (reduced || suppressed || gatedOut) return null;

  return (
    <button
      type="button"
      onClick={() => setMotionPaused(!paused)}
      /* No aria-pressed: the visible label already carries the state, and
         a toggle whose label flips would otherwise be announced as
         "Play motion, pressed" while motion is stopped, which contradicts
         itself. The label alone is unambiguous. */
      className="fixed left-4 bottom-4 z-40 inline-flex min-h-11 items-center chapter-label chapter-rail-btn chapter-rail-hit chapter-rail-invert transition-opacity duration-300 hover:opacity-70"
    >
      {paused ? 'Resume motion' : 'Pause motion'}
    </button>
  );
};
