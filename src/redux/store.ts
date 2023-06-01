import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/es/storage';

import { baseApi } from './api';
import { apiSettingsSlice } from './apiSettings/apiSettings.slice';
import { chatsSlice } from './chats/chatsSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const reducers = combineReducers({
  apiSettings: apiSettingsSlice.reducer,
  chats: chatsSlice.reducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat([baseApi.middleware]),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
