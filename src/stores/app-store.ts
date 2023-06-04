import {
  Middleware,
  PreloadedState,
  StoreEnhancer,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  PersistConfig,
  REGISTER,
  REHYDRATE,
  persistReducer,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { authApi } from './auth/auth-api';
import { AUTH_FEATURE_KEY, authReducer } from './auth/auth.slice';
import { PRODUCT_FEATURE_KEY, productReducer } from './product/product.slice';
import { THEME_FEATURE_KEY, themeReducer } from './theme/theme.slice';

// Configurations
const reducer = combineReducers({
  [AUTH_FEATURE_KEY]: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [PRODUCT_FEATURE_KEY]: productReducer,
  [THEME_FEATURE_KEY]: themeReducer,
});
const middlewares: Middleware[] = [authApi.middleware];
const enhancers: StoreEnhancer[] = [];

// Persistences
const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage,
  whitelist: [THEME_FEATURE_KEY],
};
const persistedReducer = persistReducer(persistConfig, reducer);

// store setup function for testing purposes
export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    devTools: process.env.NODE_ENV === 'development',
    reducer: persistedReducer,
    enhancers,
    preloadedState,
    middleware: (defaultMiddlewares) => {
      return defaultMiddlewares({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(middlewares);
    },
  });
}

// main
export const appStore = setupStore();
export default appStore;

setupListeners(appStore.dispatch);

export type AppStore = ReturnType<typeof setupStore>;
export type RootState = ReturnType<typeof reducer>;
export type AppDispatch = AppStore['dispatch'];
