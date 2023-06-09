import { PaletteMode } from '@mui/material';

export const getThemePalette = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            main: '#6129ff',
          },
          secondary: {
            main: '#000000',
          },
          text: {
            primary: '#000000',
            secondary: '#AEAEAE',
          },
          background: {
            default: '#ffffff',
            paper: '#F2F2F2',
          },
        }
      : {
          primary: {
            main: '#6129ff',
          },
          secondary: {
            main: '#000000',
          },
          text: {
            primary: '#ffffff',
            secondary: '#AEAEAE',
          },
          background: {
            default: '#191824',
            paper: '#252836',
          },
        }),
  },
});
