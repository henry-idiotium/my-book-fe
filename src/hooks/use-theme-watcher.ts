import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from '@/hooks';
import { ThemeConfig, ThemeState, selectTheme, themeActions } from '@/stores';

export function useThemeWatcher(selector = ':root', throwError = false) {
  const [error, setError] = useState<string>();
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  useEffect(() => set('base', theme.base), [theme.base]);
  useEffect(() => set('accent', theme.accent), [theme.accent]);

  function set(type: keyof ThemeState, value: ThemeState[keyof ThemeState]) {
    dispatch(themeActions.set({ type, value } as ThemeConfig));
    setDataAtr(type, value);
  }
  function setDataAtr(key: keyof ThemeState, type: string) {
    const selectedEl = document.querySelector(selector);
    if (!selectedEl) {
      const errorMessage = `Not found element with selector ${selector}`;

      setError(errorMessage);

      if (!throwError) throw new Error(errorMessage);
      else return;
    }

    selectedEl.setAttribute(`data-theme-${key}`, type);
  }

  return [error] as const;
}

export default useThemeWatcher;
