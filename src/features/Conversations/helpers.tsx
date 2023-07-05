import { arrayMove } from '@dnd-kit/sortable';

import {
  collapseChatTreeItem,
  deleteChatTreeItem,
} from '@/redux/conversations/conversationsSlice';
import { FlattenedItem, TreeItem, TreeItems } from '@/typings/common';

export const removeChildrenOf = (
  items: FlattenedItem[],
  ids: string[] | string,
) => {
  const excludeParentIds = Array.isArray(ids) ? [...ids] : [ids];

  return items?.filter(item => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      if (item.children.length) {
        excludeParentIds.push(item.id);
      }
      return false;
    }

    return true;
  });
};

export const getDragDepth = (offset: number, width: number) => {
  const dragDepth = Math.round(offset / width);
  return dragDepth >= 1 ? 1 : dragDepth;
};

const getMaxDepth = ({ previousItem }: { previousItem: FlattenedItem }) => {
  if (previousItem) {
    return previousItem?.depth + 1;
  }

  return 0;
};
export const getMinDepth = ({ nextItem }: { nextItem: FlattenedItem }) => {
  if (nextItem) {
    return nextItem?.depth;
  }

  return 0;
};

export const getProjection = (
  items: FlattenedItem[],
  actvId: string,
  overTheId: string,
  dragOffset: number,
  width: number,
) => {
  const overItemIndex = items.findIndex(({ id }) => id === overTheId);
  const activeItemIndex = items.findIndex(({ id }) => id === actvId);
  const activeCurrentItem = items[activeItemIndex];

  if (!activeCurrentItem) {
    return null;
  }

  const newItems = arrayMove(items, activeItemIndex, overItemIndex);
  const previousItem = newItems[overItemIndex - 1] || null;
  const nextItem = newItems[overItemIndex + 1] || null;
  const dragDepth = getDragDepth(dragOffset, width);
  const projectedDepth = activeCurrentItem.depth + dragDepth;
  const maxDepth = getMaxDepth({
    previousItem,
  });
  const minDepth = getMinDepth({ nextItem });
  let depth = projectedDepth;

  const getParentId = () => {
    if (depth === 0 || !previousItem) {
      return null;
    }

    if (depth > 1) {
      return previousItem.parentId;
    }

    if (depth === previousItem.depth) {
      return previousItem.parentId;
    }

    if (depth > previousItem.depth) {
      return previousItem.id;
    }

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find(item => item?.depth === depth)?.parentId;

    return newParent ?? null;
  };

  const getParentType = () => {
    if (depth === 0 || !previousItem) {
      return null;
    }

    if (depth === previousItem.depth) {
      return previousItem.parentType;
    }

    if (depth > previousItem.depth) {
      return previousItem.type;
    }

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find(item => item?.depth === depth)?.parentType;

    return newParent ?? null;
  };

  if (projectedDepth >= maxDepth) {
    if (maxDepth > 1) {
      depth = 1;
    } else {
      depth = maxDepth;
    }
  } else if (projectedDepth < minDepth) {
    depth = minDepth;
  }

  return {
    depth,
    maxDepth,
    minDepth,
    collapsed: activeCurrentItem.collapsed,
    currentType: activeCurrentItem.type,
    parentType: getParentType(),
    parentId: getParentId(),
  };
};

export const countChildren = (items: TreeItem[], count = 0): number =>
  items.reduce((acc, { children }) => {
    if (children.length) {
      return countChildren(children, acc + 1);
    }

    return acc + 1;
  }, count);

export const findItem = (items: TreeItem[], itemId: string) =>
  items.find(({ id }) => id === itemId);

export const buildTree = (flatndItems: FlattenedItem[]): TreeItems => {
  const root: TreeItem = {
    id: 'root',
    children: [],
    name: '',
    type: '',
  };
  const nodes: Record<string, TreeItem> = { [root.id]: root };
  const items = flatndItems.map(item => ({ ...item, children: [] }));

  for (const item of items) {
    const { id, children } = item;
    const parentId = item.parentId ?? root.id;
    const parent = nodes[parentId] ?? findItem(items, parentId);

    nodes[id] = { id, children, name: item.name, type: item.type };
    parent.children.push(item);
  }

  return root.children;
};

export const findItemDeep = (
  items: TreeItems,
  itemId: string,
): TreeItem | undefined => {
  for (const item of items) {
    const { id, children } = item;

    if (id === itemId) {
      return item;
    }

    if (children.length) {
      const child = findItemDeep(children, itemId);

      if (child) {
        return child;
      }
    }
  }

  return undefined;
};

export const getChildCount = (items: TreeItems, id: string) => {
  if (!id) {
    return 0;
  }

  const item = findItemDeep(items, id);

  return item ? countChildren(item.children) : 0;
};

export const findChatParent = (
  items: TreeItems,
  itemId: string,
): TreeItem | undefined => {
  for (const item of items) {
    const { id, children } = item;
    if (id === itemId) {
      return undefined;
    }
    if (children.length) {
      const child = findItem(children, itemId);
      if (child) {
        return item;
      }
    }
  }
  return undefined;
};

export const removeItem = (
  id: string,
  dispatch: (arg0: {
    payload: { chatTreeId: string };
    type: 'conversations/deleteChatTreeItem';
  }) => void,
) => {
  dispatch(deleteChatTreeItem({ chatTreeId: id }));
};

export const collapseItem = (
  id: string,
  dispatch: (arg0: {
    payload: { chatTreeId: string };
    type: 'conversations/collapseChatTreeItem';
  }) => void,
) => {
  dispatch(collapseChatTreeItem({ chatTreeId: id }));
};

export const handleRemove = (
  id: string,
  removableItem: boolean | undefined,
  dispatch: (arg0: {
    payload: { chatTreeId: string };
    type: 'conversations/deleteChatTreeItem';
  }) => void,
) => (removableItem ? () => removeItem(id, dispatch) : undefined);
