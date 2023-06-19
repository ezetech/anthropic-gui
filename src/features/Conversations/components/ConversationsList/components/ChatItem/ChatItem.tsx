import { memo, useState } from 'react';

import classNames from 'classnames';
import OutsideClickHandler from 'react-outside-click-handler';
import { NavLink, useParams } from 'react-router-dom';

import { ROUTES } from '@/app/router/constants/routes';
import {
  deleteChatInFolder,
  deleteConversation,
} from '@/redux/conversations/conversationsSlice';
import { useAppDispatch } from '@/redux/hooks';
import { Chat } from '@/typings/common';
import { IconComponent } from '@/ui/IconComponent';

import styles from './ChatItem.module.scss';

interface ChatItemProps {
  conversationItem: Chat;
  folderId?: string;
}

export const ChatItem = memo(
  ({ conversationItem, folderId }: ChatItemProps) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const { id } = useParams();

    const dispatch = useAppDispatch();

    const onClickDelete = () => {
      setIsDeleting(true);
    };

    const onClickCancel = () => {
      setIsDeleting(false);
    };

    const onDeleteConfirm = () => {
      if (folderId) {
        dispatch(deleteChatInFolder({ chatId: conversationItem.id, folderId }));
      } else {
        dispatch(deleteConversation({ conversationId: conversationItem.id }));
      }
      setIsDeleting(false);
    };

    const onOutsideClick = () => {
      if (isDeleting) {
        onClickCancel();
      }
    };

    return (
      <OutsideClickHandler onOutsideClick={onOutsideClick}>
        <NavLink
          to={`${ROUTES.Chat}/${conversationItem.id}`}
          className={classNames(styles.wrapper, {
            [styles.selected]: conversationItem.id === id,
          })}
        >
          <IconComponent
            type="conversation"
            className={styles.conversationIcon}
          />
          <span>{conversationItem.name}</span>
          {isDeleting ? (
            <div className={styles.confirmationDelete}>
              <IconComponent type="confirm" onClick={onDeleteConfirm} />
              <IconComponent type="cancel" onClick={onClickCancel} />
            </div>
          ) : (
            <IconComponent
              type="deleteIcon"
              className={styles.deleteIcon}
              onClick={onClickDelete}
            />
          )}
        </NavLink>
      </OutsideClickHandler>
    );
  },
);

ChatItem.displayName = 'ConversationItem';
