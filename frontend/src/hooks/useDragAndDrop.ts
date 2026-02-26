import { useState, useCallback, useRef } from 'react';
import { TodoItem } from '../types';
import { DragProps } from '../types/drag';

function getStorageKey(listId: number) {
  return `todo-order-${listId}`;
}

function readOrder(listId: number): number[] | null {
  try {
    const raw = localStorage.getItem(getStorageKey(listId));
    if (raw === null) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeOrder(listId: number, ids: number[]) {
  localStorage.setItem(getStorageKey(listId), JSON.stringify(ids));
}

function sortItems(items: TodoItem[], storedOrder: number[] | null): TodoItem[] {
  if (!storedOrder) return items;

  const itemMap = new Map(items.map((item) => [item.id, item]));
  const ordered: TodoItem[] = [];

  for (const id of storedOrder) {
    const item = itemMap.get(id);
    if (item) {
      ordered.push(item);
      itemMap.delete(id);
    }
  }

  // Append new items not in stored order
  for (const item of itemMap.values()) {
    ordered.push(item);
  }

  return ordered;
}

export function useDragAndDrop(listId: number, items: TodoItem[]) {
  const draggedId = useRef<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  const storedOrder = readOrder(listId);
  const orderedItems = sortItems(items, storedOrder);

  // Persist current order (handles first load + pruning stale IDs)
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
        const fromId = draggedId.current;
        const toId = itemId;
        if (fromId === null || fromId === toId) return;

        const ids = readOrder(listId) ?? orderedItems.map((i) => i.id);
        const fromIndex = ids.indexOf(fromId);
        const toIndex = ids.indexOf(toId);
        if (fromIndex === -1 || toIndex === -1) return;

        ids.splice(fromIndex, 1);
        ids.splice(toIndex, 0, fromId);
        writeOrder(listId, ids);

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

  return { orderedItems, getDragProps, dragOverId };
}
