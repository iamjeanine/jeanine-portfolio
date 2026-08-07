import React, { useEffect, useRef } from 'react';

/**
 * The chapter spine's signature moment: scrolling from one section into
 * the next morphs the background through actual color, instead of
 * cutting. Driven by a CSS custom property set directly via ref on
 * scroll (rAF-throttled), no React re-renders. One implementation shared
 * by Productions (ColorBridge, spread to spread) and Ghost Mode Labs
 * (LightsDown, paper into the chapter's dark ground and back).
 */
export const ColorBridge: React.FC<{
  from: string;
  to: string;
  heightClassName?: string;
}> = ({ from, to, heightClassName = 'h-[16vh] md:h-[24vh]' }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--t', '0.5');
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const traveled = vh - rect.top;
      const t = Math.min(1, Math.max(0, traveled / total));
      el.style.setProperty('--t', t.toFixed(3));
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
    <div
      ref={ref}
      aria-hidden="true"
      className={heightClassName}
      style={
        {
          '--t': 0,
          '--from-c': from,
          '--to-c': to,
          background:
            'color-mix(in oklch, var(--from-c) calc((1 - var(--t)) * 100%), var(--to-c) calc(var(--t) * 100%))',
        } as React.CSSProperties
      }
    />
  );
};
