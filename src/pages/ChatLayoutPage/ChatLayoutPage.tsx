import { PropsWithChildren } from 'react';

import classNames from 'classnames';

import { ApiSettings } from '@/features/ApiSettings';
import { Sidebar } from '@/features/Sidebar';

import styles from './ChatLayoutPage.module.scss';

export const ChatLayoutPage = ({ children }: PropsWithChildren) => (
  <div className={classNames(['app', styles.wrapper])}>
    <Sidebar />
    {children}
    <ApiSettings />
  </div>
);
