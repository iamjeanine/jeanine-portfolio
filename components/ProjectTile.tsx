
import React, { useRef, useState } from 'react';
import type { Project } from '../types';
import { AudioOnIcon, AudioOffIcon } from './icons/AudioIcons';
import { useIntersectionReveal } from '../hooks/useIntersectionReveal';
import { useViewTransitionNavigate } from '../hooks/useViewTransition';
import { getVisibleProjects } from '../constants';

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

  // Stable project number — position in full list, not filtered view
  const projectNumber = React.useMemo(() => {
    const all = getVisibleProjects();
    return String(all.findIndex(p => p.id === project.id) + 1).padStart(2, '0');
  }, [project.id]);

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
        className="block group cursor-pointer"
        style={{
          transition: 'transform 400ms cubic-bezier(0.22,0.61,0.36,1), box-shadow 400ms cubic-bezier(0.22,0.61,0.36,1)',
          transform: isHovered ? 'translateY(-4px) scale(1.012)' : 'translateY(0) scale(1)',
          boxShadow: isHovered
            ? '0 16px 40px -10px rgba(21,14,10,0.35), 0 4px 12px -4px rgba(21,14,10,0.2)'
            : '0 0 0 0 transparent',
        }}
      >
        {/* ── MOBILE: Head row — № + type | CTA ── */}
        <div className="flex justify-between items-baseline mb-2 md:hidden">
          <span
            className="text-[9px] tracking-[0.22em] uppercase"
            style={{ color: 'var(--ink-mute)' }}
          >
            <span className="text-[11px]" style={{ color: 'var(--terra)' }}>
              № {projectNumber}
            </span>
            &nbsp;&nbsp;{project.categoryLabel}
          </span>
          <span
            className="text-[9px] tracking-[0.22em] uppercase"
            style={{ color: 'var(--terra)' }}
          >
            See the project →
          </span>
        </div>

        {/* ── MOBILE: Title ── */}
        <h2
          className="md:hidden font-serif italic font-medium text-[22px] leading-none tracking-[-0.01em] mb-2"
          style={{ color: 'var(--ink)' }}
        >
          {project.coverTitle || project.title}
        </h2>

        {/* ── Tile container ── */}
        <div
          className="relative aspect-video overflow-hidden"
          style={{ containerType: 'inline-size', borderRadius: '1px', backgroundColor: '#EEEAE3' }}
        >
          {/* Title panel — sits behind video, revealed as video slides (desktop only) */}
          <div className="absolute inset-0 w-1/3 hidden md:flex flex-col justify-center p-4 md:p-6">
            {project.categoryLabel && (
              <div className="overflow-hidden mb-1.5">
                <span
                  className={`block text-[10px] md:text-[11px] tracking-[0.14em] uppercase font-normal transition-all will-change-transform ${
                    isHovered
                      ? 'opacity-100 translate-y-0 duration-[350ms] delay-100'
                      : 'opacity-0 translate-y-2 duration-200 delay-0'
                  }`}
                  style={{ transitionTimingFunction: 'cubic-bezier(.22,.61,.36,1)', color: 'var(--ink-mute)' }}
                >
                  {project.categoryLabel}
                </span>
              </div>
            )}
            <div className="overflow-hidden">
              <h2
                className={`text-base md:text-lg font-serif italic font-medium transition-all will-change-transform ${
                  isHovered
                    ? 'opacity-100 translate-y-0 duration-[350ms] delay-150'
                    : 'opacity-0 translate-y-2 duration-200 delay-0'
                }`}
                style={{ transitionTimingFunction: 'cubic-bezier(.22,.61,.36,1)' }}
              >
                {project.coverTitle || project.title}
              </h2>
            </div>
            {project.subtitle && (
              <div className="overflow-hidden mt-1.5">
                <p
                  className={`text-xs md:text-sm font-sans font-light leading-snug transition-all will-change-transform ${
                    isHovered
                      ? 'opacity-100 translate-y-0 duration-[350ms] delay-[250ms]'
                      : 'opacity-0 translate-y-2 duration-200 delay-0'
                  }`}
                  style={{ transitionTimingFunction: 'cubic-bezier(.22,.61,.36,1)', color: 'var(--ink-soft)' }}
                >
                  {project.subtitle}
                </p>
              </div>
            )}

            {/* CTA pill — "See the project →" */}
            <div className="overflow-hidden mt-4">
              <div
                className={`transition-all will-change-transform ${
                  isHovered
                    ? 'opacity-100 translate-y-0 duration-[350ms] delay-[350ms]'
                    : 'opacity-0 translate-y-2 duration-200 delay-0'
                }`}
                style={{ transitionTimingFunction: 'cubic-bezier(.22,.61,.36,1)' }}
              >
                <span
                  className="inline-flex items-center text-[10px] tracking-[0.18em] uppercase"
                  style={{
                    gap: '0.5em',
                    color: 'var(--terra)',
                    padding: '6px 12px 5px',
                    border: '1px solid var(--terra)',
                    borderRadius: '999px',
                  }}
                >
                  <span>See the project</span>
                  <span style={{ lineHeight: 0 }}>→</span>
                </span>
              </div>
            </div>
          </div>

          {/* Video container — slides right on hover (desktop), static on mobile */}
          <div
            className={`absolute inset-0 z-[1] bg-neutral-900 ${
              isHovered ? 'md:translate-x-[30%] md:scale-[1.03]' : 'translate-x-0 scale-100'
            }`}
            style={{
              viewTransitionName: isTransitioning ? 'project-hero' : 'none',
              transition: 'transform 350ms cubic-bezier(.22,.61,.36,1)',
              boxShadow: isHovered ? '-12px 0 24px rgba(0,0,0,0.1)' : 'none',
            } as React.CSSProperties}
          >
            {/* Corner Number — identity mark */}
            <div
              className="absolute z-[2] hidden md:inline-flex items-start"
              style={{
                top: '12px',
                left: '18px',
                fontFamily: "'Bodoni Moda', serif",
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: '5.2cqw',
                lineHeight: 0.9,
                color: 'rgba(246,239,231,0.92)',
                textShadow: '0 1px 10px rgba(0,0,0,0.6)',
                gap: '0.15em',
              }}
            >
              <span>{projectNumber}</span>
              <span
                style={{
                  width: '0.85cqw',
                  height: '0.85cqw',
                  background: 'var(--terra)',
                  borderRadius: '999px',
                  marginTop: '0.45em',
                  boxShadow: '0 0 1cqw rgba(179,84,58,0.55)',
                  display: 'inline-block',
                }}
              />
            </div>

            {/* Corner Arrow — click affordance */}
            <div
              className="absolute z-[2] hidden md:inline-flex items-center"
              style={{
                bottom: '14px',
                right: '18px',
                fontSize: '1.6cqw',
                color: isHovered ? 'var(--cream)' : 'rgba(246,239,231,0.85)',
                textShadow: '0 1px 6px rgba(0,0,0,0.55)',
                gap: '0.45em',
                transition: 'transform 300ms ease, color 300ms ease',
                transform: isHovered ? 'translate(2px, -2px)' : 'translate(0, 0)',
              }}
            >
              <span
                style={{
                  fontSize: '0.65em',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: 'rgba(246,239,231,0.65)',
                }}
              >
                See the project
              </span>
              <span>↗</span>
            </div>

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
            />

            {/* Mute button — audio tiles only, top-right to clear corner arrow */}
            {project.previewHasAudio && (
              <button
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {isMuted ? <AudioOffIcon /> : <AudioOnIcon />}
              </button>
            )}
          </div>
        </div>

        {/* ── MOBILE: Subtitle ── */}
        {project.subtitle && (
          <p
            className="md:hidden mt-2"
            style={{ fontSize: '11px', color: 'var(--ink-soft)' }}
          >
            {project.subtitle}
          </p>
        )}
      </a>
    </div>
  );
};

export default ProjectTile;
