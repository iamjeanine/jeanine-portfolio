import React from 'react';

/** Chapter-prefixed index marker: `01`-`07` in Productions, `L-01`-`L-09` in Labs. */
export const IndexNumber: React.FC<{ value: React.ReactNode; color: string }> = ({
  value,
  color,
}) => (
  <span className="chapter-label" style={{ color }}>
    {value}
  </span>
);
