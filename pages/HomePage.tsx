
import React, { useState } from 'react';
import Hero from '../components/Hero';
import ProjectGrid from '../components/ProjectGrid';
import AboutModal from '../components/AboutModal';

const HomePage = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <main className="bg-[#f8f8f8]">
      <Hero />
      <ProjectGrid onAboutClick={() => setIsAboutOpen(true)} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </main>
  );
};

export default HomePage;
