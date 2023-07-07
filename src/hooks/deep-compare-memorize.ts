import { dequal as deepEqual } from 'dequal/lite';
import { useRef } from 'react';

/**
 * A hook that uses deep comparison to memoize the input `value`.
 * @remarks Useful for optimizing component performance by avoiding unnecessary
 * re-renders in response to changes in complex data or expensive computations.
 */
export function useDeepCompareMemoize<T>(value: T) {
  const ref = useRef<T>();
  const signalRef = useRef(0);

  if (!deepEqual(value, ref.current)) {
    ref.current = value;
    signalRef.current += 1;
  }

  return [signalRef.current];
}
export default useDeepCompareMemoize;
