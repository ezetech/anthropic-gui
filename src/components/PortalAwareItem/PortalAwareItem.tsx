import { createPortal } from 'react-dom';

const portal = document.createElement('div');
document.body.appendChild(portal);

export function PortalAwareItem({ provided, snapshot, children }: any) {
  const usePortal = snapshot.isDragging;

  const child = (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      {children}
    </div>
  );

  if (!usePortal) {
    return child;
  }

  // if dragging - put the item in a portal
  return createPortal(child, portal);
}
