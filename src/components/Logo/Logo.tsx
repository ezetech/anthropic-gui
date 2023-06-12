import { useAppSelector } from '@/redux/hooks';
import { selectThemeMode } from '@/redux/theme/theme.selectors';
import { IconComponent } from '@/ui/IconComponent';

export const Logo = () => {
  const theme = useAppSelector(selectThemeMode);

  return (
    <div>
      {theme === 'dark' ? (
        <IconComponent type="logoDark" />
      ) : (
        <IconComponent type="logoLight" />
      )}
    </div>
  );
};
