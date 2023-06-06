import { StrictMode } from 'react';

import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from '@/redux/store';
import { CustomThemeProvider } from '@/theme/themeProvider';

import { RouterComponent } from './router/RouterComponent';

export const App = () => (
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <HashRouter>
          <CustomThemeProvider>
            <RouterComponent />
          </CustomThemeProvider>
        </HashRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);
