
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);
  
  // Parallax effect logic
  const parallaxFactor = 0.05; // A small factor for a subtle effect

  useEffect(() => {
    const handleScroll = () => {
      if (tileRef.current) {
        const rect = tileRef.current.getBoundingClientRect();
        // Check if the element is within the viewport
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          // Calculate offset based on the element's position relative to the viewport center
          const offset = (rect.top - window.innerHeight / 2) * parallaxFactor;
          tileRef.current.style.transform = `translateY(${offset}px)`;
        }
      }
    };
    
    // Use requestAnimationFrame to throttle scroll events for better performance
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
    // Run once on mount to set the initial position
    handleScroll();

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount and unmount

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!project.previewAutoplay && videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!project.previewAutoplay && videoRef.current) {
      videoRef.current.pause();
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMuted(prev => !prev);
  };

  return (
    <div 
        ref={tileRef}
        className="relative mb-8 md:mb-12 will-change-transform"
    >
      <Link 
        to={`/project/${project.id}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group"
      >
        <div className="relative aspect-video bg-gray-200 overflow-hidden">
            {/* Info Box - Static, will be revealed by video moving */}
            <div className="absolute inset-0 w-1/3 flex flex-col justify-center p-4 md:p-6">
                 <div>
                    <h2 className="text-base md:text-lg font-light">{project.coverTitle || project.title}</h2>
                </div>
            </div>

            {/* Video Container - moves on hover */}
            <div className={`absolute inset-0 transform transition-transform duration-500 ease-in-out ${isHovered ? 'translate-x-[33.33%]' : 'translate-x-0'}`}>
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    src={project.previewVideoUrl}
                    autoPlay={project.previewAutoplay}
                    loop
                    muted={project.previewHasAudio ? isMuted : true}
                    playsInline
                    preload={index < 5 ? "auto" : "metadata"}
                />
            </div>
             {project.previewHasAudio && (
                <button 
                    onClick={toggleMute} 
                    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                    className="absolute bottom-4 right-4 z-10 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    {isMuted ? <AudioOffIcon /> : <AudioOnIcon />}
                </button>
            )}
        </div>
      </Link>
    </div>
  );
};

export default ProjectTile;