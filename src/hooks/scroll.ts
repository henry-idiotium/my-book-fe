import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useEffectOnce } from 'usehooks-ts';

/**
 * Provide scroll-abilities and states to a div Ref Object.
 * @remarks scroll back not support horizontal position yet.
 */
export function useScroll(
  ref: React.RefObject<HTMLDivElement>,
  _options?: UseScrollOptions,
) {
  const options: UseScrollOptions = {
    startAt: 'top',
    shouldScrollBackPerc: 0.3,
    ..._options,
  };

  const [position, setPosition] = useState<Location>({ x: 0, y: 0 });

  const shouldGoBack = useMemo(() => {
    const element = ref.current;
    const startAt = options.startAt;
    const excludedHeightPerc = options.shouldScrollBackPerc;
    if (!element || !startAt || !excludedHeightPerc) return false;

    const height = element.clientHeight;
    const scrollHeight = element.scrollHeight;

    /** Should go back when pass certain height. */
    const excludedHeight = Math.floor(height * excludedHeightPerc);
    /** Point of interest for the checks. */
    const checkPoint = startAt === 'bottom' ? height : 0;
    /** Scroll height matches with check point. */
    const relativeScrollHeight = scrollHeight - (startAt === 'top' ? height : 0);

    const heightPosition = Math.ceil(checkPoint + position.y);
    const comparedHeight = relativeScrollHeight - excludedHeight;

    return startAt === 'bottom'
      ? heightPosition <= comparedHeight
      : heightPosition >= comparedHeight;
  }, [options.startAt, position.y]);

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
        element.scrollTo({ ...args[0], behavior: args[0].behavior ?? options.behavior });
      }

      // xy only args
      else if (typeof args[0] === 'number' && typeof args[1] === 'number') {
        element.scrollTo(args[0], args[1]);
      }

      // default
      else throw new Error('Invalid arguments passed to scrollTo.');
    },
    [ref.current?.scrollHeight],
  );

  const scrollBack = useCallback(
    (behavior?: ScrollBehavior) => {
      const element = ref.current;
      const startAt = options.startAt;
      if (!element || !startAt) return;
      scrollTo({ top: getTop(element, startAt), behavior });
    },
    [ref.current?.scrollHeight],
  );
  useLayoutEffect(() => {
    handleScroll();
    ref.current?.addEventListener('scroll', handleScroll);
    return () => ref.current?.removeEventListener('scroll', handleScroll);
  }, []);

  useEffectOnce(() => {
    if (!ref.current || !options.startAt) return;

    ref.current.scrollTo({
      top: getTop(ref.current, options.startAt),
      behavior: 'instant',
    });
  });

  return { position, shouldGoBack, scrollTo, scrollBack };
}

function getTop(element: HTMLDivElement, startAt: VerticalOption) {
  return startAt === 'bottom' ? element.scrollHeight : 0;
}

type ScrollToArgs = [number, number] | [ScrollToOptions];
type Location = { x: number; y: number };

type VerticalOption = 'top' | 'bottom';
type UseScrollOptions = {
  startAt?: VerticalOption;
  shouldScrollBackPerc?: number;
  behavior?: ScrollBehavior;
};
