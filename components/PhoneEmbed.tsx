import React from 'react';

interface PhoneEmbedProps {
  src: string;
  title?: string;
}

const PhoneEmbed: React.FC<PhoneEmbedProps> = ({ src, title = 'Interactive prototype' }) => {
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
      </div>
    </div>
  );
};

export default PhoneEmbed;
