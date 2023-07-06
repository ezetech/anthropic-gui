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
          borderRadius: '8px',
          border: '1px solid #AEAEAE',
          transition: '0.3s',
        },
        '&:hover fieldset': {
          borderColor: '#000000',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#6129ff',
          borderWidth: '1px',
        },
      },
      '& .MuiOutlinedInput-root.Mui-error': {
        '& fieldset': {
          borderColor: '#eb4040',
        },
        '& input': {
          color: '#eb4040',
        },
        '&:hover fieldset': {
          borderColor: '#eb4040',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#eb4040',
          borderWidth: '1px',
        },
      },
    }}
  />
));

TextFieldAuthComponent.displayName = 'TexFieldAuthComponent';
