import { ApiSettings } from '@/features/ApiSettings';
import { Sidebar } from '@/features/Sidebar';

import styles from './HomePage.module.scss';

export const HomePage = () => (
  <div className={styles.wrapper}>
    <Sidebar />
    <div style={{ textAlign: 'center', padding: '25px' }}>Chat</div>
    <ApiSettings />
  </div>
);
