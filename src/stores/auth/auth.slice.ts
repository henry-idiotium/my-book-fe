/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { z } from 'zod';

import { RootState } from '..';

import { authApi } from './auth.api';
import { AuthValidResponse } from './types';

import { userZod } from '@/types';
import { getZodDefault } from '@/utils';

export const AUTH_FEATURE_KEY = 'auth';

export type AuthState = z.infer<typeof authStateZod>;
const authStateZod = z.object({
  token: z.string(),
  expires: z.number().optional(),
  user: userZod.default(getZodDefault(userZod)),
});

const initialState = getZodDefault(authStateZod);
export const authSlice = createSlice({
  name: AUTH_FEATURE_KEY,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action: PayloadAction<AuthValidResponse>) => {
        state.token = action.payload.token;
        state.expires = jwt_decode<JwtPayload>(action.payload.token).exp;
        state.user = action.payload.user;
      }
    );

    builder.addMatcher(
      authApi.endpoints.refresh.matchFulfilled,
      (state, action: PayloadAction<AuthValidResponse>) => {
        state.token = action.payload.token;
        state.expires = jwt_decode<JwtPayload>(action.payload.token).exp;
        state.user = action.payload.user;
      }
    );

    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
      state = { ...initialState, expires: state.expires };
    });
  },
});

export const selectAuth = (state: RootState) => state.auth;
export const selectUserInSession = (state: RootState) => state.auth.user;
export const authReducer = authSlice.reducer;
