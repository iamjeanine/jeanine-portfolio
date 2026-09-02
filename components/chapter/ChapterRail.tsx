import React, { useEffect, useRef, useState } from 'react';
import { useAnyElementVisible } from './useElementVisible';
import { preferredScrollBehavior } from './motionPreference';

export interface RailSection {
  id: string;
  index: string;
  label: string;
}

interface Progress {
  chapter: string;
  position: number;
  total: number;
}

/**
 * Tracks "spread 3 of 7" / "entry 4 of 9" position inside whichever
 * chapter is currently in view (REDESIGN-PLAN.md navigation critique, P1:
 * a ~31-viewport-height document with zero sub-chapter feedback).
 *
 * Reads data-progress-* attributes rather than parsing ids. It used to
 * encode all three values into the id itself, which meant `id` could not
 * also be the stable per-work anchor the Cover's index now links to, and
 * required a regex to read back what the renderer already knew.
 */
const useChapterProgress = (): Progress | null => {
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-progress-chapter]')
    );
    if (elements.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const el = visible[0].target as HTMLElement;
        const chapter = el.dataset.progressChapter;
        const position = Number(el.dataset.progressIndex);
        const total = Number(el.dataset.progressTotal);
        if (!chapter || !position || !total) return;
        setProgress({ chapter, position, total });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return progress;
};

/**
 * Persistent chapter position indicator (REDESIGN-PLAN.md 4.2). Fixed
 * right edge on desktop, a single compact current-position label on
 * mobile.
 *
 * The desktop rail uses an explicit ink for each production spread, cream
 * in Labs, and dark ink on paper. This keeps the fixed navigation inside the
 * authored palette instead of generating surprise colors with blend modes.
 * Active vs inactive is conveyed by opacity and weight. Still no pill, no
 * glass, no backdrop blur.
 */
export const ChapterRail: React.FC<{
  sections: RailSection[];
  hideWhileVisibleIds?: readonly string[];
  /** Called once per deliberate click (rail button or mobile menu item),
   * after the click's own scroll. Meant to push a real history entry, so
   * Back can undo the jump. */
  onNavigate?: (id: string) => void;
  /** Called whenever passive scroll moves the active chapter, independent
   * of onNavigate, including back to undefined once no chapter is in view.
   * Meant to sync the URL via history.replace, silently, so reload or a
   * copied link lands where the visitor actually was, without flooding
   * Back/Forward on ordinary scrolling. Read through a ref internally so
   * an inline function passed fresh every parent render doesn't re-run
   * this effect on anything but a real position change. */
  onActiveChange?: (id: string | undefined) => void;
}> = ({ sections, hideWhileVisibleIds, onNavigate, onActiveChange }) => {
  // Starts undefined, not at the first section: on the Cover no chapter is
  // in view yet, and defaulting to sections[0] made the rail claim
  // "01 Productions" on the very first screen, which is the one place a
  // position indicator has to be trustworthy. Once a chapter has been
  // entered the last value is kept rather than cleared, so passing through
  // an inter-chapter bridge (which belongs to no section) doesn't flicker.
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  // A second, deliberately non-sticky copy of the same signal, for
  // onActiveChange only. activeId's stickiness exists so the rail's own
  // visible label doesn't flicker to blank in a bridge gap, but that same
  // stickiness is wrong for URL-sync: after a visitor scrolls back up past
  // every chapter to the Cover, or presses browser Back, activeId keeps
  // reporting the last chapter seen, and syncing that stale value would
  // silently push the visitor's own Back action back to where they left.
  // rawActiveId genuinely clears to undefined the moment nothing is
  // intersecting, so the URL can clear with it.
  const [rawActiveId, setRawActiveId] = useState<string | undefined>(undefined);
  const [mobileOpen, setMobileOpen] = useState(false);
  const progress = useChapterProgress();

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (elements.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
          setRawActiveId(visible[0].target.id);
        } else {
          setRawActiveId(undefined);
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  const onActiveChangeRef = useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;

  // Guards against syncing "no chapter" to the URL before the observer has
  // ever reported a real position: on a deep link to a chapter, rawActiveId
  // starts undefined for a moment while the mount scroll and the observer's
  // first callback catch up, and without this guard that brief undefined
  // would debounce-fire and wipe out a valid incoming deep link.
  const hasObservedPosition = useRef(false);
  if (rawActiveId) hasObservedPosition.current = true;

  // Debounced, not immediate: a single smooth-scroll jump (e.g. Productions
  // to About) passes *through* every chapter in between, so rawActiveId
  // changes several times inside one scroll animation. Syncing on every one
  // of those was clobbering the destination a deliberate click had just
  // pushed, e.g. clicking "About" correctly pushed /about, then the scroll
  // animation's transit through Labs silently replaced it with /labs a
  // moment later. Waiting for rawActiveId to hold still for a beat means
  // only the chapter the visitor actually lands on and stays on ever
  // reaches the URL, regardless of how long the animation took.
  useEffect(() => {
    if (!hasObservedPosition.current) return;
    const timeout = window.setTimeout(() => {
      onActiveChangeRef.current?.(rawActiveId);
    }, 700);
    return () => window.clearTimeout(timeout);
  }, [rawActiveId]);

  // The rail and the Cover's index would otherwise show the same three
  // chapters at once (Impeccable navigation critique, P0): the fixed rail
  // floated over the Contents block while it displayed the identical list at
  // a larger size, with mismatched copy besides. Rather than pick a winner,
  // the rail steps aside for whichever element owns that job at the moment,
  // fading out while a competing endcap is on screen and back in once the
  // visitor reaches an actual chapter.
  const suppressed = useAnyElementVisible(hideWhileVisibleIds);

  // Closing the mobile menu on every chapter change (rather than leaving it
  // open) keeps it from surviving into a chapter its contents no longer
  // describe.
  useEffect(() => {
    setMobileOpen(false);
  }, [activeId]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  // No fallback to sections[0]: undefined means "not in a chapter yet", and
  // the mobile chip stays hidden rather than mislabeling the Cover.
  const active = sections.find((s) => s.id === activeId);
  const activeProgress =
    active && progress && progress.chapter === active.id
      ? `${progress.position}/${progress.total}`
      : undefined;
  const productionRailInks = [
    'var(--ink)',
    '#26141A',
    'var(--cream)',
    'var(--ink)',
    'var(--ink)',
  ];
  const desktopRailInk = active?.id === 'labs'
    ? 'var(--cream-ink)'
    : active?.id === 'productions' && progress?.chapter === 'productions'
      ? productionRailInks[Math.max(0, Math.min(productionRailInks.length - 1, progress.position - 1))]
      : 'var(--ink)';
  // The compact control is an actual fore-edge tab now, rather than long
  // difference-blended text floating over faces, titles and body copy. Labs
  // gets the chapter's ink-black stock; every paper/colour-field chapter
  // gets the site's cream stock. The tab therefore stays legible without
  // borrowing a rectangular hole from whatever happens to pass behind it.
  const mobileRailColors = active?.id === 'labs'
    ? {
        surface: 'rgba(5,7,12,0.96)',
        ink: 'var(--cream-ink)',
        muted: 'rgba(247,243,237,0.67)',
        border: 'rgba(247,243,237,0.22)',
        accent: 'var(--ember)',
      }
    : {
        surface: 'rgba(247,243,237,0.97)',
        ink: 'var(--ink)',
        muted: 'var(--ink-mute)',
        border: 'rgba(20,16,14,0.22)',
        accent: 'var(--terra-text)',
      };

  const scrollToSection = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: preferredScrollBehavior(), block: 'start' });
    onNavigate?.(id);
  };

  // "Ghost Mode Labs · 4/9": only the currently active chapter ever carries
  // a live count, and only once it actually has one (About has no spreads
  // or entries to count, so it never grows a suffix).
  const labelFor = (s: RailSection) =>
    s.id === activeId && progress && progress.chapter === s.id
      ? `${s.label} · ${progress.position}/${progress.total}`
      : s.label;

  return (
    <>
      {/*
        lg, not md. The vertical rail used to appear from 768px, where no
        chapter has the horizontal room for a fixed right-edge label beside
        its content: measured at 768, every section on the site put text
        under it, by 113px on the Productions spreads and their credits
        screen and 97px in both Labs tiers. That was not one layout's bug
        but the rail appearing at a width it does not fit, so it is fixed
        here once rather than by padding six layouts, which at 768 would
        have spent 144px of a 576px measure.

        lg was still too generous, found on the next pass. Reserving the
        rail's footprint inside a four-of-twelve column at 1024 left the
        flipped Productions spreads a 267px column carrying 176px of
        padding, so the description rendered in a 91px ribbon, about ten
        characters a line. Overlap was fixed and readability was quietly
        spent paying for it, which the overlap sweep could not see because
        it only ever measured collisions.

        So the rail is xl and up, where the reservation costs a proportion
        of the width rather than most of it, and the compact chip covers
        everything below 1280. The xl:pr-44 clearances in Productions and
        Labs are scoped to match: at 1024 those columns carry no
        reservation at all, because there is no rail there to clear.
      */}
      <nav
        className="hidden xl:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-2 chapter-rail-invert chapter-rail-authored transition-[opacity,background-color,border-color] duration-500"
        style={{
          opacity: suppressed ? 0 : 1,
          pointerEvents: suppressed ? 'none' : 'auto',
          color: desktopRailInk,
          mixBlendMode: 'normal',
          // Labs contains both an ink-black ground and pale media frames.
          // A slim, square fore-edge backing keeps the fixed cream labels
          // legible across both without introducing a floating card. Its
          // full width, padding, and one-pixel border footprint stay reserved
          // in every chapter, so only the surface color changes at the Labs
          // handoff; the rail no longer makes a tiny positional snap.
          backgroundColor: active?.id === 'labs' ? 'rgba(5,7,12,0.94)' : 'transparent',
          borderColor: active?.id === 'labs' ? 'rgba(247,243,237,0.22)' : 'transparent',
          borderStyle: 'solid',
          borderWidth: '1px 0 1px 1px',
          padding: '0.75rem 1.5rem 0.75rem 0.875rem',
          width: '15rem',
        }}
        aria-hidden={suppressed || undefined}
        aria-label="Chapters"
      >
        {sections.map((s) => {
          const isActive = s.id === activeId;
          return (
            <button
              key={s.id}
              type="button"
              tabIndex={suppressed ? -1 : undefined}
              onClick={() => scrollToSection(s.id)}
              className="chapter-label chapter-rail-btn chapter-rail-hit flex items-baseline gap-2 transition-opacity duration-300"
              /* Keep inactive choices clearly secondary without fading
                 the authored rail ink into an ambiguous mid-tone. */
              style={{
                // 0.84 keeps near-black above 4.5:1 on the poppy field,
                // the lowest-contrast light field in this sequence.
                opacity: isActive ? 1 : 0.84,
                fontWeight: isActive ? 700 : 400,
                outlineColor: desktopRailInk,
              }}
              aria-current={isActive ? 'true' : undefined}
            >
              <span className="tabular-nums">{s.index}</span>
              <span>{labelFor(s)}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile and tablet: a compact fore-edge tab that expands into the
          same 3-item chapter list. The visible state is deliberately only
          "01 · 2/5"; the chapter's full name remains in the accessible
          label. The old long label regularly sat across titles and body
          copy, so shortening it protects the content without hiding status.

          !suppressed added here (P1 fix): activeId is deliberately sticky
          (see its own comment above) so the rail's label doesn't flicker
          blank crossing an inter-chapter bridge, but that same stickiness
          means it never clears back to undefined when a visitor scrolls
          back up to the Cover after having entered a chapter. The desktop
          nav already handles this correctly, by fading on `suppressed`
          rather than keying its visibility off activeId at all; this
          chip was the one place that check was missing, so it could sit
          on top of the Cover's own title and credential block showing a
          stale "Ghost Mode Labs · 1/5". Mirrors desktop's exact
          treatment (opacity, pointer-events, aria-hidden) rather than
          unmounting outright, so it fades instead of popping. */}
      {active && (
        <div
          className="xl:hidden fixed top-0 right-0 z-40 flex flex-col items-stretch transition-opacity duration-500"
          style={{
            opacity: suppressed ? 0 : 1,
            pointerEvents: suppressed ? 'none' : 'auto',
            color: mobileRailColors.ink,
            backgroundColor: mobileRailColors.surface,
            borderColor: mobileRailColors.border,
            borderLeftWidth: '1px',
            borderBottomWidth: '1px',
          }}
          aria-hidden={suppressed || undefined}
        >
          <button
            type="button"
            tabIndex={suppressed ? -1 : undefined}
            onClick={() => setMobileOpen((open) => !open)}
            className="chapter-label chapter-rail-btn min-h-11 px-3 py-2 text-right active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px]"
            style={{
              color: mobileRailColors.ink,
              outlineColor: mobileRailColors.accent,
              minWidth: '2.75rem',
              padding: '0.5rem 0.75rem',
            }}
            aria-expanded={mobileOpen}
            aria-label={
              mobileOpen
                ? 'Close chapter list'
                : // Label in Name (WCAG 2.5.3): the accessible name opens
                  // with the numerals the button visibly shows, so a
                  // speech-input user can say what they see.
                  `${active.index}${
                    activeProgress ? ` \u00B7 ${activeProgress}` : ''
                  }, currently in ${active.label}. Open chapter list.`
            }
          >
            {active.index}{activeProgress ? ` · ${activeProgress}` : ''}
          </button>
          {/* Keep the panel mounted so closing gets the same continuity as
              opening. The outer grid owns the short vertical reveal; the
              inner wrapper clips it. Closed controls leave the tab order,
              so the visual concealment never creates hidden keyboard stops. */}
          <div
            className="chapter-mobile-rail-panel"
            data-open={mobileOpen ? 'true' : 'false'}
            aria-hidden={!mobileOpen}
            style={{
              color: mobileRailColors.ink,
              backgroundColor: mobileRailColors.surface,
              borderColor: mobileRailColors.border,
              borderLeftWidth: '1px',
              borderBottomWidth: '1px',
            }}
          >
            <div className="min-h-0 overflow-hidden">
              <nav aria-label="Chapters" className="w-64 px-3 pb-3">
                {sections.map((s) => {
                  const isActive = s.id === activeId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      tabIndex={mobileOpen ? 0 : -1}
                      onClick={() => {
                        scrollToSection(s.id);
                        setMobileOpen(false);
                      }}
                      className="chapter-label chapter-rail-btn flex min-h-11 w-full items-center justify-between gap-4 py-2 text-left active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{
                        color: isActive ? mobileRailColors.ink : mobileRailColors.muted,
                        fontWeight: isActive ? 700 : 400,
                        outlineColor: mobileRailColors.accent,
                        borderTop: `1px solid ${mobileRailColors.border}`,
                        padding: '0.5rem 0',
                      }}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      <span>{s.label}</span>
                      <span className="tabular-nums" style={{ color: mobileRailColors.accent }}>
                        {s.index}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
