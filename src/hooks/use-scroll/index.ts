import { useCallback, useLayoutEffect, useMemo, useState } from 'react';

import { useBoolean } from '../use-boolean';
import deepCompareMemo from '../use-deep-compare-memorize';
import { useDidMount } from '../use-did-mount';
import { useEffectOnce } from '../use-effects';

import { getDefaultOptions, getTop as getEnds } from './helpers';
import { ScrollLocation, ScrollToArgs, UseScrollOptions } from './types';

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

      const checkLine = startAtEnd ? height : 0;
      const excludeRegion = startAtEnd ? scrollHeight : 0;
      const hitRegion = excludePerc <= 1 ? Math.floor(height * excludePerc) : excludePerc;

      const heightPosition = Math.ceil(checkLine + position.y);
      const comparedHeight = Math.abs(hitRegion - excludeRegion);

      return { heightPosition, comparedHeight, startAtEnd };
    },
    [position.y],
  );

  const shouldGoBack = useMemo(() => {
    const viewHeightPerc = options.viewHeightPerc;
    const heightMeta = getHeightMeta(false, viewHeightPerc);
    if (!viewHeightPerc || !heightMeta) return false;

    const { comparedHeight, heightPosition, startAtEnd } = heightMeta;

    return startAtEnd ? heightPosition <= comparedHeight : heightPosition >= comparedHeight;
  }, [getHeightMeta]);

  const isAtEnds = useMemo(() => {
    const heightMeta = getHeightMeta(false, options.endAnchorHeight);
    if (!heightMeta) return false;

    const { comparedHeight, heightPosition, startAtEnd } = heightMeta;

    return startAtEnd ? heightPosition >= comparedHeight : heightPosition <= comparedHeight;
  }, [getHeightMeta]);

  const isAtOppositeEnds = useMemo(() => {
    const heightMeta = getHeightMeta(true, options.endAnchorHeight);
    if (!heightMeta) return false;

    const { comparedHeight, heightPosition, startAtEnd } = heightMeta;

    return startAtEnd ? heightPosition >= comparedHeight : heightPosition <= comparedHeight;
  }, [getHeightMeta]);

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
      if (!ref.current || !options.startAt) return;

      scrollTo({ top: getEnds(ref.current, options.startAt), behavior });
    },
    [scrollTo],
  );

  const handleScroll = useCallback(() => {
    const element = ref.current;
    if (!element) return;

    const x = Math.abs(element.scrollLeft);
    const y = Math.abs(element.scrollTop);
    setPosition({ x, y });
  }, [ref.current?.scrollTop, ref.current?.scrollLeft]);

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
      top: getEnds(ref.current, options.startAt),
      behavior: 'instant',
    });
  });

  return [{ position, shouldGoBack, isAtEnds, isAtOppositeEnds }, scrollBack, scrollTo] as const;
}

export function useScrollAlt(ref: React.RefObject<HTMLDivElement>, _options?: UseScrollOptions) {
  const didMount = useDidMount();

  const options = useMemo(() => getDefaultOptions(_options), deepCompareMemo(_options));

  const shouldGoBack = useBoolean(false);
  const isAtEnds = useBoolean(false);
  const isAtOppositeEnds = useBoolean(false);

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
      if (!ref.current || !options.startAt) return;

      scrollTo({ top: getEnds(ref.current, options.startAt), behavior });
    },
    [scrollTo],
  );

  /*   const handleScroll = useCallback(() => {
    const element = ref.current;
    const startAt = options.startAt;
    const viewHeightPerc = options.viewHeightPerc;
    const endAnchorHeight = options.endAnchorHeight;
    if (!element || !startAt || !endAnchorHeight || !viewHeightPerc) return;

    if (startAt === 'top') {
      shouldGoBack.setValue(element.scrollTop >= element.clientHeight * viewHeightPerc);
      isAtEnds.setValue(element.scrollTop <= endAnchorHeight);
      isAtOppositeEnds.setValue(
        element.scrollTop >= element.scrollHeight - (element.clientHeight + endAnchorHeight),
      );
    } else {
      if (!didMount) return; // avoid first computation

      isAtOppositeEnds.setValue(element.scrollTop <= endAnchorHeight);
      isAtEnds.setValue(
        element.scrollTop >= element.scrollHeight - (element.clientHeight + endAnchorHeight),
      );
      shouldGoBack.setValue(
        element.scrollTop <= element.scrollHeight - element.clientHeight * viewHeightPerc,
      );
    }
  }, [ref.current, didMount]); */

  // handle scroll listener
  useLayoutEffect(() => {
    const handleScroll = () => {
      const element = ref.current;
      const startAt = options.startAt;
      const viewHeightPerc = options.viewHeightPerc;
      const endAnchorHeight = options.endAnchorHeight;
      if (!element || !startAt || !endAnchorHeight || !viewHeightPerc) return;

      if (startAt === 'top') {
        shouldGoBack.setValue(element.scrollTop >= element.clientHeight * viewHeightPerc);
        isAtEnds.setValue(element.scrollTop <= endAnchorHeight);
        isAtOppositeEnds.setValue(
          element.scrollTop >= element.scrollHeight - (element.clientHeight + endAnchorHeight),
        );
      } else {
        if (!didMount) return; // avoid first computation

        isAtOppositeEnds.setValue(element.scrollTop <= endAnchorHeight);
        isAtEnds.setValue(
          element.scrollTop >= element.scrollHeight - (element.clientHeight + endAnchorHeight),
        );
        shouldGoBack.setValue(
          element.scrollTop <= element.scrollHeight - element.clientHeight * viewHeightPerc,
        );
      }
    };

    ref.current?.removeEventListener('scroll', handleScroll); // remove existing one

    handleScroll();
    ref.current?.addEventListener('scroll', handleScroll);
    return () => ref.current?.removeEventListener('scroll', handleScroll);
  }, [didMount]);

  // init position
  useEffectOnce(() => {
    if (!ref.current || !options.startAt) return;

    scrollBack('instant');
  });

  return [
    {
      shouldGoBack: shouldGoBack.value,
      isAtOppositeEnds: isAtOppositeEnds.value,
      isAtEnds: isAtEnds.value,
    },
    scrollBack,
    scrollTo,
  ] as const;
}
