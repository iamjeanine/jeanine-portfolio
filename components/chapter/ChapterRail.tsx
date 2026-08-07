import React, { useEffect, useState } from 'react';

export interface RailSection {
  id: string;
  index: string;
  label: string;
  /** true if this section sits on a dark ground (Ghost Mode Labs). */
  dark?: boolean;
}

/**
 * Persistent chapter position indicator (REDESIGN-PLAN.md 4.2). Fixed
 * right edge on desktop, a single compact current-position label on
 * mobile. Recolors between ink/terra (paper sections) and cream-ink/ember
 * (the Labs dark ground) based on whichever section is centered in the
 * viewport. No pill, no glass, no backdrop blur.
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
  const onDark = Boolean(active?.dark);
  const mutedColor = onDark ? 'rgba(242,237,226,0.45)' : 'rgba(21,14,10,0.4)';
  const accentColor = onDark ? 'var(--ember)' : 'var(--terra)';
  const focusClass = onDark ? 'chapter-rail-btn-dark' : 'chapter-rail-btn-light';

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
              className={`chapter-label chapter-rail-btn ${focusClass} flex items-baseline gap-2 transition-colors duration-300`}
              style={{ color: isActive ? accentColor : mutedColor }}
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
          className={`md:hidden fixed bottom-5 right-5 z-40 chapter-label chapter-rail-btn ${focusClass} transition-colors duration-300`}
          style={{ color: accentColor }}
          aria-label={`Currently in chapter: ${active.label}. Tap to scroll to its start.`}
        >
          {active.index} &middot; {active.label}
        </button>
      )}
    </>
  );
};
