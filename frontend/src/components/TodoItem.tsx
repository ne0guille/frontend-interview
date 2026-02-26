import { DragProps } from '../types/drag';

type TodoItemProps = {
    id: number;
    name: string;
    done: boolean;
    onDelete: (id: number) => void;
    onToggle: (id: number) => void;
    dragProps: DragProps;
    isDragOver: boolean;
}
export const TodoItem = ({id, done, name, onDelete, onToggle, dragProps, isDragOver }: TodoItemProps) => {
    const handleOnDelete = () => {
        onDelete(id);
    }
    const handleOnToggle = () => {
        onToggle(id);
    }
    return (
        <li
            {...dragProps}
            className={`flex cursor-grab items-center gap-2 rounded-lg px-2 py-1 hover:bg-surface-hover transition-opacity ${isDragOver ? 'border-t-2 border-blue-400' : ''}`}
            style={{ opacity: isDragOver ? 0.5 : 1 }}
        >
            <input type="checkbox" checked={done} onChange={handleOnToggle} className="h-4 w-4 rounded border-input" />
            <span className={`flex-1 ${done ? 'line-through text-text-muted' : 'text-text-secondary'}`}>{name}</span>
            <button type="button" onClick={handleOnDelete} className="text-text-muted hover:text-red-500">✕</button>
        </li>
    )
}