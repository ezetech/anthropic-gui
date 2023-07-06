import { memo } from 'react';

import TextField, { TextFieldProps } from '@mui/material/TextField';
import classNames from 'classnames';

import styles from './TextFieldAuthComponent.module.scss';

export const TextFieldAuthComponent = memo((props: TextFieldProps) => (
  <TextField
    {...props}
    error={props.error}
    className={classNames(
      styles.textField,
      styles.wrapper,
      props.className,
      props.error,
    )}
    sx={{
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          border: '1px solid #AEAEAE',
        },
        '&:hover fieldset': {
          borderColor: '#AEAEAE',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#6129ff',
        },
      },
      '& .MuiOutlinedInput-root.Mui-error': {
        '& fieldset': {
          borderColor: '#eb4040',
        },
        '&:hover fieldset': {
          borderColor: '#eb4040',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#eb4040',
        },
      },
    }}
  />
));

TextFieldAuthComponent.displayName = 'TexFieldAuthComponent';
