
import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ProjectGrid from '../components/ProjectGrid';
import AboutModal from '../components/AboutModal';
import { useIntersectionReveal } from '../hooks/useIntersectionReveal';

const HomePage = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const { ref: closingRef, isVisible: closingVisible } = useIntersectionReveal({ threshold: 0.3 });

  useEffect(() => {
    const handleScroll = () => {
      setShowHeader(window.scrollY > window.innerHeight * 0.85);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="bg-[#F5F2EC]">
      {/* Sticky header — fades in after scrolling past hero */}
      <header
        className={`fixed top-0 left-0 right-0 flex justify-between items-center px-6 md:px-8 py-4 bg-[#F5F2EC]/90 backdrop-blur-sm transition-all duration-500 ${
          showHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        style={{ zIndex: 40 }}
      >
        <span
          className="text-[11px] tracking-[0.18em] uppercase text-neutral-400 cursor-pointer hover:text-neutral-700 transition-colors duration-300"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Jeanine Emilia Cornillot
        </span>
        <button
          onClick={() => setIsAboutOpen(true)}
          className="text-[11px] tracking-[0.18em] uppercase text-neutral-400 hover:text-neutral-700 transition-colors duration-300"
        >
          About
        </button>
      </header>

      <Hero />
      {/* Grid sits above the sticky hero in z-order */}
      <div className="relative overflow-hidden" style={{ zIndex: 2 }}>
        <ProjectGrid />

        {/* Closing section — end credits */}
        <section
          ref={closingRef}
          className={`w-full bg-[#F5F2EC] flex flex-col items-center justify-center py-16 md:py-24 px-6 transition-all duration-1000 ease-out ${
            closingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="w-16 h-px bg-neutral-300 mb-8" />
          <h2 className="font-serif text-5xl md:text-7xl text-neutral-800 mb-8 tracking-[-0.02em] text-center">
            Jeanine Emilia Cornillot
          </h2>
          <div className="flex items-center space-x-8 md:space-x-10 text-xs md:text-sm font-light">
            <button
              onClick={() => setIsAboutOpen(true)}
              className="text-neutral-500 hover:text-[#B3543A] transition-colors duration-300 tracking-[0.25em] uppercase"
            >
              About
            </button>
            <a
              href="https://www.linkedin.com/in/jcornillot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-[#B3543A] transition-colors duration-300 tracking-[0.25em] uppercase"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/iamjeanine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-[#B3543A] transition-colors duration-300 tracking-[0.25em] uppercase"
            >
              GitHub
            </a>
            <a
              href="mailto:iamjeanine@me.com"
              className="text-neutral-500 hover:text-[#B3543A] transition-colors duration-300 tracking-[0.25em] uppercase"
            >
              Email
            </a>
          </div>
        </section>
      </div>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </main>
  );
};

export default HomePage;
