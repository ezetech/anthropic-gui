import { memo } from 'react';

import { ReactComponent as arrowDown } from '@/assets/icons/arrow-down.svg';
import { ReactComponent as logoDark } from '@/assets/icons/logo-dark.svg';
import { ReactComponent as logoLight } from '@/assets/icons/logo-light.svg';
import { ReactComponent as logout } from '@/assets/icons/logout.svg';
import { ReactComponent as plus } from '@/assets/icons/plus.svg';
import { ReactComponent as search } from '@/assets/icons/search.svg';
import { ReactComponent as themeDark } from '@/assets/icons/theme-dark.svg';
import { ReactComponent as themeLight } from '@/assets/icons/theme-light.svg';

const ICONS = {
  themeLight,
  themeDark,
  arrowDown,
  logoDark,
  logoLight,
  logout,
  plus,
  search,
} as const;

export type IconType = keyof typeof ICONS;

export const IconComponent = memo(
  ({ type, className }: { type?: IconType; className?: string }) => {
    if (!type) {
      return null;
    }

    const NewIcon = ICONS[type];
    return <NewIcon className={className} />;
  },
);

IconComponent.displayName = 'IconComponent';
