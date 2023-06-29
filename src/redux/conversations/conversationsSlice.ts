import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import { ChatContent, TreeItem, TreeItems } from '@/typings/types';

import { findChatById } from './conversations.selectors';

interface ConversationsState {
  conversations: TreeItem[];
}

const initialState: ConversationsState = {
  conversations: [],
};

const renameChatTree = (
  items: TreeItem[],
  chatTreeId: string,
  chatTreeName: string,
): TreeItem[] =>
  items.map(item => {
    if (item.id === chatTreeId) {
      return { ...item, name: chatTreeName };
    }

    if (item.children && item.children.length) {
      return {
        ...item,
        children: renameChatTree(item.children, chatTreeId, chatTreeName),
      };
    }

    return item;
  });

const deleteChatTree = (items: TreeItem[], chatTreeId: string): TreeItem[] => {
  const newItems = [];
  for (const item of items) {
    if (item.id === chatTreeId) {
      continue;
    }
    const newItem = { ...item };
    if (item.children.length) {
      newItem.children = deleteChatTree(item.children, chatTreeId);
    }

    newItems.push(newItem);
  }
  return newItems;
};

const collapseChatTree = <T extends keyof TreeItem>(
  items: TreeItems,
  id: string,
  property: T,
  setter: (value: TreeItem[T]) => TreeItem[T],
) => {
  for (const item of items) {
    if (item.id === id) {
      item[property] = setter(item[property]);
      continue;
    }

    if (item.children.length) {
      item.children = collapseChatTree(item.children, id, property, setter);
    }
  }

  return [...items];
};

export const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    saveChat: (
      state,
      action: PayloadAction<Omit<TreeItem, 'type' | 'createdAt' | 'children'>>,
    ) => {
      state.conversations.unshift({
        type: 'chat',
        children: [],
        createdAt: new Date(),
        ...action.payload,
      });
    },
    saveFolder: (
      state,
      action: PayloadAction<
        Omit<TreeItem, 'type' | 'id' | 'createdAt' | 'children'>
      >,
    ) => {
      state.conversations.unshift({
        type: 'folder',
        id: uuidv4(),
        createdAt: new Date(),
        children: [],
        ...action.payload,
      });
    },
    renameChatTreeItem: (
      state,
      action: PayloadAction<{ chatTreeId: string; chatTreeName: string }>,
    ) => {
      const { chatTreeId, chatTreeName } = action.payload;
      const conversationToRename = renameChatTree(
        state.conversations,
        chatTreeId,
        chatTreeName,
      );
      state.conversations = conversationToRename;
    },
    updateChatContents: (
      state,
      action: PayloadAction<{ chatId: string; contents: ChatContent[] }>,
    ) => {
      const { chatId, contents } = action.payload;
      const chatToUpdate = findChatById(state.conversations, chatId);
      if (chatToUpdate) {
        (chatToUpdate as TreeItem).content = contents;
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
    collapseChatTreeItem: (
      state,
      action: PayloadAction<{ chatTreeId: string }>,
    ) => {
      const { chatTreeId } = action.payload;
      state.conversations = collapseChatTree(
        state.conversations,
        chatTreeId,
        'collapsed',
        value => !value,
      );
    },
    deleteChatTreeItem: (
      state,
      action: PayloadAction<{ chatTreeId: string }>,
    ) => {
      const { chatTreeId } = action.payload;
      state.conversations = deleteChatTree(state.conversations, chatTreeId);
    },
    updateChatTree: (state, action: PayloadAction<{ chatTree: TreeItems }>) => {
      const { chatTree } = action.payload;
      state.conversations = chatTree;
    },
    clearConversations: () => initialState,
  },
});

export const {
  saveChat,
  saveFolder,
  updateChatContents,
  clearConversations,
  addPromptToChat,
  updateContentById,
  renameChatTreeItem,
  deleteChatTreeItem,
  updateChatTree,
  collapseChatTreeItem,
} = conversationsSlice.actions;
