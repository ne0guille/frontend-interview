// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { readOrder, writeOrder, sortByOrder, moveItem } from './todoOrder';
import type { TodoItem } from '../types';

function makeItem(id: number): TodoItem {
  return { id, name: `Item ${id}`, description: '', done: false };
}

describe('readOrder / writeOrder', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('write then read returns same data', () => {
    writeOrder(1, [3, 1, 2]);
    expect(readOrder(1)).toEqual([3, 1, 2]);
  });

  it('read returns null when key does not exist', () => {
    expect(readOrder(999)).toBeNull();
  });

  it('read returns null on corrupted JSON', () => {
    localStorage.setItem('todo-order-1', '{invalid json');
    expect(readOrder(1)).toBeNull();
  });
});

describe('sortByOrder', () => {
  const items = [makeItem(1), makeItem(2), makeItem(3)];

  it('returns items as-is when storedOrder is null', () => {
    expect(sortByOrder(items, null)).toBe(items);
  });

  it('returns items as-is when storedOrder is empty', () => {
    expect(sortByOrder(items, [])).toBe(items);
  });

  it('sorts items according to storedOrder', () => {
    const result = sortByOrder(items, [3, 1, 2]);

    expect(result.map((i) => i.id)).toEqual([3, 1, 2]);
  });

  it('appends items not in storedOrder at the end', () => {
    const result = sortByOrder(items, [2]);

    expect(result.map((i) => i.id)).toEqual([2, 1, 3]);
  });

  it('skips IDs in storedOrder that do not exist in items', () => {
    const result = sortByOrder(items, [999, 3, 1, 2]);

    expect(result.map((i) => i.id)).toEqual([3, 1, 2]);
  });
});

describe('moveItem', () => {
  it('moves item forward in array', () => {
    const ids = [1, 2, 3, 4];
    const result = moveItem(ids, 1, 3);

    expect(result).toEqual([2, 3, 1, 4]);
  });

  it('moves item backward in array', () => {
    const ids = [1, 2, 3, 4];
    const result = moveItem(ids, 3, 1);

    expect(result).toEqual([3, 1, 2, 4]);
  });

  it('returns null when fromId not found', () => {
    expect(moveItem([1, 2, 3], 999, 1)).toBeNull();
  });

  it('returns null when toId not found', () => {
    expect(moveItem([1, 2, 3], 1, 999)).toBeNull();
  });

  it('does not mutate original array', () => {
    const ids = [1, 2, 3];
    moveItem(ids, 1, 3);

    expect(ids).toEqual([1, 2, 3]);
  });
});
