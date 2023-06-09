import { SyntheticEvent, useState } from 'react';

import { FormControl } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import classNames from 'classnames';

import { ReactComponent as arrowDown } from '@/assets/icons/arrow-down.svg';

import { SelectComponentProps } from './selectTypes';

import styles from './SelectComponent.module.scss';

export const SelectComponent = (props: SelectComponentProps) => {
  const { selectItems, ...otherProps } = props;
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = (event: SyntheticEvent<Element>) => {
    event.stopPropagation();
    setIsOpen(false);
  };

  const handleOpen = (event: SyntheticEvent<Element>) => {
    event.stopPropagation();
    setIsOpen(true);
  };

  return (
    <FormControl className={styles.wrapper} onClick={handleOpen} fullWidth>
      <InputLabel className={styles.label}>{props.label}</InputLabel>
      <Select
        {...otherProps}
        open={isOpen}
        onClose={handleClose}
        onOpen={handleOpen}
        variant="outlined"
        className={classNames(styles.select, { [styles.open]: isOpen })}
        IconComponent={arrowDown}
      >
        {selectItems.map(({ label, value }) => (
          <MenuItem value={value} key={value}>
            {label ?? value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
