import { InputAdornment } from '@mui/material';

import { IconComponent } from '@/ui/IconComponent';
import { TextFieldComponent } from '@/ui/TextFieldComponent';

import styles from './Conversations.module.scss';

export const Conversations = () => (
  <div>
    <TextFieldComponent
      placeholder="Search conversation"
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconComponent type="search" className={styles.searchIcon} />
          </InputAdornment>
        ),
      }}
    />
  </div>
);
