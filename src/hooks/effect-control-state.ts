import { dequal as deepEqual } from 'dequal/lite';
import { useRef, useState } from 'react';

export function useEffectControlState<S>(initialState: S | (() => S)) {
  const [state, setStateNoEffect] = useState<S>(initialState);
  const ref = useRef<S>();
  const signalRef = useRef(0);

  function setStateEffect(value: React.SetStateAction<S>) {
    setStateNoEffect(value);

    if (!deepEqual(state, ref.current)) {
      ref.current = state;
      signalRef.current += 1;
    }
  }

  return [state, signalRef.current, setStateEffect, setStateNoEffect] as const;
}

export default useEffectControlState;
