import React, { useEffect, useRef } from 'react';
import { GRAIN_URI } from './constants';

/**
 * The chapter spine's signature moment: scrolling from one section into the
 * next washes the background through actual color instead of cutting.
 *
 * The fill is a real vertical gradient, pinned to `from` at its top edge and
 * `to` at its bottom edge. That matters: both seams then match their
 * neighbouring sections *by construction*, at every scroll position. The
 * previous implementation interpolated a single flat colour with color-mix,
 * so the whole bridge was one uniform slab whose edges only lined up with
 * the sections above and below at one exact scroll offset, and visibly
 * mismatched everywhere else. The Phase 5 critique measured that as ten flat
 * bands with hard seams, which flattened the lights-down moment the whole
 * "one publication" thesis leans on.
 *
 * Scroll still drives the effect, but only the *position* of the midpoint,
 * never the endpoints. As the bridge travels up the viewport the blend point
 * sweeps from low to high, so the leaving colour gives way to the arriving
 * one as you move through it, and the seams stay exact throughout.
 *
 * Shared by Productions (spread to spread) and Ghost Mode Labs (paper into
 * the chapter's dark ground and back). Productions opts into `wipe`, a
 * short, nearly hard editorial turn with no grain. Labs keeps this animated
 * wash, where the longer atmosphere belongs to the chapter's visual language.
 *
 * Reduced motion: the midpoint parks at 0.5, which renders a clean
 * symmetric gradient rather than the muddy frozen mid-mix the flat-colour
 * version produced.
 *
 * Heights were cut roughly 40% (default was 16vh/24vh) after an outside
 * review measured all eleven bridges at 2.96 viewport-heights combined,
 * 11.2% of the whole page, carrying no words and no image: "a magazine
 * turns the page with a cut; this one dissolves like a 2004 slideshow."
 * Two findings there, and shortening serves both. The dead space was
 * padding the scroll with nothing to look at, and the long dissolves were
 * diluting the per-spread colour blocking that is the chapter's strongest
 * asset. The wash itself stays: it is still the mechanism that keeps every
 * seam exact, and hard-cutting would reintroduce the flat-band seams the
 * Phase 5 critique caught. This is a shorter turn, not a cut.
 *
 * `via` overrides the midpoint's colour, for pairs where the plain mix of
 * `from` and `to` is itself the problem. Measured on the paper-to-Labs
 * crossing after Jeanine and an outside reviewer both independently read
 * it as "grey" and "dirty" rather than warm: the computed mid-mix rendered
 * as #7b7274, 3.8% saturation, confirmed by sampling the actual composited
 * pixel, not eyeballed. That held across every interpolation space tried
 * (oklch, oklab, lab, lch, srgb all landed within a point or two of each
 * other), which rules out "wrong colour space" as the cause: both `from`
 * (cream, ~31% saturation) and `to` (ink-deep, ~38%) are themselves close
 * to neutral, so any colour-accurate mix of two near-neutrals is another
 * near-neutral. No mixing function fixes that; only a real colour placed
 * at the midpoint does. `--terra` measures L=46.5%, matching the computed
 * mid-mix's own 46.5% almost exactly, so swapping it in keeps the
 * gradient's light-to-dark rhythm identical and only changes chroma. Costs
 * nothing on the other six bridges on the site: default is unset, which
 * falls through to the original computed mix unchanged.
 */
export const ColorBridge: React.FC<{
  from: string;
  to: string;
  heightClassName?: string;
  via?: string;
  variant?: 'wash' | 'wipe';
}> = ({ from, to, heightClassName, via, variant = 'wash' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const resolvedHeight =
    heightClassName ??
    (variant === 'wipe' ? 'h-[5vh] md:h-[6vh]' : 'h-[10vh] md:h-[14vh]');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (variant === 'wipe') return;
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
  }, [variant]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`relative ${resolvedHeight}`}
      style={
        {
          '--t': 0.5,
          '--from-c': from,
          '--to-c': to,
          // Midpoint sweeps 82% -> 18% as the bridge rises through the
          // viewport: early on most of the band still reads as the colour
          // being left, and by the time it exits, as the colour arriving.
          background:
            variant === 'wipe'
              ? 'linear-gradient(180deg, var(--from-c) 0%, var(--from-c) 49%, var(--to-c) 51%, var(--to-c) 100%)'
              : `linear-gradient(180deg, var(--from-c) 0%, ${
                  via ?? 'color-mix(in oklch, var(--from-c), var(--to-c))'
                } calc(82% - var(--t) * 64%), var(--to-c) 100%)`,
        } as React.CSSProperties
      }
    >
      {/* The same grain the chapters carry. Without it the bridges were the
          one ungrained surface on the site, which left a faint but
          measurable step at each seam (the neighbouring section's grain
          against the bridge's clean fill) and broke the "one grain" the
          shared physics depends on. */}
      {variant === 'wash' && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: GRAIN_URI, opacity: 0.05 }}
        />
      )}
    </div>
  );
};
