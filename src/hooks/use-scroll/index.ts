import { useCallback, useLayoutEffect } from 'react';

import { useBoolean } from '../use-boolean';
import { useDidMount } from '../use-did-mount';
import { useEffectOnce } from '../use-effects';

import { getDefaultOptions, getTop as getEnds } from './helpers';
import { ScrollToArgs, UseScrollOptions as Options } from './types';

/**
 * Provide scroll-abilities and states to a div Ref Object.
 * @remarks scroll back not support horizontal position yet.
 */
export function useScroll(ref: React.RefObject<HTMLDivElement>, _options?: Options): Returned {
  const options = getDefaultOptions(_options);

  const didMount = useDidMount();

  const shouldGoBack = useBoolean(false);
  const isAtOppositeEnds = useBoolean(false);
  const isAtEnds = useBoolean(false);

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
  }, [ref.current]);

  // handle scroll listener
  useLayoutEffect(() => {
    handleScroll();
    ref.current?.addEventListener('scroll', handleScroll);
    return () => ref.current?.removeEventListener('scroll', handleScroll);
  }, [didMount]);

  // init position
  useEffectOnce(() => {
    if (!ref.current || !options.startAt) return;

    scrollBack('instant');
  });

  return [shouldGoBack.value, isAtOppositeEnds.value, isAtEnds.value, scrollBack, scrollTo];
}

type Returned = [
  shouldGoBack: boolean,
  isAtOppositeEnds: boolean,
  isAtEnds: boolean,
  scrollBack: (behavior?: ScrollBehavior) => void,
  scrollTo: (...arg: ScrollToArgs) => void,
];
