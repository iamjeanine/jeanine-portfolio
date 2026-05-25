import React from 'react';

const ScrollCue = () => {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
      <div className="w-px h-10 overflow-hidden">
        <div
          className="w-full h-full bg-white/50"
          style={{ animation: 'scroll-line 2.2s ease-in-out infinite' }}
        />
      </div>
    </div>
  );
};

export default ScrollCue;
