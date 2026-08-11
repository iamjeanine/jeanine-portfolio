import React, { useEffect, useRef, useState } from 'react';
import { useMotionPaused } from './motionPreference';

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
  /**
   * Seconds into the clip to start (and loop back to). For a cover asset
   * that opens on a title card, this plays "a clean segment" per
   * REDESIGN-PLAN.md 5.4 without cropping or re-encoding the file. Bypasses
   * the native `loop` attribute (which restarts at 0) in favor of a manual
   * restart on `ended`, so the loop point is the offset, not the clip start.
   */
  startAt?: number;
  /**
   * Thumbnail scale, for a credits-row cover rather than a chapter frame.
   * Two changes from the default: the shadow drops from `0 40px 120px`,
   * tuned for a frame near the full width of the chapter, to something
   * proportional (that blur radius is wider than a ~200px thumbnail and
   * reads as a smudge, not depth); and the aspect ratio locks to whatever
   * `aspectRatio` was passed rather than snapping to the source's own once
   * metadata loads, so a row of differently-shaped source clips still reads
   * as one even grid of covers instead of a different height each.
   */
  compact?: boolean;
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
  startAt,
  compact = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [errored, setErrored] = useState(false);
  const [naturalRatio, setNaturalRatio] = useState<string | undefined>(aspectRatio);
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motionPaused = useMotionPaused();
  const shouldPlay = !reduced && !motionPaused;

  // Apply the site-wide pause to this video whenever the flag flips, and to
  // videos that mount while already paused (a later entry scrolled into
  // view after the visitor pressed pause).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (shouldPlay) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [shouldPlay, near]);

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
        // Compact ignores the detected natural ratio and stays at whatever
        // aspectRatio was passed in (square, for the two credits screens):
        // a thumbnail is a cropped cover, not a frame, so snapping to the
        // source's real shape once metadata loads would make each row a
        // different height instead of one even grid of covers.
        aspectRatio: (compact ? aspectRatio : naturalRatio) ?? '16 / 9',
        background: fallbackBackground,
        border: '1px solid rgba(242,237,226,0.14)',
        boxShadow: compact ? '0 8px 24px rgba(0,0,0,0.5)' : '0 40px 120px rgba(0,0,0,0.6)',
      }}
    >
      {near && !errored && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          aria-label={alt}
          muted
          loop={startAt === undefined}
          playsInline
          autoPlay={shouldPlay}
          preload="metadata"
          className="w-full h-full object-cover"
          style={{ backgroundColor: fallbackBackground }}
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            if (!compact && v.videoWidth && v.videoHeight) {
              setNaturalRatio(`${v.videoWidth} / ${v.videoHeight}`);
            }
            if (startAt !== undefined) {
              v.currentTime = startAt;
            }
          }}
          onEnded={(e) => {
            if (startAt === undefined) return;
            const v = e.currentTarget;
            v.currentTime = startAt;
            v.play().catch(() => {});
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
