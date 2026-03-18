import React, { useState } from 'react';

interface PhoneEmbedProps {
  src: string;
  title?: string;
}

const PhoneEmbed: React.FC<PhoneEmbedProps> = ({ src, title = 'Interactive prototype' }) => {
  const [hintDismissed, setHintDismissed] = useState(false);

  return (
    <div className="flex justify-center">
      <div
        className="relative flex-shrink-0"
        style={{
          width: 300,
          height: 650,
          borderRadius: 44,
          background: '#1a1a1a',
          boxShadow:
            '0 0 0 2px #333, 0 20px 60px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.15)',
          padding: 10,
        }}
      >
        {/* Notch / Dynamic Island */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 130,
            height: 24,
            background: '#1a1a1a',
            borderRadius: '0 0 18px 18px',
            zIndex: 2,
          }}
        />
        <iframe
          src={src}
          title={title}
          loading="lazy"
          allow="microphone"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: 36,
            background: '#0a0a0a',
          }}
        />

        {/* Interactive hint overlay — fades on click */}
        {!hintDismissed && (
          <div
            onClick={() => setHintDismissed(true)}
            className="absolute inset-[10px] flex flex-col items-center justify-center cursor-pointer"
            style={{
              borderRadius: 36,
              background: 'rgba(10, 10, 10, 0.55)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              animation: 'phoneHintFade 0.6s ease-out',
              zIndex: 3,
            }}
          >
            {/* Pulsing ring */}
            <div className="relative mb-5">
              <div
                className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center"
                style={{ animation: 'phoneHintPulse 2.4s ease-in-out infinite' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 15l-6-6M9 15V9h6" />
                </svg>
              </div>
            </div>
            <span
              className="text-white/70 text-[11px] tracking-[0.18em] uppercase font-light"
            >
              Tap to explore
            </span>

            <style>{`
              @keyframes phoneHintPulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.08); opacity: 0.7; }
              }
              @keyframes phoneHintFade {
                from { opacity: 0; }
                to { opacity: 1; }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneEmbed;
