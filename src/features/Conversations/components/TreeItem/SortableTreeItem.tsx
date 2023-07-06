import { CSSProperties } from 'react';

import { AnimateLayoutChanges, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { TreeItemMemo, Props as TreeItemProps } from './TreeItem';

interface Props extends TreeItemProps {
  id: string;
  name: string;
  type: string;
}

const iOS = /iPad|iPhone|iPod/.test(navigator.platform);

const animateLayoutChanges: AnimateLayoutChanges = ({
  isSorting,
  wasDragging,
}) => (isSorting || wasDragging ? false : true);

export const SortableTreeItem = ({ id, type, depth, ...props }: Props) => {
  const {
    attributes,
    isDragging,
    isSorting,
    listeners,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    animateLayoutChanges,
  });
  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <TreeItemMemo
      ref={setDraggableNodeRef}
      wrapperRef={setDroppableNodeRef}
      style={style}
      depth={depth}
      ghost={isDragging}
      disableSelection={iOS}
      disableInteraction={isSorting}
      type={type}
      handleProps={{
        ...attributes,
        ...listeners,
      }}
      {...props}
    />
  );
};

SortableTreeItem.displayName = 'SortableTreeItem';
