import React, { useEffect, useState } from 'react';

import { Dialog } from '@/components';
import { useDispatch, useSelector } from '@/hooks';
import { themeConfig, selectTheme, themeActions } from '@/stores';

type ThemeDialogProps = React.PropsWithChildren;

export function ThemeDialog({ children }: ThemeDialogProps) {
  const { accent: ACCENT, base: BASE } = themeConfig;

  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  const [baseIndex, baseNext] = useLoop(BASE.length, BASE.indexOf(theme.base));
  const [accentIndex, accentNext] = useLoop(ACCENT.length, ACCENT.indexOf(theme.accent));

  useEffect(() => {
    dispatch(themeActions.set({ type: 'base', value: BASE[baseIndex] }));
  }, [baseIndex]);

  useEffect(() => {
    dispatch(themeActions.set({ type: 'accent', value: ACCENT[accentIndex] }));
  }, [accentIndex]);

  return (
    <Dialog>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Content>
        <div className="">
          <div className="">
            <button
              type="button"
              className="flex w-full justify-between p-3 hover:bg-base-focus"
              onClick={baseNext}
            >
              <div className="">
                <span>Background:</span>
              </div>

              <div className="h-10 w-20 bg-base" />
            </button>

            <button
              type="button"
              className="flex w-full justify-between p-3 hover:bg-base-focus"
              onClick={accentNext}
            >
              <div className="">
                <span>Color</span>
              </div>

              <div className="h-10 w-20 bg-accent" />
            </button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
}
export default ThemeDialog;

function useLoop(num: number, start = 0) {
  const [index, setIndex] = useState(start);
  const incremental = () => setIndex((index + 1) % num);
  return [index, incremental] as const;
}
