import {
  Middleware,
  Reducer,
  StoreEnhancer,
  configureStore,
} from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  TypedUseSelectorHook,
  useDispatch as useBaseDispatch,
  useSelector,
} from 'react-redux';

import { authApi } from './auth/auth-api';
import { AUTH_FEATURE_KEY, authReducer } from './auth/auth.slice';
import { PRODUCT_FEATURE_KEY, productReducer } from './product/product.slice';
import { THEME_FEATURE_KEY, themeReducer } from './theme/theme.slice';

const reducer = {
  [AUTH_FEATURE_KEY]: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [PRODUCT_FEATURE_KEY]: productReducer,
  [THEME_FEATURE_KEY]: themeReducer,
};
const middlewares: Middleware[] = [authApi.middleware];
const enhancers: StoreEnhancer[] = [];

export type AppDispatch = typeof store.dispatch;
export type RootState<TReducer = typeof reducer> = {
  [Key in keyof TReducer]: TReducer[Key] extends Reducer<infer TEntity>
    ? TEntity
    : never;
};

export const useDispatch: () => AppDispatch = useBaseDispatch;

export const store = configureStore({
  reducer,
  devTools: process.env.NODE_ENV === 'development',
  enhancers,

  middleware: (defaultMiddlewares) => defaultMiddlewares().concat(middlewares),
});

setupListeners(store.dispatch);

export default store;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
