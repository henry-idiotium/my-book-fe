import '@/styles/main.scss';

import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import { routes } from '@/pages/routes';
import { setupStore } from '@/stores';

const store = setupStore();
const persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <StrictMode>
        <RouterProvider router={routes} />
      </StrictMode>
    </PersistGate>
  </Provider>
);
