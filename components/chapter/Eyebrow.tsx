import React from 'react';
import { IndexNumber } from './IndexNumber';

/** Client/date left, index right. The eyebrow row atop every spread and entry. */
export const Eyebrow: React.FC<{
  label: React.ReactNode;
  index: React.ReactNode;
  labelColor: string;
  indexColor: string;
  className?: string;
  indexClassName?: string;
  /** Used by the Productions spread choreography to give the eyebrow its own
   *  entrance beat. */
  style?: React.CSSProperties;
}> = ({ label, index, labelColor, indexColor, className, indexClassName, style }) => (
  <div className={`flex items-baseline justify-between ${className ?? ''}`} style={style}>
    <span className="chapter-label" style={{ color: labelColor }}>
      {label}
    </span>
    <IndexNumber value={index} color={indexColor} className={indexClassName} />
  </div>
);
