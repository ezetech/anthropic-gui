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
  buildTree,
  collapseItem,
  findChatParent,
  getChildCount,
  getProjection,
  removeChildrenOf,
  removeItem,
} from '@/features/Conversations/helpers';
import {
  selectConversationsList,
  selectConversationFlattenList,
} from '@/redux/conversations/conversations.selectors';
import { updateChatTree } from '@/redux/conversations/conversationsSlice';
import { TreeItems, FlattenedItem, SensorContext } from '@/typings/common';

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
    const dispatch = useDispatch();
    const treeItems = useSelector(selectConversationsList);
    const flattenedTree = useSelector(selectConversationFlattenList);

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

    const handleDragStart = ({ active: { id: currentId } }: DragStartEvent) => {
      setActiveId(String(currentId));
      setOverId(String(currentId));
      flattenedItems.find(({ id }) => id === activeId);
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

      document.body.style.setProperty('cursor', '');
    };

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
      resetState();
      if (projected && over) {
        const { depth, parentId, parentType, currentType } = projected;
        if (parentType === 'chat' && currentType === 'chat') {
          const chatInFolder = findChatParent(flattenedTree, parentId || '');
          if (chatInFolder) {
            const clonedItems: FlattenedItem[] = structuredClone(flattenedTree);
            const overIndex =
              clonedItems.findIndex(({ id }) => id === parentId) + 1;
            const activeIndex = clonedItems.findIndex(
              ({ id }) => id === active.id,
            );

            const activeTreeItem = clonedItems[activeIndex];
            clonedItems[activeIndex] = {
              ...activeTreeItem,
              depth,
              parentId: chatInFolder?.id || '',
            };
            const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
            const newItems = buildTree(sortedItems);
            dispatch(updateChatTree({ chatTree: newItems }));
          }
          return;
        }
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

    const handleCollapse = (
      id: string,
      collapsibleItem: boolean | undefined,
      children: string | any[],
    ) =>
      collapsibleItem && children?.length
        ? () => collapseItem(id, dispatch)
        : undefined;

    const handleRemove = (id: string, removableItem: boolean | undefined) =>
      removableItem ? () => removeItem(id, dispatch) : undefined;

    useEffect(() => {
      sensorContext.current = {
        items: flattenedItems,
        offset: offsetLeft,
      };
    }, [flattenedItems, offsetLeft]);

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
                  depth={activeItem?.depth}
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
