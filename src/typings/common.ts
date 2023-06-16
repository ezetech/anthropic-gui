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

export interface ChatContent {
  type: 'human' | 'assistant';
  text: string;
}

interface ConversationCommon {
  id: string;
  name: string;
  createdAt: Date;
  type: 'folder' | 'chat';
}

export interface Chat extends ConversationCommon {
  content?: ChatContent[];
}

export interface Folder extends ConversationCommon {
  chats?: Chat[];
}
