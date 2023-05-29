import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import routes from '@/routes';
import { store } from '@/stores';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <StrictMode>
      <RouterProvider router={routes} />
    </StrictMode>
  </Provider>
);
