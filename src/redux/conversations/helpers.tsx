import { FlattenedItem, TreeItems } from '@/typings/types';

export const flatten = (
  items: TreeItems,
  parentType: string | null = null,
  parentId: string | null = null,
  depth = 0,
): FlattenedItem[] =>
  items?.reduce<FlattenedItem[]>(
    (acc, item, index) => [
      ...acc,
      { ...item, parentType, parentId, depth, index },
      ...flatten(item.children, item.type, item.id, depth + 1),
    ],
    [],
  );
