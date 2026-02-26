import { type CSSProperties, forwardRef, memo } from 'react';

type TodoItemProps = {
  id: number;
  name: string;
  done: boolean;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  isDragging?: boolean;
  style?: CSSProperties;
  dragHandleProps?: Record<string, unknown>;
};

export const TodoItem = memo(
  forwardRef<HTMLLIElement, TodoItemProps>(
    ({ id, done, name, onDelete, onToggle, isDragging, style, dragHandleProps }, ref) => {
      const handleOnDelete = () => onDelete(id);
      const handleOnToggle = () => onToggle(id);

      return (
        <li
          ref={ref}
          style={style}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 min-h-[44px] hover:bg-surface-hover transition-opacity cursor-grab touch-none ${
            isDragging ? 'opacity-50 scale-[1.02] shadow-lg' : ''
          }`}
          {...dragHandleProps}
        >
          <label className="flex w-11 h-11 shrink-0 items-center justify-center touch-auto">
            <input
              type="checkbox"
              checked={done}
              onChange={handleOnToggle}
              className="h-5 w-5 rounded-full border-input"
            />
          </label>

          <span
            className={`flex-1 ${done ? 'line-through text-text-muted' : 'text-text-secondary'}`}
          >
            {name}
          </span>

          <button
            type="button"
            onClick={handleOnDelete}
            className="flex w-11 h-11 shrink-0 items-center justify-center text-text-muted hover:text-red-500 touch-auto"
            aria-label="Delete item"
          >
            ✕
          </button>
        </li>
      );
    },
  ),
);
