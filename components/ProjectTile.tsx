
import React, { useRef, useState } from 'react';
import type { Project } from '../types';
import { AudioOnIcon, AudioOffIcon } from './icons/AudioIcons';
import { useIntersectionReveal } from '../hooks/useIntersectionReveal';
import { useViewTransitionNavigate } from '../hooks/useViewTransition';

interface ProjectTileProps {
  project: Project;
  index: number;
}

const ProjectTile: React.FC<ProjectTileProps> = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isTouchDevice] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const { ref: tileRef, isVisible } = useIntersectionReveal();
  const vtNavigate = useViewTransitionNavigate();

  // Lazy-load video: only set src when tile is near the viewport
  React.useEffect(() => {
    const el = tileRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
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

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const toggleMute = (e: React.MouseEvent) => {
    if (isMobile) return;
    if (isTouchDevice && !isHovered) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    setIsMuted(prev => !prev);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Touch devices: first tap expands tile, second tap navigates
    if (isTouchDevice && !isHovered) {
      setIsHovered(true);
      if (videoRef.current?.paused) {
        videoRef.current.play().catch(() => {});
      }
      return;
    }

    // Set transition name on this tile's video container before navigating
    setIsTransitioning(true);
    vtNavigate(`/project/${project.id}`);
  };

  return (
    <div
      ref={tileRef}
      className={`relative transition-all duration-700 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-8 scale-[0.97]'
      }`}
      style={{ transitionDelay: `${(index % 2) * 100}ms` }}
    >
      <a
        href={`#/project/${project.id}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="block group"
      >
        <div className="relative aspect-video overflow-hidden" style={{ backgroundColor: '#f3f3f2' }}>
            {/* Title panel — sits behind video, revealed as video slides (desktop only) */}
            <div className="absolute inset-0 w-1/3 hidden md:flex flex-col justify-center p-4 md:p-6">
                 {project.categoryLabel && (
                   <div className="overflow-hidden mb-1.5">
                     <span className={`block text-[10px] md:text-[11px] tracking-[0.14em] uppercase text-neutral-500 font-normal transition-all will-change-transform ${isHovered ? 'opacity-100 translate-y-0 duration-[350ms] delay-100' : 'opacity-0 translate-y-2 duration-200 delay-0'}`} style={{ transitionTimingFunction: 'cubic-bezier(.22,.61,.36,1)' }}>
                       {project.categoryLabel}
                     </span>
                   </div>
                 )}
                 <div className="overflow-hidden">
                    <h2 className={`text-base md:text-lg font-sans font-medium transition-all will-change-transform ${isHovered ? 'opacity-100 translate-y-0 duration-[350ms] delay-150' : 'opacity-0 translate-y-2 duration-200 delay-0'}`} style={{ transitionTimingFunction: 'cubic-bezier(.22,.61,.36,1)' }}>
                        {project.coverTitle || project.title}
                    </h2>
                </div>
                {project.subtitle && (
                  <div className="overflow-hidden mt-1.5">
                    <p className={`text-sm md:text-base font-sans font-light text-neutral-500 whitespace-pre-line transition-all will-change-transform ${isHovered ? 'opacity-100 translate-y-0 duration-[350ms] delay-[250ms]' : 'opacity-0 translate-y-2 duration-200 delay-0'}`} style={{ transitionTimingFunction: 'cubic-bezier(.22,.61,.36,1)' }}>
                        {project.subtitle}
                    </p>
                  </div>
                )}
            </div>

            {/* Video container — slides right on hover (desktop), static on mobile */}
            <div
              className={`absolute inset-0 z-[1] bg-neutral-900 ${isHovered ? 'md:translate-x-[30%] md:scale-[1.03]' : 'translate-x-0 scale-100'}`}
              style={{
                viewTransitionName: isTransitioning ? 'project-hero' : 'none',
                transition: 'transform 350ms cubic-bezier(.22,.61,.36,1)',
                boxShadow: isHovered ? '-12px 0 24px rgba(0,0,0,0.1)' : 'none',
              } as React.CSSProperties}
            >
                <video
                    ref={videoRef}
                    className="w-full h-full pointer-events-none object-cover"
                    src={shouldLoad ? project.previewVideoUrl : undefined}
                    poster={project.previewPosterUrl}
                    autoPlay={project.previewAutoplay}
                    loop
                    muted={project.previewHasAudio ? isMuted : true}
                    playsInline
                    preload="metadata"
                    style={{
                      transition: 'filter 350ms cubic-bezier(.22,.61,.36,1)',
                    }}
                />
            </div>


            {/* Mute button — audio tiles only */}
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

        {/* Mobile caption — always visible below the tile */}
        <div className="mt-3 mb-1 md:hidden">
          {project.categoryLabel && (
            <span className="block text-[10px] tracking-[0.14em] uppercase text-neutral-400 font-normal mb-1">
              {project.categoryLabel}
            </span>
          )}
          <h2 className="text-base font-sans font-medium text-neutral-800">
            {project.coverTitle || project.title}
          </h2>
          {project.subtitle && (
            <p className="text-sm font-light text-neutral-500 mt-0.5">
              {project.subtitle}
            </p>
          )}
        </div>
      </a>
    </div>
  );
};

export default ProjectTile;
