import { createSelector } from '@reduxjs/toolkit';

import { Chat, Folder } from '@/typings/common';
import { FlattenedItem, TreeItem, TreeItems } from '@/typings/types';

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

export const selectConversationsList = (state: RootState) =>
  state.chats.conversations;

export const selectConversationFlattenList = (state: RootState) =>
  flatten(state.chats.conversations);

export const selectCountConversations = createSelector(
  selectConversationsList,
  conversation => {
    let countItems = 0;
    for (const item of conversation) {
      if (item.type === 'chat') {
        countItems += 1;
      }
      if (item.children?.length) {
        countItems += item.children.length;
      }
    }
    return countItems;
  },
);

export const searchChats = (
  conversations: TreeItem[],
  searchedName: string,
): TreeItem[] => {
  const newItems: TreeItem[] = [];

  const searchRecursively = (items: TreeItem[]) => {
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
  conversations: TreeItem[],
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
