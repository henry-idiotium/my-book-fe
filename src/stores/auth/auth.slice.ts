/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createSlice, isAnyOf } from '@reduxjs/toolkit';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { z } from 'zod';

import { userZod } from '@/types';
import { Logger, getZodDefault } from '@/utils';

import { RootState } from '..';

import { authApi } from './auth.api';
import { AuthValidResponse } from './types';

export const AUTH_FEATURE_KEY = 'auth';

const endpoints = authApi.endpoints;

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
      endpoints.login.matchFulfilled,
      (state, action: PayloadAction<AuthValidResponse>) => {
        state.token = action.payload.token;
        state.expires = jwt_decode<JwtPayload>(action.payload.token).exp;
        state.user = action.payload.user;
      },
    );

    builder.addMatcher(
      endpoints.refresh.matchFulfilled,
      (state, action: PayloadAction<AuthValidResponse>) => {
        state.token = action.payload.token;
        state.expires = jwt_decode<JwtPayload>(action.payload.token).exp;
        state.user = action.payload.user;
      },
    );

    builder.addMatcher(endpoints.logout.matchFulfilled, (state) => {
      state = { ...initialState, expires: state.expires };
    });

    builder.addMatcher(
      isAnyOf(
        endpoints.login.matchRejected,
        endpoints.refresh.matchRejected,
        endpoints.logout.matchRejected,
      ),
      (_, action) => {
        const meta = action.meta;
        const msg = `💫⚠️  ${meta.arg.endpointName} ${meta.requestStatus}\n`;
        Logger.warn(msg.toUpperCase(), action);
      },
    );
  },
});

export const selectAuth = (state: RootState) => state.auth;
export const selectUserInSession = (state: RootState) => state.auth.user;
export const authReducer = authSlice.reducer;
