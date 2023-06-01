import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '..';

import { authApi } from './auth-api';

import { UserEntity, defaultUser } from '@/types';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
  token: string;
  user: UserEntity;
}

export const initialAuthState: AuthState = { token: '', user: defaultUser };

export const authSlice = createSlice({
  name: AUTH_FEATURE_KEY,
  initialState: initialAuthState,
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
        state.token = initialAuthState.token;
        state.user = initialAuthState.user;
      }
    );
  },
});

export const selectAuth = (state: RootState) => state.auth;
export const authReducer = authSlice.reducer;
