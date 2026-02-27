import { useNavigate } from 'react-router-dom';
import { flushSync } from 'react-dom';

export function useViewTransitionNavigate() {
  const navigate = useNavigate();

  return (to: string) => {
    if (!(document as any).startViewTransition) {
      navigate(to);
      return;
    }

    (document as any).startViewTransition(() => {
      flushSync(() => {
        navigate(to);
      });
    });
  };
}
