/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import jwt_decode, { JwtPayload } from 'jwt-decode';

import { RootState } from '..';

import { authApi } from './auth.api';
import { AuthValidResponse } from './types';

import { UserEntity, userZod } from '@/types';
import { getZodDefault } from '@/utils';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
  token: string;
  expires: number | undefined;
  user: UserEntity;
}

const defaultUser = getZodDefault(userZod);
export const initialAuthState: AuthState = {
  token: '',
  expires: undefined,
  user: defaultUser,
};

export const authSlice = createSlice({
  name: AUTH_FEATURE_KEY,
  initialState: initialAuthState,
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
    builder.addMatcher(
      authApi.endpoints.logout.matchFulfilled,
      (state, action) => {
        state.token = initialAuthState.token;
        state.user = initialAuthState.user;
      }
    );
  },
});

export const selectAuth = (state: RootState) => state.auth;
export const selectUserInSession = (state: RootState) => state.auth.user;
export const authReducer = authSlice.reducer;
