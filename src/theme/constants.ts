export const Theme = {
  LIGHT: 'appLightTheme',
  DARK: 'appDarkTheme',
} as const;

export type ThemeType = ValueOf<typeof Theme>;
