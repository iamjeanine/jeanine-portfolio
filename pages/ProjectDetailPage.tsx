
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PROJECTS } from '../constants';
import type { Project } from '../types';
import VideoPlayer from '../components/VideoPlayer';
import { CloseIcon, NextIcon, PrevIcon } from '../components/icons/NavigationIcons';

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
            <p className="text-sm md:text-base font-light text-neutral-700 whitespace-pre-line mb-6">{project.description}</p>
            
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
    setIsClosing(true);
    setTimeout(() => navigate('/'), 300); // Match transition duration
  };
  
  if (!project) {
    return null; 
  }

  const prevProject = projectIndex > 0 ? PROJECTS[projectIndex - 1] : PROJECTS[PROJECTS.length - 1];
  const nextProject = projectIndex < PROJECTS.length - 1 ? PROJECTS[projectIndex + 1] : PROJECTS[0];
  
  const renderDefaultLayout = () => (
    <>
      <div className="w-full max-w-5xl space-y-8">
          {project.mainVideos.map((video, index) => (
              <div key={`video-container-${index}`}>
                <VideoPlayer 
                  src={video.url} 
                  aspectRatio={video.aspectRatio} 
                  autoplay={video.autoplay}
                  loop={video.loop}
                  showControls={video.showControls}
                  hasAudio={video.hasAudio}
                  projectId={project.id}
                />
                {video.caption && (
                    <p className="text-center text-xs text-neutral-500 mt-2 font-light tracking-wide">{video.caption}</p>
                )}
              </div>
          ))}
          {project.mainImages && project.mainImages.map((image, index) => {
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
              <div key={`image-${index}`} className={`relative w-full mx-auto ${getAspectRatioClass()}`}>
                <img src={image.url} alt={`${project?.title} content`} className="w-full h-full object-contain bg-black" loading="lazy" />
              </div>
            )
          })}
      </div>
      <ProjectTextBlock project={project} />
    </>
  );

  const renderSocialCampaignLayout = () => (
    <>
      <div className="w-full max-w-5xl">
          {project.mainVideos[0] && (
              <div key="video-container-0">
                  <VideoPlayer 
                      src={project.mainVideos[0].url} 
                      aspectRatio={project.mainVideos[0].aspectRatio} 
                      autoplay={project.mainVideos[0].autoplay}
                      loop={project.mainVideos[0].loop}
                      showControls={project.mainVideos[0].showControls}
                      hasAudio={project.mainVideos[0].hasAudio}
                      projectId={project.id}
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
            <VideoPlayer
              src={project.mainVideos[1].url}
              aspectRatio={project.mainVideos[1].aspectRatio}
              autoplay={project.mainVideos[1].autoplay}
              loop={project.mainVideos[1].loop}
              showControls={project.mainVideos[1].showControls}
              hasAudio={project.mainVideos[1].hasAudio}
              projectId={project.id}
            />
            {(project.mainVideos[1].title || project.mainVideos[1].subtitle) && (
              <div className="max-w-2xl mt-4">
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
          </div>
        )}
      </div>

      <div className="w-full max-w-5xl mt-8 md:mt-12">
        {project.mainVideos[2] && (
          <div key="video-container-2">
            <VideoPlayer
              src={project.mainVideos[2].url}
              aspectRatio={project.mainVideos[2].aspectRatio}
              autoplay={project.mainVideos[2].autoplay}
              loop={project.mainVideos[2].loop}
              showControls={project.mainVideos[2].showControls}
              hasAudio={project.mainVideos[2].hasAudio}
              projectId={project.id}
            />
            {(project.mainVideos[2].title || project.mainVideos[2].subtitle) && (
              <div className="max-w-2xl mt-4">
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
              <div key="video-container-0">
                <VideoPlayer
                  src={project.mainVideos[0].url}
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
    <div className={`fixed inset-0 bg-[#f8f8f8] z-50 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'} overflow-y-auto`}>
      <div className="w-full minh-screen p-4 md:p-8 flex flex-col">
        {/* Header */}
        <header className="flex justify-end items-center w-full mb-8 shrink-0">
          <button onClick={handleClose} className="text-neutral-600 hover:text-[#2C4A3C] transition-colors">
            <CloseIcon />
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
                return renderDefaultLayout();
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
