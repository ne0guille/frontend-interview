import { useState, useCallback, useRef, useMemo } from 'react';
import { TodoItem } from '../types';
import { DragProps } from '../types/drag';
import { readOrder, writeOrder, sortByOrder, moveItem, moveItemToEnd } from '../domain/todoOrder';

export function useDragAndDrop(listId: number, items: TodoItem[]) {
  const draggedId = useRef<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | 'end' | null>(null);

  const storedOrder = readOrder(listId);
  const orderedItems = useMemo(
    () => sortByOrder(items, storedOrder),
    [items, storedOrder]
  );
  const currentIds = orderedItems.map((item) => item.id);
  const storedStr = storedOrder ? JSON.stringify(storedOrder) : null;
  if (storedStr !== JSON.stringify(currentIds)) {
    writeOrder(listId, currentIds);
  }

  const getDragProps = useCallback(
    (itemId: number): DragProps => ({
      draggable: true,
      onDragStart: () => {
        draggedId.current = itemId;
      },
      onDragOver: (e) => {
        e.preventDefault();
        setDragOverId(itemId);
      },
      onDrop: (e) => {
        e.preventDefault();
        e.stopPropagation();
        const fromId = draggedId.current;
        if (fromId === null || fromId === itemId) return;

        const ids = readOrder(listId) ?? orderedItems.map((i) => i.id);
        const newIds = moveItem(ids, fromId, itemId);
        if (newIds) writeOrder(listId, newIds);

        draggedId.current = null;
        setDragOverId(null);
      },
      onDragEnd: () => {
        draggedId.current = null;
        setDragOverId(null);
      },
    }),
    [listId, orderedItems],
  );

  const getListProps = useCallback(
    () => ({
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault();
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        const fromId = draggedId.current;
        if (fromId === null) return;

        const ids = readOrder(listId) ?? orderedItems.map((i) => i.id);
        const newIds = moveItemToEnd(ids, fromId);
        if (newIds) writeOrder(listId, newIds);

        draggedId.current = null;
        setDragOverId(null);
      },
    }),
    [listId, orderedItems],
  );

  const getDropZoneProps = useCallback(
    () => ({
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault();
        setDragOverId('end');
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        const fromId = draggedId.current;
        if (fromId === null) return;

        const ids = readOrder(listId) ?? orderedItems.map((i) => i.id);
        const newIds = moveItemToEnd(ids, fromId);
        if (newIds) writeOrder(listId, newIds);

        draggedId.current = null;
        setDragOverId(null);
      },
      onDragLeave: () => {
        setDragOverId((prev) => (prev === 'end' ? null : prev));
      },
    }),
    [listId, orderedItems],
  );

  return { orderedItems, getDragProps, getListProps, getDropZoneProps, dragOverId };
}
