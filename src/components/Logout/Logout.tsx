import { memo } from 'react';

import { cleanApiKey } from '@/redux/apiSettings/apiSettings.slice';
import { useAppDispatch } from '@/redux/hooks';
import { IconComponent } from '@/ui/IconComponent';

import styles from './Logout.module.scss';

export const Logout = memo(() => {
  const dispatch = useAppDispatch();

  const onLogout = () => {
    dispatch(cleanApiKey());
  };

  return (
    <button className={styles.btn} onClick={onLogout}>
      <span>Logout</span>
      <IconComponent type="logout" />
    </button>
  );
});

Logout.displayName = 'Logout';
