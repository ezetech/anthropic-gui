import { FocusEvent } from 'react';

import { TextField } from '@mui/material';
import classNames from 'classnames';

import { IconComponent } from '@/ui/IconComponent';

import styles from './Prompts.module.scss';

interface EditablePromptProps {
  deletePromptRow: (id: string) => () => void;
  id: string;
  handlePromptBlur: (
    id: string,
  ) => (event: FocusEvent<HTMLTextAreaElement>) => void;
  type: 'human' | 'assistant';
  closeEditing?: () => void;
  text: string;
}

export const EditablePrompt = ({
  deletePromptRow,
  handlePromptBlur,
  id,
  type,
  closeEditing,
  text,
}: EditablePromptProps) => {
  const onBlur = (event: FocusEvent<HTMLTextAreaElement>) => {
    closeEditing?.();
    handlePromptBlur(id)(event);
  };
  return (
    <div className={styles.promptContainer}>
      <IconComponent type={type === 'human' ? 'human' : 'ai'} />
      <div className={styles.textAreaContainer}>
        <div className={styles.textAreaLabel}>
          {type === 'human' ? 'You' : 'AI'}
        </div>
        <div
          className={styles.textAreaDeleteIcon}
          onClick={deletePromptRow(id)}
        >
          <IconComponent type="deleteIcon" className={styles.iconDelete} />
        </div>
        <TextField
          multiline
          className={classNames(styles.textAreaMuiContainer)}
          InputProps={{
            className: styles.textArea,
          }}
          defaultValue={text}
          onBlur={onBlur}
          autoFocus
        />
      </div>
    </div>
  );
};
