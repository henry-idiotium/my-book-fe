import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useEffectOnce } from 'usehooks-ts';

import deepCompareMemo from '../deep-compare-memorize';

import { getDefaultOptions, getTop } from './helpers';
import { ScrollLocation, ScrollToArgs, UseScrollOptions } from './types';

// todo: (refactor) rename and add comments for better readability

/**
 * Provide scroll-abilities and states to a div Ref Object.
 * @remarks scroll back not support horizontal position yet.
 */
export function useScroll(ref: React.RefObject<HTMLDivElement>, _options?: UseScrollOptions) {
  const options = useMemo(() => getDefaultOptions(_options), deepCompareMemo(_options));

  const [position, setPosition] = useState<ScrollLocation>({ x: 0, y: 0 });

  const getHeightMeta = useCallback(
    (oppositeType: boolean, excludePerc?: number) => {
      const startAt = options.startAt;
      const element = ref.current;
      if (!element || !startAt || !excludePerc) return false;

      const height = element.clientHeight;
      const scrollHeight = element.scrollHeight;
      const startAtEnd = startAt === (oppositeType ? 'top' : 'bottom');

      /** Point of interest for the checks. */
      const checkLine = startAtEnd ? height : 0;
      /** Should go back when pass certain height. */
      const excludeRegion = startAtEnd ? scrollHeight : 0;
      const hitRegion = excludePerc <= 1 ? Math.floor(height * excludePerc) : excludePerc;

      const heightPosition = Math.ceil(checkLine + position.y);
      const comparedHeight = Math.abs(hitRegion - excludeRegion);

      return { heightPosition, comparedHeight, startAtEnd };
    },
    [options.startAt, position.y],
  );

  const shouldGoBack = useMemo(() => {
    const viewHeightPerc = options.viewHeightPerc;
    const heightMeta = getHeightMeta(false, viewHeightPerc);
    if (!viewHeightPerc || !heightMeta) return false;

    const { comparedHeight, heightPosition, startAtEnd } = heightMeta;

    return startAtEnd ? heightPosition <= comparedHeight : heightPosition >= comparedHeight;
  }, [options.startAt, getHeightMeta]);

  const isAtEnds = useMemo(() => {
    const heightMeta = getHeightMeta(false, options.endAnchorHeight);
    if (!heightMeta) return false;

    const { comparedHeight, heightPosition, startAtEnd } = heightMeta;

    return startAtEnd ? heightPosition >= comparedHeight : heightPosition <= comparedHeight;
  }, [options.startAt, getHeightMeta]);

  const isAtOppositeEnds = useMemo(() => {
    const heightMeta = getHeightMeta(true, options.endAnchorHeight);
    if (!heightMeta) return false;

    const { comparedHeight, heightPosition, startAtEnd } = heightMeta;

    return startAtEnd ? heightPosition >= comparedHeight : heightPosition <= comparedHeight;
  }, [options.startAt, getHeightMeta]);

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

  // handle scroll listener
  useLayoutEffect(() => {
    handleScroll();
    ref.current?.addEventListener('scroll', handleScroll);
    return () => ref.current?.removeEventListener('scroll', handleScroll);
  }, []);

  // init position
  useEffectOnce(() => {
    if (!ref.current || !options.startAt) return;

    ref.current.scrollTo({
      top: getTop(ref.current, options.startAt),
      behavior: 'instant',
    });
  });

  return [{ position, shouldGoBack, isAtEnds, isAtOppositeEnds }, scrollBack, scrollTo] as const;
}
