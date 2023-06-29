import type { MutableRefObject } from 'react';

export type ApiErrorDetails = {
  fields?: Record<string, string>;
  message?: string;
  code: string | number;
};

export interface ApiSettingOptions {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
  topK: number;
  topP: number;
}

export type PromptType = 'Human' | 'Assistant';

export interface ConversationCommon {
  id: string;
  name: string;
  createdAt: Date;
  children: ConversationCommon[];
  type: 'folder' | 'chat';
}

export interface Chat extends ConversationCommon {
  content?: ChatContent[];
}

export interface Folder extends ConversationCommon {
  chats?: Chat[];
}

export interface ChatContent {
  id: string;
  type: PromptType;
  text: string;
}

export interface TreeItem {
  id: string;
  name: string;
  type: string;
  content?: ChatContent[];
  children: TreeItem[];
  createdAt?: Date;
  collapsed?: boolean;
}

export type TreeItems = TreeItem[];

export interface FlattenedItem extends TreeItem {
  parentId: null | string;
  parentType: null | string;
  depth: number;
  index: number;
}

export type SensorContext = MutableRefObject<{
  items: FlattenedItem[];
  offset: number;
}>;
