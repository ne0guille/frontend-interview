import type { TodoList, TodoItem } from '../types';
import type { UpdateTodoItemDto } from '../api/todo-list.dto';

export function addItemToList(
  lists: TodoList[],
  listId: number,
  item: TodoItem,
): TodoList[] {
  return lists.map((list) =>
    list.id === listId
      ? { ...list, todoItems: [...list.todoItems, item] }
      : list
  );
}

export function updateItemInLists(
  lists: TodoList[],
  listId: number,
  itemId: number,
  data: UpdateTodoItemDto,
): TodoList[] {
  return lists.map((list) =>
    list.id === listId
      ? { ...list, todoItems: list.todoItems.map((item) =>
          item.id === itemId ? { ...item, ...data } : item
        )}
      : list
  );
}

export function removeItemFromLists(
  lists: TodoList[],
  listId: number,
  itemId: number,
): TodoList[] {
  return lists.map((list) =>
    list.id === listId
      ? { ...list, todoItems: list.todoItems.filter((item) => item.id !== itemId) }
      : list
  );
}
