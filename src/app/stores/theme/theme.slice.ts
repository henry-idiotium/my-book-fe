import { createSlice } from '@reduxjs/toolkit';

export const THEME_FEATURE_KEY = 'theme';

interface ThemeEntity {
  darkMode: boolean;
}

const initialState: ThemeEntity = {
  darkMode: false,
};

export const themeSlice = createSlice({
  name: THEME_FEATURE_KEY,
  initialState,
  reducers: {
    toggle: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});

export const themeReducer = themeSlice.reducer;
export const themeActions = themeSlice.actions;

export const selectThemeEntity = (rootState: GenericObject) =>
  rootState[THEME_FEATURE_KEY] as ThemeEntity;
