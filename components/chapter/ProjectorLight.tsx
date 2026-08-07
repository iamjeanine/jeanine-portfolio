import React, { useEffect, useRef } from 'react';

/**
 * The Screening Room's one flourish (REDESIGN-PLAN.md 5.3): as a Feature's
 * video frame enters the viewport, a soft warm light rises behind it, like a
 * projector warming up as the screening starts, then settles. Driven by a
 * scroll-set CSS custom property via ref (rAF-throttled), the same pattern
 * as ColorBridge, so there are no React re-renders.
 *
 * The light is a radial gradient placed behind the frame, never a
 * zero-offset colored box-shadow on the frame itself (those read as the
 * banned "dark glow" and one was already removed from this page).
 *
 * It only ever brightens: the value tracks its own peak so scrolling back up
 * does not dim a screening that has already started.
 *
 * Reduced motion: renders settled at full (still subtle) value, no scroll
 * coupling at all.
 */
export const ProjectorLight: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--pl', '1');
      return;
    }
    let raf = 0;
    let peak = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 as the frame's top crosses the viewport bottom, reaching 1 once it
      // has travelled three quarters of a viewport further up.
      const t = Math.min(1, Math.max(0, (vh - rect.top) / (vh * 0.75)));
      if (t > peak) {
        peak = t;
        el.style.setProperty('--pl', peak.toFixed(3));
      }
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
  }, []);

  return (
    <div ref={ref} className="relative" style={{ '--pl': 0 } as React.CSSProperties}>
      <div aria-hidden="true" className="chapter-projector-light" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
