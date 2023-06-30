import { useEffect, useState } from 'react';

type Option = {
  start?: 'top' | 'bottom';
  passPerc?: number;
};

export function useScrollToEnds(
  ref?: React.RefObject<HTMLDivElement>,
  options?: Option
): [boolean, () => void] {
  const { start = 'top', passPerc = 0.5 } = options ?? {};
  const [shouldScrollBack, setShouldScrollBack] = useState(false);

  useEffect(() => {
    const element = ref?.current;
    if (!element) return;

    element.addEventListener('scroll', handleScrollChange(element));

    return () => {
      element.removeEventListener('scroll', handleScrollChange(element));
    };
  }, []);

  function handleScrollChange(element: HTMLDivElement) {
    return () => {
      const { scrollTop, clientHeight } = element;

      const passPosition = Math.abs(clientHeight * passPerc);
      const isScrolledPast =
        start === 'top' ? scrollTop > passPosition : scrollTop < passPosition;

      setShouldScrollBack(isScrolledPast);
    };
  }

  function scrollBack() {
    const element = ref?.current;
    if (!element) return;

    const positionToScrollTo = start === 'top' ? 0 : element.clientHeight;

    element.scrollTo({ top: positionToScrollTo, behavior: 'smooth' });
  }

  return [shouldScrollBack, scrollBack];
}

export default useScrollToEnds;
