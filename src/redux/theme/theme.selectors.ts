import { RootState } from '@/redux/store';

export const selectThemeMode = (state: RootState) => state.theme.mode;
