import { useEffect, useState } from 'react';

import { Button, PageMeta } from '@/components';

export function Home() {
  return (
    <PageMeta title="Home" auth={{ type: 'private' }}>
      <div className="min-h-screen">
        {/* <Button onClick={inc}>inc</Button>
        <Button onClick={nothing}>nothing</Button> */}
        {/* {Array.from(Array(30)).map((_, i) => (
          <div key={i} className="border-gray h-80 border-b bg-cyan-950" />
        ))} */}
        <div className="flex flex-col bg-cyan-950 wh-[600px]">
          <div className="w-full shrink-0 bg-slate-900" />
          <div className="w-full overflow-auto bg-purple-950">
            <div className="h-20 w-full border-t bg-cyan-800" />
            <div className="h-20 w-full border-t bg-cyan-800" />
            <div className="h-20 w-full border-t bg-cyan-800" />
            <div className="h-20 w-full border-t bg-cyan-800" />
            <div className="h-20 w-full border-t bg-cyan-800" />
            <div className="h-20 w-full border-t bg-cyan-800" />
            <div className="h-20 w-full border-t bg-cyan-800" />
            <div className="h-20 w-full border-t bg-cyan-800" />
          </div>
        </div>
      </div>
    </PageMeta>
  );
}

export default Home;
