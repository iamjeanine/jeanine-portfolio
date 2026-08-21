import { useNavigate } from 'react-router-dom';
import { flushSync } from 'react-dom';

/**
 * Direction along the spine, for route transitions that should read as
 * movement through the book rather than a placeless crossfade: forward is
 * deeper in (cover -> chapter -> project, 01 -> 02 -> 03), back is toward
 * the cover. The value lands on <html data-vt-dir="..."> just before the
 * view transition starts; index.html's ::view-transition rules key on it
 * to pick the slide direction. It self-clears after the transition window
 * so a later direction-less navigation falls back to the plain crossfade
 * instead of inheriting a stale slide.
 */
export type SpineDirection = 'forward' | 'back';

let clearDirTimer: number | undefined;

export const setSpineDirection = (dir: SpineDirection) => {
  const root = document.documentElement;
  root.dataset.vtDir = dir;
  window.clearTimeout(clearDirTimer);
  clearDirTimer = window.setTimeout(() => {
    delete root.dataset.vtDir;
  }, 600);
};

export function useViewTransitionNavigate() {
  const navigate = useNavigate();

  return (to: string | number, dir?: SpineDirection) => {
    if (dir) setSpineDirection(dir);

    if (!(document as any).startViewTransition) {
      navigate(to as any);
      return;
    }

    (document as any).startViewTransition(() => {
      flushSync(() => {
        navigate(to as any);
      });
    });
  };
}

/**
 * Click handler for a <Link> that should transition directionally along
 * the spine. React Router v7's own `viewTransition` prop never calls
 * document.startViewTransition under HashRouter (verified 2026-08-21:
 * zero invocations on click), so the transition is driven here instead:
 * modified clicks (cmd/ctrl/shift/alt, middle button) fall through to
 * the browser's normal open-in-new-tab behavior, everything else
 * prevents the default navigation and re-runs it inside a view
 * transition with the direction stamped. Keep the <Link to> as-is; it
 * still provides the real href.
 */
export function useSpineNavigate() {
  const vtNavigate = useViewTransitionNavigate();

  return (
    e: { defaultPrevented: boolean; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean; button: number; preventDefault: () => void },
    to: string,
    dir: SpineDirection
  ) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    vtNavigate(to, dir);
  };
}
