import { useMemo } from 'react';
import { useBoolean } from 'usehooks-ts';

export function useInitialMemo<T>(
  factory: () => T,
  initialValue: T,
  deps: React.DependencyList | undefined,
): T {
  const initialIsSettled = useBoolean(false);

  const value = useMemo(() => {
    if (!initialIsSettled.value) {
      initialIsSettled.setTrue();
      return initialValue;
    }

    return factory();
  }, deps);

  return value;
}

export default useInitialMemo;
