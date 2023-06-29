import { Element, Text } from 'slate';

import { PromptType } from '@/typings/common';

export type CustomRange = {
  prismToken: string;
  anchor: { path: number[]; offset: number };
  focus: { path: number[]; offset: number };
};

export type PrismToken = string | { type: string; content: PrismToken[] };

export interface CustomText extends Text {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  strikethrough?: boolean;
  deleted?: boolean;
  inserted?: boolean;
  prismToken?: string;
  inlineCode?: boolean;
}

export interface CustomElement extends Element {
  type?: string;
  value?: string;
  url?: string;
  lang?: string;
  ordered?: boolean;
  start?: number;
}

export interface IEditablePrompt {
  type: PromptType;
  text: string;
  deletePromptRow: (id: string) => () => void;
  id: string;
  handlePromptBlur: (id: string, text: string) => void;
  disabled?: boolean;
}
