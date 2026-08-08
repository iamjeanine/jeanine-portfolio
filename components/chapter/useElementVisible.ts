import { useEffect, useState } from 'react';

/**
 * True while the element with this id is intersecting the viewport.
 *
 * Shared by the two fixed controls that need to step aside on the Cover:
 * ChapterRail (which would otherwise show the same three chapters the
 * Cover's index already lists, the P0 from the navigation critique) and
 * MotionToggle (which has nothing to pause there, since the Cover is
 * typographic and every video on the site lives further down, and which
 * was measured overlapping the Cover's index text at 375px once the index
 * made the Cover taller than the viewport).
 *
 * Pass undefined to opt out entirely, which keeps this a no-op for callers
 * that have nothing to hide behind.
 */
export const useElementVisible = (id?: string): boolean => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [id]);

  return visible;
};
