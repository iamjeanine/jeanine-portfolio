import { useNavigate } from 'react-router-dom';
import { flushSync } from 'react-dom';

export function useViewTransitionNavigate() {
  const navigate = useNavigate();

  return (to: string | number) => {
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
