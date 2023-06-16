import { PropsWithChildren } from 'react';

import { ApiSettings } from '@/features/ApiSettings';
import { Sidebar } from '@/features/Sidebar';

import styles from './ChatLayoutPage.module.scss';

export const ChatLayoutPage = ({ children }: PropsWithChildren) => (
  <div className={styles.wrapper}>
    <Sidebar />
    {children}
    <ApiSettings />
  </div>
);
