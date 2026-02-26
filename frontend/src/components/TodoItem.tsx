type TodoItemProps = {
    id: number;
    name: string;
    done: boolean;
    onDelete: (id: number) => void;
    onToggle: (id: number) => void;
}
export const TodoItem = ({id, done, name, onDelete, onToggle }: TodoItemProps) => {
    const handleOnDelete = () => {
        onDelete(id);
    }
    const handleOnToggle = () => {
        onToggle(id);
    }
    return (
        <li className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-gray-50">
            <input type="checkbox" checked={done} onChange={handleOnToggle} className="h-4 w-4 rounded border-gray-300" />
            <span className={`flex-1 ${done ? 'line-through text-gray-400' : 'text-gray-700'}`}>{name}</span>
            <button type="button" onClick={handleOnDelete} className="text-gray-400 hover:text-red-500">✕</button>
        </li>
    )
}