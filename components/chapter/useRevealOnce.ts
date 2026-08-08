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
/**
 * `rootMargin` defaults to pulling the root's bottom edge up by 40%, so a
 * target must cross into the top 60% of the viewport before it fires.
 *
 * This is the whole ballgame for an element taller than the viewport, and
 * getting it wrong made the Productions choreography invisible in normal
 * use. With a plain 12% threshold and no margin, a 1027px spread in a 900px
 * viewport fired as soon as ~123px of it had entered, which put its title's
 * top edge at 869px, i.e. 97% down the screen, measured. The 820ms entrance
 * then ran while the title climbed into view and was finished before it
 * reached anywhere readable, so a visitor scrolling normally only ever saw
 * the settled result. It verified fine only because the test jumped the
 * element to centre, which trips the observer and the paint in the same
 * instant and hides the problem completely.
 *
 * Tuned rather than guessed: the eyebrow/title/grid stack begins about
 * 139px into a spread at desktop, so firing when the spread's top crosses
 * 60% of the viewport puts the title near 75% of viewport height, with room
 * left to animate while genuinely on screen. Holds up at 375px too, where
 * the smaller top padding lands the title around 72%.
 */
export const useRevealOnce = (
  id: string,
  rootMargin = '0px 0px -40% 0px',
  threshold = 0
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
      { rootMargin, threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id, reduced, rootMargin, threshold]);

  return { shown, reduced };
};
