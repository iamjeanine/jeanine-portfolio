
import React, { useEffect, useState } from 'react';
import { CloseIcon } from './icons/NavigationIcons';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-title"
    >
      <div 
        className="bg-[#f8f8f8] p-8 md:p-12 max-w-2xl w-full relative overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-600 hover:text-[#2C4A3C] transition-colors" aria-label="Close about section">
          <CloseIcon />
        </button>
        <h2 id="about-title" className="text-2xl md:text-3xl font-light mb-6">About</h2>
        <div className="space-y-4 text-sm md:text-base font-light text-neutral-700">
          <p>
            Emmy and Ambie Award-winning executive producer and showrunner. 300+ episodes across podcasts, video, and television.
          </p>
          <p>
            Created Scamfluencers (53M downloads, #1 Apple Podcasts) and The Last City (starring Rhea Seehorn, #1 in 20 countries). Producer on Dying for Sex, now an FX series starring Michelle Williams with 9 Emmy nominations.
          </p>
          <p>
            At Wondery, founded the AI Creator Lab and scaled it from 4 to 50+ across teams.
          </p>
          <p>
            I like building new story forms- apps, prototypes, audio tools, video game experiments, new ways to tell stories.
          </p>
          <p className="pt-2">
            <a href="https://www.linkedin.com/in/jcornillot" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#2C4A3C] transition-colors">LinkedIn</a>
            <span className="mx-2 text-neutral-400">/</span>
            <a href="mailto:iamjeanine@me.com" className="underline hover:text-[#2C4A3C] transition-colors">Email</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
