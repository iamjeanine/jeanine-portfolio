import React from 'react';
import { preferredScrollBehavior } from './motionPreference';

export interface ChapterContentsItem {
  anchor: string;
  index: string;
  name: string;
  meta: string;
}

interface ChapterContentsProps {
  ariaLabel: string;
  items: ChapterContentsItem[];
  label: string;
  colors: {
    accent: string;
    border: string;
    ink: string;
    muted: string;
  };
}

/**
 * A chapter-level table of contents: the fast path for a visitor who knows
 * which credit or lab project they want, without turning the Cover into a
 * directory. It is deliberately typographic and flat — hairlines, index
 * numbers, titles and roles — so it reads as a book's contents leaf rather
 * than a website card grid.
 */
export const ChapterContents: React.FC<ChapterContentsProps> = ({
  ariaLabel,
  items,
  label,
  colors,
}) => {
  const openItem = (anchor: string, moveFocus: boolean) => {
    const target = document.getElementById(anchor);
    if (!target) return;
    target.scrollIntoView({ behavior: preferredScrollBehavior(), block: 'start' });
    // Keyboard and assistive-technology activation moves the reading cursor
    // with the viewport. Pointer activation only scrolls: forcing focus after
    // a mouse/touch click paints a browser outline around an entire cinematic
    // spread, which looks like a rendering defect rather than feedback.
    if (moveFocus) target.focus({ preventScroll: true });
  };

  return (
    <details
      className="chapter-contents mt-12 md:mt-16 xl:pr-44"
      style={{ '--contents-accent': colors.accent } as React.CSSProperties}
    >
      <summary className="chapter-contents-summary flex min-h-12 cursor-pointer list-none items-center gap-4 py-3 select-none">
        <span className="chapter-label" style={{ color: colors.muted }}>
          {label}
        </span>
        <span
          aria-hidden="true"
          className="flex-1"
          style={{ borderTop: `1px solid ${colors.border}` }}
        />
        <span className="chapter-label tabular-nums" style={{ color: colors.muted }}>
          {String(items.length).padStart(2, '0')} works
        </span>
        <span
          aria-hidden="true"
          className="chapter-contents-marker text-base leading-none"
          style={{ color: colors.accent }}
        >
          +
        </span>
      </summary>

      <div className="chapter-contents-body">
        <div className="overflow-hidden">
          <nav aria-label={ariaLabel}>
            <ol className="mt-2 grid grid-cols-1 md:grid-cols-2 md:gap-x-12 xl:gap-x-20">
              {items.map((item) => (
                <li key={item.anchor} style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <button
                    type="button"
                    onClick={() => openItem(item.anchor, false)}
                    onKeyDown={(event) => {
                      if (event.key !== 'Enter' && event.key !== ' ') return;
                      event.preventDefault();
                      openItem(item.anchor, true);
                    }}
                    className="group grid min-h-12 w-full grid-cols-[2.75rem_minmax(0,1fr)] items-baseline gap-x-3 py-3 text-left transition-opacity duration-300 hover:opacity-65 active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{ background: 'none', border: 0, color: colors.ink, outlineColor: colors.accent }}
                  >
                    <span className="chapter-label tabular-nums" style={{ color: colors.accent }}>
                      {item.index}
                    </span>
                    <span className="min-w-0">
                      <span
                        className="block truncate text-[1.05rem] leading-tight md:text-[1.15rem]"
                        style={{ fontFamily: "'Bodoni Moda', serif" }}
                      >
                        {item.name}
                      </span>
                      <span
                        className="mt-1 block truncate text-[0.78rem] italic leading-tight"
                        style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: colors.muted }}
                      >
                        {item.meta}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </details>
  );
};
