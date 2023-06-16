import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/es/storage';

import { apiSettingsSlice } from './apiSettings/apiSettings.slice';
import { conversationsSlice } from './conversations/conversationsSlice';
import { themeSlice } from './theme/themeSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const reducers = combineReducers({
  apiSettings: apiSettingsSlice.reducer,
  chats: conversationsSlice.reducer,
  theme: themeSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
