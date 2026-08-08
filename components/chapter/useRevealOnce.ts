import { useEffect, useState } from 'react';

/**
 * True once the element with this id has entered the viewport, and true
 * forever after. Observed by id rather than by ref, matching the pattern
 * useElementVisible already established in this folder, so a caller inside
 * SpreadShell can use it without SpreadShell having to forward a ref.
 *
 * The difference from useElementVisible is the whole point: that hook tracks
 * continuous visibility and goes false again on exit, which is right for
 * hiding fixed chrome. This one latches and disconnects, which is right for
 * an entrance. A spread should animate in the first time it is reached and
 * then stay put, not replay every time it is scrolled back past.
 *
 * Returns `reduced` alongside `shown` so callers can drop their transition
 * properties entirely rather than merely shortening them. Like the Cover's
 * entrance, prefers-reduced-motion is read synchronously in the initial
 * state and `shown` starts true, so no pre-animation frame is ever painted
 * and no transition is attached at all.
 */
export const useRevealOnce = (
  id: string,
  threshold = 0.12
): { shown: boolean; reduced: boolean } => {
  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [shown, setShown] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    const el = document.getElementById(id);
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id, reduced, threshold]);

  return { shown, reduced };
};
