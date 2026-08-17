
import React, { useRef, useState, useEffect } from 'react';
import { AudioOnIcon, AudioOffIcon } from './icons/AudioIcons';
import { FullscreenEnterIcon, FullscreenExitIcon } from './icons/NavigationIcons';

interface VideoPlayerProps {
  src: string;
  posterUrl?: string;
  glassPlateImageUrl?: string;
  aspectRatio: '16:9' | '9:16' | '4:3' | '1:1';
  autoplay?: boolean;
  loop?: boolean;
  showControls?: boolean;
  hasAudio?: boolean;
  projectId?: string;
  startUnmuted?: boolean;
  softLoop?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, posterUrl, glassPlateImageUrl, aspectRatio, autoplay = false, loop = false, showControls = false, hasAudio = false, projectId, startUnmuted = false, softLoop = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // On mobile, keep everything muted, no auto-unmuting
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  // Always start muted so autoplay works (browsers block unmuted autoplay).
  // If startUnmuted is requested, we unmute programmatically after play begins.
  const wantsUnmuted = startUnmuted && hasAudio && !isMobile;
  const [isMuted, setIsMuted] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [showHighlightOverlay, setShowHighlightOverlay] = useState(false);
  const overlayShownRef = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasLoadedFrame, setHasLoadedFrame] = useState(false);
  const silencedRef = useRef(false);
  // Soft loop veil: the interior film blooms out at its tail but opens
  // cold, so a looping playback jumps at the seam. Until the master gets
  // its opening bloom re-exported, this dips to dark over the last beat
  // and eases the fresh start in, on first play and on every loop.
  const [veiled, setVeiled] = useState(softLoop);
  useEffect(() => {
    if (!softLoop) return;
    const video = videoRef.current;
    if (!video) return;
    const onTime = () => {
      const d = video.duration;
      if (!d || !Number.isFinite(d)) return;
      if (video.currentTime > d - 0.45) setVeiled(true);
      else if (video.currentTime < d - 1) setVeiled(false);
    };
    video.addEventListener('timeupdate', onTime);
    return () => video.removeEventListener('timeupdate', onTime);
  }, [softLoop]);

  useEffect(() => {
    setHasLoadedFrame(false);
    // A CTA-click silence applies to the page it happened on, not to the
    // next project this same player instance renders after SPA navigation.
    silencedRef.current = false;
  }, [src, posterUrl]);

  // Opening an external prototype must not leave this page's soundtrack
  // playing underneath it. The action card dispatches this event on click;
  // the visitor can still unmute manually afterward.
  useEffect(() => {
    const handleSilence = () => {
      silencedRef.current = true;
      if (videoRef.current) videoRef.current.muted = true;
      setIsMuted(true);
    };
    window.addEventListener('portfolio:silence-videos', handleSilence);
    return () => window.removeEventListener('portfolio:silence-videos', handleSilence);
  }, []);

  // Unmute after autoplay succeeds (browsers require muted for autoplay).
  // Re-armed per src: this player instance survives SPA navigation between
  // project pages, so a once-consumed listener from the previous page must
  // not leave the next page's video permanently muted. If the new video is
  // already playing by the time this effect runs, unmute directly.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !wantsUnmuted) return;

    const handlePlaying = () => {
      // Small delay to ensure playback is stable before unmuting
      setTimeout(() => {
        if (video && !video.paused && !silencedRef.current) {
          video.muted = false;
          setIsMuted(false);
        }
      }, 100);
    };

    if (!video.paused && video.readyState >= 3) {
      handlePlaying();
      return;
    }
    video.addEventListener('playing', handlePlaying, { once: true });
    return () => video.removeEventListener('playing', handlePlaying);
  }, [wantsUnmuted, src]);

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

  // Touch devices have no hover state, so a demo with showControls enabled
  // must expose its native controls immediately instead of leaving play and
  // audio unreachable behind a desktop-only interaction.
  const showNativeControls = showControls && (isMobile || projectId === 'narrative-space' || isHovering);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full mx-auto ${getAspectRatioClass()} group overflow-hidden`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <video
        ref={videoRef}
        className={`w-full h-full bg-black ${projectId === 'narrative-space' || projectId === 'unstill' || projectId === 'mythos' ? 'object-contain' : 'object-cover'}`}
        src={src}
        poster={posterUrl}
        autoPlay={autoplay}
        loop={loop}
        muted={isMuted}
        playsInline
        controls={showNativeControls}
        controlsList="nodownload"
        preload="metadata"
        onLoadedData={() => setHasLoadedFrame(true)}
      />

      {softLoop && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background: '#100B08',
            opacity: veiled ? 1 : 0,
            transition: veiled
              ? 'opacity 320ms ease-in'
              : 'opacity 1100ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      )}

      {posterUrl && (
        <img
          src={posterUrl}
          alt=""
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 z-[1] h-full w-full transition-opacity duration-200 ${
            projectId === 'narrative-space' || projectId === 'unstill' || projectId === 'mythos'
              ? 'object-contain bg-black'
              : 'object-cover'
          } ${hasLoadedFrame ? 'opacity-0' : 'opacity-100'}`}
        />
      )}

      {glassPlateImageUrl && (
        <div 
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out pointer-events-none ${isHovering ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${glassPlateImageUrl})` }}
        >
          <div className="absolute inset-0 backdrop-blur-sm bg-black/10"></div>
        </div>
      )}
      
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

      {hasAudio && !showNativeControls && (
        <button
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          className="absolute bottom-4 right-4 z-10 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {isMuted ? <AudioOffIcon /> : <AudioOnIcon />}
        </button>
      )}
    </div>
  );
};

export default VideoPlayer;
