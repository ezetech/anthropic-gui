import { useEffect } from 'react';

import { PaletteMode } from '@mui/material';

import { Theme } from './constants';

export const useCustomTheme = (mode: PaletteMode) => {
  useEffect(() => {
    if (mode === 'light') {
      document.body.classList.remove(Theme.DARK);
      document.body.classList.add(Theme.LIGHT);
    }

    if (mode === 'dark') {
      document.body.classList.remove(Theme.LIGHT);
      document.body.classList.add(Theme.DARK);
    }
  }, [mode]);
};
