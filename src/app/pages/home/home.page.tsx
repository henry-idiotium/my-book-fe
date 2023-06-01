import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from '@/hooks';
import { THEME_CONFIG, selectTheme, themeActions } from '@/stores';

const { ACCENT, BASE } = THEME_CONFIG;

export function Home() {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

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

  function nextBase() {
    baseNext();
  }
  function nextAccent() {
    accentNext();
  }

  return (
    <div className="">
      <h1>Welcome to Home!</h1>

      <br />
      <br />

      <button onClick={nextBase}>--BASE--</button>
      <br />
      <button onClick={nextAccent}>--ACCENT--</button>

      <br />
      <br />
    </div>
  );
}

export default Home;

function useLoop(num: number, start = 0) {
  const [index, setIndex] = useState(start);

  function incremental() {
    setIndex((index + 1) % num);
  }

  return [index, incremental] as const;
}
