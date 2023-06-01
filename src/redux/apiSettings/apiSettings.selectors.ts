import { RootState } from '@/redux/store';

export const selectApiKey = (state: RootState) => state.apiSettings.apiKey;

export const selectApiModel = (state: RootState) => state.apiSettings.model;

export const selectApiMaxTokens = (state: RootState) =>
  state.apiSettings.maxTokens;

export const selectApiTemperature = (state: RootState) =>
  state.apiSettings.temperature;

export const selectApiTopK = (state: RootState) => state.apiSettings.topK;

export const selectApiTopP = (state: RootState) => state.apiSettings.topP;
