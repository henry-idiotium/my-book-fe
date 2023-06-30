import {
  AnyAction,
  Middleware,
  PreloadedState,
  StoreEnhancer,
  ThunkAction,
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

import { authApi } from './auth/auth.api';
import { AUTH_FEATURE_KEY, authReducer } from './auth/auth.slice';
import {
  CHAT_SOCKET_FEATURE_KEY,
  chatSocketReducer,
} from './chat-socket/chat-socket.slice';
import { THEME_FEATURE_KEY, themeReducer } from './theme/theme.slice';

// Configurations
const reducer = combineReducers({
  [CHAT_SOCKET_FEATURE_KEY]: chatSocketReducer,
  [THEME_FEATURE_KEY]: themeReducer,
  [AUTH_FEATURE_KEY]: authReducer,
  [authApi.reducerPath]: authApi.reducer,
});
const middlewares: Middleware[] = [authApi.middleware];
const enhancers: StoreEnhancer[] = [];

// Persistence
const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  whitelist: [THEME_FEATURE_KEY],
  storage,
};

// store factory, for testing
export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    devTools: import.meta.env.DEV,
    reducer: persistReducer(persistConfig, reducer),
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

export const appStore = setupStore();
export default appStore;

setupListeners(appStore.dispatch);

export type AppStore = ReturnType<typeof setupStore>;
export type RootState = ReturnType<typeof reducer>;
export type AppDispatch = AppStore['dispatch'];

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;
