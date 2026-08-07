import React, { useEffect, useState } from 'react';

export interface RailSection {
  id: string;
  index: string;
  label: string;
}

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
export const ChapterRail: React.FC<{ sections: RailSection[] }> = ({ sections }) => {
  // Starts undefined, not at the first section: on the Cover no chapter is
  // in view yet, and defaulting to sections[0] made the rail claim
  // "01 Productions" on the very first screen, which is the one place a
  // position indicator has to be trustworthy. Once a chapter has been
  // entered the last value is kept rather than cleared, so passing through
  // an inter-chapter bridge (which belongs to no section) doesn't flicker.
  const [activeId, setActiveId] = useState<string | undefined>(undefined);

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
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  // No fallback to sections[0]: undefined means "not in a chapter yet", and
  // the mobile chip stays hidden rather than mislabeling the Cover.
  const active = sections.find((s) => s.id === activeId);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
        className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-2 chapter-rail-invert"
        aria-label="Chapter navigation"
      >
        {sections.map((s) => {
          const isActive = s.id === activeId;
          return (
            <button
              key={s.id}
              type="button"
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
              <span>{s.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile: collapsed to the current position only. Top-right rather
          than bottom-right so it sits outside the thumb zone and stops
          overlaying the disclosure rows near the viewport bottom, which
          were measured stealing taps intended for them. */}
      {active && (
        <button
          type="button"
          onClick={() => scrollToSection(active.id)}
          className="md:hidden fixed top-3 right-3 z-40 chapter-label chapter-rail-btn chapter-rail-hit chapter-rail-invert"
          aria-label={`Jump to the start of ${active.label}, the chapter currently in view.`}
        >
          {active.index} &middot; {active.label}
        </button>
      )}
    </>
  );
};
