import React from 'react';

const ScrollCue = () => {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
      <svg className="w-6 h-6 text-white animate-bounce" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
      </svg>
    </div>
  );
};

export default ScrollCue;
