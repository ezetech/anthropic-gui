import { ReactNode, memo } from 'react';

import Button, { ButtonProps } from '@mui/material/Button';
import classNames from 'classnames';

import styles from './ButtonComponents.module.scss';

interface ButtonComponentProps extends ButtonProps {
  children: ReactNode;
}

export const ButtonComponent = memo((props: ButtonComponentProps) => {
  const { variant = 'contained', className } = props;

  return (
    <Button
      {...props}
      variant={variant}
      className={classNames([
        styles.button,
        styles.buttonWrapper,
        styles[variant],
        className,
      ])}
    >
      {props.children}
    </Button>
  );
});

ButtonComponent.displayName = 'ButtonComponent';
