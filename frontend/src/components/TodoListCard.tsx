import { TodoList as TodoListType } from '../types';
import { TodoList } from './TodoList';
import { AddNewItem } from './AddNewItem';

type TodoListCardProps = {
  list: TodoListType;
  onAdd: (params: { listId: number; name: string }) => Promise<void>;
  onToggle: (listId: number, itemId: number) => void;
  onDelete: (listId: number, itemId: number) => void;
};

export const TodoListCard = ({ list, onAdd, onToggle, onDelete }: TodoListCardProps) => {
  const handleToggle = (itemId: number) => onToggle(list.id, itemId);
  const handleDelete = (itemId: number) => onDelete(list.id, itemId);

  return (
    <section className="flex flex-col rounded-2xl border border-border bg-surface-card p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-text-primary">{list.name}</h2>
      <AddNewItem listId={list.id} onAdd={onAdd} />
      <TodoList
        listId={list.id}
        items={list.todoItems}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    </section>
  );
};
