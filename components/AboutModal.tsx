
import React, { useEffect } from 'react';
import { CloseIcon } from './icons/NavigationIcons';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  // FIX: The `useEffect` hook was used without being imported. It has been added to the `react` import statement.
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
        className="bg-neutral-900 p-8 md:p-12 max-w-2xl w-full relative overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grain texture inside modal */}
        <div
          className="grain-overlay absolute inset-0 pointer-events-none mix-blend-overlay rounded-none"
          style={{
            opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px',
            animation: 'grain 0.5s steps(6) infinite',
          }}
        />
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors" aria-label="Close about section">
          <CloseIcon />
        </button>
        <h2 id="about-title" className="text-2xl md:text-3xl font-serif text-white mb-6">About</h2>
        <div className="space-y-4 text-sm md:text-base font-light text-neutral-300">
          <p>
            Emmy and Ambie Award-winning executive producer and showrunner. 300+ episodes across podcasts, television, and digital.
          </p>
          <p>
            Created Scamfluencers (53M downloads, #1 Apple Podcasts). Produced Dying for Sex (FX limited series, 9 Primetime Emmy nominations). Created The Last City (#1 Apple Fiction in 20 countries).
          </p>
          <p>
            Founded Wondery's first AI Creator Lab, scaling from 4 to 50+ people across content, marketing, product, and ad sales. Multiple projects moved from lab to production.
          </p>
          <p>
            Now building narrative experiences, story tools, and interactive prototypes with AI.
          </p>
          <div className="border-t border-neutral-800 pt-4 mt-6">
            <a href="https://www.linkedin.com/in/jcornillot" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors underline">LinkedIn</a>
            <span className="mx-2 text-neutral-600">/</span>
            <a href="mailto:iamjeanine@me.com" className="text-neutral-400 hover:text-white transition-colors underline">Email</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
