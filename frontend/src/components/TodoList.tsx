import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TodoItem as TodoItemType } from '../types';
import { SortableItem } from './SortableItem';
import { useDragAndDrop } from '../hooks/useDragAndDrop';

type TodoListProps = {
  listId: number;
  items: TodoItemType[];
  onToggle: (itemId: number) => void;
  onDelete: (itemId: number) => void;
};

export const TodoList = ({ listId, items, onToggle, onDelete }: TodoListProps) => {
  const { items: sortedItems, sortedIds, handleDragEnd } = useDragAndDrop(listId, items);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
    useSensor(KeyboardSensor),
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
        {sortedItems.length === 0 ? (
          <p className="flex flex-1 items-center justify-center text-text-muted pb-4">
            No tasks have been entered yet
          </p>
        ) : (
          <ul aria-label="Todo items" className="flex flex-1 flex-col gap-2 pb-4">
            {sortedItems.map((item) => (
              <SortableItem
                key={item.id}
                {...item}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </ul>
        )}
      </SortableContext>
    </DndContext>
  );
};
