import { PropsWithChildren } from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import { useAppSelector } from '@/redux/hooks';
import { selectThemeMode } from '@/redux/theme/theme.selectors';

import { getThemePalette } from './themePalette';
import { useCustomTheme } from './useTheme';

export const CustomThemeProvider = ({ children }: PropsWithChildren) => {
  const mode = useAppSelector(selectThemeMode);

  const theme = createTheme(getThemePalette(mode));

  useCustomTheme(mode);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
