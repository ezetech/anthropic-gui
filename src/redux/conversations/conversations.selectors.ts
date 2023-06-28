import { Chat, Folder } from '@/typings/common';
import { FlattenedItem, TreeItems } from '@/typings/types';

import { RootState } from '../store';

export const flatten = (
  items: TreeItems,
  parentType: string | null = null,
  parentId: string | null = null,
  depth = 0,
): FlattenedItem[] =>
  items?.reduce<FlattenedItem[]>(
    (acc, item, index) => [
      ...acc,
      { ...item, parentType, parentId, depth, index },
      ...flatten(item.children, item.type, item.id, depth + 1),
    ],
    [],
  );

const countChatsTree = (items: any[], chatType = 'chat'): number => {
  let countItems = 0;
  for (const item of items) {
    if (item.type === chatType) {
      countItems += 1;
    }
    if (item.children.length) {
      countItems += countChatsTree(item.children, chatType);
    }
  }
  return countItems;
};

export const selectConversationsList = (state: RootState) =>
  state.chats.conversations;

export const selectConversationFlattenList = (state: RootState) =>
  flatten(state.chats.conversations);

export const selectCountConversations = (state: RootState) =>
  countChatsTree(state.chats.conversations, 'chat');

export const searchChats = (
  conversations: any[],
  searchedName: string,
): any[] => {
  const newItems: any[] = [];

  const searchRecursively = (items: any[]) => {
    for (const item of items) {
      if (item.name === searchedName && item.type === 'chat') {
        newItems.push(item);
      }

      if (item?.children?.length) {
        searchRecursively(item.children);
      }
    }
  };

  searchRecursively(conversations);
  return newItems;
};

export const selectConversationsSearchedList =
  (searchedName: string) => (state: RootState) =>
    searchChats(state.chats.conversations, searchedName);

export const findChatById = (
  conversations: (Chat | Folder)[],
  id: string,
): Chat | undefined => {
  let result: Chat | undefined;

  for (const item of conversations) {
    if (item.type === 'chat' && item.id === id) {
      result = item as Chat;

      break;
    }

    if (item.type === 'folder') {
      const folder = item as Folder;
      if (folder.children) {
        result = findChatById(folder.children, id);
        if (result) {
          break;
        }
      }
    }
  }

  return result;
};

export const selectChatById = (id: string) => (state: RootState) =>
  findChatById(state.chats.conversations, id);
