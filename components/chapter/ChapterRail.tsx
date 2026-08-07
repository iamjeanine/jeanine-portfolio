import React, { useEffect, useRef, useState } from 'react';

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
 * a ~31-viewport-height document with zero sub-chapter feedback). Reads
 * ids of the form `<chapter>-progress-<position>-<total>`, set by
 * ProductionsPreviewPage's Spread and LabsPreviewPage's entry components;
 * those ids exist purely for this observer, not as skip-link targets.
 */
const useChapterProgress = (): Progress | null => {
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>('[id^="productions-progress-"], [id^="labs-progress-"]')
    );
    if (elements.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const match = visible[0].target.id.match(/^(productions|labs)-progress-(\d+)-(\d+)$/);
        if (!match) return;
        setProgress({ chapter: match[1], position: Number(match[2]), total: Number(match[3]) });
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
 * The plan specifies ink-on-paper vs cream-ink-on-dark, but the rail
 * spends most of the scroll floating over Productions' saturated
 * per-spread fields (terra orange, navy, near-black plum), not just
 * "paper" or "the Labs dark ground": a binary light/dark scheme goes
 * unreadable there (e.g. muted ink or terra on the Scamfluencers
 * orange field measures under 2:1). Instead the rail is white text in
 * `mix-blend-mode: difference`, which inverts against whatever is
 * behind it and stays legible against every ground in the spine
 * without needing to know what that ground is. Active vs inactive is
 * conveyed by opacity and weight instead of hue, since the whole
 * point is not depending on a color read against a variable backdrop.
 * Still no pill, no glass, no backdrop blur.
 */
export const ChapterRail: React.FC<{
  sections: RailSection[];
  hideWhileVisibleId?: string;
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
}> = ({ sections, hideWhileVisibleId, onNavigate, onActiveChange }) => {
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

  // The rail and the Contents block used to show the same three chapters at
  // once (Impeccable navigation critique, P0): the fixed rail floated over
  // the Contents section while it displayed the identical list at a larger
  // size, with mismatched copy besides. Rather than pick a winner, the rail
  // now steps aside for whichever element owns that job at the moment: it
  // fades out while `hideWhileVisibleId` is on screen, and back in once the
  // visitor has moved on to an actual chapter.
  const [suppressed, setSuppressed] = useState(false);

  useEffect(() => {
    if (!hideWhileVisibleId) return;
    const el = document.getElementById(hideWhileVisibleId);
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setSuppressed(entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [hideWhileVisibleId]);

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

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        Desktop: full vertical stack, right edge.

        The difference-blend lives on the fixed <nav>, not on the buttons.
        A position:fixed element establishes its own stacking context, which
        isolates its descendants' blend group: a mix-blend-mode on a child
        therefore has no page backdrop to invert against and paints as
        literal white. That was a real defect, caught in the Phase 5
        critique, that rendered the rail at 1.12:1 on paper. Blending at the
        fixed element itself is correct, because an element with
        mix-blend-mode blends against its own backdrop rather than its
        children's.
      */}
      <nav
        className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-2 chapter-rail-invert transition-opacity duration-500"
        style={{ opacity: suppressed ? 0 : 1, pointerEvents: suppressed ? 'none' : 'auto' }}
        aria-hidden={suppressed || undefined}
        aria-label="Chapter navigation"
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
              /* 0.66, not a lower "muted" value: opacity scales the
                 difference blend, so an inactive item's effective contrast
                 drops with it. Measured from rendered pixels, 0.55 landed at
                 3.66:1 against the palest spread field (Dying for Sex) and
                 4.18:1 on paper, both under the floor. 0.66 clears 4.5:1 on
                 every ground in the spine while still reading as clearly
                 secondary to the active item at full opacity. */
              style={{ opacity: isActive ? 1 : 0.66, fontWeight: isActive ? 700 : 400 }}
              aria-current={isActive ? 'true' : undefined}
            >
              <span className="tabular-nums">{s.index}</span>
              <span>{labelFor(s)}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile: a single current-position chip that expands into the same
          3-item list on tap. It used to only ever jump back to the top of
          the chapter already in view, no path existed to reach a different
          one (Impeccable navigation critique, P0): the one persistent nav
          element mobile had was non-functional for its actual job. */}
      {active && (
        <div
          className="md:hidden fixed top-3 right-3 z-40 flex flex-col items-end gap-2 chapter-rail-invert"
        >
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="chapter-label chapter-rail-btn chapter-rail-hit"
            aria-expanded={mobileOpen}
            aria-label={
              mobileOpen
                ? 'Close chapter list'
                : `Currently in ${active.label}${
                    progress && progress.chapter === active.id
                      ? `, ${progress.position} of ${progress.total}`
                      : ''
                  }. Open chapter list.`
            }
          >
            {active.index} &middot; {labelFor(active)}
          </button>
          {mobileOpen && (
            <div className="flex flex-col items-end gap-2" role="menu">
              {sections.map((s) => {
                const isActive = s.id === activeId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      scrollToSection(s.id);
                      setMobileOpen(false);
                    }}
                    className="chapter-label chapter-rail-btn chapter-rail-hit"
                    style={{ opacity: isActive ? 1 : 0.66, fontWeight: isActive ? 700 : 400 }}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    {s.index} {labelFor(s)}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
};
