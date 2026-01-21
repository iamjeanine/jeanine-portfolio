
import React, { useState } from 'react';
import { HERO_VIDEOS } from '../constants';
import { AudioOnIcon, AudioOffIcon } from './icons/AudioIcons';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleVideoReady = () => {
    setIsLoaded(true);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMuted(prev => !prev);
  };

  const name1 = 'Jeanine';
  const name2 = 'Cornillot';

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
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
      
      {/* Text Content - uses mix-blend-mode to interact with video */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-center text-white">
          <h1 className="font-serif text-8xl md:text-9xl lg:text-[160px] font-normal text-white mix-blend-lighten text-center tracking-[-0.05em] leading-none animate-[subtle-zoom_20s_ease-in-out_infinite_alternate]">
            <span 
              className={`block transition-all ease-[cubic-bezier(0.2,0.8,0.2,1)] duration-1000 ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md'}`}
              style={{ transitionDelay: '200ms' }}
            >
              {name1}
            </span>
            <span 
              className={`block transition-all ease-[cubic-bezier(0.2,0.8,0.2,1)] duration-1000 ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md'}`}
              style={{ transitionDelay: '400ms' }}
            >
              {name2}
            </span>
          </h1>
          <p 
            className={`text-base md:text-lg font-normal tracking-[0.2em] uppercase text-white mix-blend-lighten mt-4 transition-opacity duration-1000 ease-in ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: '600ms' }}
          >
            AI Creative Producer
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 z-10 group">
        <div className="relative flex items-center">
          <div className="mr-3 overflow-hidden">
             <div className="transition-transform duration-500 ease-out translate-y-full group-hover:translate-y-0">
                <span
                    className="block font-serif text-sm whitespace-nowrap bg-gradient-to-r from-white/70 via-white to-white/70 [background-size:200%_auto] bg-clip-text text-transparent group-hover:animate-[shimmer_0.8s_ease-out]"
                    aria-hidden="true"
                >
                    ElevenLabs music
                </span>
             </div>
          </div>
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