import { TodoList } from '../types';
import { TodoItem } from './TodoItem';
import { AddNewItem } from './AddNewItem';
import { useDragAndDrop } from '../hooks/useDragAndDrop';

type TodoListCardProps = {
  list: TodoList;
  onAdd: (params: { listId: number; name: string }) => void;
  onToggle: (listId: number, itemId: number) => void;
  onDelete: (listId: number, itemId: number) => void;
};

export const TodoListCard = ({ list, onAdd, onToggle, onDelete }: TodoListCardProps) => {
  const handleToggle = (itemId: number) => onToggle(list.id, itemId);
  const handleDelete = (itemId: number) => onDelete(list.id, itemId);
  const { orderedItems, getDragProps, getListProps, getDropZoneProps, dragOverId } = useDragAndDrop(list.id, list.todoItems);

  return (
    <section className="flex flex-col rounded-2xl border border-border bg-surface-card p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-text-primary">{list.name}</h2>
      <AddNewItem listId={list.id} onAdd={onAdd} />
      <ul className="mt-3 flex flex-1 flex-col gap-2 pb-4" {...getListProps()}>
        {orderedItems.map((item) => (
          <TodoItem
            key={item.id}
            {...item}
            onToggle={handleToggle}
            onDelete={handleDelete}
            dragProps={getDragProps(item.id)}
            isDragOver={dragOverId === item.id}
          />
        ))}
        <li
          className={`min-h-[2rem] flex-1 list-none ${dragOverId === 'end' ? 'border-t-2 border-blue-400' : ''}`}
          {...getDropZoneProps()}
        />
      </ul>
    </section>
  );
};
