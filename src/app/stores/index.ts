import {
  Middleware,
  Reducer,
  StoreEnhancer,
  configureStore,
} from '@reduxjs/toolkit';
import { useDispatch as useBaseDispatch } from 'react-redux';

import { PRODUCT_FEATURE_KEY, productReducer } from './product/product.slice';
import { THEME_FEATURE_KEY, themeReducer } from './theme/theme.slice';

const reducer = {
  [PRODUCT_FEATURE_KEY]: productReducer,
  [THEME_FEATURE_KEY]: themeReducer,
};
const middlewares: Middleware[] = [];
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
  middleware: (defaultMiddlewares) => defaultMiddlewares().concat(middlewares),
  devTools: process.env.NODE_ENV === 'development',
  enhancers,
});

export default store;
