import { PaletteMode } from '@mui/material';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface ThemeState {
  mode: PaletteMode;
}

const initialState: ThemeState = { mode: 'light' };

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<PaletteMode>) => {
      state.mode = action.payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;
