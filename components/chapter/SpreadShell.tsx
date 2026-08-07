import React from 'react';
import { GRAIN_URI } from './constants';

/**
 * Grain overlay + gutters, shared chrome for a chapter section. Productions
 * wraps each spread individually (background varies per spread); Labs
 * wraps the whole chapter once (one dark ground, entries inside).
 */
export const SpreadShell: React.FC<{
  background: string;
  as?: 'section' | 'div';
  id?: string;
  overflowHidden?: boolean;
  grainOpacity?: number;
  gutterClassName?: string;
  paddingClassName?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({
  background,
  as = 'section',
  id,
  overflowHidden = true,
  grainOpacity = 0.05,
  gutterClassName = 'px-6 md:px-20',
  paddingClassName = '',
  style,
  children,
}) => {
  const Tag = as as React.ElementType;
  return (
    <Tag id={id} className={`relative ${overflowHidden ? 'overflow-hidden' : ''}`} style={{ background, ...style }}>
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: GRAIN_URI, opacity: grainOpacity }}
      />
      <div className={`relative ${gutterClassName} ${paddingClassName}`}>{children}</div>
    </Tag>
  );
};
