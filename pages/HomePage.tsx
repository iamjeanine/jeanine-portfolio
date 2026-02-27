
import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ProjectGrid from '../components/ProjectGrid';
import AboutModal from '../components/AboutModal';
import ScrollCue from '../components/ScrollCue';
import { useIntersectionReveal } from '../hooks/useIntersectionReveal';

const HomePage = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { ref: closingRef, isVisible: closingVisible } = useIntersectionReveal({ threshold: 0.3 });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="bg-[#f8f8f8]">
      <Hero />
      {!hasScrolled && <ScrollCue />}
      {/* Grid sits above the sticky hero in z-order */}
      <div className="relative" style={{ zIndex: 2 }}>
        <ProjectGrid />

        {/* Closing section — end credits */}
        <section
          ref={closingRef}
          className={`w-full bg-[#f8f8f8] flex flex-col items-center justify-center py-32 md:py-48 px-6 transition-all duration-1000 ease-out ${
            closingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <h2 className="font-serif text-3xl md:text-5xl text-neutral-800 mb-10">
            Jeanine Cornillot
          </h2>
          <div className="flex items-center space-x-6 text-sm font-light">
            <button
              onClick={() => setIsAboutOpen(true)}
              className="text-neutral-500 hover:text-neutral-800 transition-colors duration-300 tracking-wider uppercase"
            >
              About
            </button>
            <span className="text-neutral-300">|</span>
            <a
              href="https://www.linkedin.com/in/jcornillot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-neutral-800 transition-colors duration-300 tracking-wider uppercase"
            >
              LinkedIn
            </a>
            <span className="text-neutral-300">|</span>
            <a
              href="mailto:iamjeanine@me.com"
              className="text-neutral-500 hover:text-neutral-800 transition-colors duration-300 tracking-wider uppercase"
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
