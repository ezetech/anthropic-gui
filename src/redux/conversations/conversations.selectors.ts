import { Chat, Folder } from '@/typings/common';

import { RootState } from '../store';

export const selectConversationsList = (state: RootState) =>
  state.chats.conversations;

const searchChats = (
  conversations: (Chat | Folder)[],
  searchedName: string,
): Chat[] => {
  let result: Chat[] = [];
  const search = searchedName.toLowerCase();

  conversations.forEach(item => {
    if (item.type === 'chat' && item.name.toLowerCase().includes(search)) {
      result.push(item as Chat);
    }

    if (item.type === 'folder') {
      const folder = item as Folder;
      if (folder.chats) {
        const folderChats = searchChats(folder.chats, search);
        result = [...result, ...folderChats];
      }
    }
  });

  return result;
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
      if (folder.chats) {
        result = findChatById(folder.chats, id);
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
