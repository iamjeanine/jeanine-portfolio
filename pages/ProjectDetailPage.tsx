
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PROJECTS, getVisibleProjects } from '../constants';
import type { Project } from '../types';
import VideoPlayer from '../components/VideoPlayer';
import { BackIcon, NextIcon, PrevIcon, ExternalLinkIcon } from '../components/icons/NavigationIcons';
import { useViewTransitionNavigate } from '../hooks/useViewTransition';


// Reusable component for the text block
const ProjectTextBlock = ({ project }: { project: Project }) => {
  return (
    <div className="w-full max-w-5xl mt-8 md:mt-12">
        <div className="max-w-2xl">
            <div className="mb-6">
              <h1 className="text-xl md:text-2xl font-light">{project.title}</h1>
              {project.descriptor && <p className="text-md md:text-lg text-neutral-500 font-light italic">{project.descriptor}</p>}
              {project.subtitle && <p className="text-md md:text-lg text-neutral-500 font-light">{project.subtitle}</p>}
            </div>
            <p 
                className="text-sm md:text-base font-light text-neutral-700 whitespace-pre-line mb-6"
                dangerouslySetInnerHTML={{ __html: project.description }}
            />
            
            {project.formats && (
                <div className="mt-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                        {project.formats.map((format, index) => (
                            <div key={index} className="border-l-2 border-neutral-300 pl-4">
                                <p className="text-sm md:text-base font-light text-neutral-800">{format}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {project.tools && <p className="text-xs md:text-sm text-neutral-500 font-light tracking-wider mt-6">{project.tools}</p>}
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
      {project.interactivePitch ? (
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
                    startUnmuted={index === 0}
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
                      startUnmuted
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
                  <h3 className="text-lg md:text-xl font-light mb-1">{project.mainVideos[1].title}</h3>
                )}
                {project.mainVideos[1].subtitle && (
                  <p className="text-sm md:text-base text-neutral-600 font-light">
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
                  <h3 className="text-lg md:text-xl font-light mb-1">{project.mainVideos[2].title}</h3>
                )}
                {project.mainVideos[2].subtitle && (
                  <p className="text-sm md:text-base text-neutral-600 font-light">
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
                    <h3 className="text-lg md:text-xl font-light mb-2">{captionTitle}</h3>
                    <p className="text-sm md:text-base font-light text-neutral-700 whitespace-pre-line">
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
        
        {/* Footer Navigation */}
        <footer className="w-full flex justify-between items-center mt-auto pt-8 shrink-0">
            <div>
                {/* Potentially other info here */}
            </div>
            <div className="flex items-center space-x-4">
                <Link to={`/project/${prevProject.id}`} className="text-neutral-600 hover:text-[#2C4A3C] transition-colors">
                    <PrevIcon />
                </Link>
                <Link to={`/project/${nextProject.id}`} className="text-neutral-600 hover:text-[#2C4A3C] transition-colors">
                    <NextIcon />
                </Link>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default ProjectDetailPage;