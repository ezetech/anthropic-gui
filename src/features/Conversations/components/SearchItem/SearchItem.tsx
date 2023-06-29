import { memo, useState } from 'react';

import classNames from 'classnames';
import OutsideClickHandler from 'react-outside-click-handler';
import { NavLink, useParams } from 'react-router-dom';

import { ROUTES } from '@/app/router/constants/routes';
import { deleteChatTreeItem } from '@/redux/conversations/conversationsSlice';
import { useAppDispatch } from '@/redux/hooks';
import { TreeItem } from '@/typings/types';
import { IconComponent } from '@/ui/IconComponent';

import styles from './SearchItem.module.scss';

interface SearchItemProps {
  conversationItem: TreeItem;
}

export const SearchItem = memo(({ conversationItem }: SearchItemProps) => {
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
    dispatch(deleteChatTreeItem({ chatTreeId: conversationItem.id }));

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
});

SearchItem.displayName = 'SearchItem';
