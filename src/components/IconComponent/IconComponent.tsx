import { memo } from 'react';

import { ReactComponent as themeDark } from '@/assets/icons/theme-dark.svg';
import { ReactComponent as themeLight } from '@/assets/icons/theme-light.svg';

const ICONS = {
  themeLight,
  themeDark,
} as const;

export type IconType = keyof typeof ICONS;

export const IconComponent = memo(({ type }: { type: IconType }) => {
  const NewIcon = ICONS[type];
  return <NewIcon />;
});

IconComponent.displayName = 'IconComponent';
