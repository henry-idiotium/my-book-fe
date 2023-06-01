import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { LoginForm } from '@/types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.SERVER_URL}/api/v1/auth`,
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body: LoginForm) => {
        return {
          url: '/email/login',
          method: 'post',
          body,
          credentials: 'include',
        };
      },
    }),
    refresh: builder.mutation({
      query: () => {
        return {
          url: '/refresh',
          method: 'get',
          credentials: 'include',
        };
      },
    }),
    logout: builder.mutation({
      query: () => {
        return {
          url: '/logout',
          method: 'get',
          credentials: 'include',
        };
      },
    }),
  }),
});

// export react hook
export const { useLoginMutation, useRefreshMutation, useLogoutMutation } =
  authApi;
