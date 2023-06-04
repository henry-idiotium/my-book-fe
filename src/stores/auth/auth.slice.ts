import { createSlice } from '@reduxjs/toolkit';
import { object, string, z } from 'zod';

import { RootState } from '..';

import { authApi } from './auth-api';

import { defaultUser, userZod } from '@/types';
import { getZodDefault } from '@/utils';

export const AUTH_FEATURE_KEY = 'auth';

const authZod = object({
  token: string(),
  user: object(userZod.shape),
});

export type AuthState = z.infer<typeof authZod>;
export const initialState = getZodDefault(authZod, { deep: false });

export const authSlice = createSlice({
  name: AUTH_FEATURE_KEY,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
      }
    );
    builder.addMatcher(
      authApi.endpoints.refresh.matchFulfilled,
      (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
      }
    );
    builder.addMatcher(
      authApi.endpoints.logout.matchFulfilled,
      (state, action) => {
        state.token = initialState.token;
        state.user = initialState.user;
      }
    );
  },
});

export const selectAuth = (state: RootState) => state.auth;
export const authReducer = authSlice.reducer;
