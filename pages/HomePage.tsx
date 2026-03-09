
import React, { useState } from 'react';
import Hero from '../components/Hero';
import ProjectGrid from '../components/ProjectGrid';
import AboutModal from '../components/AboutModal';
import { useIntersectionReveal } from '../hooks/useIntersectionReveal';

const HomePage = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const { ref: closingRef, isVisible: closingVisible } = useIntersectionReveal({ threshold: 0.3 });

  return (
    <main className="bg-[#f8f8f8]">
      <Hero />
      {/* Grid sits above the sticky hero in z-order */}
      <div className="relative" style={{ zIndex: 2 }}>
        <ProjectGrid />

        {/* Closing section — end credits */}
        <section
          ref={closingRef}
          className={`w-full bg-[#f8f8f8] flex flex-col items-center justify-center py-40 md:py-56 px-6 transition-all duration-1000 ease-out ${
            closingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="w-16 h-px bg-neutral-300 mb-12" />
          <h2 className="font-serif text-5xl md:text-7xl text-neutral-800 mb-12 tracking-[-0.02em]">
            Jeanine Cornillot
          </h2>
          <div className="flex items-center space-x-8 md:space-x-10 text-xs md:text-sm font-light">
            <button
              onClick={() => setIsAboutOpen(true)}
              className="text-neutral-500 hover:text-neutral-800 transition-colors duration-300 tracking-[0.25em] uppercase"
            >
              About
            </button>
            <a
              href="https://www.linkedin.com/in/jcornillot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-neutral-800 transition-colors duration-300 tracking-[0.25em] uppercase"
            >
              LinkedIn
            </a>
            <a
              href="mailto:iamjeanine@me.com"
              className="text-neutral-500 hover:text-neutral-800 transition-colors duration-300 tracking-[0.25em] uppercase"
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
