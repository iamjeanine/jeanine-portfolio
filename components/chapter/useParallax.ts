import { useEffect, useRef } from 'react';

/**
 * Subtle scroll-linked vertical drift for a spread's artwork: the "page has
 * dimension" effect, the last item on the reconciled motion list. Returns a
 * ref to attach directly to the media cluster; no wrapping element, so the
 * overlap inset's percentage-based offsets (`-bottom-14`, `-right-[8%]`)
 * keep resolving against the same box they always have.
 *
 * Driven by a scroll-set CSS custom property via rAF, the same pattern
 * ColorBridge and ProjectorLight already use, so there are no React
 * re-renders on scroll. Reduced motion skips the effect entirely: the
 * effect bails before ever touching the custom property, so it stays at
 * its 0px default and no transform is ever applied.
 *
 * Desktop only, checked at read time inside the scroll handler rather than
 * with a CSS breakpoint: below 1024px Productions collapses to a single
 * stacked column (see the Spread body comment), and a drifting hero image
 * directly above stacked body text reads as jitter, not depth, since there
 * is no side-by-side layout for the drift to read against.
 */
export const useParallax = (rate: number) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      if (window.innerWidth < 1024) {
        el.style.setProperty('--parallax-y', '0px');
        return;
      }
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Signed distance of the element's own centre from the viewport's
      // centre, in viewport-heights: negative while the element is still
      // below centre (approaching from below), positive once it has
      // passed centre and is leaving through the top. Multiplying by
      // `rate` and pushing the element the *same* direction as this value
      // (not the inverse) is what makes it lag the surrounding scroll: as
      // the page carries it upward past centre, the drift holds it back
      // downward by a fraction of that same motion.
      const centerOffset = (rect.top + rect.height / 2 - vh / 2) / vh;
      el.style.setProperty('--parallax-y', `${(centerOffset * rate * vh).toFixed(1)}px`);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [rate]);

  return ref;
};
