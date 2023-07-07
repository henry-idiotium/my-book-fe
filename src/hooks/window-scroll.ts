import { useCallback, useLayoutEffect, useState } from 'react';
import { z } from 'zod';

import { getZodDefault } from '@/utils';

type ScrollToArgs = [number, number] | [ScrollToOptions];
type Location = z.infer<typeof locationZod>;
const locationZod = z.object({
  x: z.number().nullable(),
  y: z.number().nullable(),
});

export function useWindowScroll() {
  const [state, setState] = useState<Location>(getZodDefault(locationZod));

  const scrollTo = useCallback((...args: ScrollToArgs) => {
    if (typeof args[0] === 'object') {
      window.scrollTo(args[0]);
    } else if (typeof args[0] === 'number' && typeof args[1] === 'number') {
      window.scrollTo(args[0], args[1]);
    } else {
      throw new Error(
        `Invalid arguments passed to scrollTo. See here for more info. https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo`,
      );
    }
  }, []);

  useLayoutEffect(() => {
    const handleScroll = () => {
      setState({ x: window.scrollX, y: window.scrollY });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return [state, scrollTo];
}
