import { ChangeEvent, memo, useState } from 'react';

import { InputAdornment } from '@mui/material';
import OutsideClickHandler from 'react-outside-click-handler';
import { useDispatch } from 'react-redux';

import { ChatsTree } from '@/features/Conversations/ChatsTree';
import { useDebounce } from '@/hooks/useDebounce';
import { selectCountConversations } from '@/redux/conversations/conversations.selectors';
import {
  clearConversations,
  saveFolder,
} from '@/redux/conversations/conversationsSlice';
import { useAppSelector } from '@/redux/hooks';
import { ButtonComponent } from '@/ui/ButtonComponent';
import { IconComponent } from '@/ui/IconComponent';
import { TextFieldComponent } from '@/ui/TextFieldComponent';

import { ChatsTreeSearch } from './ChatsTreeSearch';

import styles from './Conversations.module.scss';

export const Conversations = memo(() => {
  const [isClearing, setIsClearing] = useState(false);
  const dispatch = useDispatch();
  const [searchedName, setSearchedName] = useState('');
  const debouncedSearch = useDebounce(searchedName, 500);
  const conversationLength = useAppSelector(selectCountConversations);

  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchedName(event.target.value);
  };

  const onClickNewFolder = () => {
    dispatch(saveFolder({ name: 'New Folder' }));
  };

  const onClickClear = () => {
    setIsClearing(true);
  };

  const onClickCancel = () => {
    setIsClearing(false);
  };

  const onClearConfirm = () => {
    dispatch(dispatch(clearConversations()));
    setIsClearing(false);
  };

  const onOutsideClick = () => {
    onClickCancel();
  };

  return (
    <>
      <TextFieldComponent
        placeholder="Search conversation"
        fullWidth
        onChange={onSearchChange}
        value={searchedName}
        autoComplete="off"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconComponent type="search" className={styles.searchIcon} />
            </InputAdornment>
          ),
        }}
      />
      <div className={styles.header}>
        <p>{`Conversations (${conversationLength})`}</p>
        <OutsideClickHandler onOutsideClick={onOutsideClick}>
          {isClearing ? (
            <div className={styles.confirmationClear}>
              <IconComponent type="confirm" onClick={onClearConfirm} />
              <IconComponent type="cancel" onClick={onClickCancel} />
            </div>
          ) : (
            <ButtonComponent onClick={onClickClear} variant="text">
              Clear
            </ButtonComponent>
          )}
        </OutsideClickHandler>
      </div>
      <div className={styles.newFolder} onClick={onClickNewFolder}>
        <button>
          <IconComponent type="newFolder" />
        </button>
        <span>Add new folder</span>
      </div>
      {debouncedSearch ? (
        <ChatsTreeSearch searchName={debouncedSearch} />
      ) : (
        <div className={styles.treeContainer}>
          <ChatsTree collapsible removable />
        </div>
      )}
    </>
  );
});

Conversations.displayName = 'Conversations';
