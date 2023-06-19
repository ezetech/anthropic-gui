import { DragDropContext, Draggable } from 'react-beautiful-dnd';

import { Drop } from '@/components/Drop';
import { PortalAwareItem } from '@/components/PortalAwareItem';
import { selectConversationsList } from '@/redux/conversations/conversations.selectors';
import {
  moveChatFromFolderToFolder,
  moveChatToFolder,
  moveChatToGeneralList,
  reorderConversation,
} from '@/redux/conversations/conversationsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

import { ChatItem } from './components/ChatItem';
import { FolderItem } from './components/FolderItem';

import styles from './ConversationsList.module.scss';

export const ConversationsDraggableList = () => {
  const conversations = useAppSelector(selectConversationsList);

  const dispatch = useAppDispatch();

  const onDragEnd = (result: any) => {
    const { source, destination, draggableId } = result;

    const sourceId = source?.droppableId;
    const destinationId = destination?.droppableId;

    const isSourceInFolder = sourceId !== 'conversations';
    const isDestinationInFolder = destinationId !== 'conversations';

    if (!destination) return;

    if (isSourceInFolder && isDestinationInFolder) {
      dispatch(
        moveChatFromFolderToFolder({
          sourceFolderId: sourceId,
          sourceIndex: source.index,
          destinationFolderId: destinationId,
          destinationIndex: destination.index,
        }),
      );
    } else if (!isSourceInFolder && isDestinationInFolder) {
      const conversationItem = conversations.find(
        ({ id }) => id === draggableId,
      );

      if (conversationItem?.type !== 'folder') {
        dispatch(
          moveChatToFolder({
            sourceIndex: source.index,
            destinationFolderId: destinationId,
            destinationIndex: destination.index,
          }),
        );
      }
    } else if (isSourceInFolder && !isDestinationInFolder) {
      dispatch(
        moveChatToGeneralList({
          sourceFolderId: sourceId,
          endIndex: destination.index,
          startIndex: source.index,
        }),
      );
    } else {
      dispatch(
        reorderConversation({
          startIndex: source.index,
          endIndex: destination.index,
        }),
      );
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Drop droppableId="conversations" ignoreContainerClipping>
        {dropProvided => (
          <div
            ref={dropProvided.innerRef}
            {...dropProvided.droppableProps}
            className={styles.wrapper}
          >
            {conversations?.length
              ? conversations.map((conversation, index) => (
                  <Draggable
                    key={conversation.id}
                    draggableId={conversation.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <PortalAwareItem provided={provided} snapshot={snapshot}>
                        {conversation.type === 'folder' ? (
                          <FolderItem folderItem={conversation} />
                        ) : (
                          <ChatItem conversationItem={conversation} />
                        )}
                      </PortalAwareItem>
                    )}
                  </Draggable>
                ))
              : null}
            {dropProvided.placeholder}
          </div>
        )}
      </Drop>
    </DragDropContext>
  );
};
