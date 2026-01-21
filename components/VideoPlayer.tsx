
import React, { useRef, useState } from 'react';
import { AudioOnIcon, AudioOffIcon } from './icons/AudioIcons';

interface VideoPlayerProps {
  src: string;
  aspectRatio: '16:9' | '9:16' | '4:3' | '1:1';
  autoplay?: boolean;
  loop?: boolean;
  showControls?: boolean;
  hasAudio?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, aspectRatio, autoplay = false, loop = false, showControls = true, hasAudio = false }) => {
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