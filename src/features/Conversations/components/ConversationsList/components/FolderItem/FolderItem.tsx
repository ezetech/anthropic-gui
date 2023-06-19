import { ChangeEvent, MouseEvent, memo, useEffect, useState } from 'react';

import classNames from 'classnames';
import { Draggable } from 'react-beautiful-dnd';

import { Drop } from '@/components/Drop';
import { PortalAwareItem } from '@/components/PortalAwareItem';
import {
  deleteConversation,
  renameFolder,
} from '@/redux/conversations/conversationsSlice';
import { useAppDispatch } from '@/redux/hooks';
import { Folder } from '@/typings/common';
import { IconComponent } from '@/ui/IconComponent';
import { TextFieldComponent } from '@/ui/TextFieldComponent';

import { ChatItem } from '../ChatItem';

import styles from './FolderItem.module.scss';

interface FolderItemProps {
  folderItem: Folder;
}

export const FolderItem = memo(({ folderItem }: FolderItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isDragging, setIsDragging] = useState(true);
  const [editedFolderName, setEditedFolderName] = useState(folderItem.name);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isDragging) {
      setIsOpened(false);
    }
  }, [isDragging]);

  const toggleOpen = () => {
    if (!isDragging) {
      setIsOpened(prev => !prev);
    }
  };

  const onClickDelete = (event: MouseEvent) => {
    event.stopPropagation();
    setIsDeleting(true);
  };

  const onCancel = (event: MouseEvent) => {
    event.stopPropagation();
    setIsDeleting(false);
    setIsEditing(false);
  };

  const onConfirm = (event: MouseEvent) => {
    event.stopPropagation();
    if (isDeleting) {
      dispatch(deleteConversation({ conversationId: folderItem.id }));
      setIsDeleting(false);
    }
    if (isEditing) {
      if (editedFolderName) {
        dispatch(
          renameFolder({
            conversationId: folderItem.id,
            name: editedFolderName,
          }),
        );
      }
      setIsEditing(false);
    }
  };

  const onClickEdit = (event: MouseEvent) => {
    event.stopPropagation();
    setIsEditing(true);
  };

  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setEditedFolderName(event.target.value);
  };

  const onMouseDownCapture = (event: MouseEvent) => {
    if (event.target === event.currentTarget) {
      setIsDragging(prev => !prev);
    }
  };

  return (
    <div>
      <div
        className={classNames(styles.wrapper, {
          [styles.editing]: isEditing,
        })}
        onClick={toggleOpen}
        onMouseDownCapture={onMouseDownCapture}
      >
        {isOpened ? (
          <IconComponent
            type="openedFolder"
            onMouseDownCapture={onMouseDownCapture}
            className={styles.folderIcon}
          />
        ) : (
          <IconComponent
            type="closedFolder"
            onMouseDownCapture={onMouseDownCapture}
            className={styles.folderIcon}
          />
        )}
        {isEditing ? (
          <TextFieldComponent
            value={editedFolderName}
            onChange={onChangeName}
            className={styles.editInput}
            autoFocus
            fullWidth
          />
        ) : (
          <span onMouseDownCapture={onMouseDownCapture}>{folderItem.name}</span>
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
      {isOpened && (
        <Drop droppableId={folderItem.id}>
          {dropProvided => (
            <div
              ref={dropProvided.innerRef}
              {...dropProvided.droppableProps}
              className={styles.nestedContent}
            >
              {folderItem.chats?.length ? (
                folderItem.chats.map((chat, index) => (
                  <Draggable key={chat.id} draggableId={chat.id} index={index}>
                    {(provided, snapshot) => (
                      <PortalAwareItem provided={provided} snapshot={snapshot}>
                        <ChatItem key={chat.id} conversationItem={chat} />
                      </PortalAwareItem>
                    )}
                  </Draggable>
                ))
              ) : (
                <div>
                  <p>Empty folder</p>
                  <p>Drag conversations to add</p>
                </div>
              )}
              {dropProvided.placeholder}
            </div>
          )}
        </Drop>
      )}
    </div>
  );
});

FolderItem.displayName = 'FolderItem';
