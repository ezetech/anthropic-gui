import { memo } from 'react';

import { cleanApiKey } from '@/redux/apiSettings/apiSettings.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectThemeMode } from '@/redux/theme/theme.selectors';
import { setTheme } from '@/redux/theme/themeSlice';
import { IconComponent } from '@/ui/IconComponent';

import styles from './Logout.module.scss';

export const Logout = memo(() => {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector(selectThemeMode);

  const onLogout = () => {
    dispatch(cleanApiKey());

    if (currentTheme === 'dark') {
      dispatch(setTheme('light'));
    }
  };

  return (
    <button className={styles.btn} onClick={onLogout}>
      <span>Logout</span>
      <IconComponent type="logout" />
    </button>
  );
});

Logout.displayName = 'Logout';
