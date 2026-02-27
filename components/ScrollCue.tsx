import React from 'react';

const ScrollCue = () => {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3">
      <span className="text-[11px] tracking-[0.3em] uppercase text-white/70">
        scroll
      </span>
      <div className="w-px h-8 overflow-hidden">
        <div
          className="w-full h-full bg-white/60"
          style={{ animation: 'scroll-line 2s ease-in-out infinite' }}
        />
      </div>
    </div>
  );
};

export default ScrollCue;
