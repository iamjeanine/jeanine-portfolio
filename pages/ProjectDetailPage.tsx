
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PROJECTS, getVisibleProjects } from '../constants';
import type { Project } from '../types';
import VideoPlayer from '../components/VideoPlayer';
import { BackIcon, NextIcon, PrevIcon, ExternalLinkIcon } from '../components/icons/NavigationIcons';
import PhoneEmbed from '../components/PhoneEmbed';
import { useViewTransitionNavigate } from '../hooks/useViewTransition';


// Reusable component for the text block
const ProjectTextBlock = ({ project }: { project: Project }) => {
  const paragraphs = project.description.split('\n\n').filter(Boolean);
  const lastParagraph = paragraphs[paragraphs.length - 1];
  const hasCallout = paragraphs.length > 2 && lastParagraph.length < 80;
  const bodyParagraphs = hasCallout ? paragraphs.slice(1, -1) : paragraphs.slice(1);

  // Detect pull quotes — paragraphs wrapped in curly quotes or straight quotes
  const isPullQuote = (text: string) => {
    const trimmed = text.trim();
    return (trimmed.startsWith('\u201C') && trimmed.endsWith('\u201D')) ||
           (trimmed.startsWith('"') && trimmed.endsWith('"'));
  };

  const stripQuotes = (text: string) => {
    return text.trim().replace(/^[\u201C"]/,'').replace(/[\u201D"]$/,'');
  };

  // Lead paragraph analysis
  const leadText = paragraphs[0] || '';
  const isEpigraph = leadText.startsWith('\u201C') || leadText.startsWith('"');
  const dropCapLetter = leadText.charAt(0);
  const leadRest = leadText.slice(1);

  // Parse epigraph into quote + attribution
  const parseEpigraph = (text: string) => {
    const dashMatch = text.match(/(.+?)\n\u2014\s*(.+)/s) || text.match(/(.+?)\s*\u2014\s*(.+)/);
    if (dashMatch) {
      return { quote: stripQuotes(dashMatch[1].trim()), attribution: dashMatch[2].trim() };
    }
    return { quote: stripQuotes(text), attribution: '' };
  };

  return (
    <div className="w-full max-w-5xl mt-8 md:mt-12">
        <div className="max-w-2xl">
            {/* Category label */}
            {(project.client || project.categoryLabel) && (
              <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-normal mb-4">
                {[project.client, project.categoryLabel].filter(Boolean).join(' \u00B7 ')}
              </p>
            )}

            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-light">{project.title}</h1>
              {(project.subtitle || project.descriptor) && <p className="text-lg md:text-xl text-neutral-500 font-light italic">{project.subtitle || project.descriptor}</p>}
            </div>

            {/* Lead: epigraph or drop cap */}
            {leadText && isEpigraph ? (
              <blockquote className="border-l-2 border-neutral-300 pl-6 mb-8">
                <p className="font-body-serif text-xl md:text-2xl font-light text-neutral-700 leading-relaxed italic">
                  {parseEpigraph(leadText).quote}
                </p>
                {parseEpigraph(leadText).attribution && (
                  <p className="text-sm text-neutral-500 font-light mt-3 tracking-wide">
                    &mdash; {parseEpigraph(leadText).attribution}
                  </p>
                )}
              </blockquote>
            ) : leadText ? (
              <p className="font-body-serif text-xl md:text-2xl font-light text-neutral-800 leading-relaxed mb-8">
                <span className="float-left text-5xl md:text-6xl font-normal leading-[0.8] mr-2 mt-1">{dropCapLetter}</span>
                {leadRest}
              </p>
            ) : null}

            {/* Subtle divider between lead and body */}
            {bodyParagraphs.length > 0 && (
              <div className="w-10 h-px bg-neutral-300 mb-8" />
            )}

            {/* Body paragraphs — with pull quote detection */}
            {bodyParagraphs.map((para, i) =>
              isPullQuote(para) ? (
                <blockquote key={i} className="border-l-2 border-neutral-300 pl-6 my-10">
                  <p className="font-body-serif text-xl md:text-2xl font-light text-neutral-700 leading-relaxed italic">
                    {stripQuotes(para)}
                  </p>
                </blockquote>
              ) : (
                <p key={i} className="font-body-serif text-base md:text-lg font-light text-neutral-700 leading-[1.85] mb-7">
                  {para}
                </p>
              )
            )}

            {/* Closing callout — short final lines get pulled out */}
            {hasCallout && (
              <p className="font-body-serif text-lg md:text-xl font-light text-neutral-800 italic mt-10 mb-8">
                {lastParagraph}
              </p>
            )}

            {project.formats && (
                <div className="mt-10 mb-8">
                    <span className="block text-[10px] tracking-[0.14em] uppercase text-neutral-400 font-normal mb-3">Formats</span>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                        {project.formats.map((format, index) => (
                            <p key={index} className="text-base md:text-lg font-light text-neutral-700">{format}</p>
                        ))}
                    </div>
                </div>
            )}

            {project.liveUrl && (
              <div className="mt-10 mb-2 border border-neutral-200 rounded-sm px-6 py-5 bg-neutral-50/60">
                <p className="text-xs font-light tracking-[0.2em] uppercase text-neutral-500 mb-3">Try the prototype</p>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center text-base font-light text-neutral-800 hover:text-[#2C4A3C] transition-colors"
                >
                  {project.liveUrlLabel || 'Visit the live site'}
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
                </a>
              </div>
            )}

            {project.tools && <p className="text-xs md:text-sm text-neutral-500 font-light tracking-wider mt-10 pt-4 border-t border-neutral-200">{project.tools}</p>}
        </div>
    </div>
  );
};


const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const vtNavigate = useViewTransitionNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [projectIndex, setProjectIndex] = useState(-1);
  const [isClosing, setIsClosing] = useState(false);
  

  useEffect(() => {
    // Scroll to top on new project load
    window.scrollTo(0, 0);

    const foundProject = PROJECTS.find(p => p.id === id);
    if (foundProject) {
      setProject(foundProject);
      const index = PROJECTS.findIndex(p => p.id === id);
      setProjectIndex(index);
    } else {
      navigate('/');
    }
  }, [id, navigate]);

    

  const handleClose = () => {
    if (!(document as any).startViewTransition) {
      // Fallback for browsers without View Transitions API
      setIsClosing(true);
      setTimeout(() => navigate('/'), 300);
      return;
    }
    vtNavigate('/');
  };
  
  if (!project) {
    return null; 
  }

  const visibleProjects = getVisibleProjects();
  const visibleIndex = visibleProjects.findIndex(p => p.id === id);
  const prevProject = visibleIndex > 0 ? visibleProjects[visibleIndex - 1] : visibleProjects[visibleProjects.length - 1];
  const nextProject = visibleIndex < visibleProjects.length - 1 ? visibleProjects[visibleIndex + 1] : visibleProjects[0];
  
  const renderDefaultLayout = () => (
    <>
      {project.embedUrl ? (
        <div className="w-full max-w-5xl py-8" style={{ viewTransitionName: 'project-hero' } as React.CSSProperties}>
          <p className="text-center text-xs tracking-[0.15em] uppercase text-neutral-400 font-light mb-6">interactive &mdash; click to explore</p>
          <PhoneEmbed src={project.embedUrl} title={`${project.title} — interactive prototype`} />
        </div>
      ) : project.interactivePitch ? (
         <div className="w-full max-w-5xl" style={{ viewTransitionName: 'project-hero' } as React.CSSProperties}>
            <a 
                href={project.interactivePitch.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative block w-full aspect-video bg-neutral-200 border border-neutral-300"
                aria-label={`View interactive pitch for ${project.title}`}
            >
                <video
                    src={project.interactivePitch.previewVideoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-100 scale-95 ease-in-out">
                        <span className="text-white text-lg font-light mr-3">View Pitch</span>
                        <ExternalLinkIcon className="h-5 w-5 text-white" />
                    </div>
                </div>
            </a>
         </div>
      ) : (
        <div className="w-full max-w-5xl space-y-8">
            {project.mainVideos.map((video, index) => (
                <div key={`video-container-${index}`} style={index === 0 ? { viewTransitionName: 'project-hero' } as React.CSSProperties : undefined}>
                  <VideoPlayer
                    src={video.url}
                    posterUrl={video.posterUrl}
                    glassPlateImageUrl={video.glassPlateImageUrl}
                    aspectRatio={video.aspectRatio}
                    autoplay={video.autoplay}
                    loop={video.loop}
                    showControls={video.showControls}
                    hasAudio={video.hasAudio}
                    projectId={project.id}
                    startUnmuted={index === 0 && video.hasAudio && !video.startMuted}
                  />
                  {video.caption && (
                      <p className="text-center text-xs text-neutral-500 mt-2 font-light tracking-wide">{video.caption}</p>
                  )}
                </div>
            ))}
            {project.mainImages && project.mainImages.map((image, index: number) => {
              const needsTransitionName = project.mainVideos.length === 0 && index === 0;
              const getAspectRatioClass = () => {
                switch (image.aspectRatio) {
                  case '16:9': return 'aspect-video';
                  case '9:16': return 'aspect-[9/16]';
                  case '4:3': return 'aspect-[4/3]';
                  case '1:1': return 'aspect-square';
                  default: return 'aspect-video';
                }
              };
              return (
                <div key={`image-${index}`} className={`relative w-full mx-auto ${getAspectRatioClass()}`} style={needsTransitionName ? { viewTransitionName: 'project-hero' } as React.CSSProperties : undefined}>
                  <img src={image.url} alt={`${project?.title} content`} className="w-full h-full object-contain bg-black" loading="lazy" />
                </div>
              )
            })}
        </div>
      )}
      <ProjectTextBlock project={project} />
    </>
  );

  const renderSocialCampaignLayout = () => (
    <>
      <div className="w-full max-w-5xl">
          {project.mainVideos[0] && (
              <div key="video-container-0" style={{ viewTransitionName: 'project-hero' } as React.CSSProperties}>
                  <VideoPlayer
                      src={project.mainVideos[0].url}
                      posterUrl={project.mainVideos[0].posterUrl}
                      aspectRatio={project.mainVideos[0].aspectRatio}
                      autoplay={project.mainVideos[0].autoplay}
                      loop={project.mainVideos[0].loop}
                      showControls={project.mainVideos[0].showControls}
                      hasAudio={project.mainVideos[0].hasAudio}
                      projectId={project.id}
                      startUnmuted={!project.mainVideos[0].startMuted}
                  />
                  {project.mainVideos[0].caption && (
                      <p className="text-center text-xs text-neutral-500 mt-2 font-light tracking-wide">{project.mainVideos[0].caption}</p>
                  )}
              </div>
          )}
      </div>

      <ProjectTextBlock project={project} />

      <div className="w-full max-w-5xl mt-8 md:mt-12">
        {project.mainVideos[1] && (
          <div key="video-container-1">
            {(project.mainVideos[1].title || project.mainVideos[1].subtitle) && (
              <div className="max-w-2xl mb-4">
                {project.mainVideos[1].title && (
                  <h3 className="text-xl md:text-2xl font-light text-neutral-800 mb-2">{project.mainVideos[1].title}</h3>
                )}
                {project.mainVideos[1].subtitle && (
                  <p className="text-base md:text-lg text-neutral-700 font-light leading-relaxed">
                    {project.mainVideos[1].subtitle}
                  </p>
                )}
              </div>
            )}
            <VideoPlayer
              src={project.mainVideos[1].url}
              posterUrl={project.mainVideos[1].posterUrl}
              aspectRatio={project.mainVideos[1].aspectRatio}
              autoplay={project.mainVideos[1].autoplay}
              loop={project.mainVideos[1].loop}
              showControls={project.mainVideos[1].showControls}
              hasAudio={project.mainVideos[1].hasAudio}
              projectId={project.id}
            />
          </div>
        )}
      </div>

      <div className="w-full max-w-5xl mt-8 md:mt-12">
        {project.mainVideos[2] && (
          <div key="video-container-2">
             {(project.mainVideos[2].title || project.mainVideos[2].subtitle) && (
              <div className="max-w-2xl mb-4">
                {project.mainVideos[2].title && (
                  <h3 className="text-xl md:text-2xl font-light text-neutral-800 mb-2">{project.mainVideos[2].title}</h3>
                )}
                {project.mainVideos[2].subtitle && (
                  <p className="text-base md:text-lg text-neutral-700 font-light leading-relaxed">
                    {project.mainVideos[2].subtitle}
                  </p>
                )}
              </div>
            )}
            <VideoPlayer
              src={project.mainVideos[2].url}
              posterUrl={project.mainVideos[2].posterUrl}
              aspectRatio={project.mainVideos[2].aspectRatio}
              autoplay={project.mainVideos[2].autoplay}
              loop={project.mainVideos[2].loop}
              showControls={project.mainVideos[2].showControls}
              hasAudio={project.mainVideos[2].hasAudio}
              projectId={project.id}
            />
          </div>
        )}
      </div>
    </>
  );

  const renderAICreatorLabLayout = () => {
    const video2 = project.mainVideos[1];
    const captionParts = video2?.caption?.split('\n\n') || [];
    const captionTitle = captionParts[0] || '';
    const captionBody = captionParts.slice(1).join('\n\n');

    return (
        <>
          <div className="w-full max-w-5xl">
            {project.mainVideos[0] && (
              <div key="video-container-0" style={{ viewTransitionName: 'project-hero' } as React.CSSProperties}>
                <VideoPlayer
                  src={project.mainVideos[0].url}
                  posterUrl={project.mainVideos[0].posterUrl}
                  aspectRatio={project.mainVideos[0].aspectRatio}
                  autoplay={project.mainVideos[0].autoplay}
                  loop={project.mainVideos[0].loop}
                  showControls={project.mainVideos[0].showControls}
                  hasAudio={project.mainVideos[0].hasAudio}
                  projectId={project.id}
                />
                {project.mainVideos[0].caption && (
                  <p className="text-center text-xs text-neutral-500 mt-2 font-light tracking-wide">
                    {project.mainVideos[0].caption}
                  </p>
                )}
              </div>
            )}
          </div>

          <ProjectTextBlock project={project} />
    
          <div className="w-full max-w-5xl mt-8 md:mt-12">
            {video2 && (
              <div key="video-container-1">
                <VideoPlayer
                  src={video2.url}
                  posterUrl={video2.posterUrl}
                  aspectRatio={video2.aspectRatio}
                  autoplay={video2.autoplay}
                  loop={video2.loop}
                  showControls={video2.showControls}
                  hasAudio={video2.hasAudio}
                  projectId={project.id}
                />
                {video2.caption && (
                  <div className="max-w-2xl mt-4">
                    <h3 className="text-xl md:text-2xl font-light text-neutral-800 mb-2">{captionTitle}</h3>
                    <p className="text-base md:text-lg font-light text-neutral-700 leading-relaxed whitespace-pre-line">
                      {captionBody}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      );
  }

  return (
    <div
      className={`fixed inset-0 bg-[#f8f8f8] z-50 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'} overflow-y-auto`}
      style={{ overscrollBehavior: 'contain', willChange: 'scroll-position' }}
    >
      {/* Atmospheric overlays — subtle grain + top gradient */}
      <div
        className="grain-overlay fixed inset-0 pointer-events-none mix-blend-overlay"
        style={{
          opacity: 0.015,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
          animation: 'grain 0.5s steps(6) infinite',
          zIndex: 0,
        }}
      />
      <div
        className="fixed top-0 left-0 right-0 pointer-events-none"
        style={{
          height: '200px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.03), transparent)',
          zIndex: 0,
        }}
      />

      <div className="w-full min-h-screen p-4 md:p-8 flex flex-col" style={{ contain: 'layout', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header className="flex justify-start items-center w-full mb-8 shrink-0">
          <button onClick={handleClose} className="group flex items-center space-x-2 text-neutral-600 hover:text-[#2C4A3C] transition-colors">
            <BackIcon />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out font-light text-sm">Work</span>
          </button>
        </header>

        {/* Content */}
        <main className="flex-grow flex flex-col items-center">
            {(() => {
              if (project.id === 'in-world-social-campaign') {
                return renderSocialCampaignLayout();
              } else if (project.id === 'ai-creator-lab') {
                return renderAICreatorLabLayout();
              } else {
                return (
                  <>
                    {renderDefaultLayout()}
                    
                  </>
                );
              }
            })()}
        </main>
        
        {/* Footer Navigation — full-width on mobile, icon-only on desktop */}
        <footer className="w-full mt-auto pt-8 shrink-0">
            {/* Mobile: full-width prev/next with project names */}
            <div className="flex flex-col gap-3 md:hidden">
                <Link
                  to={`/project/${prevProject.id}`}
                  className="flex items-center gap-3 px-4 py-3 border border-neutral-200 rounded-sm text-neutral-600 hover:text-neutral-800 hover:border-neutral-400 transition-colors"
                >
                    <PrevIcon />
                    <div className="min-w-0">
                      <span className="block text-[10px] tracking-[0.12em] uppercase text-neutral-400">Previous</span>
                      <span className="block text-sm font-light truncate">{prevProject.title}</span>
                    </div>
                </Link>
                <Link
                  to={`/project/${nextProject.id}`}
                  className="flex items-center justify-end gap-3 px-4 py-3 border border-neutral-200 rounded-sm text-neutral-600 hover:text-neutral-800 hover:border-neutral-400 transition-colors text-right"
                >
                    <div className="min-w-0">
                      <span className="block text-[10px] tracking-[0.12em] uppercase text-neutral-400">Next</span>
                      <span className="block text-sm font-light truncate">{nextProject.title}</span>
                    </div>
                    <NextIcon />
                </Link>
            </div>
            {/* Desktop: full-width editorial nav */}
            <div className="hidden md:block border-t border-neutral-200 mt-4">
              <div className="grid grid-cols-2">
                <Link
                  to={`/project/${prevProject.id}`}
                  className="group flex items-center gap-4 py-6 pr-8 text-neutral-500 hover:text-neutral-800 transition-colors"
                >
                  <span className="transition-transform duration-200 group-hover:-translate-x-1">
                    <PrevIcon />
                  </span>
                  <div>
                    <span className="block text-[10px] tracking-[0.14em] uppercase text-neutral-400 mb-1">Previous</span>
                    <span className="block text-base font-light">{prevProject.title}</span>
                  </div>
                </Link>
                <Link
                  to={`/project/${nextProject.id}`}
                  className="group flex items-center justify-end gap-4 py-6 pl-8 border-l border-neutral-200 text-neutral-500 hover:text-neutral-800 transition-colors text-right"
                >
                  <div>
                    <span className="block text-[10px] tracking-[0.14em] uppercase text-neutral-400 mb-1">Next</span>
                    <span className="block text-base font-light">{nextProject.title}</span>
                  </div>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    <NextIcon />
                  </span>
                </Link>
              </div>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default ProjectDetailPage;