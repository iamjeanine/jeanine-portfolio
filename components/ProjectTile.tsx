
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
  const { ref: tileRef, isVisible } = useIntersectionReveal();
  const vtNavigate = useViewTransitionNavigate();

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
        <div className="relative aspect-video bg-gray-200 overflow-hidden">
            {/* Title overlay — left side */}
            <div className="absolute inset-0 w-1/3 flex flex-col justify-center p-4 md:p-6 z-[2]">
                 <div className="overflow-hidden">
                    <h2 className={`text-base md:text-lg font-sans font-light transition-all duration-500 ease-in-out delay-100 will-change-transform ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                        {project.coverTitle || project.title}
                    </h2>
                </div>
            </div>

            {/* Video container — shifts right on hover, view-transition-name on click */}
            <div
              className={`absolute inset-0 transform transition-all duration-500 ease-in-out ${isHovered ? 'translate-x-[15%]' : 'translate-x-0'} group-hover:scale-105`}
              style={{ viewTransitionName: isTransitioning ? 'project-hero' : 'none' } as React.CSSProperties}
            >
                <video
                    ref={videoRef}
                    className={`w-full h-full pointer-events-none ${project.id === 'narrative-space' ? 'object-contain bg-black' : 'object-cover'}`}
                    src={project.previewVideoUrl}
                    poster={project.previewPosterUrl}
                    autoPlay={project.previewAutoplay}
                    loop
                    muted={project.previewHasAudio ? isMuted : true}
                    playsInline
                    preload={index < 5 ? "auto" : "metadata"}
                    style={{
                      filter: isHovered ? 'saturate(1) brightness(1)' : 'saturate(0.6) brightness(0.85)',
                      transition: 'filter 600ms ease-out',
                    }}
                />
            </div>

            {/* Vignette overlay — lifts on hover */}
            <div
              className={`absolute inset-0 pointer-events-none z-[1] transition-opacity duration-600 ease-out ${isHovered ? 'opacity-0' : 'opacity-100'}`}
              style={{
                background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.25) 100%)',
              }}
            />

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
      </a>
    </div>
  );
};

export default ProjectTile;
