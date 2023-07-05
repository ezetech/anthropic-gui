import { createSelector } from '@reduxjs/toolkit';

import { TreeItem } from '@/typings/common';

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
  conversations => {
    let countItems = 0;
    if (!conversations?.length) {
      return 0;
    }
    for (const item of conversations) {
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
): TreeItem | undefined => {
  let result: TreeItem | undefined;
  if (!conversations?.length) {
    return;
  }
  for (const item of conversations) {
    if (item.type === 'chat' && item.id === id) {
      result = item as TreeItem;

      break;
    }

    if (item.children?.length) {
      result = findChatById(item.children, id);
      if (result) {
        break;
      }
    }
  }

  return result;
};

export const selectChatById = (id: string) =>
  createSelector(selectConversationsList, conversations =>
    findChatById(conversations, id),
  );
