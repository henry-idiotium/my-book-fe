import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { z } from 'zod';

import { RootState } from '..';

import { getZodDefault } from '@/utils';

export const THEME_FEATURE_KEY = 'theme';

export const THEME_CONFIG = {
  BASE: ['default', 'dim', 'dark'],
  ACCENT: ['blue', 'gold', 'pink', 'blue', 'orange', 'green'],
};

const themeStateZod = z.object({
  base: z.string().default(THEME_CONFIG.BASE[0]),
  accent: z.string().default(THEME_CONFIG.ACCENT[0]),
});

export type ThemeState = z.infer<typeof themeStateZod>;
const initialState = getZodDefault(themeStateZod);

type PayloadSet = { type: keyof ThemeState; value: string };
export const themeSlice = createSlice({
  name: THEME_FEATURE_KEY,
  initialState,
  reducers: {
    set: (state, action: PayloadAction<PayloadSet>) => {
      const { type, value } = action.payload;

      state[type] = value;
    },
  },
});

export const themeReducer = themeSlice.reducer;
export const themeActions = themeSlice.actions;

export const selectTheme = (rootState: RootState) =>
  rootState[THEME_FEATURE_KEY] as ThemeState;
