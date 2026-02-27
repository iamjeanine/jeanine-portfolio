
import React, { useState, useEffect, useRef } from 'react';
import { HERO_VIDEOS } from '../constants';
import { AudioOnIcon, AudioOffIcon } from './icons/AudioIcons';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);

  const handleVideoReady = () => {
    setIsLoaded(true);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMuted(prev => !prev);
  };

  // Scroll-triggered recession: sets CSS custom property, zero re-renders
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const handleScroll = () => {
      const rect = hero.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);
      hero.style.setProperty('--scroll', String(progress));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const name1 = 'Jeanine';
  const name2 = 'Cornillot';

  return (
    <div ref={heroRef} className="sticky top-0 h-screen w-full overflow-hidden bg-black" style={{ zIndex: 1 }}>
      {/* Inner wrapper — darkens and recedes on scroll */}
      <div
        className="absolute inset-0"
        style={{
          transform: 'scale(calc(1 - var(--scroll, 0) * 0.05))',
          filter: 'brightness(calc(1 - var(--scroll, 0) * 0.6))',
          willChange: 'transform, filter',
        }}
      >
        {/* Background Video */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={HERO_VIDEOS.url}
          poster={HERO_VIDEOS.posterUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          onPlaying={handleVideoReady}
        />

        {/* Film grain overlay */}
        <div
          className="grain-overlay absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px',
            animation: 'grain 0.5s steps(6) infinite',
          }}
        />

        {/* Text Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center text-white">
            <h1 className="font-serif text-8xl md:text-9xl lg:text-[160px] font-normal text-white mix-blend-lighten text-center tracking-[-0.05em] leading-none animate-[subtle-zoom_20s_ease-in-out_infinite_alternate]">
              <span
                className={`block transition-all ease-[cubic-bezier(0.2,0.8,0.2,1)] duration-[1200ms] ${isLoaded ? 'opacity-100 blur-0 translate-y-0 tracking-[-0.05em]' : 'opacity-0 blur-md translate-y-4 tracking-[0.1em]'}`}
                style={{ transitionDelay: '300ms' }}
              >
                {name1}
              </span>
              <span
                className={`block transition-all ease-[cubic-bezier(0.2,0.8,0.2,1)] duration-[1200ms] ${isLoaded ? 'opacity-100 blur-0 translate-y-0 tracking-[-0.05em]' : 'opacity-0 blur-md translate-y-4 tracking-[0.1em]'}`}
                style={{ transitionDelay: '550ms' }}
              >
                {name2}
              </span>
            </h1>
            <p
              className={`text-base md:text-lg font-normal tracking-[0.2em] uppercase text-white mix-blend-lighten mt-4 transition-all duration-[1200ms] ease-in ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
              style={{ transitionDelay: '900ms' }}
            >
              Producer + Maker
            </p>
          </div>
        </div>

        {/* Mute toggle */}
        <div className="absolute bottom-8 right-8 z-10">
          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white transition-all"
          >
            {isMuted ? <AudioOffIcon /> : <AudioOnIcon />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
