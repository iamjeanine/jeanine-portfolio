import React from 'react';
import { IndexNumber } from './IndexNumber';

/** Client/date left, index right. The eyebrow row atop every spread and entry. */
export const Eyebrow: React.FC<{
  label: React.ReactNode;
  index: React.ReactNode;
  labelColor: string;
  indexColor: string;
  className?: string;
}> = ({ label, index, labelColor, indexColor, className }) => (
  <div className={`flex items-baseline justify-between ${className ?? ''}`}>
    <span className="chapter-label" style={{ color: labelColor }}>
      {label}
    </span>
    <IndexNumber value={index} color={indexColor} />
  </div>
);
