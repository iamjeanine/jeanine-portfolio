import { useLayoutEffect } from 'react';
import type { RefObject } from 'react';

/**
 * Fits the name to its container: measured, not clamped, because the
 * display face is a drop-in slot (HeroDisplay) whose metrics are unknown
 * until a trial font lands in /public/fonts. One line spanning ~95% of the
 * container above 640px; below that the name breaks after "Emilia" and
 * each line fits the width on its own.
 */
export function useFitName(
  containerRef: RefObject<HTMLElement | null>,
  h1Ref: RefObject<HTMLHeadingElement | null>,
  line1Ref: RefObject<HTMLSpanElement | null>,
  line2Ref: RefObject<HTMLSpanElement | null>
) {
  useLayoutEffect(() => {
    const fit = () => {
      const container = containerRef.current;
      const h1 = h1Ref.current;
      const l1 = line1Ref.current;
      const l2 = line2Ref.current;
      if (!container || !h1 || !l1 || !l2) return;
      const w = container.clientWidth;
      if (!w) return;
      h1.style.fontSize = '100px';
      l1.style.fontSize = '';
      l2.style.fontSize = '';
      if (window.innerWidth < 640) {
        const w1 = l1.getBoundingClientRect().width;
        const w2 = l2.getBoundingClientRect().width;
        if (w1) l1.style.fontSize = `${((100 * w * 0.93) / w1).toFixed(2)}px`;
        if (w2) l2.style.fontSize = `${((100 * w * 0.93) / w2).toFixed(2)}px`;
      } else {
        const total = h1.scrollWidth;
        if (total) h1.style.fontSize = `${((100 * w * 0.95) / total).toFixed(2)}px`;
      }
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (containerRef.current) ro.observe(containerRef.current);
    if ('fonts' in document) document.fonts.ready.then(fit).catch(() => {});
    return () => ro.disconnect();
  }, [containerRef, h1Ref, line1Ref, line2Ref]);
}
