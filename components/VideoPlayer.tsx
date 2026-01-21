
import React, { useRef, useState } from 'react';
import { AudioOnIcon, AudioOffIcon } from './icons/AudioIcons';

interface VideoPlayerProps {
  src: string;
  aspectRatio: '16:9' | '9:16' | '4:3' | '1:1';
  autoplay?: boolean;
  loop?: boolean;
  showControls?: boolean;
  hasAudio?: boolean;
  projectId?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, aspectRatio, autoplay = false, loop = false, showControls = true, hasAudio = false, projectId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  // A video that autoplays should start muted. A video without audio is always muted.
  const [isMuted, setIsMuted] = useState(autoplay || !hasAudio);

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

  return (
    <div 
      className={`relative w-full mx-auto ${getAspectRatioClass()} group`}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain bg-black"
        src={src}
        autoPlay={autoplay}
        loop={loop}
        muted={isMuted}
        playsInline
        controls={showControls}
      />
      {/* Show custom mute button only if video has audio and native controls are hidden */}
      {hasAudio && !showControls && (
        <>
          {projectId === 'the-anomaly-zone' || projectId === 'split-continuity' ? (
            <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="group/audiocontrol flex items-center">
                <div className="mr-2 overflow-hidden opacity-0 group-hover/audiocontrol:opacity-100 transition-opacity duration-300">
                  <div className="transition-transform duration-500 ease-out translate-y-full group-hover/audiocontrol:translate-y-0">
                    <span
                      className="block font-serif text-xs whitespace-nowrap bg-gradient-to-r from-white/70 via-white to-white/70 [background-size:200%_auto] bg-clip-text text-transparent group-hover/audiocontrol:animate-[shimmer_0.8s_ease-out]"
                      aria-hidden="true"
                    >
                      ElevenLabs sound
                    </span>
                  </div>
                </div>
                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  className="p-2 rounded-full bg-black/30 hover:bg-black/60 text-white transition-colors"
                >
                  {isMuted ? <AudioOffIcon /> : <AudioOnIcon />}
                </button>
              </div>
            </div>
          ) : (
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
    </div>
  );
};

export default VideoPlayer;