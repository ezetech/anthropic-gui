import { memo } from 'react';

import { PaletteMode } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import classNames from 'classnames';

import { IconComponent } from '@/components/IconComponent';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectThemeMode } from '@/redux/theme/theme.selectors';
import { setTheme } from '@/redux/theme/themeSlice';

import styles from './ThemeSwitcher.module.scss';

export const ThemeSwitcher = memo(() => {
  const mode = useAppSelector(selectThemeMode);
  const dispatch = useAppDispatch();

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newMode: PaletteMode,
  ) => {
    if (newMode !== null) {
      dispatch(setTheme(newMode));
    }
  };

  return (
    <ToggleButtonGroup
      exclusive
      onChange={handleChange}
      value={mode}
      className={classNames(styles.wrapper, styles.buttonGroup)}
      fullWidth
    >
      <ToggleButton
        value="dark"
        aria-label="dark"
        fullWidth
        className={classNames(styles.button, {
          [styles.selected]: mode === 'dark',
        })}
      >
        <IconComponent type="themeDark" />
      </ToggleButton>
      <ToggleButton
        value="light"
        aria-label="light"
        fullWidth
        className={classNames(styles.button, {
          [styles.selected]: mode === 'light',
        })}
      >
        <IconComponent type="themeLight" />
      </ToggleButton>
    </ToggleButtonGroup>
  );
});

ThemeSwitcher.displayName = 'ThemeSwitcher';
