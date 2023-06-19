import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import { Chat, ChatContent, Folder } from '@/typings/common';

import { findChatById } from './conversations.selectors';

interface ConversationsState {
  conversations: (Chat | Folder)[];
}

const initialState: ConversationsState = {
  conversations: [],
};

export const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    saveChat: (
      state,
      action: PayloadAction<Omit<Chat, 'type' | 'createdAt'>>,
    ) => {
      state.conversations.unshift({
        type: 'chat',
        createdAt: new Date(),
        ...action.payload,
      });
    },
    saveFolder: (
      state,
      action: PayloadAction<Omit<Folder, 'type' | 'id' | 'createdAt'>>,
    ) => {
      state.conversations.unshift({
        type: 'folder',
        id: uuidv4(),
        createdAt: new Date(),
        chats: [],
        ...action.payload,
      });
    },
    renameFolder: (
      state,
      action: PayloadAction<{ conversationId: string; name: string }>,
    ) => {
      const { conversationId, name } = action.payload;
      const conversationToRename = state.conversations.find(
        ({ id }) => id === conversationId,
      );
      if (conversationToRename) {
        conversationToRename.name = name;
      }
    },
    renameChat: (
      state,
      action: PayloadAction<{ conversationId: string; name: string }>,
    ) => {
      const { conversationId, name } = action.payload;
      const conversationToRename = findChatById(
        state.conversations,
        conversationId,
      );
      if (conversationToRename) {
        conversationToRename.name = name;
      }
    },
    updateChatContents: (
      state,
      action: PayloadAction<{ chatId: string; contents: ChatContent[] }>,
    ) => {
      const { chatId, contents } = action.payload;
      const chatToUpdate = findChatById(state.conversations, chatId);
      if (chatToUpdate) {
        (chatToUpdate as Chat).content = contents;
      }
    },
    updateContentById: (
      state,
      action: PayloadAction<{
        chatId: string;
        contentId: string;
        text: string;
      }>,
    ) => {
      const { chatId, contentId, text } = action.payload;
      const chat = findChatById(state.conversations, chatId);

      const contentToUpdate = chat?.content?.find(
        content => content.id === contentId,
      );
      if (contentToUpdate) {
        contentToUpdate.text = text;
      }
    },
    addPromptToChat: (
      state,
      action: PayloadAction<{ chatId: string; content: ChatContent }>,
    ) => {
      const { chatId, content } = action.payload;

      const chat = findChatById(state.conversations, chatId);

      if (chat && chat.content) {
        chat.content.push(content);
      } else if (chat) {
        chat.content = [content];
      }
    },
    deleteConversation: (
      state,
      action: PayloadAction<{ conversationId: string }>,
    ) => {
      state.conversations = state.conversations.filter(
        conversation => conversation.id !== action.payload.conversationId,
      );
    },
    deleteChatInFolder: (
      state,
      action: PayloadAction<{ chatId: string; folderId: string }>,
    ) => {
      const { chatId, folderId } = action.payload;

      const folder = state.conversations.find(
        ({ id }) => id === folderId,
      ) as Folder;

      if (folder) {
        folder.chats = folder.chats?.filter(chat => chat.id !== chatId);
      }
    },

    reorderConversation: (
      state,
      action: PayloadAction<{ startIndex: number; endIndex: number }>,
    ) => {
      const { endIndex, startIndex } = action.payload;
      const [removed] = state.conversations.splice(startIndex, 1);
      state.conversations.splice(endIndex, 0, removed);
    },
    moveChatToGeneralList: (
      state,
      action: PayloadAction<{
        sourceFolderId: string;
        startIndex: number;
        endIndex: number;
      }>,
    ) => {
      const { sourceFolderId, endIndex, startIndex } = action.payload;

      const sourceFolder = state.conversations.find(
        folder => folder.id === sourceFolderId,
      ) as Folder;

      if (sourceFolder.chats) {
        const [removed] = sourceFolder.chats.splice(startIndex, 1);
        state.conversations.splice(endIndex, 0, removed);
      }
    },
    moveChatFromGeneralListToFolder: (
      state,
      action: PayloadAction<{
        destinationFolderId: string;
        startIndex: number;
        endIndex: number;
      }>,
    ) => {
      const { destinationFolderId, endIndex, startIndex } = action.payload;

      const destinationFolder = state.conversations.find(
        folder => folder.id === destinationFolderId,
      ) as Folder;

      const [removed] = state.conversations.splice(startIndex, 1);
      destinationFolder.chats?.splice(endIndex, 0, removed as Chat);
    },

    moveChatToFolder: (
      state,
      action: PayloadAction<{
        sourceIndex: number;
        destinationFolderId: string;
        destinationIndex: number;
      }>,
    ) => {
      const { sourceIndex, destinationFolderId, destinationIndex } =
        action.payload;

      const destinationFolder = state.conversations.find(
        folder => folder.id === destinationFolderId,
      ) as Folder;

      const [removed] = state.conversations.splice(sourceIndex, 1);
      destinationFolder.chats?.splice(destinationIndex, 0, removed as Chat);
    },
    moveChatFromFolderToFolder: (
      state,
      action: PayloadAction<{
        sourceFolderId: string;
        sourceIndex: number;
        destinationFolderId: string;
        destinationIndex: number;
      }>,
    ) => {
      const {
        sourceFolderId,
        sourceIndex,
        destinationFolderId,
        destinationIndex,
      } = action.payload;

      const sourceFolder = state.conversations.find(
        folder => folder.id === sourceFolderId,
      ) as Folder;
      const destinationFolder = state.conversations.find(
        folder => folder.id === destinationFolderId,
      ) as Folder;

      if (sourceFolder.chats) {
        const [removed] = sourceFolder.chats.splice(sourceIndex, 1);
        destinationFolder?.chats?.splice(destinationIndex, 0, removed);
      }
    },

    clearConversations: () => initialState,
  },
});

export const {
  saveChat,
  deleteConversation,
  renameChat,
  reorderConversation,
  saveFolder,
  updateChatContents,
  clearConversations,
  moveChatFromFolderToFolder,
  moveChatToFolder,
  moveChatToGeneralList,
  moveChatFromGeneralListToFolder,
  addPromptToChat,
  updateContentById,
  renameFolder,
  deleteChatInFolder,
} = conversationsSlice.actions;
