import type { TodoItem } from '../types';

function getStorageKey(listId: number) {
  return `todo-order-${listId}`;
}

export function readOrder(listId: number): number[] | null {
  try {
    const raw = localStorage.getItem(getStorageKey(listId));
    if (raw === null) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function writeOrder(listId: number, ids: number[]) {
  localStorage.setItem(getStorageKey(listId), JSON.stringify(ids));
}

export function sortByOrder(items: TodoItem[], storedOrder: number[] | null): TodoItem[] {
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

  for (const item of itemMap.values()) {
    ordered.push(item);
  }

  return ordered;
}

export function moveItem(ids: number[], fromId: number, toId: number): number[] | null {
  const fromIndex = ids.indexOf(fromId);
  const toIndex = ids.indexOf(toId);
  if (fromIndex === -1 || toIndex === -1) return null;

  const result = [...ids];
  result.splice(fromIndex, 1);
  result.splice(toIndex, 0, fromId);
  return result;
}

export function moveItemToEnd(ids: number[], fromId: number): number[] | null {
  const fromIndex = ids.indexOf(fromId);
  if (fromIndex === -1) return null;

  const result = [...ids];
  result.splice(fromIndex, 1);
  result.push(fromId);
  return result;
}
