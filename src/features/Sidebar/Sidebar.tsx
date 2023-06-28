import { memo } from 'react';

import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/app/router/constants/routes';
import { Logo } from '@/components/Logo';
import { Logout } from '@/components/Logout';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Conversations } from '@/features/Conversations';
import { ButtonComponent } from '@/ui/ButtonComponent';
import { IconComponent } from '@/ui/IconComponent';

import styles from './Sidebar.module.scss';

interface SidebarProps {
  className?: string;
}

export const Sidebar = memo(({ className }: SidebarProps) => {
  const navigate = useNavigate();

  const onClickNewChat = () => {
    navigate(ROUTES.Home);
  };

  return (
    <div className={classNames(className, styles.wrapper)}>
      <Logo />
      <ButtonComponent onClick={onClickNewChat}>
        <span>New Chat</span>
        <IconComponent type="plus" className={styles.newChatIcon} />
      </ButtonComponent>
      <Conversations />
      <div className={styles.bottomItems}>
        <ThemeSwitcher />
        <Logout />
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';
