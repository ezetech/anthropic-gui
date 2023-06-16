import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import { Chat, ChatContent, Folder } from '@/typings/common';

// TODO remove after tests
export const conversationExamples: (Chat | Folder)[] = [
  {
    createdAt: new Date(),
    id: uuidv4(),
    name: 'Some conversation',
    type: 'chat',
    content: [{ text: 'Some conversation', type: 'human' }],
  },
  {
    createdAt: new Date(),
    id: uuidv4(),
    name: 'Some conversation 2',
    type: 'chat',
    content: [{ text: 'Some conversation 2', type: 'human' }],
  },
  {
    createdAt: new Date(),
    id: uuidv4(),
    name: 'Some conversation',
    type: 'chat',
    content: [{ text: 'Some conversation', type: 'human' }],
  },
  {
    createdAt: new Date(),
    id: uuidv4(),
    name: 'Typescript',
    type: 'chat',
    content: [{ text: 'Some conversation 2', type: 'human' }],
  },
  {
    createdAt: new Date(),
    id: uuidv4(),
    name: 'Some conversation',
    type: 'chat',
    content: [{ text: 'Some conversation', type: 'human' }],
  },
  {
    createdAt: new Date(),
    id: uuidv4(),
    name: 'Some conversation',
    type: 'chat',
    content: [{ text: 'Some conversation 2', type: 'human' }],
  },
  {
    createdAt: new Date(),
    id: uuidv4(),
    name: 'Some conversation',
    type: 'chat',
    content: [{ text: 'Some conversation', type: 'human' }],
  },
  {
    createdAt: new Date(),
    id: uuidv4(),
    name: 'Some conversation 2',
    type: 'chat',
    content: [{ text: 'Some conversation 2', type: 'human' }],
  },
  {
    createdAt: new Date(),
    id: uuidv4(),
    name: 'Typescript',
    type: 'chat',
    content: [{ text: 'Some conversation', type: 'human' }],
  },
  {
    createdAt: new Date(),
    id: uuidv4(),
    name: 'React',
    type: 'chat',
    content: [{ text: 'Some conversation 2', type: 'human' }],
  },
  {
    createdAt: new Date(),
    id: uuidv4(),
    name: 'Some Folder 3',
    type: 'folder',
    chats: [
      {
        createdAt: new Date(),
        id: uuidv4(),
        name: 'Internet',
        type: 'chat',
        content: [{ text: 'Some conversation 2', type: 'human' }],
      },
      {
        createdAt: new Date(),
        id: uuidv4(),
        name: 'What is Love?',
        type: 'chat',
        content: [{ text: 'Some conversation 2', type: 'human' }],
      },
    ],
  },
];

interface ConversationsState {
  conversations: (Chat | Folder)[];
}

const initialState: ConversationsState = {
  conversations: [],
  // conversations: conversationExamples, // TODO remove after tests
};

export const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    saveChat: (
      state,
      action: PayloadAction<Omit<Chat, 'type' | 'id' | 'createdAt'>>,
    ) => {
      state.conversations.unshift({
        type: 'chat',
        id: uuidv4(),
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
    renameConversation: (
      state,
      action: PayloadAction<{ conversationId: string; name: string }>,
    ) => {
      const { conversationId, name } = action.payload;
      const conversationToRename = state.conversations.find(
        conversation => conversation.id === conversationId,
      );
      if (conversationToRename) {
        conversationToRename.name = name;
      }
    },
    updateChatContent: (
      state,
      action: PayloadAction<{ chatId: string; contents: ChatContent[] }>,
    ) => {
      const { chatId, contents } = action.payload;
      const chatToUpdate = state.conversations.find(
        conversation => conversation.id === chatId,
      );
      if (chatToUpdate) {
        (chatToUpdate as Chat).content = contents;
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
  renameConversation,
  reorderConversation,
  saveFolder,
  updateChatContent,
  clearConversations,
  moveChatFromFolderToFolder,
  moveChatToFolder,
  moveChatToGeneralList,
  moveChatFromGeneralListToFolder,
} = conversationsSlice.actions;
