import { createSelector } from '@reduxjs/toolkit';

import { Chat, Folder, TreeItem } from '@/typings/common';

import { RootState } from '../store';

import { flatten } from './helpers';

export const selectConversationsList = (state: RootState) =>
  state.chats.conversations;

export const selectConversationFlattenList = createSelector(
  selectConversationsList,
  conversation => flatten(conversation),
);

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
    const search = searchedName.toLowerCase();
    for (const item of items) {
      if (item.type === 'chat' && item.name.toLowerCase().includes(search)) {
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

export const selectConversationsSearchedList = (searchedName: string) =>
  createSelector(selectConversationsList, conversations =>
    searchChats(conversations, searchedName),
  );

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

export const selectChatById = (id: string) =>
  createSelector(selectConversationsList, conversations =>
    findChatById(conversations, id),
  );
