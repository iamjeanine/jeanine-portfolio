
import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ProjectGrid from '../components/ProjectGrid';
import AboutModal from '../components/AboutModal';
import ScrollCue from '../components/ScrollCue';

const HomePage = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

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
      <ProjectGrid />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </main>
  );
};

export default HomePage;
