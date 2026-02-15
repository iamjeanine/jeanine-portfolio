
import React, { useRef, useState, useEffect } from 'react';
import { AudioOnIcon, AudioOffIcon } from './icons/AudioIcons';
import { FullscreenEnterIcon, FullscreenExitIcon } from './icons/NavigationIcons';

interface VideoPlayerProps {
  src: string;
  posterUrl?: string;
  aspectRatio: '16:9' | '9:16' | '4:3' | '1:1';
  autoplay?: boolean;
  loop?: boolean;
  showControls?: boolean;
  hasAudio?: boolean;
  projectId?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, posterUrl, aspectRatio, autoplay = false, loop = false, showControls = false, hasAudio = false, projectId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // A video that autoplays should start muted. A video without audio is always muted.
  const [isMuted, setIsMuted] = useState(autoplay || !hasAudio);
  const [isHovering, setIsHovering] = useState(false);
  const [showHighlightOverlay, setShowHighlightOverlay] = useState(false);
  const overlayShownRef = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || projectId !== 'storycraft') {
        return;
    }

    const handlePlay = () => {
        // Only trigger if it hasn't been shown and video is at the start
        if (!overlayShownRef.current && video.currentTime < 1) {
            overlayShownRef.current = true;
            setShowHighlightOverlay(true);
            
            setTimeout(() => {
                setShowHighlightOverlay(false);
            }, 5000); // Show for 5s then trigger fade out
        }
    };
    
    // Reset the flag if user seeks back to the beginning
    const handleSeeked = () => {
        if (video.currentTime < 1) {
            overlayShownRef.current = false;
        }
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('seeked', handleSeeked);

    return () => {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('seeked', handleSeeked);
    };
  }, [projectId]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '16:9': return 'aspect-video';
      case '9:16': return 'aspect-[9/16]';
      case '4:3': return 'aspect-[4/3]';
      case '1:1': return 'aspect-square';
      default: return 'aspect-video';
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMuted(prev => !prev);
  };
  
  const handleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const showNativeControls = showControls && (projectId === 'narrative-space' || isHovering);
  const isSpecialElevenLabsVideo = false; // No videos use the special hover effect anymore.

  return (
    <div 
      ref={containerRef}
      className={`relative w-full mx-auto ${getAspectRatioClass()} group overflow-hidden`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <video
        ref={videoRef}
        className={`w-full h-full bg-black ${projectId === 'narrative-space' ? 'object-contain' : 'object-cover'}`}
        src={src}
        poster={posterUrl}
        autoPlay={autoplay}
        loop={loop}
        muted={isMuted}
        playsInline
        controls={showNativeControls}
        controlsList="nodownload"
      />
      
      {projectId === 'storycraft' && (
        <div 
          className={`absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-500 ease-in-out ${showHighlightOverlay ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="bg-black/40 backdrop-blur-sm rounded-full px-4 py-2">
            <h3 className="font-serif text-sm text-white/90 tracking-wider bg-gradient-to-r from-white/80 via-white to-white/80 [background-size:200%_auto] bg-clip-text text-transparent animate-[shimmer_1.5s_ease-out]">
              Edited Highlights
            </h3>
          </div>
        </div>
      )}

      {projectId === 'narrative-space' && (
        <button 
          onClick={handleFullscreen} 
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white transition-opacity duration-200 ${showNativeControls ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}
        </button>
      )}

      {hasAudio && (
        <>
          {isSpecialElevenLabsVideo ? (
            <div className="absolute bottom-4 right-4 z-10 flex items-center pointer-events-none">
              {/* Text appears on main video hover */}
              <div className={`mr-2 overflow-hidden transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
                <div className={`transition-transform duration-500 ease-out ${isHovering ? 'translate-y-0' : 'translate-y-full'}`}>
                  <span
                    className={`block font-serif text-xs whitespace-nowrap bg-gradient-to-r from-white/70 via-white to-white/70 [background-size:200%_auto] bg-clip-text text-transparent ${isHovering ? 'animate-[shimmer_0.8s_ease-out]' : ''}`}
                    aria-hidden="true"
                  >
                    ElevenLabs music
                  </span>
                </div>
              </div>
              {/* Custom button is only visible when native controls are NOT shown */}
              {!showNativeControls && (
                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  className="p-2 rounded-full bg-black/30 hover:bg-black/60 text-white transition-colors opacity-0 group-hover:opacity-100 pointer-events-auto"
                >
                  {isMuted ? <AudioOffIcon /> : <AudioOnIcon />}
                </button>
              )}
            </div>
          ) : (
            // Logic for regular mute button
            <>
            {!showNativeControls && (
              <button 
                onClick={toggleMute} 
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                className="absolute bottom-4 right-4 z-10 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {isMuted ? <AudioOffIcon /> : <AudioOnIcon />}
              </button>
            )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
