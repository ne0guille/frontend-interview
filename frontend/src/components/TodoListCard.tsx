import { TodoList as TodoListType } from '../types';
import { TodoList } from './TodoList';
import { AddNewItem } from './AddNewItem';
import { useCallback } from 'react';

type TodoListCardProps = {
  list: TodoListType;
  onAdd: (params: { listId: number; name: string }) => void;
  onToggle: (listId: number, itemId: number) => void;
  onDelete: (listId: number, itemId: number) => void;
};

export const TodoListCard = ({ list, onAdd, onToggle, onDelete }: TodoListCardProps) => {
  const handleToggle = useCallback((itemId: number) => onToggle(list.id, itemId), [list.id, onToggle])
  const handleDelete = useCallback((itemId: number) => onDelete(list.id, itemId), [list.id, onDelete])
  return (
    <section className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-surface-card px-4 shadow-sm select-none">
      <div className="-mx-4 bg-primary">
        <h2 className="text-lg font-semibold bg-surface-heading text-text-on-heading text-center p-2">{list.name}</h2>
      </div>
      <AddNewItem listId={list.id} onAdd={onAdd} />
      <div className="flex-1 min-h-0 overflow-y-auto">
        <TodoList
          listId={list.id}
          items={list.todoItems}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      </div>
    </section>
  );
};
