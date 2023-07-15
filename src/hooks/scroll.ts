import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useBoolean, useEffectOnce } from 'usehooks-ts';

export function useScroll(
  ref: React.RefObject<HTMLDivElement>,
  options?: Options,
) {
  const [position, setPosition] = useState<Location>({ x: null, y: null });

  const handleScroll = useCallback(() => {
    const element = ref.current;
    if (!element) return;

    const x = Math.abs(element.scrollLeft);
    const y = Math.abs(element.scrollTop);
    setPosition({ x, y });
  }, [ref]);

  const scrollTo = useCallback(
    (...args: ScrollToArgs) => {
      const element = ref.current;
      if (!element) return;

      // full object args
      if (typeof args[0] === 'object') {
        element.scrollTo(args[0]);
      }

      // xy only args
      else if (typeof args[0] === 'number' && typeof args[1] === 'number') {
        element.scrollTo(args[0], args[1]);
      }

      // default
      else throw new Error('Invalid arguments passed to scrollTo.');
    },
    [ref],
  );

  const scrollBack = useCallback(
    (behavior?: ScrollBehavior) => {
      const element = ref.current;
      const type = options?.endsIndication?.startAt;
      if (!element || !type) return;

      const top = type === 'bottom' ? element.scrollHeight : 0;
      element.scrollTo({ left: 0, top, behavior });
    },
    [ref],
  );

  const shouldGoBack = useMemo(() => {
    const element = ref.current;
    const endType = options?.endsIndication?.startAt;

    if (!element || !endType) return;
    const pinPoint = endType === 'bottom' ? element.clientHeight : 0;
    const heightPosition = Math.abs((position.y ?? 0) + pinPoint);
    const excludedHeight = Math.abs(element.clientHeight * 0.2);
    const comparisionHeight = element.scrollHeight - excludedHeight;

    return endType === 'bottom'
      ? heightPosition <= comparisionHeight
      : heightPosition >= comparisionHeight;
  }, [position.y]);

  useLayoutEffect(() => {
    handleScroll();

    const element = ref.current;
    if (!element) return;

    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, []);

  useEffectOnce(() => {
    if (ref.current && options?.endsIndication?.startAt === 'bottom') {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  });

  return { position, shouldGoBack, scrollTo, scrollBack };
}

type VerticalOption = 'top' | 'bottom';

type ScrollToArgs = [number, number] | [ScrollToOptions];

type Location = { x: number | null; y: number | null };

type Options = {
  endsIndication?: {
    startAt: VerticalOption;
  };
};
