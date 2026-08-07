import React, { useEffect, useRef, useState } from 'react';

/**
 * Mounts its video only when near the viewport; plays muted and looping
 * on arrival. On load failure, renders a title-on-field placeholder
 * instead of an invisible black box on the Labs dark ground.
 */
export const LazyVideo: React.FC<{
  src: string;
  poster?: string;
  alt: string;
  fallbackTitle?: React.ReactNode;
  fallbackColor?: string;
  fallbackBackground?: string;
  className?: string;
  rootMargin?: string;
}> = ({
  src,
  poster,
  alt,
  fallbackTitle,
  fallbackColor = '#F2EDE2',
  fallbackBackground = '#17100B',
  className = 'relative aspect-video overflow-hidden',
  rootMargin = '400px',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [errored, setErrored] = useState(false);
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        background: fallbackBackground,
        boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
      }}
    >
      {near && !errored && (
        <video
          src={src}
          poster={poster}
          aria-label={alt}
          muted
          loop
          playsInline
          autoPlay={!reduced}
          preload="metadata"
          className="w-full h-full object-cover"
          onError={() => setErrored(true)}
        />
      )}
      {near && errored && fallbackTitle && (
        <div
          className="w-full h-full flex items-center justify-center text-center px-6"
          style={{ color: fallbackColor }}
        >
          <span className="chapter-label">{fallbackTitle}</span>
        </div>
      )}
    </div>
  );
};
