
import React, { useRef, useState, useEffect } from 'react';
import { AudioOnIcon, AudioOffIcon } from './icons/AudioIcons';
import { PlayIcon } from './icons/NavigationIcons';

interface VideoPlayerProps {
  src: string;
  aspectRatio: '16:9' | '9:16' | '4:3' | '1:1';
  autoplay?: boolean;
  loop?: boolean;
  showControls?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, aspectRatio, autoplay = false, loop = false, showControls = true }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(autoplay);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from toggling play/pause
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const togglePlay = () => {
    if (!showControls) return;

    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onPause);

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onPause);
    };
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

  return (
    <div 
      className={`relative w-full mx-auto ${getAspectRatioClass()} ${showControls ? 'group cursor-pointer' : ''}`}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain bg-black"
        src={src}
        autoPlay={autoplay}
        loop={loop}
        muted={isMuted}
        playsInline
        controls={false}
      />
       {showControls && !isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 pointer-events-none transition-opacity duration-300 group-hover:bg-opacity-30">
            <PlayIcon />
        </div>
      )}
      {showControls && (
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={toggleMute} className="text-white p-2 rounded-full bg-black/30 hover:bg-black/60 transition-colors">
            {isMuted ? <AudioOffIcon /> : <AudioOnIcon />}
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;