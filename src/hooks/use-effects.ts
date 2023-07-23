/**
 * Source: usehook-ts
 */

import { EffectCallback, useEffect, DependencyList } from 'react';

import { useDidMount } from './use-did-mount';

/** Just modified version of useEffect that's executed only one time, at the mounting time. */
export const useEffectOnce = (effect: EffectCallback) => useEffect(effect, []);

/** Just modified version of useEffect that is skipping the first render. */
export function useUpdateEffect(effect: EffectCallback, deps?: DependencyList) {
  const didMount = useDidMount();

  useEffect(() => {
    if (didMount) return effect();
  }, deps);
}
