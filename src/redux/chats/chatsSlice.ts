import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Chat } from '@/typings/common';

const initialState: Chat[] = [];

export const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    saveChat: (state, action: PayloadAction<Chat>) => {
      state.push(action.payload);
    },
    deleteChat: (state, action: PayloadAction<{ chatId: string }>) => {
      state.filter(chat => chat.id !== action.payload.chatId);
    },
  },
});

export const { saveChat, deleteChat } = chatsSlice.actions;
