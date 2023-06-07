import { memo } from 'react';

import { PaletteMode } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import classNames from 'classnames';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectThemeMode } from '@/redux/theme/theme.selectors';
import { setTheme } from '@/redux/theme/themeSlice';
import { IconComponent } from '@/ui/IconComponent';

import styles from './ThemeSwitcher.module.scss';

export const ThemeSwitcher = memo(() => {
  const mode = useAppSelector(selectThemeMode);
  const dispatch = useAppDispatch();

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newMode: PaletteMode,
  ) => {
    if (newMode !== null) {
      return dispatch(setTheme(newMode));
    }

    dispatch(setTheme(mode === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ToggleButtonGroup
      exclusive
      onChange={handleChange}
      value={mode}
      className={classNames([styles.wrapper, styles.buttonGroup, styles[mode]])}
      fullWidth
    >
      <ToggleButton
        value="dark"
        aria-label="dark"
        fullWidth
        className={classNames([styles.darkBtn, styles.button])}
      >
        <IconComponent type="themeDark" />
      </ToggleButton>
      <ToggleButton
        value="light"
        aria-label="light"
        fullWidth
        className={classNames([styles.lightBtn, styles.button])}
      >
        <IconComponent type="themeLight" />
      </ToggleButton>
    </ToggleButtonGroup>
  );
});

ThemeSwitcher.displayName = 'ThemeSwitcher';
