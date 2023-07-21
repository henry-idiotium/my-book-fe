import { useEffect, useRef, useState } from 'react';
import { useUpdateEffect } from 'usehooks-ts';

import { useScroll } from '@/hooks';
import { usePersistScrollView } from '@/hooks/persist-scroll-view';

const initialItems: { key: number }[] = [
  { key: 1 },
  { key: 2 },
  { key: 3 },
  { key: 4 },
  { key: 5 },
  { key: 6 },
  { key: 7 },
  { key: 8 },
  { key: 9 },
  { key: 10 },
];

export function Home() {
  const [items, setItems] = useState(initialItems);

  const containerRef = useRef<HTMLDivElement>(null);

  const { afterPrepend, beforePrepend } = usePersistScrollView(containerRef);

  const [{ shouldGoBack, isAtEnds, isAtOppositeEnds }, scrollBack] = useScroll(containerRef, {
    viewHeightPerc: 0.4,
    behavior: 'smooth',
    startAt: 'bottom',
  });

  useEffect(() => {
    if (!isAtOppositeEnds) return;
    beforePrepend();
    prepend();
  }, [isAtOppositeEnds]);

  useUpdateEffect(() => {
    afterPrepend();
  }, [items.length]);

  const reset = () => setItems(initialItems);

  function prepend() {
    const startIndex = items.length;
    const newItems = Array.from(Array(10)).map((_, index) => ({ key: startIndex + index + 1 }));

    setItems((prev) => [...newItems, ...prev]);
  }

  return (
    <div className="min-h-screen">
      <div className="flex h-20 w-full justify-end">
        {JSON.stringify({ isAtEnds, isAtOppositeEnds })}
      </div>

      <div className="flex h-20 w-full justify-end">
        {shouldGoBack ? <button onClick={() => scrollBack()}>back</button> : null}
      </div>

      <div className="h-30 flex w-full justify-center pb-10">
        <button onClick={reset}>RESET</button>
      </div>

      <div className="h-30 flex w-full justify-center pb-10">
        <button onClick={prepend}>INCREASE</button>
      </div>

      <div className="w-full max-w-[620px]">
        <div ref={containerRef} className="h-[500px] w-full overflow-auto bg-cyan-800/50">
          {items.map(({ key }, index) => (
            <div
              key={index}
              id={`name_${key}`}
              className="flex h-20 w-full items-center justify-center border-b align-middle text-lg font-semibold text-black"
            >
              <span>{key}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;

/* 
function scrollParentToChild(parent: HTMLDivElement, child: HTMLDivElement) {
  const parentRect = parent.getBoundingClientRect();
  const childRect = child.getBoundingClientRect();

  // Should we scroll using top or bottom? Find the smaller ABS adjustment
  const scrollTop = childRect.top - parentRect.top;
  const scrollBot = childRect.bottom - parentRect.bottom;
  if (Math.abs(scrollTop) < Math.abs(scrollBot)) {
    // we're near the top of the list
    parent.scrollTop += scrollTop;
  } else {
    // we're near the bottom of the list
    parent.scrollTop += scrollBot;
  }
}

type UseIntersectionObserverProps = {
  root?: HTMLElement | null;
  rootMargin?: string;
  threshold?: number;
};

function useIntersectionObserver(
  callback: IntersectionObserverCallback,
  { root = null, rootMargin = '0px', threshold = 0 }: UseIntersectionObserverProps = {},
) {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        if (observer.current) callback([entry], observer.current);
      },
      { root, rootMargin, threshold },
    );

    if (node) observer.current.observe(node);

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [callback, node, root, rootMargin, threshold]);

  return [setNode, entry] as const;
}
 */
