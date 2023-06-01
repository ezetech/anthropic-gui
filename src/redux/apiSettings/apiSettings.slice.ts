import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

import { ApiSettingOptions } from '@/typings/common';

const initialState: ApiSettingOptions = {
  apiKey: '',
  model: 'claude-v1.3-100k',
  maxTokens: 100000,
  temperature: 1,
  topK: -1,
  topP: -1,
};

export const apiSettingsSlice = createSlice({
  name: 'apiSettings',
  initialState,
  reducers: {
    setApiSettings: <
      F extends keyof ApiSettingOptions,
      V extends ApiSettingOptions[F],
    >(
      state: Draft<ApiSettingOptions>,
      action: PayloadAction<{ field: F; value: V }>, //
    ) => {
      const { field, value } = action.payload;

      state[field] = value;
    },
    cleanState: () => initialState,
  },
});

export const { cleanState, setApiSettings } = apiSettingsSlice.actions;
