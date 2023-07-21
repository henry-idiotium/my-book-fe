import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { z } from 'zod';

import { getZodDefault, zodLiteralUnion } from '@/utils';

import { RootState } from '..';

export const THEME_FEATURE_KEY = 'theme';

export const themeConfig = {
  base: ['default', 'dim', 'dark'],
  accent: ['blue', 'gold', 'pink', 'blue', 'orange', 'green'],
} as const;

const themeStateZod = z.object({
  base: zodLiteralUnion(...themeConfig.base).default(themeConfig.base[0]),
  accent: zodLiteralUnion(...themeConfig.accent).default(themeConfig.accent[0]),
});

export const themeSlice = createSlice({
  name: THEME_FEATURE_KEY,
  initialState: getZodDefault(themeStateZod),
  reducers: {
    set: (state, action: PayloadAction<ThemeConfig>) => {
      const { type, value } = action.payload;

      (state as { [key in typeof type]: typeof value })[type] = value;
      (state as { [key in typeof type]: typeof value })[type] = value;
    },
  },
});

export const themeReducer = themeSlice.reducer;
export const themeActions = themeSlice.actions;

export const selectTheme = (rootState: RootState) => rootState[THEME_FEATURE_KEY];

export const selectThemeIsDark = (rootState: RootState) => {
  const { base } = selectTheme(rootState);
  const darkModes: ThemeBaseTypes[] = ['dark', 'dim'];
  return darkModes.includes(base);
};

// types
export type ThemeBaseTypes = (typeof themeConfig.base)[number];
export type ThemeAccentTypes = (typeof themeConfig.accent)[number];
export type ThemeState = z.infer<typeof themeStateZod>;
export type ThemeConfig = {
  [Key in keyof ThemeState]: {
    type: Key;
    value: (typeof themeConfig)[Key][number];
  };
}[keyof ThemeState];
