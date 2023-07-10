import { useMemo } from 'react';
import { useBoolean } from 'usehooks-ts';

export function useMemoWithInitial<T>(
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
