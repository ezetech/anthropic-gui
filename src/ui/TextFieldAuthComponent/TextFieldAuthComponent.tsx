import { memo } from 'react';

import TextField, { TextFieldProps } from '@mui/material/TextField';
import classNames from 'classnames';

import styles from './TextFieldAuthComponent.module.scss';

export const TextFieldAuthComponent = memo((props: TextFieldProps) => (
  <TextField
    {...props}
    className={classNames(
      styles.textField,
      styles.wrapper,
      props.className,
      props.error && styles.invalid,
    )}
  />
));

TextFieldAuthComponent.displayName = 'TexFieldAuthComponent';
