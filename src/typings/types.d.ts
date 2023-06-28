import type { MutableRefObject } from 'react';

type ValueOf<T> = T[keyof T];

export interface TreeItem {
  id: string;
  name: string;
  type: string;
  children: TreeItem[];
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
