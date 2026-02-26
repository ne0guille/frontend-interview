import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as todoListService from '../api/todo-list.service';
import type {
  CreateTodoListDto,
  UpdateTodoListDto,
  AddTodoItemDto,
  UpdateTodoItemDto,
} from '../api/todo-list.dto';
import type { TodoList } from '../types';
import { addItemToList, updateItemInLists, removeItemFromLists } from '../domain/todoListUpdaters';

const todoListsKey = ['todoLists'] as const;

export function useTodoList() {
  const queryClient = useQueryClient();

  const todoListsQuery = useQuery({
    queryKey: todoListsKey,
    queryFn: todoListService.getAllTodoLists,
  });

  const createTodoList = useMutation({
    mutationFn: (data: CreateTodoListDto) => todoListService.createTodoList(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: todoListsKey }),
  });

  const updateTodoList = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTodoListDto }) =>
      todoListService.updateTodoList(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: todoListsKey }),
  });

  const deleteTodoList = useMutation({
    mutationFn: (id: number) => todoListService.deleteTodoList(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: todoListsKey }),
  });

  const addTodoItem = useMutation({
    mutationFn: ({ listId, data }: { listId: number; data: AddTodoItemDto }) =>
      todoListService.addTodoItem(listId, data),
    onMutate: async ({ listId, data }) => {
      await queryClient.cancelQueries({ queryKey: todoListsKey });
      const previous = queryClient.getQueryData<TodoList[]>(todoListsKey);
      const tempItem = { id: -Date.now(), name: data.name, description: '', done: false };
      queryClient.setQueryData<TodoList[]>(todoListsKey, (old) =>
        old ? addItemToList(old, listId, tempItem) : old
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(todoListsKey, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todoListsKey });
    },
  });

  const updateTodoItem = useMutation({
    mutationFn: ({
      listId,
      itemId,
      data,
    }: {
      listId: number;
      itemId: number;
      data: UpdateTodoItemDto;
    }) => todoListService.updateTodoItem(listId, itemId, data),
    onMutate: async ({ listId, itemId, data }) => {
      await queryClient.cancelQueries({ queryKey: todoListsKey });
      const previous = queryClient.getQueryData<TodoList[]>(todoListsKey);
      queryClient.setQueryData<TodoList[]>(todoListsKey, (old) =>
        old ? updateItemInLists(old, listId, itemId, data) : old
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(todoListsKey, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todoListsKey });
    },
  });

  const deleteTodoItem = useMutation({
    mutationFn: ({ listId, itemId }: { listId: number; itemId: number }) =>
      todoListService.deleteTodoItem(listId, itemId),
    onMutate: async ({ listId, itemId }) => {
      await queryClient.cancelQueries({ queryKey: todoListsKey });
      const previous = queryClient.getQueryData<TodoList[]>(todoListsKey);
      queryClient.setQueryData<TodoList[]>(todoListsKey, (old) =>
        old ? removeItemFromLists(old, listId, itemId) : old
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(todoListsKey, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todoListsKey });
    },
  });

  const toggleTodoItem = (listId: number, itemId: number) => {
    const lists = queryClient.getQueryData<TodoList[]>(todoListsKey);
    const item = lists?.find((l) => l.id === listId)?.todoItems.find((i) => i.id === itemId);
    if (!item) return;
    updateTodoItem.mutate({ listId, itemId, data: { done: !item.done } });
  };

  return {
    todoListsQuery,
    createTodoList,
    updateTodoList,
    deleteTodoList,
    addTodoItem,
    updateTodoItem,
    deleteTodoItem,
    toggleTodoItem,
  };
}
