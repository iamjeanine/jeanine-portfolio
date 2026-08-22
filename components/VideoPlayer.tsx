
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
  volume?: number;
  projectId?: string;
  startUnmuted?: boolean;
  softLoop?: boolean;
  /** Seconds to skip into the clip before it starts (and, if looping,
   *  before it restarts on each cycle) — for a clip that opens on
   *  something the source recording can't cut, like a stale title card. */
  startTime?: number;
}

// Ramps volume from 0 up to `target` instead of snapping to full volume on
// unmute, which read as an abrupt pop. `target` defaults to 1; pages whose
// masters run hot pass a lower cap so browsing page to page stays level
// (2026-08-21 loudness pass). Cancelable so a fresh fade (or an unmount)
// doesn't fight a previous one still in flight.
const fadeVolumeIn = (video: HTMLVideoElement, frameRef: React.MutableRefObject<number | null>, ms = 700, target = 1) => {
  if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  video.volume = 0;
  const start = performance.now();
  const step = (now: number) => {
    // now can land fractionally before `start` on the very first frame
    // (observed in production right after navigation) — an unclamped
    // lower bound sends volume briefly negative, which throws and kills
    // the rAF chain, leaving the video stuck silent instead of faded in.
    const t = Math.min(1, Math.max(0, (now - start) / ms));
    video.volume = t * target;
    frameRef.current = t < 1 ? requestAnimationFrame(step) : null;
  };
  frameRef.current = requestAnimationFrame(step);
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, posterUrl, glassPlateImageUrl, aspectRatio, autoplay = false, loop = false, showControls = false, hasAudio = false, volume = 1, projectId, startUnmuted = false, softLoop = false, startTime = 0 }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fadeFrameRef = useRef<number | null>(null);
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
    if (fadeFrameRef.current !== null) {
      cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }
  }, [src, posterUrl]);

  // Skip into the clip rather than opening on frame zero. Native `loop`
  // restarts at 0 regardless, so a looping clip with a startTime handles
  // its own repeat instead, seeking back to startTime rather than 0.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !startTime) return;

    const seekPastStart = () => {
      if (video.currentTime < startTime) video.currentTime = startTime;
    };
    if (video.readyState >= 1) seekPastStart();
    else video.addEventListener('loadedmetadata', seekPastStart, { once: true });

    const handleEnded = () => {
      if (!loop) return;
      video.currentTime = startTime;
      video.play().catch(() => {});
    };
    if (loop) video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', seekPastStart);
      if (loop) video.removeEventListener('ended', handleEnded);
    };
  }, [startTime, loop, src]);

  // Opening an external prototype must not leave this page's soundtrack
  // playing underneath it. The action card dispatches this event on click;
  // the visitor can still unmute manually afterward.
  useEffect(() => {
    const handleSilence = () => {
      silencedRef.current = true;
      if (fadeFrameRef.current !== null) {
        cancelAnimationFrame(fadeFrameRef.current);
        fadeFrameRef.current = null;
      }
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
          fadeVolumeIn(video, fadeFrameRef, 700, volume);
          setIsMuted(false);
          // First-visit fallback: browsers with no engagement history for
          // this site pause playback the moment it is unmuted without a
          // gesture, which froze every sound-on hero on a recruiter's
          // first visit (2026-08-20 audit P0). Detect the pause and fall
          // back to muted, moving pictures with the unmute button offered.
          setTimeout(() => {
            if (video && video.paused && !silencedRef.current) {
              video.muted = true;
              setIsMuted(true);
              video.play().catch(() => {});
            }
          }, 180);
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
    setIsMuted(prev => {
      const next = !prev;
      if (!next && videoRef.current) {
        fadeVolumeIn(videoRef.current, fadeFrameRef, 700, volume);
        // Unmuting is a real gesture, so playback is allowed even where
        // autoplay-with-sound was refused; resume if the browser paused it.
        if (videoRef.current.paused) videoRef.current.play().catch(() => {});
      }
      return next;
    });
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
        loop={loop && !startTime}
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
          aria-label={isMuted ? 'Turn sound on' : 'Turn sound off'}
          className={`absolute bottom-4 right-4 z-10 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white transition-opacity ${
            // While muted (including the first-visit fallback) the sound
            // affordance must be discoverable without hover; once sound is
            // on it recedes to the original hover-only behavior.
            isMuted ? 'opacity-80' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          {isMuted ? <AudioOffIcon /> : <AudioOnIcon />}
        </button>
      )}
    </div>
  );
};

export default VideoPlayer;
