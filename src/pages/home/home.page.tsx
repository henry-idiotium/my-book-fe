import { useRef } from 'react';

import { useScroll, useScrollAlt } from '@/hooks';

export function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [{ shouldGoBack, isAtEnds, isAtOppositeEnds }, scrollBack] = useScrollAlt(containerRef, {
    viewHeightPerc: 3,
    behavior: 'smooth',
    startAt: 'bottom',
  });

  return (
    <div className="min-h-screen">
      <div className="flex h-20 w-full justify-end">
        {JSON.stringify({ shouldGoBack, isAtOppositeEnds, isAtEnds })}
      </div>

      <div className="flex h-20 w-full justify-end">
        {shouldGoBack ? <button onClick={() => scrollBack()}>back</button> : null}
      </div>

      <div className="w-full max-w-[620px]">
        <div ref={containerRef} className="h-[500px] w-full overflow-auto bg-cyan-800/50">
          {Array.from(Array(100)).map((_, index) => (
            <div
              key={index}
              className="flex h-20 w-full items-center justify-center border-b align-middle text-lg font-semibold text-black"
            >
              <span>{index}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;

/* 
import { useEffect } from 'react';

import { Button, Toast } from '@/components';
import { useBoolean } from '@/hooks';

export function Home() {
  const opened = useBoolean(false);

  useEffect(() => console.log(opened.value), [opened.value]);

  return (
    <Toast.Provider duration={1000}>
      <div className="min-h-screen">
        <div>
          <div className="mt-64 flex h-40 w-full justify-center">
            <Button className="h-16 w-32 capitalize" onClick={opened.setTrue}>
              call for toast
            </Button>

            <Button className="h-16 w-32 capitalize" onClick={opened.setFalse}>
              close it
            </Button>
          </div>
        </div>
      </div>

      <Toast open={opened.value} type="background" onOpenChange={opened.setValue}>
        <span>This is by design</span>

        <Toast.Close>Dismiss</Toast.Close>
      </Toast>

      <Toast.Viewport offset={32} />
    </Toast.Provider>
  );
}

export default Home;
*/
