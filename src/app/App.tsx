import { createContext, useState } from 'react';

import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from '@/redux/store';
import { CustomThemeProvider } from '@/theme/CustomThemeProvider';

import { RouterComponent } from './router/RouterComponent';

type NavigationContextType = {
  didNewChatNavigate: boolean;
  setDidNewChatNavigate: React.Dispatch<React.SetStateAction<boolean>>;
};

export const NavigationContext = createContext<NavigationContextType>({
  didNewChatNavigate: false,
  setDidNewChatNavigate: () => {},
});

export const App = () => {
  const [didNewChatNavigate, setDidNewChatNavigate] = useState(false);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <HashRouter>
          <NavigationContext.Provider
            value={{ didNewChatNavigate, setDidNewChatNavigate }}
          >
            <CustomThemeProvider>
              <RouterComponent />
            </CustomThemeProvider>
          </NavigationContext.Provider>
        </HashRouter>
      </PersistGate>
    </Provider>
  );
};
