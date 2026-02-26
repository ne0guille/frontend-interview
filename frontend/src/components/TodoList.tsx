import { TodoItem as TodoItemType } from '../types';
import { TodoItem } from './TodoItem';
import { useDragAndDrop } from '../hooks/useDragAndDrop';

type TodoListProps = {
  listId: number;
  items: TodoItemType[];
  onToggle: (itemId: number) => void;
  onDelete: (itemId: number) => void;
};

export const TodoList = ({ listId, items, onToggle, onDelete }: TodoListProps) => {
  const { orderedItems, bindItem, bindList, bindEndZone, isDragOver } = useDragAndDrop(listId, items);

  return (
    <ul className="mt-3 flex flex-1 flex-col gap-2 pb-4" {...bindList}>
      {orderedItems.map((item) => {
        const { ...drag } = bindItem(item.id);
        return (
          <TodoItem
            key={item.id}
            {...item}
            onToggle={onToggle}
            onDelete={onDelete}
            drag={drag}
            isDragOver={isDragOver(item.id)}
          />
        );
      })}
      <li
        className={`min-h-8 flex-1 list-none ${isDragOver('end') ? 'border-t-2 border-blue-400' : ''}`}
        {...bindEndZone}
      />
    </ul>
  );
};
