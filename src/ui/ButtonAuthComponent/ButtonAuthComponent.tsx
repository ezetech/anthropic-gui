import { memo } from 'react';

import Button, { ButtonProps } from '@mui/material/Button';
import classNames from 'classnames';

import styles from './ButtonAuthComponents.module.scss';

export const ButtonAuthComponent = memo((props: ButtonProps) => {
  const { variant = 'contained', disabled } = props;
  return (
    <Button
      {...props}
      variant={variant}
      disabled={disabled}
      className={classNames(
        styles.button,
        styles.buttonWrapper,
        props.className,
        { [styles.disabled]: disabled },
      )}
    />
  );
});

ButtonAuthComponent.displayName = 'ButtonAuthComponent';
