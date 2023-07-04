import { ChangeEvent, memo, useState } from 'react';

import classNames from 'classnames';
import OutsideClickHandler from 'react-outside-click-handler';
import { NavLink, useParams } from 'react-router-dom';

import { ROUTES } from '@/app/router/constants/routes';
import {
  deleteChatTreeItem,
  renameChatTreeItem,
} from '@/redux/conversations/conversationsSlice';
import { useAppDispatch } from '@/redux/hooks';
import { TreeItem } from '@/typings/common';
import { IconComponent } from '@/ui/IconComponent';
import { TextFieldComponent } from '@/ui/TextFieldComponent';

import styles from './SearchItem.module.scss';

interface SearchItemProps {
  conversationItem: TreeItem;
}

export const SearchItem = memo(({ conversationItem }: SearchItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItemName, setEditedItemName] = useState(conversationItem.name);
  const { id } = useParams();

  const dispatch = useAppDispatch();

  const onClickDelete = () => {
    setIsDeleting(true);
  };

  const onCancel = () => {
    setIsDeleting(false);
    setIsEditing(false);
    if (conversationItem.name !== editedItemName) {
      setEditedItemName(conversationItem.name);
    }
  };

  const onConfirm = () => {
    if (isDeleting) {
      dispatch(deleteChatTreeItem({ chatTreeId: conversationItem.id }));
      setIsDeleting(false);
    }
    if (isEditing) {
      if (editedItemName) {
        dispatch(
          renameChatTreeItem({
            chatTreeId: conversationItem.id,
            chatTreeName: editedItemName,
          }),
        );
      }
      setIsEditing(false);
    }
  };

  const onClickEdit = () => {
    setEditedItemName(conversationItem.name);
    setIsEditing(true);
  };

  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setEditedItemName(event.target.value);
  };

  const onOutsideClick = () => {
    if (isDeleting) {
      onCancel();
    }
  };

  return (
    <OutsideClickHandler onOutsideClick={onOutsideClick}>
      <NavLink
        to={`${ROUTES.Chat}/${conversationItem.id}`}
        className={classNames(styles.wrapper, {
          [styles.editing]: isEditing,
          [styles.selected]: conversationItem.id === id,
        })}
      >
        <IconComponent
          type="conversation"
          className={styles.conversationIcon}
        />
        {isEditing ? (
          <TextFieldComponent
            autoComplete="off"
            value={editedItemName}
            onChange={onChangeName}
            className={styles.editInput}
            autoFocus
            fullWidth
          />
        ) : (
          <span>{conversationItem.name}</span>
        )}

        {isEditing || isDeleting ? (
          <div className={styles.confirmation}>
            <IconComponent
              data-nodrag="true"
              type="confirm"
              onMouseDown={onConfirm}
            />
            <IconComponent
              data-nodrag="true"
              type="cancel"
              onMouseDown={onCancel}
            />
          </div>
        ) : (
          <div className={styles.confirmation}>
            <IconComponent
              data-nodrag="true"
              type="edit"
              onMouseDown={onClickEdit}
            />
            <IconComponent
              data-nodrag="true"
              type="deleteIcon"
              onMouseDown={onClickDelete}
            />
          </div>
        )}
      </NavLink>
    </OutsideClickHandler>
  );
});

SearchItem.displayName = 'SearchItem';
