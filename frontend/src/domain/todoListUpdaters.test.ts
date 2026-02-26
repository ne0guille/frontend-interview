import { describe, it, expect } from 'vitest';
import { addItemToList, updateItemInLists, removeItemFromLists } from './todoListUpdaters';
import type { TodoList, TodoItem } from '../types';

function makeItem(id: number, overrides?: Partial<TodoItem>): TodoItem {
  return { id, name: `Item ${id}`, description: '', done: false, ...overrides };
}

function makeLists(): TodoList[] {
  return [
    { id: 1, name: 'List A', todoItems: [makeItem(10), makeItem(11)] },
    { id: 2, name: 'List B', todoItems: [makeItem(20)] },
  ];
}

describe('addItemToList', () => {
  it('adds item to the correct list', () => {
    const lists = makeLists();
    const newItem = makeItem(12);
    const result = addItemToList(lists, 1, newItem);

    expect(result[0].todoItems).toHaveLength(3);
    expect(result[0].todoItems[2]).toEqual(newItem);
  });

  it('leaves other lists unchanged', () => {
    const lists = makeLists();
    const result = addItemToList(lists, 1, makeItem(12));

    expect(result[1].todoItems).toHaveLength(1);
  });

  it('returns unchanged lists when listId does not match', () => {
    const lists = makeLists();
    const result = addItemToList(lists, 999, makeItem(12));

    expect(result[0].todoItems).toHaveLength(2);
    expect(result[1].todoItems).toHaveLength(1);
  });

  it('works with empty lists array', () => {
    const result = addItemToList([], 1, makeItem(1));
    expect(result).toEqual([]);
  });

  it('does not mutate the original arrays', () => {
    const lists = makeLists();
    const originalItems = lists[0].todoItems;
    addItemToList(lists, 1, makeItem(12));

    expect(lists[0].todoItems).toBe(originalItems);
    expect(lists[0].todoItems).toHaveLength(2);
  });
});

describe('updateItemInLists', () => {
  it('updates matching item with partial data', () => {
    const lists = makeLists();
    const result = updateItemInLists(lists, 1, 10, { name: 'Updated', done: true });

    expect(result[0].todoItems[0]).toEqual({
      id: 10,
      name: 'Updated',
      description: '',
      done: true,
    });
  });

  it('updates only the description field', () => {
    const lists = makeLists();
    const result = updateItemInLists(lists, 1, 10, { description: 'New desc' });

    expect(result[0].todoItems[0].description).toBe('New desc');
    expect(result[0].todoItems[0].name).toBe('Item 10');
    expect(result[0].todoItems[0].done).toBe(false);
  });

  it('leaves non-matching items unchanged', () => {
    const lists = makeLists();
    const result = updateItemInLists(lists, 1, 10, { name: 'Updated' });

    expect(result[0].todoItems[1]).toEqual(makeItem(11));
  });

  it('returns unchanged lists when listId does not match', () => {
    const lists = makeLists();
    const result = updateItemInLists(lists, 999, 10, { name: 'Updated' });

    expect(result[0].todoItems[0].name).toBe('Item 10');
  });

  it('returns unchanged lists when itemId does not match', () => {
    const lists = makeLists();
    const result = updateItemInLists(lists, 1, 999, { name: 'Updated' });

    expect(result[0].todoItems[0].name).toBe('Item 10');
    expect(result[0].todoItems[1].name).toBe('Item 11');
  });

  it('does not mutate the original arrays', () => {
    const lists = makeLists();
    const originalItem = lists[0].todoItems[0];
    updateItemInLists(lists, 1, 10, { name: 'Updated' });

    expect(originalItem.name).toBe('Item 10');
  });
});

describe('removeItemFromLists', () => {
  it('removes item from correct list', () => {
    const lists = makeLists();
    const result = removeItemFromLists(lists, 1, 10);

    expect(result[0].todoItems).toHaveLength(1);
    expect(result[0].todoItems[0].id).toBe(11);
  });

  it('leaves other lists unchanged', () => {
    const lists = makeLists();
    const result = removeItemFromLists(lists, 1, 10);

    expect(result[1].todoItems).toHaveLength(1);
  });

  it('returns unchanged when listId does not match', () => {
    const lists = makeLists();
    const result = removeItemFromLists(lists, 999, 10);

    expect(result[0].todoItems).toHaveLength(2);
  });

  it('returns unchanged when itemId does not match', () => {
    const lists = makeLists();
    const result = removeItemFromLists(lists, 1, 999);

    expect(result[0].todoItems).toHaveLength(2);
  });

  it('handles removing the last item (list becomes empty)', () => {
    const lists = makeLists();
    const result = removeItemFromLists(lists, 2, 20);

    expect(result[1].todoItems).toHaveLength(0);
  });

  it('does not mutate the original arrays', () => {
    const lists = makeLists();
    const originalItems = lists[0].todoItems;
    removeItemFromLists(lists, 1, 10);

    expect(lists[0].todoItems).toBe(originalItems);
    expect(lists[0].todoItems).toHaveLength(2);
  });
});
