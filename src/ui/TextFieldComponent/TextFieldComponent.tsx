import { memo } from 'react';

import InputAdornment from '@mui/material/InputAdornment';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import classNames from 'classnames';

import { IconComponent, IconType } from '../IconComponent';

import styles from './TextFieldComponent.module.scss';

type TextFieldComponentsProps = TextFieldProps & {
  iconType?: IconType;
};

export const TextFieldComponent = memo((props: TextFieldComponentsProps) => (
  <TextField
    {...props}
    className={classNames(styles.textField, styles.wrapper)}
    InputProps={{
      startAdornment: props.iconType && (
        <InputAdornment position="start">
          <IconComponent type={props.iconType} />
        </InputAdornment>
      ),
      ...props.InputProps,
    }}
  />
));
TextFieldComponent.displayName = 'TexFieldComponent';
