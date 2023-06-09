import { memo } from 'react';

import TextField, { TextFieldProps } from '@mui/material/TextField';
import classNames from 'classnames';

import styles from './TextFieldComponent.module.scss';

export const TextFieldComponent = memo((props: TextFieldProps) => (
  <TextField
    {...props}
    className={classNames(styles.textField, styles.wrapper, props.className)}
    sx={{
      '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
          borderWidth: '1px',
          borderColor: 'var(--primary-color)',
        },
      },
    }}
  />
));
TextFieldComponent.displayName = 'TexFieldComponent';
