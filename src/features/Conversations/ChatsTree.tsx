import { memo, useEffect, useMemo, useRef, useState } from 'react';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverlay,
  DragMoveEvent,
  DragEndEvent,
  DragOverEvent,
  MeasuringStrategy,
  DropAnimation,
  defaultDropAnimation,
  Modifier,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';

import {
  selectConversationsList,
  selectConversationFlattenList,
} from '@/redux/conversations/conversations.selectors';
import {
  updateChatTree,
  deleteChatTreeItem,
  collapseChatTreeItem,
} from '@/redux/conversations/conversationsSlice';
import {
  TreeItems,
  FlattenedItem,
  SensorContext,
  TreeItem,
} from '@/typings/common';

import { SortableTreeItem } from './components/TreeItem/SortableTreeItem';

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

const dropAnimation: DropAnimation = {
  ...defaultDropAnimation,
};

interface Props {
  collapsible?: boolean;
  defaultItems?: TreeItems;
  indentationWidth?: number;
  indicator?: boolean;
  removable?: boolean;
}

const adjustTranslate: Modifier = ({ transform }) => ({
  ...transform,
  y: transform.y - 25,
});

export const ChatsTree = memo(
  ({ collapsible, indicator, indentationWidth = 20, removable }: Props) => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [overId, setOverId] = useState<string | null>(null);
    const [offsetLeft, setOffsetLeft] = useState(0);
    const [_, setCurrentPosition] = useState<{
      parentId: string | null;
      parentType: string | null;
      overId: string;
    } | null>(null);
    const dispatch = useDispatch();
    const treeItems = useSelector(selectConversationsList);
    const flattenedTree = useSelector(selectConversationFlattenList);

    const removeChildrenOf = (items: FlattenedItem[], ids: string[]) => {
      const excludeParentIds = [...ids];

      return items.filter(item => {
        if (item.parentId && excludeParentIds.includes(item.parentId)) {
          if (item.children.length) {
            excludeParentIds.push(item.id);
          }
          return false;
        }

        return true;
      });
    };

    const flattenedItems = useMemo(() => {
      const collapsedItems = flattenedTree.reduce<string[]>(
        (acc, { children, collapsed, id }) =>
          collapsed && children.length ? [...acc, id] : acc,
        [],
      );

      return removeChildrenOf(
        flattenedTree,
        activeId ? [activeId, ...collapsedItems] : collapsedItems,
      );
    }, [activeId, flattenedTree]);

    const getDragDepth = (offset: number, width: number) =>
      Math.round(offset / width);

    const getMaxDepth = ({ previousItem }: { previousItem: FlattenedItem }) => {
      if (previousItem) {
        return previousItem.depth + 1;
      }

      return 0;
    };

    const getMinDepth = ({ nextItem }: { nextItem: FlattenedItem }) => {
      if (nextItem) {
        return nextItem.depth;
      }

      return 0;
    };

    const getProjection = (
      items: FlattenedItem[],
      actvId: string,
      overTheId: string,
      dragOffset: number,
      width: number,
    ) => {
      const overItemIndex = items.findIndex(({ id }) => id === overTheId);
      const activeItemIndex = items.findIndex(({ id }) => id === actvId);
      const activeCurrentItem = items[activeItemIndex];
      const newItems = arrayMove(items, activeItemIndex, overItemIndex);
      const previousItem = newItems[overItemIndex - 1];
      const nextItem = newItems[overItemIndex + 1];
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

        if (depth === previousItem.depth) {
          return previousItem.parentId;
        }

        if (depth > previousItem.depth) {
          return previousItem.id;
        }

        const newParent = newItems
          .slice(0, overItemIndex)
          .reverse()
          .find(item => item.depth === depth)?.parentId;

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
          .find(item => item.depth === depth)?.parentType;

        return newParent ?? null;
      };

      if (projectedDepth >= maxDepth) {
        depth = maxDepth;
      } else if (projectedDepth < minDepth) {
        depth = minDepth;
      }

      return {
        depth,
        maxDepth,
        minDepth,
        currentType: activeCurrentItem.type,
        parentType: getParentType(),
        parentId: getParentId(),
      };
    };

    const projected =
      activeId && overId
        ? getProjection(
            flattenedItems,
            activeId,
            overId,
            offsetLeft,
            indentationWidth,
          )
        : null;

    const sensorContext: SensorContext = useRef({
      items: flattenedItems,
      offset: offsetLeft,
    });

    const sensors = useSensors(useSensor(PointerSensor));

    const sortedIds = useMemo(
      () => flattenedItems.map(({ id }) => id),
      [flattenedItems],
    );

    const activeItem = activeId
      ? flattenedItems.find(({ id }) => id === activeId)
      : null;

    useEffect(() => {
      sensorContext.current = {
        items: flattenedItems,
        offset: offsetLeft,
      };
    }, [flattenedItems, offsetLeft]);

    const countChildren = (items: TreeItem[], count = 0): number =>
      items.reduce((acc, { children }) => {
        if (children.length) {
          return countChildren(children, acc + 1);
        }

        return acc + 1;
      }, count);

    const findItem = (items: TreeItem[], itemId: string) =>
      items.find(({ id }) => id === itemId);

    const buildTree = (flatndItems: FlattenedItem[]): TreeItems => {
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

        nodes[id] = { id, children, name: item.name, type: item.type }; //added item and type
        parent.children.push(item);
      }

      return root.children;
    };

    const findItemDeep = (
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

    const getChildCount = (items: TreeItems, id: string) => {
      if (!id) {
        return 0;
      }

      const item = findItemDeep(items, id);

      return item ? countChildren(item.children) : 0;
    };

    const handleDragStart = ({ active: { id: currentId } }: DragStartEvent) => {
      setActiveId(String(currentId));
      setOverId(String(currentId));

      const currentItem = flattenedItems.find(({ id }) => id === activeId);
      if (currentItem) {
        setCurrentPosition({
          parentId: currentItem.parentId,
          parentType: currentItem.parentType,
          overId: String(currentId),
        });
      }

      document.body.style.setProperty('cursor', 'grabbing');
    };

    const handleDragMove = ({ delta }: DragMoveEvent) => {
      setOffsetLeft(delta.x);
    };

    const handleDragOver = ({ over }: DragOverEvent) => {
      setOverId(over?.id?.toString() ?? null);
    };

    const resetState = () => {
      setOverId(null);
      setActiveId(null);
      setOffsetLeft(0);
      setCurrentPosition(null);

      document.body.style.setProperty('cursor', '');
    };

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
      resetState();
      if (projected && over) {
        const { depth, parentId, parentType, currentType } = projected;
        if (parentType === 'chat') {
          return;
        }
        if (currentType === 'folder' && parentType === 'folder') {
          return;
        }

        const clonedItems: FlattenedItem[] = structuredClone(flattenedTree);
        const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
        const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
        const activeTreeItem = clonedItems[activeIndex];
        clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId };
        const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
        const newItems = buildTree(sortedItems);
        dispatch(updateChatTree({ chatTree: newItems }));
      }
    };

    const handleDragCancel = () => {
      resetState();
    };

    const handleRemoveItem = (id: string) => {
      dispatch(deleteChatTreeItem({ chatTreeId: id }));
    };

    const handleCollapseItem = (id: string) => {
      dispatch(collapseChatTreeItem({ chatTreeId: id }));
    };

    const handleCollapse = (
      id: string,
      collapsibleItem: boolean | undefined,
      children: TreeItem[],
    ) =>
      collapsibleItem && children?.length
        ? () => handleCollapseItem(id)
        : undefined;

    const handleRemove = (id: string, removableItem: boolean | undefined) =>
      removableItem ? () => handleRemoveItem(id) : undefined;

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        measuring={measuring}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={sortedIds}
          strategy={verticalListSortingStrategy}
        >
          {flattenedItems.map(
            ({ id, name, type, children, collapsed, depth }) => (
              <SortableTreeItem
                key={id}
                id={id}
                value={id}
                name={name}
                type={type}
                depth={id === activeId && projected ? projected.depth : depth}
                indentationWidth={indentationWidth}
                indicator={indicator}
                collapsed={Boolean(collapsed && children.length)}
                onCollapse={handleCollapse(id, collapsible, children)}
                onRemove={handleRemove(id, removable)}
              />
            ),
          )}
          {createPortal(
            <DragOverlay
              dropAnimation={dropAnimation}
              modifiers={indicator ? [adjustTranslate] : undefined}
            >
              {activeId && activeItem ? (
                <SortableTreeItem
                  id={activeId}
                  depth={activeItem.depth}
                  clone
                  childCount={getChildCount(treeItems, activeId) + 1}
                  value={activeId}
                  indentationWidth={indentationWidth}
                  name=""
                  type=""
                />
              ) : null}
            </DragOverlay>,
            document.body,
          )}
        </SortableContext>
      </DndContext>
    );
  },
);

ChatsTree.displayName = 'ChatsTree';
