import { useEffect, useState } from 'react';

import { Dialog, DialogProps } from '@/components';
import { useDispatch, useSelector } from '@/hooks';
import { THEME_CONFIG, selectTheme, themeActions } from '@/stores';

const { ACCENT, BASE } = THEME_CONFIG;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ThemeDialogProps extends Pick<DialogProps, 'trigger'> {}

export function ThemeDialog({ trigger }: ThemeDialogProps) {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  const [open, setOpen] = useState(false);
  const [baseIndex, baseNext] = useLoop(BASE.length, BASE.indexOf(theme.base));
  const [accentIndex, accentNext] = useLoop(
    ACCENT.length,
    ACCENT.indexOf(theme.accent)
  );

  useEffect(() => {
    dispatch(themeActions.set({ type: 'base', value: BASE[baseIndex] }));
  }, [baseIndex]);

  useEffect(() => {
    dispatch(themeActions.set({ type: 'accent', value: ACCENT[accentIndex] }));
  }, [accentIndex]);

  return (
    <Dialog open={open} handleOpen={setOpen} trigger={trigger}>
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
    </Dialog>
  );
}
export default ThemeDialog;

function useLoop(num: number, start = 0) {
  const [index, setIndex] = useState(start);
  const incremental = () => setIndex((index + 1) % num);
  return [index, incremental] as const;
}
