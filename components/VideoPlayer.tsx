
import React, { useRef } from 'react';

interface VideoPlayerProps {
  src: string;
  aspectRatio: '16:9' | '9:16' | '4:3' | '1:1';
  autoplay?: boolean;
  loop?: boolean;
  showControls?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, aspectRatio, autoplay = false, loop = false, showControls = true }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '16:9': return 'aspect-video';
      case '9:16': return 'aspect-[9/16]';
      case '4:3': return 'aspect-[4/3]';
      case '1:1': return 'aspect-square';
      default: return 'aspect-video';
    }
  };

  return (
    <div 
      className={`relative w-full mx-auto ${getAspectRatioClass()}`}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain bg-black"
        src={src}
        autoPlay={autoplay}
        loop={loop}
        muted={autoplay}
        playsInline
        controls={showControls}
      />
    </div>
  );
};

export default VideoPlayer;