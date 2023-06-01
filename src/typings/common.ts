export type ApiErrorDetails = {
  fields?: Record<string, string>;
  message?: string;
  code: string | number;
};

export interface ApiSettingOptions {
  apiKey: string;
  model: string; // TODO change MODEL TYPE
  maxTokens: number;
  temperature: number;
  topK: number;
  topP: number;
}

export interface ChatContent {
  type: string;
  text: string;
}

export interface Chat {
  id: string;
  name: string;
  createdAt: Date;
  order: number;
  content: ChatContent;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: Date;
  order: number;
}
