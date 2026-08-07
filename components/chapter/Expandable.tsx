import React from 'react';

/** The details/summary grid-rows reveal used for Role/Series/Impact (and,
 * from Phase 2, Labs' Concept/Build/Status). Colors are explicit props so
 * the component carries no dependency on an ancestor setting CSS vars. */
export const Expandable: React.FC<{
  label: string;
  children: React.ReactNode;
  accentColor: string;
  labelColor: string;
  bodyColor: string;
  borderColor: string;
}> = ({ label, children, accentColor, labelColor, bodyColor, borderColor }) => (
  <details
    className="chapter-expandable group"
    style={{ '--exp-border': borderColor, '--exp-accent': accentColor } as React.CSSProperties}
  >
    <summary className="chapter-expandable-summary flex items-baseline justify-between cursor-pointer list-none py-4 select-none">
      <span className="chapter-label" style={{ color: labelColor }}>
        {label}
      </span>
      <span
        className="chapter-expandable-marker text-base leading-none transition-transform duration-300"
        style={{ color: accentColor }}
        aria-hidden="true"
      >
        +
      </span>
    </summary>
    <div className="chapter-expandable-body">
      <div className="overflow-hidden">
        <div
          className="pb-6 pr-8 text-[0.95rem] leading-relaxed"
          style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: bodyColor, maxWidth: '38ch' }}
        >
          {children}
        </div>
      </div>
    </div>
  </details>
);
