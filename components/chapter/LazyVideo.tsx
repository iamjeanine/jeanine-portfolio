import React, { useEffect, useRef, useState } from 'react';

/**
 * Mounts its video only when near the viewport; plays muted and looping
 * on arrival. On load failure, renders a title-on-field placeholder
 * instead of an invisible black box on the Labs dark ground.
 *
 * Frames are aspect-native (REDESIGN-PLAN.md 5.4): the ratio is read from
 * the asset's own dimensions once metadata loads, rather than forcing 16:9.
 * On a dark ground a letterboxed bar is invisible, so a forced ratio makes
 * the media boundary vanish. `aspectRatio` can pin a known ratio up front
 * to avoid the small reflow when the true one arrives.
 *
 * The hairline border marks every frame edge so frames read as objects on
 * the ground. Shadow is depth only, never colored.
 */
export const LazyVideo: React.FC<{
  src: string;
  poster?: string;
  alt: string;
  fallbackTitle?: React.ReactNode;
  fallbackColor?: string;
  fallbackBackground?: string;
  className?: string;
  aspectRatio?: string;
  rootMargin?: string;
}> = ({
  src,
  poster,
  alt,
  fallbackTitle,
  fallbackColor = 'var(--cream-ink)',
  fallbackBackground = '#17100B',
  className = '',
  aspectRatio,
  rootMargin = '400px',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [errored, setErrored] = useState(false);
  const [naturalRatio, setNaturalRatio] = useState<string | undefined>(aspectRatio);
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
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio: naturalRatio ?? '16 / 9',
        background: fallbackBackground,
        border: '1px solid rgba(242,237,226,0.14)',
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
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            if (v.videoWidth && v.videoHeight) {
              setNaturalRatio(`${v.videoWidth} / ${v.videoHeight}`);
            }
          }}
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
