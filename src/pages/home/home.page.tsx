import { useRef } from 'react';

import { useScroll } from '@/hooks';

export function Home() {
  const divRef = useRef<HTMLDivElement>(null);
  const { scrollBack, shouldGoBack } = useScroll(divRef, {
    startAt: 'bottom',
    shouldScrollBackPerc: -0.1,
    behavior: 'smooth',
  });

  return (
    <div className="min-h-screen">
      <div className="flex h-20 w-full justify-end">
        {shouldGoBack ? <button onClick={() => scrollBack()}>back</button> : null}
      </div>

      <div className="w-full max-w-[620px]">
        <div ref={divRef} className="h-[500px] w-full overflow-auto bg-cyan-800/50">
          <div className="sticky top-0 z-0 flex h-14 w-full justify-between before:absolute before:-z-10 before:bg-lime-700/50 before:content-[''] before:wh-full">
            <div className="bg-red-800 wh-12" />
            <div className="bg-red-800 wh-12" />
            <div className="bg-red-800 wh-12" />
          </div>

          <div className="flex w-full flex-wrap gap-1 bg-emerald-800">
            <div className="h-48">fooooo</div>
            {Array.from(Array(180)).map((_, index) => (
              <div key={index} className="h-20">
                fooooo
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
