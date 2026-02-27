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

  function optimisticMutation<TVars>(options: {
    mutationFn: (vars: TVars) => Promise<unknown>;
    updater: (lists: TodoList[], vars: TVars) => TodoList[];
  }) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMutation({
      mutationFn: options.mutationFn,
      onMutate: async (vars: TVars) => {
        await queryClient.cancelQueries({ queryKey: todoListsKey });
        const previous = queryClient.getQueryData<TodoList[]>(todoListsKey);
        queryClient.setQueryData<TodoList[]>(todoListsKey, (old) =>
          old ? options.updater(old, vars) : old
        );
        return { previous };
      },
      onError: (_err: unknown, _vars: TVars, context: { previous?: TodoList[] } | undefined) => {
        if (context?.previous) queryClient.setQueryData(todoListsKey, context.previous);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: todoListsKey });
      },
    });
  }

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

  const addTodoItem = optimisticMutation<{ listId: number; data: AddTodoItemDto }>({
    mutationFn: ({ listId, data }) => todoListService.addTodoItem(listId, data),
    updater: (lists, { listId, data }) => {
      const tempItem = { id: -Date.now(), name: data.name, description: '', done: false };
      return addItemToList(lists, listId, tempItem);
    },
  });

  const updateTodoItem = optimisticMutation<{ listId: number; itemId: number; data: UpdateTodoItemDto }>({
    mutationFn: ({ listId, itemId, data }) => todoListService.updateTodoItem(listId, itemId, data),
    updater: (lists, { listId, itemId, data }) => updateItemInLists(lists, listId, itemId, data),
  });

  const deleteTodoItem = optimisticMutation<{ listId: number; itemId: number }>({
    mutationFn: ({ listId, itemId }) => todoListService.deleteTodoItem(listId, itemId),
    updater: (lists, { listId, itemId }) => removeItemFromLists(lists, listId, itemId),
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
