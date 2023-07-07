import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ApiSettingOptions } from '@/typings/common';

const initialState: ApiSettingOptions = {
  apiKey: '',
  model: 'claude-1.3-100k',
  maxTokens: 8000,
  temperature: 0.7,
  topK: 5,
  topP: 0,
};

export const apiSettingsSlice = createSlice({
  name: 'apiSettings',
  initialState,
  reducers: {
    setApiKey: (state, action: PayloadAction<string>) => {
      state.apiKey = action.payload;
    },
    setModel: (state, action: PayloadAction<string>) => {
      const value = action.payload;
      if (!value.includes('100k')) {
        if (state.maxTokens > initialState.maxTokens) {
          state.maxTokens = initialState.maxTokens;
        }
      }
      state.model = value;
    },
    setMaxTokens: (state, action: PayloadAction<number>) => {
      state.maxTokens = Math.round(action.payload);
    },
    setTemperature: (state, action: PayloadAction<number>) => {
      const value = action.payload;
      if (value > 0) {
        state.topP = initialState.topP;
      }
      state.temperature = value;
    },
    setTopK: (state, action: PayloadAction<number>) => {
      state.topK = Math.round(action.payload);
    },
    setTopP: (state, action: PayloadAction<number>) => {
      const value = action.payload;

      if (value > 0) {
        state.temperature = 0;
      }

      state.topP = value;
    },
    cleanApiKey: state => {
      state.apiKey = '';
    },
    cleanApiSettings: () => initialState,
    resetApiSettings: state => {
      const apiKey = state.apiKey;
      state = { ...initialState, apiKey };

      return state;
    },
  },
});

export const {
  setApiKey,
  setMaxTokens,
  setModel,
  setTemperature,
  setTopK,
  setTopP,
  cleanApiKey,
  cleanApiSettings,
  resetApiSettings,
} = apiSettingsSlice.actions;
