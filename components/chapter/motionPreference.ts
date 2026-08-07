import { useSyncExternalStore } from 'react';

/**
 * A single site-wide "is video motion paused" flag.
 *
 * WCAG 2.2.2 (Pause, Stop, Hide) requires a mechanism to pause motion that
 * starts automatically, runs more than five seconds, and sits alongside
 * other content. The Labs chapter's cover videos are exactly that: nine
 * autoplaying, indefinitely looping frames beside body copy. Before this,
 * a visitor who had not set an OS-level reduced-motion preference had no
 * way to stop them, which the Phase 2 critique flagged.
 *
 * Deliberately a tiny external store rather than React context: LazyVideo
 * is composed by two different pages (the standalone Labs preview and the
 * Spine), and a store needs no provider at either call site, so neither
 * page can accidentally render an unprovided subtree.
 */
let paused = false;
const listeners = new Set<() => void>();

export function isMotionPaused() {
  return paused;
}

export function setMotionPaused(next: boolean) {
  if (paused === next) return;
  paused = next;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Server snapshot is always false: nothing is playing before hydration. */
export function useMotionPaused() {
  return useSyncExternalStore(subscribe, isMotionPaused, () => false);
}
