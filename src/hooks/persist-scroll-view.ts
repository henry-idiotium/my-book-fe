import React, { useCallback, useState } from 'react';

export function usePersistScrollView(ref: React.RefObject<HTMLDivElement>, _options?: Options) {
  const options = { index: 0, ..._options } satisfies Options;

  const [prevItemInfo, setPrevItemInfo] = useState<PreviousItemInfo>({
    offset: null,
    index: null,
  });

  const beforePrepend = useCallback(() => {
    const element = ref.current;
    if (!element) return;

    const elementChildren = Array.from(element.children);
    const firstElement = elementChildren.at(0 + options.index) as HTMLDivElement;

    if (firstElement) {
      setPrevItemInfo({
        offset: firstElement.offsetTop,
        index: -elementChildren.length,
      });
    }
  }, [ref.current?.children.length]);

  const afterPrepend = useCallback(() => {
    const element = ref.current;
    const prevOffset = prevItemInfo.offset;
    const prevIndex = prevItemInfo.index;
    if (!element || !prevOffset || !prevIndex) return;

    const firstElement = Array.from(element.children).at(prevIndex + options.index);
    if (!(firstElement instanceof HTMLDivElement)) return;

    element.scrollTop = firstElement.offsetTop - prevOffset;
  }, [prevItemInfo, ref.current?.children.length]);

  return { beforePrepend, afterPrepend };
}

type PreviousItemInfo = {
  offset: number | null;
  index: number | null;
};

type Options = Partial<{
  index: number;
}>;
