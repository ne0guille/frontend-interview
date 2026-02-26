import { TodoList as TodoListType } from '../types';
import { TodoList } from './TodoList';
import { AddNewItem } from './AddNewItem';

type TodoListCardProps = {
  list: TodoListType;
  onAdd: (params: { listId: number; name: string }) => void;
  onToggle: (listId: number, itemId: number) => void;
  onDelete: (listId: number, itemId: number) => void;
};

export const TodoListCard = ({ list, onAdd, onToggle, onDelete }: TodoListCardProps) => {
  const handleToggle = (itemId: number) => onToggle(list.id, itemId);
  const handleDelete = (itemId: number) => onDelete(list.id, itemId);

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-card px-4 shadow-sm select-none">
      <div className="-mx-4 rounded-t-2xl bg-primary">
        <h2 className="text-lg font-semibold bg-surface-heading text-text-on-heading text-center p-2">{list.name}</h2>
      </div>
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
