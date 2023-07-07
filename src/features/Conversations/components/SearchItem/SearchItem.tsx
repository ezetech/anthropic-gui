import { ChangeEvent, memo, useState } from 'react';

import classNames from 'classnames';
import OutsideClickHandler from 'react-outside-click-handler';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

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
  const navigation = useNavigate();

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
        const trimmedName = editedItemName.trim();
        setEditedItemName(trimmedName);
        dispatch(
          renameChatTreeItem({
            chatTreeId: conversationItem.id,
            chatTreeName: trimmedName,
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
    if (isDeleting || isEditing) {
      onCancel();
    }
  };

  const onItemMouseDown = () => {
    navigation(`${ROUTES.Chat}/${conversationItem.id}`);
  };

  return (
    <OutsideClickHandler onOutsideClick={onOutsideClick}>
      <li className={classNames(styles.Wrapper)}>
        <div
          className={classNames(styles.wrapperItem, {
            [styles.editing]: isEditing,
            [styles.selected]: conversationItem.id === id,
          })}
          onMouseDown={onItemMouseDown}
        >
          <div className={styles.itemName}>
            <IconComponent
              className={styles.conversationIcon}
              type="conversation"
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
              <NavLink
                to={`${ROUTES.Chat}/${conversationItem.id}`}
                className={classNames({
                  [styles.selected]: conversationItem.id === id,
                })}
              >
                <span
                  className={classNames(styles.TextChat, {
                    [styles.selected]: conversationItem.id === id,
                  })}
                >
                  {conversationItem.name}
                </span>
              </NavLink>
            )}

            {isEditing || isDeleting ? (
              <div className={styles.confirmation}>
                <IconComponent type="confirm" onClick={onConfirm} />
                <IconComponent type="cancel" onClick={onCancel} />
              </div>
            ) : (
              <div className={styles.settings}>
                <IconComponent type="edit" onClick={onClickEdit} />
                <IconComponent type="deleteIcon" onClick={onClickDelete} />
              </div>
            )}
          </div>
        </div>
      </li>
    </OutsideClickHandler>
  );
});

SearchItem.displayName = 'SearchItem';
