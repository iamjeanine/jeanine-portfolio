
import React, { useRef, useState, useEffect } from 'react';
import type { Project } from '../types';
import { Link } from 'react-router-dom';
import { AudioOnIcon, AudioOffIcon } from './icons/AudioIcons';

interface ProjectTileProps {
  project: Project;
  index: number;
}

const ProjectTile: React.FC<ProjectTileProps> = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isMuteButtonHovered, setIsMuteButtonHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  // Parallax effect logic
  const parallaxFactor = 0.05; // A small factor for a subtle effect

  useEffect(() => {
    // Detect if it's a touch-only device on component mount
    setIsTouchDevice(window.matchMedia('(hover: none)').matches);

    const handleScroll = () => {
      if (tileRef.current) {
        const rect = tileRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          const offset = (rect.top - window.innerHeight / 2) * parallaxFactor;
          tileRef.current.style.transform = `translateY(${offset}px)`;
        }
      }
    };
    
    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  // Scroll-triggered animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentTileRef = tileRef.current;
    if (currentTileRef) {
      observer.observe(currentTileRef);
    }

    return () => {
      if (currentTileRef) {
        observer.unobserve(currentTileRef);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (!isTouchDevice) {
      setIsHovered(true);
      if (!project.previewAutoplay && videoRef.current) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      }
    }
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      setIsHovered(false);
      if (!project.previewAutoplay && videoRef.current) {
        videoRef.current.pause();
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMuted(prev => !prev);
  };

  const handleTap = (e: React.MouseEvent) => {
    if (isTouchDevice) {
      if (!isHovered) {
        e.preventDefault();
        setIsHovered(true);

        if (videoRef.current?.paused) {
          videoRef.current.play().catch(() => {});
        }
      }
    }
  };

  return (
    <div 
        ref={tileRef}
        className="relative will-change-transform"
    >
      <Link 
        to={`/project/${project.id}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleTap}
        className={`block group transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        style={{ transitionDelay: `${(index % 4) * 100}ms` }}
      >
        <div className="relative aspect-video bg-gray-200 overflow-hidden">
            <div className="absolute inset-0 w-1/3 flex flex-col justify-center p-4 md:p-6">
                 <div className="overflow-hidden">
                    <h2 className={`text-base md:text-lg font-light transition-all duration-500 ease-in-out delay-100 will-change-transform will-change-opacity ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                        {project.coverTitle || project.title}
                    </h2>
                </div>
            </div>

            <div className={`absolute inset-0 transform transition-transform duration-500 ease-in-out ${isHovered ? 'translate-x-[33.33%]' : 'translate-x-0'}`}>
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    src={project.previewVideoUrl}
                    poster={project.previewPosterUrl}
                    autoPlay={project.previewAutoplay}
                    loop
                    muted={project.previewHasAudio ? isMuted : true}
                    playsInline
                    preload={index < 5 ? "auto" : "metadata"}
                />
            </div>
             {project.previewHasAudio && (
                project.id === 'the-anomaly-zone' ? (
                  <div className="absolute bottom-4 right-4 z-10 flex items-center">
                    <div className={`mr-2 overflow-hidden transition-opacity duration-300 ${isMuteButtonHovered ? 'opacity-100' : 'opacity-0'}`}>
                      <div className={`transition-transform duration-500 ease-out ${isMuteButtonHovered ? 'translate-y-0' : 'translate-y-full'}`}>
                        <span
                          className={`block font-serif text-xs whitespace-nowrap bg-gradient-to-r from-white/70 via-white to-white/70 [background-size:200%_auto] bg-clip-text text-transparent ${isMuteButtonHovered ? 'animate-[shimmer_0.8s_ease-out]' : ''}`}
                          aria-hidden="true"
                        >
                          ElevenLabs music
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={toggleMute}
                      onMouseEnter={() => setIsMuteButtonHovered(true)}
                      onMouseLeave={() => setIsMuteButtonHovered(false)}
                      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                      className={`p-2 rounded-full bg-black/30 hover:bg-black/60 text-white transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    >
                      {isMuted ? <AudioOffIcon /> : <AudioOnIcon />}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                    className="absolute bottom-4 right-4 z-10 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {isMuted ? <AudioOffIcon /> : <AudioOnIcon />}
                  </button>
                )
            )}
        </div>
      </Link>
    </div>
  );
};

export default ProjectTile;
