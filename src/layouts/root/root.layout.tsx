import { Outlet } from 'react-router-dom';

import { useThemeWatcher } from '@/hooks';

export function Root() {
  useThemeWatcher(':root', true);

  return (
    <div className="box-content flex flex-[1] flex-col items-center">
      <div className="flex w-full max-w-[120em] flex-col items-stretch text-base">
        <div className="h-full w-full px-[2em]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Root;
