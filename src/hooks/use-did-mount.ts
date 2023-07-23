import { useState } from 'react';

import { useEffectOnce } from './use-effects';

export function useDidMount(): boolean {
  const [didMount, setDidMount] = useState(false);
  useEffectOnce(() => setDidMount(true));
  return didMount;
}
