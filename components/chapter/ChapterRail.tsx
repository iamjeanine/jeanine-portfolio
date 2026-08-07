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
  const [activeId, setActiveId] = useState(sections[0]?.id);

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

  const active = sections.find((s) => s.id === activeId) ?? sections[0];

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {/* Desktop: full vertical stack, right edge */}
      <nav
        className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-4"
        aria-label="Chapter navigation"
      >
        {sections.map((s) => {
          const isActive = s.id === activeId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollToSection(s.id)}
              className="chapter-label chapter-rail-btn chapter-rail-invert flex items-baseline gap-2 transition-opacity duration-300"
              style={{ opacity: isActive ? 1 : 0.55, fontWeight: isActive ? 700 : 400 }}
              aria-current={isActive ? 'true' : undefined}
            >
              <span>{s.index}</span>
              <span>{s.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile: collapsed to the current position only */}
      {active && (
        <button
          type="button"
          onClick={() => scrollToSection(active.id)}
          className="md:hidden fixed bottom-5 right-5 z-40 chapter-label chapter-rail-btn chapter-rail-invert"
          aria-label={`Currently in chapter: ${active.label}. Tap to scroll to its start.`}
        >
          {active.index} &middot; {active.label}
        </button>
      )}
    </>
  );
};
