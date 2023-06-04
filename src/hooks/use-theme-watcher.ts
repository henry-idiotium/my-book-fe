import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from '@/hooks';
import { ThemeState, selectTheme, themeActions } from '@/stores';

export function useThemeWatcher(selector = ':root', throwError = false) {
  const [error, setError] = useState<string>();
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  useEffect(() => set('base', theme.base), [theme.base]);
  useEffect(() => set('accent', theme.accent), [theme.accent]);

  function set(type: keyof ThemeState, value: string) {
    dispatch(themeActions.set({ type, value }));
    setDataAtr(type, value);
  }
  function setDataAtr(key: keyof ThemeState, type: string) {
    const el = document.querySelector(selector);
    if (!el) {
      const errorMessage = `Not found element with selector ${selector}`;

      setError(errorMessage);

      if (!throwError) throw new Error(errorMessage);
      else return;
    }

    el.setAttribute(`data-theme-${key}`, type);
  }

  return [error] as const;
}

export default useThemeWatcher;
