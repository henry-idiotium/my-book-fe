import { useEffect, useRef, useState } from 'react';

import { Button, PageMeta } from '@/components';
import useScrollToEnds from '@/hooks/scroll-to-ends';

export function Home() {
  const divRef = useRef<HTMLDivElement>(null);
  const [shouldScrollBack, scrollBack] = useScrollToEnds(divRef);

  return (
    <PageMeta title="Home" auth={{ type: 'private' }}>
      <div className="min-h-screen">
        <div className="h-20">
          {shouldScrollBack ? <Button onClick={scrollBack}>back</Button> : null}
        </div>

        <div className="w-[600px]">
          {/* conversation container */}
          <div
            ref={divRef}
            className="max-h-screen min-h-screen overflow-auto bg-cyan-800/50 wh-full"
          >
            {/* topbar */}

            <div className="sticky top-0 z-0 flex h-14 w-full justify-between before:absolute before:-z-10 before:bg-lime-700/50 before:content-[''] before:wh-full">
              <div className="bg-red-800 wh-12" />
              <div className="bg-red-800 wh-12" />
              <div className="bg-red-800 wh-12" />
            </div>

            {/* content */}
            <div className="flex w-full flex-wrap gap-1 bg-emerald-800">
              <div className="h-20">fooooo</div>
              {Array.from(Array(180)).map((_, index) => (
                <div key={index} className="h-20">
                  fooooo
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageMeta>
  );
}

export default Home;
