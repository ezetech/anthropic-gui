import { HTMLAttributes, memo } from 'react';

import { ReactComponent as ai } from '@/assets/icons/ai.svg';
import { ReactComponent as aiResponse } from '@/assets/icons/aiResponse.svg';
import { ReactComponent as arrowDown } from '@/assets/icons/arrow-down.svg';
import { ReactComponent as backgroundChatDark } from '@/assets/icons/backgroundChat-dark.svg';
import { ReactComponent as backgroundChatLight } from '@/assets/icons/backgroundChat-light.svg';
import { ReactComponent as cancel } from '@/assets/icons/cancel.svg';
import { ReactComponent as close } from '@/assets/icons/close.svg';
import { ReactComponent as closedFolder } from '@/assets/icons/closed-folder.svg';
import { ReactComponent as confirm } from '@/assets/icons/confirm.svg';
import { ReactComponent as conversation } from '@/assets/icons/conversation.svg';
import { ReactComponent as copy } from '@/assets/icons/copy.svg';
import { ReactComponent as deleteIcon } from '@/assets/icons/delete.svg';
import { ReactComponent as edit } from '@/assets/icons/edit.svg';
import { ReactComponent as heart } from '@/assets/icons/heart.svg';
import { ReactComponent as human } from '@/assets/icons/human.svg';
import { ReactComponent as logoDark } from '@/assets/icons/logo-dark.svg';
import { ReactComponent as logoLight } from '@/assets/icons/logo-light.svg';
import { ReactComponent as logout } from '@/assets/icons/logout.svg';
import { ReactComponent as newFolder } from '@/assets/icons/new-folder.svg';
import { ReactComponent as openedFolder } from '@/assets/icons/opened-folder.svg';
import { ReactComponent as plus } from '@/assets/icons/plus.svg';
import { ReactComponent as regenerate } from '@/assets/icons/regenerate.svg';
import { ReactComponent as search } from '@/assets/icons/search.svg';
import { ReactComponent as stop } from '@/assets/icons/stop.svg';
import { ReactComponent as submit } from '@/assets/icons/submit.svg';
import { ReactComponent as themeDark } from '@/assets/icons/theme-dark.svg';
import { ReactComponent as themeLight } from '@/assets/icons/theme-light.svg';
import { ReactComponent as warning } from '@/assets/icons/warning.svg';

const ICONS = {
  themeLight,
  themeDark,
  arrowDown,
  logoDark,
  logoLight,
  logout,
  plus,
  search,
  newFolder,
  conversation,
  closedFolder,
  openedFolder,
  edit,
  deleteIcon,
  confirm,
  cancel,
  ai,
  aiResponse,
  human,
  backgroundChatLight,
  regenerate,
  submit,
  warning,
  heart,
  copy,
  backgroundChatDark,
  stop,
  close,
} as const;

export type IconType = keyof typeof ICONS;

interface IconComponentsProps extends HTMLAttributes<SVGElement> {
  type?: IconType;
  className?: string;
}

export const IconComponent = memo(
  ({ type, className, ...otherProps }: IconComponentsProps) => {
    if (!type) {
      return null;
    }

    const NewIcon = ICONS[type];
    return <NewIcon className={className} {...otherProps} />;
  },
);

IconComponent.displayName = 'IconComponent';
